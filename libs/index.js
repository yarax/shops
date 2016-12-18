const pgp = require('pg-promise')();
const connection = 'postgres://rax:@localhost:5432/shops';
const db = pgp(connection);

module.exports = {
    db,
    getShopId: (shopName) => {
        console.log('GETTING SHOP NAME');
        return db.one('select id from shops where name=${shopName}', {shopName}).then(res => {
            return res.id;
        });
    },
    checkDublicate: () => {
        if (!e.message.match(/duplicate/)) {
            throw new Error(e);
        }
    }
}