// @flow

const cheerio = require('cheerio');
const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const url = 'http://www2.hm.com/ru_ru/index.html';
const catRgxp = 'ru_ru/(muzhchiny|zhenshchiny)/(.*?)/(.*?)\.html'; 
const shopName = 'H&M';
const {db, getShopId, checkDublicate} = require('../../libs');

function getWatchedCategories(shopId) {
    return db.query('select id, url from categories where watch=true and shop_id=${shop_id}', {shop_id: shopId});;
}

//http://www2.hm.com/ru_ru/zhenshchiny/vybrat-kategoriyu/yubki/_jcr_content/main/productlisting.display.html?product-type=ladies_skirts&sort=stock&offset=0&page-size=30000

function run(shopId, catId, catUrl) {
  const promises = [];
  return rp({
    catUrl
  }).then(res => {
    const $ = cheerio.load(res);
    $('a').each(function (i, elem) {
      const link = $(this).attr('href');
      const text = $(this).text().trim();
      const r = new RegExp(catRgxp);
      const m = link.match(r);
      if (!m) return;
      const pid = getParent(m);
      if (m) {
        promises.push(createCategory(shopId, text, link, pid));
        console.log(m[3], link, text);
      }
    });
    return Promise.all(promises);
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
