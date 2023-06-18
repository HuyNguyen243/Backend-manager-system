const { response_error } = require('../utils/app.util');
const { make } = require('simple-body-validator');
const message = require('../utils/constain.util');

const pays_Rules = {
    id_job: 'required|string|min:6',
    create_by: 'required|string|min:6',
    staff_is_pay: 'required|string|min:6',
    pay_employees: 'required|string|min:3',
};

const create_pay_special_validation = async (req, res, next) => {
    const check_validation = make(req.body, pays_Rules);
    if (!check_validation.validate()) {
        return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
    }
    return next();
};

module.exports = {
    create_pay_special_validation,
};
