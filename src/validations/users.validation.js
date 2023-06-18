const { response_error, clean_body } = require('../utils/app.util');
const UserRules = require('../rules/users.rules');
const { make, ruleIn, regex } = require('simple-body-validator');
const constants = require('../../constants');
const message = require('../utils/constain.util');
const user_admin_Rules = {
    username: 'required|min:6',
    password: 'required|min:8',
    email: 'required|email',
};
const user_Rules = {
    username: 'required|min:6',
    fullname: 'required',
    phone: ['required', regex(constants.PHONE_REGEX)],
    password: 'required|min:8',
    email: 'required|email',
    role: [
        'required',
        ruleIn([UserRules.ROLE.SALER, UserRules.ROLE.EDITOR, UserRules.ROLE.ADMIN, UserRules.ROLE.LEADER_EDITOR]),
    ],
    create_by: 'required',
    address: 'string',
    births: 'nullable|date',
    start_day: 'nullable|date',
    infor_reminder: 'required',
    kpi_saler: 'integer|nullable',
};

const update_user_Rules = {
    username: 'min:6',
    fullname: 'nullable',
    phone: [regex(constants.PHONE_REGEX)],
    password: 'min:8',
    email: 'email',
    role: [ruleIn([UserRules.ROLE.SALER, UserRules.ROLE.EDITOR, UserRules.ROLE.LEADER_EDITOR, UserRules.ROLE.ADMIN])],
    infor_reminder: 'string',
    kpi_saler: 'integer',
    address: 'string',
    births: 'nullable|date',
    start_day: 'nullable|date',
};
const create_user_validation = async (req, res, next) => {
    const check_validation = make(req.body, user_Rules);
    req.body = clean_body(req.body, user_Rules);
    if (check_validation.validate()) {
        return next();
    }
    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};

const create_admin_special_validation = async (req, res, next) => {
    const check_validation = make(req.body, user_admin_Rules);
    req.body = clean_body(req.body, user_admin_Rules);
    if (check_validation.validate()) {
        return next();
    }
    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};

const update_user_validation = async (req, res, next) => {
    const check_validation = make(req.body, update_user_Rules);
    req.body = clean_body(req.body, update_user_Rules);
    if (check_validation.validate()) {
        return next();
    }
    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};

module.exports = {
    create_admin_special_validation,
    create_user_validation,
    update_user_validation,
};
