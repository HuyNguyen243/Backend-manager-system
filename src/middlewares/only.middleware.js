const { response_forbidden } = require('../utils/app.util');
const UserRules = require('../rules/users.rules');
const only_middleware = (req, res, next) => {
    const id_system = req.id_system;
    const id = req.params.id;
    const role = req.role;
    if (role === UserRules.ROLE.ADMIN && id_system !== id) {
        return response_forbidden(res, [], "Your role don't have permission to perform this action");
    } else {
        return next();
    }
};

module.exports = {
    only_middleware,
};
