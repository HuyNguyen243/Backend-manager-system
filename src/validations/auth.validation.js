const { response_error, clean_body } = require('../utils/app.util');
const { make } = require('simple-body-validator');
const message = require('../utils/constain.util');

const auth_rules = {
    username: 'required|min:6',
    password: 'required|min:8',
};

const mail_rules = {
    email: 'required|email',
};

const reset_password_rules = {
    id: 'required',
    password: 'required|min:8',
    token: 'required',
};

const auth_login_validation = async (req, res, next) => {
    const check_validation = make(req.body, auth_rules);
    req.body = clean_body(req.body, auth_rules);
    if (check_validation.validate()) {
        return next();
    }

    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};

const forgot_validation = async (req, res, next) => {
    const check_validation = make(req.body, mail_rules);
    req.body = clean_body(req.body, mail_rules);
    if (check_validation.validate()) {
        return next();
    }

    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};

const reset_validation = async (req, res, next) => {
    const check_validation = make(req.body, reset_password_rules);
    req.body = clean_body(req.body, reset_password_rules);
    if (check_validation.validate()) {
        return next();
    }

    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};
module.exports = {
    auth_login_validation,
    forgot_validation,
    reset_validation,
};
