// USER
define('CREATE_USER_SUCSSES', 'Create user successfully');
define('CREATE_USER_FAIL', 'Create user failed');
define('GET_USER_SUCSSES', 'Get user successfully');
define('GET_USER_FAIL', 'Get user failed');
define('USER_INVAILD', 'ID User is invalid');
define('EMAIL_EXISTS', 'Email đã tồn tại');
define('USERNAME_EXISTS', 'Tên người dùng đã tồn tại');
define('PHONE_EXISTS', 'Số điện thoại đã tồn tại');
define('PERMISSION_EXISTS', 'Permission is exists');
define('DATA_INVAILD', 'Không có kết quả tìm kiếm');
define('UPDATE_USER_SUCCESS', 'Update user successfully');
define('UPDATE_USER_FAIL', 'Update user failed');

define('CHANGE_STATUS_USER_FAIL', 'Change status of users failed');
define('CHANGE_STATUS_USER_SUCCESS', 'Change status of users successfully');
///////////////VI
define('EMAIL_NOT_FOUND', 'Email không tồn tại');
define('USER_NOT_FOUND', 'Người dùng tồn tại');

//CUSTOMER
define('CREATE_CUSTOMER_FAIL', 'Create customer failed');
define('CREATE_CUSTOMER_SUCESS', 'Create customer successfully');
define('UPDATE_CUSTOMER_FAIL', 'update customer failed');
define('UPDATE_CUSTOMER_SUCESS', 'update customer successfully');
define('GET_CUSTOMER_SUCSSESS', 'Get customer successfully');
define('GET_CUSTOMER_FAIL', 'Get customer failed');
define('DELETE_CUSTOMER_FAIL', 'delete customer failed');
define('DELETE_CUSTOMER_SUCESS', 'delete customer successfully');
define('CHANGE_STATUS_CUSTOMER_FAIL', 'Change status of customer failed');
define('CHANGE_STATUS_CUSTOMER_SUCCESS', 'Change status of customer successfully');

//PAY
// define('CREATE_PAY_FAIL', 'Create pay failed');
define('CREATE_PAY_SUCCESS', 'Create pay successfully');
define('UPDATE_PAY_FAIL', 'update pay failed');
define('UPDATE_PAY_SUCCESS', 'update pay successfully');
define('GET_PAY_SUCCESS', 'Get pay successfully');
define('GET_PAY_FAIL', 'Get pay failed');
define('DELETE_PAY_FAIL', 'delete pay failed');
define('DELETE_PAY_SUCCESS', 'delete pay successfully');
//SETTING
define('CREATE_SETTING_FAIL', 'Create setting failed');
define('CREATE_SETTING_SUCCESS', 'Create setting successfully');
define('UPDATE_SETTING_FAIL', 'update setting failed');
define('UPDATE_SETTING_SUCCESS', 'update setting successfully');
define('GET_SETTING_SUCCESS', 'Get setting successfully');
define('GET_SETTING_FAIL', 'Get setting failed');
define('DELETE_SETTING_FAIL', 'delete setting failed');
define('DELETE_SETTING_SUCCESS', 'delete setting successfully');
// PERMISSION
define('UNAUTHORIZED', 'Call api unauthorized');
define('ERROR_AUTHORIZED', 'Call api unauthorized key ');
define('ERROR_AUTHORIZED_API', 'Call auth api failed ');
define('INVAILD_TOKEN', 'Invalid access token');
define('TOKEN_EXPRIED', 'Token is expired');

// VALIDATION
define('INVAILD_INPUT', 'Dữ liệu nhập lỗi. Vui lòng nhập lại');
define('PAYLOAD_OVER', 'Payload data is over');

// LOGIN ROUTER
define('LOGIN_FAILED', 'Login failed');
define('REQUEST_FAILED', 'Request failed');
define('LOGIN_SUCCSSES', 'Login successfully');
define('REQUEST_SUCCSSES', 'Request successfully');

//JOBS
///////////// VI
define('CREATE_JOBS_FAIL', 'Tạo công việc mới không thành công');
define('UPDATE_JOBS_FAIL', 'Cập nhật công việc mới không thành công');
define('CANCEL_JOBS_FAIL', 'Từ chối công việc không thành công');
define('CREATE_PAY_FAIL', 'Tạo đơn thanh toán không thành công');
define('COST_JOBS_FAIL', 'Cài đặt tiền không hợp lệ');
define('COST_EDITOR_INVAILD', 'Chưa cài dặt chi phí Editor');
///////////// ENG
define('CREATE_JOBS_SUCCESS', 'Create jobs successfully');
define('GET_JOBS_FAIL', 'Get jobs failed');
define('GET_JOBS_SUCCESS', 'Get jobs successfully');
define('UPDATE_JOBS_SUCCESS', 'Update jobs successfully');
define('CANCEL_JOBS_SUCCESS', 'Cancel jobs successfully');

define('GET_MESSAGES_SUCCESS', 'get messages successfully');
define('GET_MESSAGES_FAILED', 'get messages failed');

define('UPLOAD_IMAGES_MESSAGES_SUCCESS', 'Upload images messages successfully');
define('UPLOAD_IMAGES_MESSAGES_FAILED', 'Upload images messages failed');
///////////// ENG
// define("FAIL_START_END_DAY", "The start date is longer than the end date");
///////////// VI
define('FAIL_START_END_DAY', 'Ngày bắt đầu dài hơn ngày kết thúc');

// LOGIN
///////////// VI
define('USERNAME_OR_EMAIL_INVAILD', 'Tên người dùng hoặc Email không chính xác');
define('PASSWORD_INCORECT', 'Mật khẩu không chính xác');
define('ACCOUNT_IS_LOGGED', 'Tài khoản của bạn đang đang đăng nhập ở một nơi khác');
define('EMAIL_IS_EXIST', 'Email đã tồn tại');

// WRONG
define('SOMETHING_WRONG', 'Something is wrong');
define('BODY_WRONG', 'Payload is wrong');

// LOGOUT ROUTER
define('LOGOUT_FAILED', 'Logout failed');
define('LOGOUT_SUCCSSES', 'Logout successfully');

// REMOVE  ROUTER
define('REMOVE_FAILED', 'Remove failed');
define('REMOVE_SUCCSSES', 'Remove successfully');
define('ID_NOT_FOUND', 'ID not found');

//  CHECK AUTH
define('CHECK_TOKEN_SUCCSSES', 'Check token successfully');
define('CHECK_TOKEN_FAILS', 'Check token invaild');

define('CREATE_GROUP_FAIL', 'Create group failed');
define('CREATE_GROUP_SUCCESS', 'Create group successfully');
define('UPDATE_GROUP_FAIL', 'update group failed');
define('UPDATE_GROUP_SUCCESS', 'update group successfully');
define('GET_GROUP_SUCCESS', 'Get group successfully');
define('GET_GROUP_FAIL', 'Get group failed');
define('DELETE_GROUP_FAIL', 'delete group failed');
define('DELETE_GROUP_SUCCESS', 'delete group successfully');

define('CREATE_NOTIFICATION_FAIL', 'Create notification failed');
define('CREATE_NOTIFICATION_SUCCESS', 'Create notification successfully');

define('GET_PERFORMCE_SUCCESS', 'Get performance successfully');
define('GET_PERFORMCE_FAIL', 'Get performance failed');
///////////VI
define('TOKEN_NOT_FOUND', 'Token đã hết hạn. Vui lòng xác nhận lại tài khoản');

define('MAX_QUERY_LIMIT', 'Request quá nhiều lần. Vui lòng thử lại sau 15 phút');

define('CREATE_STEP_IMAGE_FAIL', 'Create step image failed');
define('CREATE_STEP_IMAGE_SUCCESS', 'Create step image successfully');
define('CREATE_STEP_IMAGE_ISEXIST', 'Step image is exist');
define('UPDATE_STEP_IMAGE_FAIL', 'update step image failed');
define('UPDATE_STEP_IMAGE_SUCCESS', 'update step image successfully');
define('UPDATE_STEP_IMAGE_ISEXIST_FAILED', 'update failed, step image is exist');

define('GET_STEP_IMAGE_SUCCESS', 'Get step image successfully');
define('GET_STEP_IMAGE_FAIL', 'Get step image failed');
define('DELETE_STEP_IMAGE_FAIL', 'delete step image failed');
define('DELETE_STEP_IMAGE_SUCCESS', 'delete step image successfully');

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true,
    });
}
