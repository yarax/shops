// @flow
/*:: import type {CategoryGetLinks, LinkItem, DbCatItem} from '../../types/category';*/
const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const {db, getShopId, checkDublicate, fetch, normalizeUrl} = require('../../libs');
const {rootUrl} = require('./settings');
const {createCategory, run, getAllCatLinks} = require('../abstract/cats');
const url = `${rootUrl}/ru_ru/index.html`;
const saleUrl = `${rootUrl}/ru_ru/sale.html`;
const catRgxp = 'ru_ru/(muzhchiny|zhenshchiny)/(.*?)/(.*?)\.html';
const saleCatRgxp = '/ru_ru/sale/shopbyproductladies/(.*?)\.html';
let rootCats = {};

const getSalesCats = (shopId, pid) => {
  return (html/*: string*/)/*: [DbCatItem]*/ => {
    return getAllCatLinks(html, saleCatRgxp).map((linkItem/*: LinkItem*/) => {
      return {
        name: linkItem.text,
        url: normalizeUrl(rootUrl, linkItem.link),
        pid,
        shop_id: shopId, 
        handler: 'new' 
      }
    });
  }
}

const getCatsWithParents = (shopId, rootCats) => {
  function getParent(mask) {
    const name = mask[1];
    if (!rootCats[name]) {
      throw new Error(`Dont know parent category ${name}, just ${JSON.stringify(rootCats)}`);
    }
    return rootCats[name];
  }
  return (html/*: string*/)/*: [DbCatItem]*/ => {
    return getAllCatLinks(html, catRgxp).map((linkItem/*: LinkItem*/) => {
      return {
        name: linkItem.text,
        url: normalizeUrl(rootUrl, linkItem.link),
        shop_id: shopId,
        pid: getParent(linkItem.match),
        handler: 'changes'
      }
    });
  }
}

function go() {
  return getShopId('h&m').then(shopId => {
    return Promise.props({
      muzhchiny: createCategory({
        shop_id: shopId, 
        name: 'muzhchiny', 
        url: 'http://www2.hm.com/ru_ru/muzhchiny.html', 
        pid: 0, 
        handler: 'ignore'
      }),
      zhenshchiny: createCategory({
        shop_id: shopId, 
        name: 'zhenshchiny', 
        url: 'http://www2.hm.com/ru_ru/zhenshchiny.html', 
        pid: 0, 
        handler: 'ignore'
      }),
      sale: createCategory({
        shop_id: shopId, 
        name: 'sale', 
        url: saleUrl, 
        pid: 0, 
        handler: 'ignore'
      }),
    })
      .then(cats => {
        rootCats = cats; 
      })
      .then(() => run(url, getCatsWithParents(shopId, rootCats)))
      .then(() => run(saleUrl, getSalesCats(shopId, rootCats.sale)))
      .then(() => {
        console.log('Done');
      });
  })
    .catch(console.log);
}

go.getCatsWithParents = getCatsWithParents;
go.url = url;

module.exports = go;