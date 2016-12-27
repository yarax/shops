// @flow
/*:: import type {Category, CategoryGetLinks} from '../../types/category';*/

const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const {db, getShopId, checkDublicate, fetch, normalizeUrl} = require('../../libs');
let rootCats = {};

function createCategory(shopId/*: number*/, name/*: string*/, url/*: string*/, pid/*: number*/) {
  // @TODO url can be updated
  return db.query('insert into categories (name, shop_id, pid, url) values (${name}, ${shop_id}, ${pid}, ${url}) RETURNING id', {
    shop_id: shopId,
    name,
    url,
    pid
  }).then(res => {
    console.log('Created: ', name, url);
    return res[0].id;
  }).catch(checkDublicate)
}

function run(url/*: string*/, shopId/*: number*/, getCatLinks/*: CategoryGetLinks*/) {
  const promises = [];
  return fetch(url).then(res => {
    const links = getCatLinks(res);
    return Promise.all(links.map((item) => {
      return createCategory(shopId, item.text, item.link, item.pid);
    }));
  });
}

module.exports = {
  createCategory,
  run
}