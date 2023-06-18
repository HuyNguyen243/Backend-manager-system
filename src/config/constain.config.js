require('dotenv').config();

const SALT_KEY = process.env.SALT_KEY;
const SALT_KEY_BCRYPT = process.env.SALT_KEY_BCRYPT;
const STMP_EMAIL_HOST = process.env.STMP_EMAIL_HOST;
const STMP_EMAIL_PORT = process.env.STMP_EMAIL_PORT;
const STMP_EMAIL_USER = process.env.STMP_EMAIL_USER;
const STMP_EMAIL_PASSWORD = process.env.STMP_EMAIL_PASSWORD;
module.exports = {
    SALT_KEY,
    SALT_KEY_BCRYPT,
    STMP_EMAIL_HOST,
    STMP_EMAIL_PASSWORD,
    STMP_EMAIL_PORT,
    STMP_EMAIL_USER,
};
