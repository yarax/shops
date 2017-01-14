const {fetch, getShopId} = require('../libs');
const cheerio = require('cheerio');
const fs = require('fs');
const Promise = require('bluebird');
const {getCatsWithParents, url} = require('../crawlers/hm/cats');

describe('H&M cats', () => {
  it('getCatLinks', (done) => {
    getShopId('h&m').then(shopId => {
      return fetch(url).then(res => {
      const links = getCatsWithParents(shopId, {
        muzhchiny: 1,
        zhenshchiny: 1
      })(res);
      if (!Array.isArray(links)) throw new Error('H&M categories getCatLinks result is not array');
      if (links.length < 10) throw new Error('H&M categories count < 10');
      if (!links[0].name) throw new Error('H&M first category got no name');
      if (!links[0].url) throw new Error('H&M first category got no link');
      done();
    }).catch(done);
    });
  });
});