const { response_error } = require('../utils/app.util');
const { make } = require('simple-body-validator');
const message = require('../utils/constain.util');

const step_image_Rules = {
    step_image: 'required|string',
};

const step_image_validation = async (req, res, next) => {
    const check_validation = make(req.body, step_image_Rules);
    if (!check_validation.validate()) {
        return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
    }
    return next();
};

module.exports = {
    step_image_validation,
};
