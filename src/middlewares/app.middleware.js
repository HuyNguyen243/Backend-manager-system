const { auth_middleware, auth_middleware_for_token, auth_middleware_admin_it } = require('./auth.middleware');
const { role_middleware } = require('./role.middleware');
const { only_middleware } = require('./only.middleware');
module.exports = {
    auth_middleware,
    auth_middleware_admin_it,
    auth_middleware_for_token,
    role_middleware,
    only_middleware,
};
