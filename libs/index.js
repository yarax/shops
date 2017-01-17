const pgp = require('pg-promise')();
const fs = require('fs');
const connection = fs.readFileSync(`${__dirname}/../pg.conf`).toString();
const rp = require('request-promise');
const Promise = require('bluebird');
const fsa = Promise.promisifyAll(fs);
const db = pgp(connection);
let notifications = 0;
const limit = 10;
const idsHash = {};

module.exports = {
    normalizeUrl: (rootUrl, path) => {
        return `${rootUrl}${path}`;
    },
    db,
    getShopId: (shopName) => {
        console.log('GETTING SHOP NAME');
        return db.one('select id from shops where name=${shopName}', {shopName}).then(res => {
            return res.id;
        });
    },
    checkDublicate: (e) => {
        //if (!e.message.match(/duplicate/)) {
            throw new Error(e);
        //}
    },
    fetch: (url) => {
        return rp({url});
    },
    clearPrice: (str) => {
        if (!str) return 0;
        return str.replace(/[^0-9]*/g, '');
    },
    // id is for caching already sent items
    notify: (str, dIRp) => {
        notifications++;
        if (notifications > limit) return Promise.resolve(null);
        if (!idsHash[str]) {
            idsHash[str] = true;
            return (dIRp || rp)({
                url: `http://bot.yarax.ru/send?chat=rax_test_group&message=${encodeURIComponent(str)}`
            });
        }
    }
}