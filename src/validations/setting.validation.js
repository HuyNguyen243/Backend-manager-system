const { response_error } = require('../utils/app.util');
const { make } = require('simple-body-validator');
const message = require('../utils/constain.util');

const setting_Rules = {
    rate_sale: 'required|integer|min:3|max:100',
    exchange_rate: 'integer',
    type_img: 'array',
    type_fixed: 'array',
    type_pay: 'array',
    type_define_image: 'array',
    group_name_job: 'array',
};

const update_setting_Rules = {
    exchange_rate: 'integer',
    rate_sale: 'integer|min:3|max:100',
    type_img: 'array',
    type_fixed: 'array',
    type_pay: 'array',
    type_define_image: 'array',
    group_name_job: 'array',
};

const create_setting_special_validation = async (req, res, next) => {
    const check_validation = make(req.body, setting_Rules);
    if (!check_validation.validate()) {
        return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
    }
    return next();
};

const update_setting_special_validation = async (req, res, next) => {
    const check_validation = make(req.body, update_setting_Rules);
    if (!check_validation.validate()) {
        return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
    }
    return next();
};
module.exports = {
    create_setting_special_validation,
    update_setting_special_validation,
};
