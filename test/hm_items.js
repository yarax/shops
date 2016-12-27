const {fetch} = require('../libs');
const cheerio = require('cheerio');
const fs = require('fs');
const Promise = require('bluebird');
const {getAllItems, loadAllFeed} = require('../crawlers/hm/items');
const url = 'http://www2.hm.com/ru_ru/muzhchiny/vybrat-kategoriyu/rubashki.html';
let _html;

describe('items', () => {
  it('loadAllFeed', (done) => {
    fetch(url).then(loadAllFeed(url)).then((html) => {
      if (typeof(html) !== 'string') throw new Error('loadAllFeed returns non string');
      if (html.length < 100000) throw new Error('loadAllFeed returns too short page');
      _html = html;
      done();
    }).catch(done);
  });

  it('getAllItems', (done) => {
    const res = getAllItems(_html);
    if (!Array.isArray(res)) throw new Error('getAllItems returns non array');
    if (res.length < 10) throw new Error('getAllItems returns too few elements');
    if (!res[0].url) throw new Error('getAllItems no url');
    if (!res[0].name) throw new Error('getAllItems no name');
    if (!res[0].price) throw new Error('getAllItems no price');
    done();
  });
});