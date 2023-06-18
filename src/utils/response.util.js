'use strict';
const constants = require('../../constants');

const response_success = (res, data = {}, message = '') => {
    return api_response(res, constants.SUCCESS_CODE, true, data, message);
};

const response_error = (res, data = {}, message = '') => {
    return api_response(res, constants.ERROR_CODE, false, data, message);
};

const response_unauthorized = (res, data = {}, message = '') => {
    return api_response(res, constants.UNAUTHORIZED_CODE, false, data, message);
};

const response_forbidden = (res, data = {}, message = '') => {
    return api_response(res, constants.FORBIDDEN_CODE, false, data, message);
};

const response_not_found = (res, data = {}, message = '') => {
    return api_response(res, constants.NOT_FOUND_CODE, false, data, message);
};

const api_response = (res, code, success, data = {}, message = '') => {
    return res.status(code).json({
        status: success,
        data: data,
        message: message,
    });
};

module.exports = {
    response_success,
    response_error,
    response_unauthorized,
    response_forbidden,
    response_not_found,
};
