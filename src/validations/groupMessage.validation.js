const { response_error, clean_body } = require('../utils/app.util');
const { make } = require('simple-body-validator');
const message = require('../utils/constain.util');

const groupMsg_rules = {
    name: 'required|min:6',
    create_by: 'required|string',
    members: 'required|array',
    type: 'required|string',
};

const group_message_validation = async (req, res, next) => {
    const check_validation = make(req.body, groupMsg_rules);
    req.body = clean_body(req.body, groupMsg_rules);
    if (check_validation.validate()) {
        return next();
    }

    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};

module.exports = {
    group_message_validation,
};
