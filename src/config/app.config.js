require('dotenv').config();
var serverip = require('quick-local-ip');
const APP_PORT = process.env.APP_PORT;
const APP_ENV = process.env.APP_ENV;
const APP_URL = serverip.getLocalIP4();
const APP_WEBSITE_URL = process.env.APP_WEBSITE_URL;
const APP_WEBSITE_API = process.env.APP_WEBSITE_API;
const MODE_DEPLOY = process.env.MODE_DEPLOY;
module.exports = {
    APP_PORT,
    APP_ENV,
    APP_URL,
    APP_WEBSITE_URL,
    APP_WEBSITE_API,
    MODE_DEPLOY,
};
