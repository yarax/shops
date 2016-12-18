// @flow

const cheerio = require('cheerio');
const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const shopUrl = 'http://www2.hm.com';
const url = `${shopUrl}/ru_ru/index.html`;
const catRgxp = 'ru_ru/(muzhchiny|zhenshchiny)/(.*?)/(.*?)\.html'; 
const shopName = 'H&M';
const {db, getShopId, checkDublicate} = require('../../libs');

function createCategory(shopId, name, url, pid) {
  // @TODO url can be updated
  return db.query('insert into categories (name, shop_id, pid, url) values (${name}, ${shop_id}, ${pid}, ${url})', {
    shop_id: shopId,
    name,
    url,
    pid
  }).then(res => {
    console.log(res);
  }).catch(checkDublicate)
}

function normalizeUrl(path) {
  return `${shopUrl}${path}`;
}

function getParent(mask) {
  const ids = {
    'muzhchiny': 1,
    'zhenshchiny': 2
  };
  const name = mask[1];
  return ids[name];
}

function run(shopId) {
  const promises = [];
  return rp({
    url
  }).then(res => {
    const $ = cheerio.load(res);
    $('a').each(function (i, elem) {
      const link = normalizeUrl($(this).attr('href'));
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

//getShopId('h&m').then(console.log).catch(console.log);
getShopId('h&m').then(shopId => {
  return Promise.all([
    createCategory(shopId, 'muzhchiny', 'http://www2.hm.com/ru_ru/muzhchiny.html', 0),
    createCategory(shopId, 'zhenshchiny', 'http://www2.hm.com/ru_ru/zhenshchiny.html', 0)
  ])
  .then(() => run(shopId))
  .then(() => {
    console.log('Done');
  });
})
.catch(console.log);