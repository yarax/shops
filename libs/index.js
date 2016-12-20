const pgp = require('pg-promise')();
const connection = 'postgres://rax:@localhost:5432/shops';
const rp = require('request-promise');
const db = pgp(connection);

module.exports = {
    db,
    getShopId: (shopName) => {
        console.log('GETTING SHOP NAME');
        return db.one('select id from shops where name=${shopName}', {shopName}).then(res => {
            return res.id;
        });
    },
    checkDublicate: (e) => {
        if (!e.message.match(/duplicate/)) {
            throw new Error(e);
        }
    },
    fetch: (url) => {
        return rp({url});
    }
}