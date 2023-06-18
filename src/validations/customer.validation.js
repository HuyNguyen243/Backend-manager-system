const { response_error } = require('../utils/app.util');
const { make } = require('simple-body-validator');
const message = require('../utils/constain.util');

const customer_Rules = {
    create_by: 'string',
    fullname: 'required|min:3',
    email: 'required|string|email',
    country: 'required|string',
    city: 'required|string',
    link: 'required|string',
    list_jobs: 'array',
    infor_reminder: 'required',
};

const create_customer_special_validation = async (req, res, next) => {
    const check_validation = make(req.body, customer_Rules);
    if (!check_validation.validate()) {
        return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
    }
    return next();
};

module.exports = {
    create_customer_special_validation,
};
