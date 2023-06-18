const {
    response_success,
    response_error,
    response_unauthorized,
    response_forbidden,
    response_not_found,
} = require('./response.util');

const { random_id, hash_string, clean_body, hash_string_decode, TimeNow } = require('./support.util');

const {
    data_response,
    token_response,
    data_customer_response,
    data_pay_response,
    data_job_response,
    data_cost_response,
    data_setting_response,
} = require('./data.util');
module.exports = {
    // Common function
    random_id,
    hash_string,
    clean_body,
    hash_string_decode,
    TimeNow,

    // Response
    response_success,
    response_error,
    response_unauthorized,
    response_forbidden,
    response_not_found,
    data_job_response,
    data_cost_response,
    // Data
    data_response,
    token_response,
    data_customer_response,
    data_pay_response,
    data_setting_response,
};
