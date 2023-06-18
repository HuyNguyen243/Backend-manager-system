const BaseController = require('./BaseController');
const messager = require('../utils/constain.util');
const { data_response } = require('../utils/app.util');
const UserRepositories = require('../repositories/UserRepositories');
const { random_id, hash_string } = require('../utils/support.util');
const UserRules = require('../rules/users.rules');
const { TimeNow } = require('../utils/support.util');
const { singleAvatar } = require('../services/multer.service');
const MessageRepositories = require('../repositories/MessageRepositories');
const { orderIds } = require('../commons/message.common');
const { format_date_query } = require('../utils/support.util');
const { APP_WEBSITE_API } = require('./../config/app.config');

class UserController extends BaseController {
    userRespositories;
    messRespositories;
    constructor() {
        super();
        this.userRespositories = new UserRepositories();
        this.messRespositories = new MessageRepositories();
    }
    get_user = async (req, res) => {
        try {
            const id = req.params.id;
            const user = await this.userRespositories.getuser({
                id_system: id,
            });

            if (user) {
                const fullUrl = APP_WEBSITE_API + '/images/';
                const userData = data_response(user, fullUrl);
                return this.response_success(res, userData, messager.GET_USER_SUCSSES);
            }
            return this.response_error(res, [], messager.GET_USER_FAIL);
        } catch (error) {
            return this.response_error(res, [], messager.GET_USER_FAIL);
        }
    };

    get_user_all = async (req, res) => {
        try {
            let aggregate_options = [
                {
                    $match: {
                        role: { $not: /ADMIN/ },
                    },
                },
                {
                    $project: {
                        fullname: 1,
                        status: 1,
                        email: 1,
                        births: 1,
                        start_day: 1,
                        address: 1,
                        id_system: 1,
                        phone: 1,
                        role: 1,
                        payment_method: 1,
                        nameBank: 1,
                        number_account_payment: 1,
                        branch: 1,
                        avatar: 1,
                        infor_reminder: 1,
                        kpi_saler: 1,
                        _modified_at: 1,
                        _create_at: 1,
                    },
                },
                {
                    $sort: { _create_at: -1 },
                },
            ];

            if (req.query.saler) {
                aggregate_options.unshift({
                    $match: { role: UserRules.ROLE.SALER },
                });
            }

            if (req.query?.keyword) {
                const keyword = req.query.keyword;
                aggregate_options.unshift({
                    $match: {
                        $or: [
                            { fullname: { $regex: new RegExp(keyword, 'i') } },
                            { role: { $regex: new RegExp(keyword, 'i') } },
                            { infor_reminder: { $regex: new RegExp(keyword, 'i') } },
                        ],
                    },
                });
            }

            if (req.query?.status) {
                aggregate_options.unshift({
                    $match: { status: req.query?.status },
                });
            }

            if (req.query?.sort_by && req.query?.sort_value) {
                let sort;
                if (req.query?.sort_value === 'ASC') {
                    sort = 1;
                } else if (req.query?.sort_value === 'DESC') {
                    sort = -1;
                }
                const sortObj = {};
                sortObj[req.query?.sort_by] = sort;
                sortObj['_id'] = sort;
                aggregate_options.push({
                    $sort: sortObj,
                });
            }

            if (req.query?.start_date && req.query?.end_date) {
                const { start_date, end_date } = req.query;
                const checkDate = format_date_query(start_date, end_date);
                aggregate_options.push({
                    $match: {
                        start_day: checkDate,
                    },
                });
            }

            const userData = await this.userRespositories.getuserall(aggregate_options);

            if (userData) {
                const data_user_rp = [];
                const fullUrl = req.protocol + '://' + req.get('host') + '/images/';

                for (let index = 0; index < userData.length; index++) {
                    data_user_rp.push(data_response(userData[index], fullUrl));
                }

                return this.response_success(res, { data_user: data_user_rp }, messager.GET_USER_SUCSSES);
            }

            return this.response_error(res, [], messager.GET_USER_FAIL);
        } catch (error) {
            return this.response_error(res, error, messager.GET_USER_FAIL);
        }
    };

    createAdmin = async (req, res) => {
        try {
            const body = req.body;
            // Check mail
            const is_email_exist = await this.userRespositories.is_exist({
                email: body?.email,
            });
            if (is_email_exist) {
                return this.response_error(res, [], messager.EMAIL_EXISTS);
            }

            // Check username
            const is_username_exist = await this.userRespositories.is_exist({
                username: body?.username,
            });
            if (is_username_exist) {
                return this.response_error(res, [], messager.USERNAME_EXISTS);
            }
            let id_system = '';
            do {
                id_system = random_id(UserRules.ROLE.ADMIN);
            } while (
                await this.userRespositories.is_exist({
                    id_system: id_system,
                })
            );
            const hasher_pwd = hash_string(body?.password);
            body.id_system = id_system;
            body.password = hasher_pwd;
            const user = await this.userRespositories.createAdmin(body);
            if (user) {
                return this.response_success(res, user, messager.CREATE_USER_SUCSSES);
            }
            return this.response_error(res, [], messager.CREATE_USER_FAIL);
        } catch (error) {
            return this.response_error(res, error, messager.CREATE_USER_FAIL);
        }
    };
    create_user = async (req, res) => {
        try {
            const body = req.body;
            // Check mail
            const is_email_exist = await this.userRespositories.is_exist({
                email: body?.email,
            });
            if (is_email_exist) {
                return this.response_error(res, [], messager.EMAIL_EXISTS);
            }

            // Check username
            const is_username_exist = await this.userRespositories.is_exist({
                username: body?.username,
            });
            if (is_username_exist) {
                return this.response_error(res, [], messager.USERNAME_EXISTS);
            }

            // Check phone
            const is_phone_exist = await this.userRespositories.is_exist({
                username: body?.phone,
            });
            if (is_phone_exist) {
                return this.response_error(res, [], messager.PHONE_EXISTS);
            }

            // Check permission
            const is_role_exist = await this.userRespositories.is_exist({
                id_system: body?.create_by,
            });
            if (!is_role_exist) {
                return this.response_error(res, [], messager.PERMISSION_EXISTS);
            }

            let id_system = '';
            do {
                id_system = random_id(body.role);
            } while (
                await this.userRespositories.is_exist({
                    id_system: id_system,
                })
            );

            const hasher_pwd = hash_string(body?.password);
            body.id_system = id_system;
            body.password = hasher_pwd;
            body.start_day == null ? (body.start_day = TimeNow()) : body.start_day;
            body.births == null ? (body.births = TimeNow()) : body.births;
            const user = await this.userRespositories.create(body);
            const fullUrl = req.protocol + '://' + req.get('host') + '/images/';
            const userData = data_response(user, fullUrl);
            if (user) {
                const users = await this.messRespositories.getMembers();
                global.io.emit('get-members', users);

                return this.response_success(res, userData, messager.CREATE_USER_SUCSSES);
            }
            return this.response_error(res, [], messager.CREATE_USER_FAIL);
        } catch (error) {
            return this.response_error(res, error, messager.CREATE_USER_FAIL);
        }
    };

    update_user = async (req, res) => {
        try {
            await singleAvatar(req, res);
            const id = req.params.id;
            const body = req.body;
            const user = await this.userRespositories.getuser({
                id_system: id,
            });
            if (user) {
                if (body) {
                    // Check mail
                    const is_email_exist = await this.userRespositories.is_exist({
                        email: body?.email,
                    });
                    if (is_email_exist) {
                        return this.response_error(res, [], messager.EMAIL_EXISTS);
                    }

                    // Check username
                    const is_username_exist = await this.userRespositories.is_exist({
                        username: body?.username,
                    });
                    if (is_username_exist) {
                        return this.response_error(res, [], messager.USERNAME_EXISTS);
                    }

                    // Check phone
                    const is_phone_exist = await this.userRespositories.is_exist({
                        username: body?.phone,
                    });
                    if (is_phone_exist) {
                        return this.response_error(res, [], messager.PHONE_EXISTS);
                    }

                    if (body?.password) {
                        const hashed_pwd = hash_string(body?.password);
                        body.password = hashed_pwd;
                    }

                    if (req.file) {
                        const avatar = req.file;
                        if (user?.avatar) {
                            await this.userRespositories.remove_image_to_public(user?.avatar);
                        }
                        body.avatar = avatar.filename;
                    }

                    const user_update = await this.userRespositories.update(
                        {
                            id_system: id,
                        },
                        body
                    );
                    if (user_update) {
                        const user = await this.userRespositories.getuser({
                            id_system: id,
                        });
                        const fullUrl = req.protocol + '://' + req.get('host') + '/images/';
                        const userData = data_response(user, fullUrl);
                        const users = await this.messRespositories.getMembers();
                        global.io.emit('get-members', users);
                        return this.response_success(res, userData, messager.UPDATE_USER_SUCCESS);
                    }
                    if (req.file) {
                        await this.userRespositories.remove_image_to_public(req.file.filename);
                    }
                    return this.response_error(res, [], messager.DATA_INVAILD);
                }
                return this.response_error(res, [], messager.UPDATE_USER_FAIL);
            }
            return this.response_error(res, [], messager.GET_USER_FAIL);
        } catch (error) {
            return this.response_error(res, error, messager.UPDATE_USER_FAIL);
        }
    };

    removeUser = async (req, res) => {
        try {
            const id = req.params.id;

            // check ID
            const is_id_exist = await this.userRespositories.is_exist({
                id_system: id,
            });

            if (!is_id_exist) {
                return this.response_error(res, [], messager.ID_NOT_FOUND);
            }
            const remove = await this.userRespositories.remove_user(id);
            if (remove) {
                const users = await this.messRespositories.getMembers();
                global.io.emit('get-members', users);
                const nameRoom = orderIds(req.id_system, id, UserRules.MESSAGE.USER);
                await this.messRespositories.deleteMessages(nameRoom);
                return this.response_success(res, [], messager.REMOVE_SUCCSSES);
            }
            return this.response_error(res, [], messager.REMOVE_FAILED);
        } catch (error) {
            return this.response_error(res, error, messager.REMOVE_FAILED);
        }
    };

    change_status = async (req, res) => {
        try {
            const id = req.params.id;
            const status = req.query?.status;
            // check ID
            const is_id_exist = await this.userRespositories.is_exist({
                id_system: id,
            });

            if (!is_id_exist) {
                return this.response_error(res, [], messager.ID_NOT_FOUND);
            }
            const change = await this.userRespositories.change_activity(is_id_exist._id, {
                status: status,
            });
            if (change) {
                return this.response_success(res, [], messager.CHANGE_STATUS_USER_SUCCESS);
            }
            return this.response_error(res, [], messager.CHANGE_STATUS_USER_FAIL);
        } catch (error) {
            return this.response_error(res, error, messager.CHANGE_STATUS_USER_FAIL);
        }
    };

    get_reminder = async (req, res) => {
        try {
            const result = await this.userRespositories.get_reminder();
            if (result) {
                return this.response_success(res, result, messager.GET_USER_SUCSSES);
            }
            return this.response_error(res, [], messager.GET_USER_FAIL);
        } catch (error) {
            return this.response_error(res, [], messager.GET_USER_FAIL);
        }
    };
}

const userController = new UserController();
module.exports = userController;
