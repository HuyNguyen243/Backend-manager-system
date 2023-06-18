const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./keystore/jwtRS512.key');
const algorithm = 'RS512';
const TokenRules = require('../rules/token.rules');
const jwt_create_token = (objData, expiresIn = null) => {
    const options = { algorithm: algorithm };
    if (expiresIn) {
        options['expiresIn'] = expiresIn;
    } else {
        options['expiresIn'] = TokenRules.DEFAULT_EXPRIED_HOURS * 3600;
    }
    const token = jwt.sign(objData, privateKey, options);
    return token;
};
const jwt_verify_token = (token) => {
    return jwt.verify(token, privateKey, { algorithms: [algorithm] }, function (err, decoded) {
        if (err) {
            return false;
        }
        return decoded;
    });
};
module.exports = {
    jwt_create_token,
    jwt_verify_token,
};
