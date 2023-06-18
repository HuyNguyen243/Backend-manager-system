const mongoose = require('mongoose');
const { MONGO_HOST, MONGO_DB, MONGO_PORT, MONGO_USER, MONGO_PASSWORD } = require('./../config/db.config');
const { APP_ENV } = require('./../config/app.config');
let connectStr;
mongoose.Promise = global.Promise;

if (APP_ENV === 'devHome') {
    connectStr = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}?authSource=admin`;
}
if (APP_ENV === 'devServer') {
    connectStr = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
}

mongoose.connect(connectStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
//  check connection of mongoose
mongoose.connection.on('open', function () {
    console.log('Connected to mongoose database server.');
});
mongoose.connection.on('error', function (err) {
    console.log('Connect fail to mongo server. Error :', err);
});
module.exports = mongoose;
