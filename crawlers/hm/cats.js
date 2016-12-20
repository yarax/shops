// @flow

const cheerio = require('cheerio');
const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const shopUrl = 'http://www2.hm.com';
const url = `${shopUrl}/ru_ru/index.html`;
const catRgxp = 'ru_ru/(muzhchiny|zhenshchiny)/(.*?)/(.*?)\.html'; 
const shopName = 'H&M';
const {db, getShopId, checkDublicate, fetch} = require('../../libs');
let rootCats = {};

function createCategory(shopId, name, url, pid) {
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

function normalizeUrl(path) {
  return `${shopUrl}${path}`;
}

function getParent(mask) {
  const name = mask[1];
  if (!rootCats[name]) {
    throw new Error(`Dont know parent category ${name}, just ${JSON.stringify(rootCats)}`);
  }
  return rootCats[name];
}

function getCatLinks(html) {
  const res = [];
  const $ = cheerio.load(html);
  $('a').each(function (i, elem) {
    const link = normalizeUrl($(this).attr('href'));
    const text = $(this).text().trim();
    const r = new RegExp(catRgxp);
    const m = link.match(r);
    if (!m) return;
    const pid = getParent(m);
    if (m) {
      res.push({
        text,
        link,
        pid
      });
    }
  });
  return res;
}

function run(shopId) {
  const promises = [];
  return fetch(url).then(res => {
    const links = getCatLinks(res);
    return Promise.all(links.map((item) => {
      return createCategory(shopId, item.text, item.link, item.pid);
    }));
  });
}

function go() {
  return getShopId('h&m').then(shopId => {
    return Promise.props({
      muzhchiny: createCategory(shopId, 'muzhchiny', 'http://www2.hm.com/ru_ru/muzhchiny.html', 0),
      zhenshchiny: createCategory(shopId, 'zhenshchiny', 'http://www2.hm.com/ru_ru/zhenshchiny.html', 0)
    })
    .then(cats => {
      rootCats = cats;
      console.log(rootCats);
    })
  .then(() => run(shopId))
    .then(() => {
      console.log('Done');
    });
  })
  .catch(console.log);
}

go.getCatLinks = getCatLinks;

module.exports = go;