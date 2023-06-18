const {
    response_success,
    response_error,
    response_unauthorized,
    response_forbidden,
    response_not_found,
} = require('../utils/app.util');

class BaseController {
    constructor() {}

    response_success = (res, data, message) => {
        return response_success(res, data, message);
    };

    response_error = (res, data, message) => {
        return response_error(res, data, message);
    };

    response_unauthorized = (res, data, message) => {
        return response_unauthorized(res, data, message);
    };

    response_forbidden = (res, data, message) => {
        return response_forbidden(res, data, message);
    };

    response_not_found = (res, data, message) => {
        return response_not_found(res, data, message);
    };
}

module.exports = BaseController;
