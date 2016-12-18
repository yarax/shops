// @flow

const cheerio = require('cheerio');
const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const url = 'http://www2.hm.com/ru_ru/index.html';
const catRgxp = 'ru_ru/(muzhchiny|zhenshchiny)/(.*?)/(.*?)\.html'; 
const shopName = 'H&M';
const db = pgp('postgres://rax:@localhost:5432/shops');

function getShopId(shopName) {
  return db.one('select id from shops where name=${shopName}', {shopName}).then(res => {
    return res.id;
  });
}

function createCategory(shopId, name, url, pid) {
  console.log({shop_id: shopId,
    name,
    url,
    pid
  });
  // @TODO url can be updated
  return db.query('insert into categories (name, shop_id, pid, url) values (${name}, ${shop_id}), ${pid}, ${url}', {
    shop_id: shopId,
    name,
    url,
    pid
  }).then(res => {
    console.log(res);
  }).catch(e => {
    console.log('Insert error: ', e);
  })
}

function getParent(mask) {
  const name = mask[1];
}

function run(shopId) {
  const promises = [];
  rp({
    url
  }).then(res => {
    const $ = cheerio.load(res);
    $('a').each(function (i, elem) {
      const link = $(this).attr('href');
      const text = $(this).text().trim();
      const r = new RegExp(catRgxp);
      const m = link.match(r);
      const pid = getParent(m);
      if (m) {
        promises.push(createCategory(shopId, text, link, pid));
        console.log(m[3], link, text);
      }
    });
  });
}

//getShopId('h&m').then(console.log).catch(console.log);
getShopId('h&m').then(shopId => {
  return Promise.all([
    createCategory(shopId, 'muzhchiny', 'http://www2.hm.com/ru_ru/muzhchiny.html', 0),
    createCategory(shopId, 'zhenshchiny', 'http://www2.hm.com/ru_ru/zhenshchiny.html', 0)
  ]).then(() => {
    console.log('Done');
  });
}).catch(console.log);
