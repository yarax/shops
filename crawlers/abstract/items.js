// @flow
/*:: import type {GrabItems, Item, ExistingItem} from '../../types/items'; */
/*:: import type {Handler} from '../../types/category'; */

const rp = require('request-promise');
const Promise = require('bluebird');
const {normalizeUrl, clearPrice, db, getShopId, checkDublicate, fetch, notify} = require('../../libs');

function getWatchedCategories(shopId/*: number*/)/*: Promise<any> */ {
    return db.query('select id, url, handler from categories where watch=true and shop_id=${shop_id}', {shop_id: shopId});
}

function getItem(name/*: string*/, url/*: string*/, catId/*: number*/, shopId/*: number*/)/*: ExistingItem*/ {
  return db.query('select id, price, old_price from items where url=${url} and cat_id=${catId} and shop_id=${shopId}', {
    url, 
    catId,
    shopId
  }).then(res => {
    if (res.length) {
      return res[0];
    }
    return false;
  });
}

function updateItem(id, price) {
  return db.query('update items set price = ${price} where id = ${id}', {
    id,
    price
  });
}

function createItem(item/*: Item*/, shopId/*: number*/, catId/*: number*/)/*: Promise<number>*/ {
    return db.query('insert into items (name, shop_id, cat_id, url, pic, old_price, price) values (${name}, ${shop_id}, ${cat_id}, ${url}, ${pic}, ${old_price}, ${price}) RETURNING id', {
      shop_id: shopId,
      name: item.name,
      url: item.url,
      cat_id: catId,
      pic: item.pic,
      old_price: item.oldPrice,
      price: item.price
    }).then(res => {
      console.log('Created: ', item.name, item.url);
      return res[0].id;
    }).catch(checkDublicate);
}

function processItem(rootUrl/*: string*/, shopId/*: number*/, catId/*: number*/, handler/*: Handler*/)/*: (Item) => any */ {
  return (item/*: Item*/) => {
    return getItem(item.name, item.url, catId, shopId).then(oldItem => {
      if (!oldItem) {
        if (handler === 'new') {
          notify(`New sale article: ${normalizeUrl(rootUrl, item.url)}`);
        }
        return createItem(item, shopId, catId);
      } else if (item.price < oldItem.price) {
        updateItem(oldItem.id, item.price).catch(console.log);
        return notify(`${oldItem.price} => ${item.price} ${normalizeUrl(rootUrl, item.url)}`);
      } else {
        return null; // nothing happend
      }
    });
  }
}

const go = (shopName/*: string*/, grabItems/*: (shopId: number, categoryId: number, url: string, handler: Handler) => any*/) => {
  getShopId(shopName)
  .then(shopId => {
  return getWatchedCategories(shopId).then((cats/*: Array<{id: number, url: string, handler: Handler}>*/) => {
    console.log(`${cats.length} watched categories`, cats);
    return Promise.all(cats.map(cat => grabItems(shopId, cat.id, cat.url, cat.handler))); 
  }).then(() => {
      console.log('DONE');
  });
  })
  .catch(console.log);
}

module.exports = {
  getWatchedCategories,
  getItem,
  createItem,
  go,
  processItem
}