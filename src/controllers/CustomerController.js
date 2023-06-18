const BaseController = require('./BaseController');
const messager = require('../utils/constain.util');
const customerResponsitores = require('../repositories/CustomerResponsitories');
const NotificationResponsitories = require('../repositories/NotificationRepositories');

const { random_id, format_date_query } = require('../utils/support.util');
const UserRules = require('../rules/users.rules');
const { data_customer_response } = require('../utils/app.util');

class CustomerController extends BaseController {
    customerRespo;
    notificationRespo;
    constructor() {
        super();
        this.customerRespo = new customerResponsitores();
        this.notificationRespo = new NotificationResponsitories();
    }

    get = async (req, res) => {
        try {
            let aggregate_options = [
                {
                    $sort: { _create_at: -1 },
                },
            ];

            const checkrole = await this.notificationRespo.checkRole(req.id_system);

            if (checkrole !== UserRules.ROLE.ADMIN) {
                aggregate_options.unshift({
                    $match: { create_by: req.id_system },
                });
            }

            if (req.query?.keyword) {
                const keyword = req.query.keyword;
                aggregate_options.unshift({
                    $match: {
                        $or: [
                            { fullname: { $regex: new RegExp(keyword, 'i') } },
                            { email: { $regex: new RegExp(keyword, 'i') } },
                            { country: { $regex: new RegExp(keyword, 'i') } },
                            { city: { $regex: new RegExp(keyword, 'i') } },
                            { id_system: { $regex: new RegExp(keyword, 'i') } },
                            { create_by: { $regex: new RegExp(keyword, 'i') } },
                            { infor_reminder: { $regex: new RegExp(keyword, 'i') } },
                        ],
                    },
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
                        _create_at: checkDate,
                    },
                });
            }

            const customer = await this.customerRespo.get(aggregate_options);
            return this.response_success(res, customer, messager.GET_CUSTOMER_SUCSSESS);
        } catch (error) {
            return this.response_error(res, [], messager.GET_CUSTOMER_FAIL);
        }
    };

    getOne = async (req, res) => {
        try {
            const id = req.params.id;
            const customer = await this.customerRespo.getOne({
                id_system: id,
            });
            if (customer) {
                const result = data_customer_response(customer);
                return this.response_success(res, result, messager.GET_CUSTOMER_SUCSSESS);
            }
            return this.response_error(res, [], messager.GET_CUSTOMER_FAIL);
        } catch (error) {
            return this.response_error(res, [], messager.GET_CUSTOMER_FAIL);
        }
    };

    create = async (req, res) => {
        try {
            const { body } = req;

            let id_system = '';
            do {
                id_system = random_id(UserRules.ROLE.CUSTOMER);
            } while (
                await this.customerRespo.is_exist({
                    id_system: id_system,
                })
            );
            body['id_system'] = id_system;

            const checkEmailIsExist = await this.customerRespo.emailIsExist(body.email);
            if (checkEmailIsExist) {
                return this.response_error(res, [], messager.EMAIL_IS_EXIST);
            }

            const customer = await this.customerRespo.create(body);
            if (!customer) {
                return this.response_error(res, [], messager.CREATE_CUSTOMER_FAIL);
            }
            return this.response_success(res, customer, messager.CREATE_CUSTOMER_SUCESS);
        } catch (error) {
            return this.response_error(res, [], messager.CREATE_CUSTOMER_FAIL);
        }
    };

    update = async (req, res) => {
        try {
            const { body } = req;
            const { id } = req.params;

            const checkEmailIsExist = await this.customerRespo.emailIsExist(body.email);
            if (checkEmailIsExist) {
                return this.response_error(res, [], messager.EMAIL_IS_EXIST);
            }
            const result = await this.customerRespo.update_customer(id, body);

            if (!result) {
                return this.response_error(res, [], messager.UPDATE_CUSTOMER_FAIL);
            }
            return this.response_success(res, [], messager.UPDATE_CUSTOMER_SUCESS);
        } catch (error) {
            return this.response_error(res, [], messager.UPDATE_CUSTOMER_FAIL);
        }
    };

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.customerRespo.delete(id);

            if (!result) {
                return this.response_error(res, [], messager.DELETE_CUSTOMER_FAIL);
            }
            return this.response_success(res, [], messager.DELETE_CUSTOMER_SUCESS);
        } catch (error) {
            return this.response_error(res, [], messager.DELETE_CUSTOMER_FAIL);
        }
    };
}

const customerController = new CustomerController();
module.exports = customerController;
