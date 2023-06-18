const { response_forbidden } = require('../utils/app.util');

const role_middleware = (roles = []) => {
    return (req, res, next) => {
        const role = req.role;
        if (!roles.includes(role) && !req.is_private_admin) {
            return response_forbidden(res, [], "Your role don't have permission to perform this action");
        } else {
            next();
        }
    };
};

module.exports = {
    role_middleware,
};
