const {fetch} = require('../libs');
const cheerio = require('cheerio');
const url = 'http://www2.hm.com/ru_ru/muzhchiny/vybrat-kategoriyu/rubashki/_jcr_content/main/productlisting.display.html?product-type=men_shirts&sort=stock&offset=0&page-size=300000';

describe('items', () => {
  it('items', (done) => {
    fetch(url).then(html => {
      const $ = cheerio.load(html);
      const el = $('.product-item-price-discount').get(0);
      console.log($(el).contents().get(0).nodeValue);
      done();
    });
  });
});