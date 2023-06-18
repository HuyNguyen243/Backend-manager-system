const BaseController = require('./BaseController');
const messager = require('../utils/constain.util');
const UserRepositories = require('../repositories/UserRepositories');
const AuthRepositories = require('../repositories/AuthRepositories');
const MessageRepositories = require('../repositories/MessageRepositories');
const UserRules = require('../rules/users.rules');
const sendMail = require('../services/sendmail.sevice');
const { hash_string } = require('../utils/support.util');
const { jwt_verify_token } = require('../services/jwt.service');
class AuthController extends BaseController {
    userRespo;
    authRespo;
    messRespo;
    constructor() {
        super();
        this.messRespo = new MessageRepositories();
        this.userRespo = new UserRepositories();
        this.authRespo = new AuthRepositories();
    }

    login = async (req, res) => {
        try {
            const payload = {
                username: req.body.username,
                password: req.body.password,
                req: req,
            };
            const auth_login = await this.authRespo.auth(payload, res);
            if (!auth_login.error) {
                await this.userRespo.change_activity(auth_login._id, {
                    status: UserRules.STATUS.ONLINE,
                });
                delete auth_login._id;
                const users = await this.messRespo.getMembers();
                global.io.emit('get-members', users);
                return this.response_success(res, auth_login, messager.LOGIN_SUCCSSES);
            }
            return this.response_error(res, [], auth_login.error);
        } catch (error) {
            return this.response_error(res, error, messager.LOGIN_FAILED);
        }
    };

    logout = async (req, res) => {
        try {
            const _id_activity = req._id_activity;

            await this.userRespo.change_activity(_id_activity, {
                status: UserRules.STATUS.OFFLINE,
            });
            const logout_token = await this.authRespo.remove_token(_id_activity);
            if (logout_token) {
                const users = await this.messRespo.getMembers();
                global.io.emit('get-members', users);
                return this.response_success(res, [], messager.LOGOUT_SUCCSSES);
            }
            return this.response_error(res, [], messager.LOGOUT_FAILED);
        } catch (error) {
            return this.response_error(res, error, messager.LOGOUT_FAILED);
        }
    };

    checktoken = async (req, res) => {
        try {
            const data_check = {
                access_token: req.access_token,
                _id_activity: req.body._id_activity,
            };

            const check_token = await this.authRespo.new_auth_token(data_check);
            if (check_token) {
                delete check_token._id;
                return this.response_success(res, check_token, messager.CHECK_TOKEN_SUCCSSES);
            }
            return this.response_error(res, [], messager.CHECK_TOKEN_FAILS);
        } catch (error) {
            return this.response_error(res, error, messager.CHECK_TOKEN_FAILS);
        }
    };

    forgotpassword = async (req, res) => {
        try {
            const payload = {
                email: req.body?.email,
            };
            const checkUser = await this.userRespo.getuser(payload);
            if (!checkUser) {
                return this.response_error(res, [], messager.EMAIL_NOT_FOUND);
            }
            checkUser.ip = await this.authRespo.get_ip();
            const tokenReset = await this.authRespo.create_new_token(checkUser);
            await sendMail(payload.email, {
                id: checkUser?.id_system,
                token: tokenReset,
                username: checkUser?.username,
                host: req.get('origin'),
            });
            return this.response_success(
                res,
                {
                    messager:
                        'Bạn vui lòng kiểm tra hộp thư điện tử và nhập vào liên kết khôi phục mật khẩu được đính kèm.',
                },
                messager.REQUEST_SUCCSSES
            );
        } catch (error) {
            return this.response_error(res, error, messager.REQUEST_FAILED);
        }
    };

    resetpassword = async (req, res) => {
        try {
            const { id, password, token } = req.body;
            const checkUser = await this.userRespo.getuser({
                id_system: id,
            });

            if (!checkUser) {
                return this.response_error(res, [], messager.USER_NOT_FOUND);
            }
            // Check token validity
            let auth_access_token = jwt_verify_token(token);
            if (!auth_access_token) {
                return this.response_error(res, [], messager.INVAILD_TOKEN);
            }
            const hasher_pwd = hash_string(password);
            await this.userRespo.update({ id_system: id }, { password: hasher_pwd });
            return this.response_success(
                res,
                {
                    messager:
                        'Mật khẩu của bạn đã được thay đổi thành công. Xin vui lòng sử dụng thông tin mới để đăng nhập',
                },
                messager.REQUEST_SUCCSSES
            );
        } catch (error) {
            return this.response_error(res, error, messager.REQUEST_FAILED);
        }
    };
}

const authController = new AuthController();
module.exports = authController;
