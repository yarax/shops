// @flow

const cheerio = require('cheerio');
const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const url = 'http://www2.hm.com/ru_ru/index.html';
const catRgxp = 'ru_ru/(muzhchiny|zhenshchiny)/(.*?)/(.*?)\.html'; 
const shopName = 'H&M';
const {db, getShopId, checkDublicate, fetch} = require('../../libs');

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
    const url = catUrl.replace(/html$/, `/_jcr_content/main/productlisting.display.html?product-type=${prodType}&sort=stock&offset=0&page-size=30000`);
    return fetch(url);
  }
}

function clearPrice(str) {
  return str.replace(/[^0-9]*/g, '');
}

// @TODO tests
function getAllItems(html) {
  const $ = cheerio.load(html);
  const blocks = $('.product-items-content div.row div.grid');
  blocks.each(function (i, elem) {
    const url = $(this).find('a').attr('href');
    const name = $(this).find('h3').text().trim();
    const pic = $(this).find('img').attr('src').trim();
    const priceNode = $(this).find('.product-item-price');
    let oldPrice = null;
    if ($(priceNode).find('small').length) {
      oldPrice = $(priceNode).find('small').text();
    }
    const price = $(priceNode).contents().get(0).nodeValue;
    return {
      url,
      name,
      pic,
      oldPrice,
      price
    }
  });
}

function createItem(shopId, catId) {
  return (item) => {
    // @TODO query
  }
}

function run(shopId, catId, catUrl) {
  const promises = [];
  return fetch(catUrl)
  .then(loadAllFeed(catUrl))
  .then(res => {
    const allItems = getAllItems(res);
    return Promise.all(allItems.map(createItem(shopId, catId)));
  });
}

getShopId('h&m').then(shopId => {
    console.log('HERE');
  return getWatchedCategories(shopId).then(cats => {
      return Promise.all(cats.map(cat => run(shopId, cat.id, cat.url)));
  }).then(() => {
      console.log('DONE');
  });
})
.catch(console.log);
