//const {fetch} = require('../libs');
const cheerio = require('cheerio');
const fs = require('fs');
const Promise = require('bluebird');
const fetch = Promise.promisify(fs.readFile);
const {getAllItems} = require('../crawlers/hm/items');
const url = 'http://www2.hm.com/ru_ru/muzhchiny/vybrat-kategoriyu/rubashki/_jcr_content/main/productlisting.display.html?product-type=men_shirts&sort=stock&offset=0&page-size=300000';

describe('items', () => {
  it('items', (done) => {
    fetch(`${__dirname}/fixtures/dress.html`).then(getAllItems).then(items => {
      console.log(items.map(item=> [item.price, item.name]));
      done();
    });
  });
});