const BaseController = require('./BaseController');
const messager = require('../utils/constain.util');
const PayReponsitories = require('../repositories/PayReponsitories');
const UserRules = require('../rules/users.rules');
const { random_id, format_date_query } = require('../utils/support.util');
const UserRepositories = require('../repositories/UserRepositories');
const JobRepositories = require('../repositories/JobRepositories');
const customerResponsitores = require('../repositories/CustomerResponsitories');
class PayController extends BaseController {
    payRespo;
    jobsRespo;
    customerRespo;
    constructor() {
        super();
        this.jobsRespo = new JobRepositories();
        this.payRespo = new PayReponsitories();
        this.userRespo = new UserRepositories();
        this.customerRespo = new customerResponsitores();
    }

    getPays = async (req, res) => {
        try {
            const id = req.params?.id;

            const checkId = await this.userRespo.getuser({ id_system: id });
            if (!checkId) {
                return this.response_error(res, [], messager.GET_PAY_FAIL);
            }

            let aggregate_options = [
                {
                    $project: {
                        _id: 0,
                        id_job: 1,
                        id_system: 1,
                        pay_amount: 1,
                        rate_sale: 1,
                        staff_is_pay: 1,
                        pay_role: 1,
                        status: 1,
                        _create_at: 1,
                    },
                },
                { $unwind: '$id_job' },
                { $unwind: '$id_system' },
                {
                    $sort: {
                        _create_at: -1,
                    },
                },
            ];

            if (!id.includes(UserRules._ROLE.ADMIN)) {
                aggregate_options.unshift({
                    $match: { staff_is_pay: id },
                });
            }
            if (req.query) {
                if (req.query?.keyword) {
                    const keyword = req.query.keyword;

                    aggregate_options.unshift({
                        $match: {
                            $or: [
                                { pay_amount: { $regex: new RegExp(keyword, 'i') } },
                                { rate_sale: { $regex: new RegExp(keyword, 'i') } },
                                { pay_role: { $regex: new RegExp(keyword, 'i') } },
                                { staff_is_pay: { $regex: new RegExp(keyword, 'i') } },
                                { status: { $regex: new RegExp(keyword, 'i') } },
                                { id_job: { $regex: new RegExp(keyword, 'i') } },
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
                            _create_at: checkDate,
                        },
                    });
                }
            }

            const result = await this.payRespo.get(aggregate_options);

            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                // Reminder_infor
                element['reminder_staff'] = (
                    await this.userRespo.getuser({ id_system: element['staff_is_pay'] })
                )?.infor_reminder;
                if (element?.pay_role === UserRules.ROLE.EDITOR || element?.pay_role === UserRules.ROLE.LEADER_EDITOR) {
                    element['pay_amount'] = Number(element?.pay_amount);
                }
                const list_jobs = await this.jobsRespo.getjobs({
                    id_system: element?.id_job,
                });

                if (list_jobs?.id_customer) {
                    const customer = await this.customerRespo.getOne({
                        id_system: list_jobs?.id_customer,
                    });

                    if (customer) {
                        element.customer_reminder = customer?.infor_reminder;
                        element.group_name_job = list_jobs?.group_name_job;
                    }
                }

                if (element?.pay_role === UserRules.ROLE.SALER) {
                    element['pay_amount'] = Number((list_jobs?.total_cost * list_jobs?.rate_saler_in_created) / 100);
                }

                element.quality_img = list_jobs?.quality_img || 0;
            }

            if (result) {
                return this.response_success(res, result, messager.GET_PAY_SUCCESS);
            }
        } catch (error) {
            return this.response_error(res, [], messager.GET_PAY_FAIL);
        }
    };

    create = async (req, res) => {
        try {
            const { body } = req;
            let id_system = '';
            do {
                id_system = random_id(UserRules.ROLE.PAY);
            } while (
                await this.payRespo.is_exist({
                    id_system: id_system,
                })
            );
            body['id_system'] = id_system;
            const result = await this.payRespo.create(body);

            if (!result) {
                return this.response_error(res, [], messager.CREATE_PAY_FAIL);
            }

            return this.response_success(res, result, messager.CREATE_PAY_SUCCESS);
        } catch (error) {
            return this.response_error(res, [], messager.CREATE_PAY_FAIL);
        }
    };

    update = async (req, res) => {
        try {
            const body = req?.body;
            if (body?.id_system?.length > 0) {
                const listID = body?.id_system;
                for (let index = 0; index < listID.length; index++) {
                    const element = listID[index];
                    const update = await this.payRespo.update(element, { status: body?.status });
                    if (!update) {
                        return this.response_error(res, [], messager.UPDATE_PAY_FAIL);
                    }
                }
            }

            return this.response_success(res, [], messager.UPDATE_PAY_SUCCESS);
        } catch (error) {
            return this.response_error(res, [], messager.UPDATE_PAY_FAIL);
        }
    };

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.payRespo.delete({ id_system: id });

            if (!result) {
                return this.response_error(res, [], messager.DELETE_CUSTOMER_FAIL);
            }
            return this.response_success(res, [], messager.DELETE_CUSTOMER_SUCESS);
        } catch (error) {
            return this.response_error(res, [], messager.DELETE_CUSTOMER_FAIL);
        }
    };

    getPayStaff = async (req, res) => {
        try {
            let aggregate_options = [
                {
                    $group: {
                        _id: {
                            // day: { $dayOfMonth: "$_create_at" },
                            month: { $month: '$_create_at' },
                            year: { $year: '$_create_at' },
                            staff_is_pay: '$staff_is_pay',
                            pay_role: '$pay_role',
                            status: '$status',
                        },
                        pay_employees: {
                            $sum: '$pay_employees',
                        },
                        list_id: {
                            $push: {
                                id_system: '$id_system',
                                id_job: '$id_job',
                                pay_amount: '$pay_amount',
                                rate_sale: '$rate_sale',
                            },
                        },
                    },
                },
                {
                    $sort: {
                        _create_at: 1,
                    },
                },
            ];

            if (req.query?.keyword) {
                const keyword = req.query.keyword;
                const checkUser = await this.userRespo.getuserall([
                    {
                        $match: {
                            $or: [
                                { username: { $regex: new RegExp(keyword, 'i') } },
                                { infor_reminder: { $regex: new RegExp(keyword, 'i') } },
                            ],
                        },
                    },
                    {
                        $unwind: '$id_system',
                    },
                    {
                        $group: {
                            _id: 0,
                            list_id: {
                                $push: '$id_system',
                            },
                        },
                    },
                    {
                        $project: {
                            list_id: 1,
                        },
                    },
                ]);
                aggregate_options.unshift({
                    $match: {
                        $or: [
                            {
                                pay_employees: {
                                    $regex: new RegExp(keyword, 'i'),
                                },
                            },
                            {
                                staff_is_pay: { $in: checkUser?.length > 0 ? checkUser[0].list_id : [] },
                            },
                            { status: { $regex: new RegExp(keyword, 'i') } },
                            { id_job: { $regex: new RegExp(keyword, 'i') } },
                        ],
                    },
                });
            }

            if (req.query.status) {
                aggregate_options.unshift({
                    $match: {
                        status: req.query.status,
                    },
                });
            }

            if (req.query?.start_date && req.query?.end_date) {
                const { start_date, end_date } = req.query;
                const checkDate = format_date_query(start_date, end_date);
                aggregate_options.unshift({
                    $match: {
                        _create_at: checkDate,
                    },
                });
            }

            const result = await this.payRespo.get(aggregate_options);

            const payStaff = [];
            if (!result) {
                return this.response_error(res, [], messager.GET_PAY_FAIL);
            }

            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                const dataUser = await this.userRespo.getuser({ id_system: element?._id?.['staff_is_pay'] });
                element['reminder_staff'] = dataUser?.infor_reminder;
                element['username'] = dataUser?.username;
                element['nameBank'] = dataUser?.nameBank;
                element['number_account_payment'] = dataUser?.number_account_payment;
                element['name_account_payment'] = dataUser?.name_account_payment;

                let payEmployees = 0;
                let quality_img = 0;

                for (const job of element.list_id) {
                    if (
                        element?._id?.pay_role === UserRules.ROLE.EDITOR ||
                        element?._id?.pay_role === UserRules.ROLE.LEADER_EDITOR
                    ) {
                        payEmployees += Number(job?.pay_amount);
                    }

                    const list_jobs = await this.jobsRespo.getjobs({
                        id_system: job?.id_job,
                    });

                    if (element?._id?.pay_role === UserRules.ROLE.SALER) {
                        if (list_jobs?.total_cost) {
                            payEmployees += Number((list_jobs?.total_cost * list_jobs?.rate_saler_in_created) / 100);
                            job.pay_amount = Number((list_jobs?.total_cost * list_jobs?.rate_saler_in_created) / 100);
                        }
                    }

                    quality_img += list_jobs?.quality_img ? list_jobs?.quality_img : 0;
                }

                if (element?._id?.pay_role === UserRules.ROLE.SALER) {
                    payEmployees = Number.parseFloat(payEmployees.toFixed(2));
                }

                element.pay_employees = payEmployees;
                element.quality_img = quality_img || 0;

                payStaff.push({
                    date: element?._id?.month + '/' + element?._id?.year,
                    reminder_staff: element?.reminder_staff,
                    username: element?.username,
                    nameBank: element?.nameBank,
                    number_account_payment: element?.number_account_payment,
                    name_account_payment: element?.name_account_payment,
                    staff_is_pay: Number.parseFloat(element?._id?.staff_is_pay).toFixed(2),
                    pay_role: element?._id?.pay_role,
                    pay_employees: element?.pay_employees,
                    status: element?._id?.status,
                    list_id: element?.list_id,
                    quality_img: element?.quality_img,
                });

                // Reminder_infor
            }

            const formatDate = (date) => {
                const arr = date.split('/');
                return Number(arr.join(''));
            };

            const rs = payStaff.sort((el, el2) => {
                return formatDate(el.date) > formatDate(el2.date) ? -1 : 1;
            });

            return this.response_success(res, rs, messager.GET_PAY_SUCCESS);
        } catch (error) {
            return this.response_error(res, [], messager.GET_PAY_FAIL);
        }
    };
}

const payController = new PayController();

module.exports = payController;
