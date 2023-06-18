const { response_error, response_unauthorized } = require('../utils/app.util');
const messager = require('../utils/constain.util');
const admin_key = require('../services/key.service');
const { jwt_verify_token } = require('../services/jwt.service');

const auth_middleware = async (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            const authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== '1TouchAuthorization') {
                return response_unauthorized(res, [], messager.ERROR_AUTHORIZED);
            } else {
                if (authorization[1] === admin_key['private_admin']) {
                    req.is_private_admin = true;
                    return next();
                }
                let access_token = authorization[1];
                let auth_access_token = jwt_verify_token(access_token);
                if (!auth_access_token) {
                    return response_error(res, [], messager.INVAILD_TOKEN);
                }
                req.role = auth_access_token.role;
                req.id_system = auth_access_token.id_system;
                req._id_activity = auth_access_token._id;
                req.access_token = access_token;
                return next();
            }
        } catch (err) {
            return response_error(res, err, messager.ERROR_AUTHORIZED_API);
        }
    }
    return response_unauthorized(res, [], messager.ERROR_AUTHORIZED_API);
};

const auth_middleware_for_token = async (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            const authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== '1TouchAuthorization') {
                return response_unauthorized(res, [], messager.ERROR_AUTHORIZED);
            } else {
                if (authorization[1] === admin_key['private_admin']) {
                    req.is_private_admin = true;
                    return next();
                }
                req.access_token = authorization[1];
                return next();
            }
        } catch (err) {
            return response_error(res, err, messager.ERROR_AUTHORIZED_API);
        }
    }
    return response_unauthorized(res, [], messager.ERROR_AUTHORIZED_API);
};

const auth_middleware_admin_it = async (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            const authorization = req.headers['authorization'];
            if (authorization === admin_key['private_admin']) {
                req.is_private_admin = true;
                return next();
            }
            return response_unauthorized(res, [], messager.ERROR_AUTHORIZED);
        } catch (err) {
            return response_error(res, err, messager.ERROR_AUTHORIZED_API);
        }
    }
    return response_unauthorized(res, [], messager.ERROR_AUTHORIZED_API);
};

module.exports = { auth_middleware, auth_middleware_for_token, auth_middleware_admin_it };
