const {
    create_admin_special_validation,
    create_user_validation,
    update_user_validation,
} = require('./users.validation');

const { create_customer_special_validation } = require('./customer.validation');
const { create_pay_special_validation } = require('./pays.validation');
const { create_setting_special_validation, update_setting_special_validation } = require('./setting.validation');
const { auth_login_validation, forgot_validation, reset_validation } = require('./auth.validation');
const {
    create_job_validation,
    update_job_validation,
    done_job_validation,
    editor_update_job_validation,
} = require('./job.validation');
const { group_message_validation } = require('./groupMessage.validation');
const { step_image_validation } = require('./stepsImage.validation');

module.exports = {
    create_admin_special_validation,
    create_user_validation,
    update_user_validation,
    create_customer_special_validation,
    create_pay_special_validation,
    auth_login_validation,
    forgot_validation,
    reset_validation,
    create_setting_special_validation,
    update_setting_special_validation,
    create_job_validation,
    update_job_validation,
    done_job_validation,
    editor_update_job_validation,
    group_message_validation,
    step_image_validation,
};
