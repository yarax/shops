// @flow

const cheerio = require('cheerio');
const pgp = require('pg-promise')();
const rp = require('request-promise');
const Promise = require('bluebird');
const shopName = 'H&M';
const {connection} = require('../../libs');
const db = pgp(connection);