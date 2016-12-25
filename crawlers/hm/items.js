// @flow

const cheerio = require('cheerio');
const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const url = 'http://www2.hm.com/ru_ru/index.html';
const catRgxp = 'ru_ru/(muzhchiny|zhenshchiny)/(.*?)/(.*?)\.html'; 
const shopName = 'H&M';
const {normalizeUrl, clearPrice, db, getShopId, checkDublicate, fetch, notify, rootUrl} = require('../../libs');

function getWatchedCategories(shopId) {
    return db.query('select id, url from categories where watch=true and shop_id=${shop_id}', {shop_id: shopId});;
}

function getProductType(firstPageHTML) {
  const $ = cheerio.load(firstPageHTML);
  return $('ul[data-category-filter]').attr('data-category-filter');
}

function loadAllFeed(catUrl){
  return (firstPageHTML) => {
    const prodType = getProductType(firstPageHTML);
    const url = catUrl.replace(/\.html$/, `/_jcr_content/main/productlisting.display.html?product-type=${prodType}&sort=stock&offset=0&page-size=30000`);
    console.log('ALL', url);
    return fetch(url);
  }
}

// @TODO tests
function getAllItems(html) {
  const $ = cheerio.load(html);
  const blocks = $('.productlist-row .product-items-content div.row article');
  const res = [];
  blocks.each(function (i, elem) {
    const url = $(this).find('a').attr('href');
    const name = $(this).find('h3').text().trim();
    const pic = $(this).find('img').attr('src').trim();
    const priceNode = $(this).find('.product-item-price');
    let oldPrice = null;
    let price = null;
    if ($(priceNode).find('small').length) {
      oldPrice = clearPrice($(priceNode).find('small').text());
      price = clearPrice($(priceNode).contents().get(0).nodeValue);
    } else {
      price = clearPrice($(priceNode).text());
    }
    res.push({
      url,
      name,
      pic,
      oldPrice,
      price
    });
  });
  return res;
}

function getItem(name, url, catId, shopId) {
  return db.query('select id, price, old_price from items where name=${name} and url=${url} and cat_id=${catId} and shop_id=${shopId}', {
    name,
    url,
    catId,
    shopId
  }).then(res => {
    if (res.length) {
      return res[0];
    }
    return false;
  });
}

function createItem(item, shopId, catId) {
    return db.query('insert into items (name, shop_id, cat_id, url, pic, old_price, price) values (${name}, ${shop_id}, ${cat_id}, ${url}, ${pic}, ${old_price}, ${price}) RETURNING id', {
      shop_id: shopId,
      name: item.name,
      url: item.url,
      cat_id: catId,
      pic: item.pic,
      old_price: item.oldPrice,
      price: item.price
    }).then(res => {
      console.log('Created: ', item.name, item.url);
      return res[0].id;
    }).catch(checkDublicate);
}

function processItem(shopId, catId) {
  return (item) => {
    return getItem(item.name, item.url, catId, shopId).then(oldItem => {
      if (!oldItem) {
        return createItem(item, shopId, catId);
      } else if (item.price != oldItem.price) {
        return notify(`${oldItem.price} => ${item.price} ${normalizeUrl(item.url)}`);
      } else {
        return null; // nothing happend
      }
    });
  }
}

function run(shopId, catId, catUrl) {
  const promises = [];
  return fetch(catUrl)
  .then(loadAllFeed(catUrl))
  .then(res => {
    const allItems = getAllItems(res);
    return Promise.all(allItems.map(processItem(shopId, catId)));
  });
}

const go = () => {
  getShopId('h&m')
  .then(shopId => {
  return getWatchedCategories(shopId).then(cats => {
    console.log(`${cats.length} watched categories`);
    return Promise.all(cats.map(cat => run(shopId, cat.id, cat.url)));
  }).then(() => {
      console.log('DONE');
  });
  })
  .catch(console.log);
}

go.getAllItems = getAllItems;

module.exports = go;
