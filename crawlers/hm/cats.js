// @flow
/*:: import type {CategoryGetLinks} from '../../types/category';*/
const cheerio = require('cheerio');
const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const {db, getShopId, checkDublicate, fetch, normalizeUrl} = require('../../libs');
const {rootUrl} = require('./settings');
const {createCategory, run} = require('../abstract/cats');
const url = `${rootUrl}/ru_ru/index.html`;
const catRgxp = 'ru_ru/(muzhchiny|zhenshchiny)/(.*?)/(.*?)\.html';
let rootCats = {};


const getCatsWithParents = (rootCats) => {
  function getParent(mask) {
    const name = mask[1];
    if (!rootCats[name]) {
      throw new Error(`Dont know parent category ${name}, just ${JSON.stringify(rootCats)}`);
    }
    return rootCats[name];
  }
  return (html) => {
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
}

function go() {
  return getShopId('h&m').then(shopId => {
    return Promise.props({
      muzhchiny: createCategory(shopId, 'muzhchiny', 'http://www2.hm.com/ru_ru/muzhchiny.html', 0),
      zhenshchiny: createCategory(shopId, 'zhenshchiny', 'http://www2.hm.com/ru_ru/zhenshchiny.html', 0)
    })
      .then(cats => {
        rootCats = cats;
      })
      .then(() => run(url, shopId, getCatsWithParents(rootCats)))
      .then(() => {
        console.log('Done');
      });
  })
    .catch(console.log);
}

go.getCatsWithParents = getCatsWithParents;
go.url = url;

module.exports = go;