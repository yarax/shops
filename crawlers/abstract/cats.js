// @flow
/*:: import type {Category, CategoryGetLinks, LinkItem, Handler, DbCatItem} from '../../types/category';*/

const pgp = require('pg-promise')();
const rp = require('request-promise');
const cheerio = require('cheerio');
const Promise = require('bluebird');
const {db, getShopId, checkDublicate, fetch, normalizeUrl} = require('../../libs');
let rootCats = {};

function createCategory(values/*: DbCatItem*/) {
  // @TODO url can be updated
  return db.query('select id from categories where url = ${url}', { url: values.url }).then((res) => {
    if (res.length) {
      return res;
    } else {
      console.log('Created: ', values);
      if (values.handler === 'new') {
        values.watch = true;
      } else {
        values.watch = false;
      }
      return db.query(`insert into categories (name, shop_id, pid, url, handler, watch) 
      values (\${name}, \${shop_id}, \${pid}, \${url}, \${handler}, \${watch}) RETURNING id`, values)
    }
  })
    .then(res => {
      return res[0].id;
    }).catch(checkDublicate)
}

function run(url/*: string*/, getCatLinks/*: (html: string) => [DbCatItem]*/) {
  const promises = [];
  return fetch(url).then(res => {
    const items = getCatLinks(res);
    return Promise.all(items.map(item => createCategory(item)));
  });
}

function getAllCatLinks(html/*: string*/, catRgxp/*: string*/)/*: [LinkItem] | [] */ {
  const res = [];
  const $ = cheerio.load(html);
  $('a').each(function (i, elem) {
    const link = $(this).attr('href');
    const text = $(this).text().trim();
    const r = new RegExp(catRgxp);
    const m = link.match(r);
    if (!m) return;
    if (m) {
      res.push({
        text,
        link,
        match: m
      });
    }
  });
  return res;
}

module.exports = {
  createCategory,
  run,
  getAllCatLinks 
}