const fs = require('fs');
const private_admin = fs.readFileSync('./keystore/admin.txt', {
    encoding: 'utf-8',
});

module.exports = {
    private_admin,
};
