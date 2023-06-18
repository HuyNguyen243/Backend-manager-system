const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { SALT_KEY, SALT_KEY_BCRYPT } = require('../config/constain.config');
const UserRules = require('../rules/users.rules');

const random_id = (_type) => {
    let id = '';
    const number = '0123456789';
    let number_length = number.length;
    let date_obj = new Date();
    let year = date_obj.getFullYear().toString().slice(-2);
    let month = date_obj.getMonth() + 1;
    month = month.toString();
    let day = date_obj.getDate().toString();
    id += day + month + year + '.';
    id += UserRules._ROLE[_type] + '.';
    for (let i = 0; i < 5; i++) {
        id += number.charAt(Math.floor(Math.random() * number_length));
    }
    return id;
};

const hash_string = (str) => {
    let hash_crypto = crypto.createHmac('sha512', SALT_KEY).update(str).digest('hex');
    const hash_bcrypt = bcrypt.hashSync(hash_crypto, Number(SALT_KEY_BCRYPT));
    return hash_bcrypt;
};
const hash_string_decode = (str, hash) => {
    let hash_crypto_decode = crypto.createHmac('sha512', SALT_KEY).update(str).digest('hex');
    const hash_decode = bcrypt.compareSync(hash_crypto_decode, hash);
    return hash_decode;
};
const clean_body = (reqBody, rules) => {
    const parseBody = {};
    const ruleKeys = Object.keys(rules);
    ruleKeys.forEach((key) => {
        let value = reqBody[key];
        if (typeof value === 'string') {
            value = value.trim();
        }
        parseBody[key] = value;
    });

    return parseBody;
};

const format_date_query = (start_date, end_date) => {
    const start = start_date.split('-');
    const end = end_date.split('-');
    const obj = {};
    obj['$gte'] = new Date(`${start[2]}-${start[1]}-${start[0]}` + 'T00:00:00.000Z');
    obj['$lte'] = new Date(`${end[2]}-${end[1]}-${end[0]}` + 'T23:59:59.000Z');
    return obj;
};

const format_date_now = (str) => {
    return new Date(str.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3'));
};

const TimeNow = () => {
    let date = new Date();
    // date.setHours(date.getHours());
    return date;
};
module.exports = {
    random_id,
    hash_string,
    clean_body,
    format_date_query,
    format_date_now,
    hash_string_decode,
    TimeNow,
};
