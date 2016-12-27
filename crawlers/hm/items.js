// @flow
/*:: import type {Item} from '../../types/items'; */

const cheerio = require('cheerio');
const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const catRgxp = 'ru_ru/(muzhchiny|zhenshchiny)/(.*?)/(.*?)\.html'; 
const {normalizeUrl, clearPrice, db, getShopId, checkDublicate, fetch, notify} = require('../../libs');
const {getWatchedCategories, go, getItem, createItem, processItem} = require('../abstract/items');
const {rootUrl, shopName} = require('./settings');


function getProductType(firstPageHTML) {
  const $ = cheerio.load(firstPageHTML);
  return $('ul[data-category-filter]').attr('data-category-filter');
}

function loadAllFeed(catUrl){
  return (firstPageHTML) => {
    const prodType = getProductType(firstPageHTML);
    const url = catUrl.replace(/\.html$/, `/_jcr_content/main/productlisting.display.html?product-type=${prodType}&sort=stock&offset=0&page-size=30000`);
    return fetch(url);
  }
}

function getAllItems(html/*: string*/)/*: Item*/ {
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

function grabItems(shopId, catId, catUrl) {
  const promises = [];
  return fetch(catUrl)
  .then(loadAllFeed(catUrl))
  .then(res => {
    const allItems = getAllItems(res);
    return Promise.all(allItems.map(processItem(rootUrl, shopId, catId)));
  });
}

function ex() {
  return go('h&m', grabItems);
}

ex.getAllItems = getAllItems;
ex.loadAllFeed = loadAllFeed;

module.exports = ex;
