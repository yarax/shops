// @flow

const cheerio = require('cheerio');
const pgp = require('pg-promise')();
const rp = require('request-promise');
const url = 'http://www2.hm.com/ru_ru/index.html';
const catRgxp = 'ru_ru/(muzhchiny|zhenshchiny)/(.*?)/(.*?)\.html'; 
const shopName = 'H&M';
const db = pgp('postgres://rax:@localhost:5432/shops');

function getShopId(shopName) {
  return db.one('select id from shops where name=${shopName}', {shopName}).then(res => {
    return res.id;
  });
}

function createOrUpdateCat(shopName, name, url) {

}

function run() {
  rp({
    url
  }).then(res => {
    const $ = cheerio.load(res);
    $('a').each(function (i, elem) {
      const link = $(this).attr('href');
      const text = $(this).text().trim();
      const r = new RegExp(catRgxp);
      const m = link.match(r); 
      if (m) {
        console.log(m[3], link, text);
      }
    });
  });
}

getShopId('h&m').then(console.log).catch(console.log);