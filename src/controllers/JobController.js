const BaseController = require('./BaseController');
const messager = require('../utils/constain.util');
const { data_job_response } = require('../utils/app.util');
const JobRepositories = require('../repositories/JobRepositories');
const CustomerRepositories = require('../repositories/CustomerResponsitories');
const UserRepositories = require('../repositories/UserRepositories');
const SettingRepositories = require('../repositories/SettingReponsitories');
const PayReponsitories = require('../repositories/PayReponsitories');
const NotificationResponsitories = require('../repositories/NotificationRepositories');
const MessageRepositories = require('../repositories/MessageRepositories');

const UserRules = require('../rules/users.rules');
const JobsRules = require('../rules/jobs.rules');
const NotificationRules = require('../rules/notification.rules');

const { random_id, format_date_query } = require('../utils/support.util');
const JobRules = require('../rules/jobs.rules');
// const JobRules = require('../rules/jobs.rules');

class JobController extends BaseController {
    jobsRespo;
    customerRespo;
    userRespo;
    settingRespo;
    payrepRespo;
    notificationRespo;
    messageRespo;
    constructor() {
        super();
        this.jobsRespo = new JobRepositories();
        this.customerRespo = new CustomerRepositories();
        this.userRespo = new UserRepositories();
        this.settingRespo = new SettingRepositories();
        this.payrepRespo = new PayReponsitories();
        this.notificationRespo = new NotificationResponsitories();
        this.messageRespo = new MessageRepositories();
    }

    get_jobs_all = async (req, res) => {
        try {
            let aggregate_options = [
                {
                    $sort: {
                        start_day: -1,
                    },
                },
            ];
            if (req.role === UserRules.ROLE.SALER) {
                aggregate_options.unshift({
                    $match: {
                        id_saler: req.id_system,
                    },
                });
            }
            if (req.role === UserRules.ROLE.EDITOR || req.role === UserRules.ROLE.LEADER_EDITOR) {
                aggregate_options.unshift({
                    $match: {
                        id_editor: req.id_system,
                    },
                });
            }
            if (req.query?.keyword) {
                const keyword = req.query.keyword;
                const checkCustomer = await this.customerRespo.getAggregate([
                    {
                        $match: {
                            $or: [
                                // { fullname: { $regex: new RegExp(keyword, 'i') } },
                                // { infor_reminder: { $regex: new RegExp(keyword, 'i') } },
                                { infor_reminder: keyword },
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

                const checkUser = await this.userRespo.getuserall([
                    {
                        $match: {
                            $or: [{ username: keyword }, { infor_reminder: keyword }],
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
                            { id_system: { $regex: new RegExp(keyword, 'i') } },
                            { id_editor: { $in: checkUser?.length > 0 ? checkUser[0].list_id : [] } },
                            { id_saler: { $in: checkUser?.length > 0 ? checkUser[0].list_id : [] } },
                            {
                                id_customer: {
                                    $in: checkCustomer?.length > 0 ? checkCustomer[0].list_id : [],
                                },
                            },
                        ],
                    },
                });
            }

            if (req.query?.status) {
                aggregate_options.unshift({
                    $match: { status_jobs: req.query?.status },
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
                        $or: [
                            {
                                _create_at: checkDate,
                            },
                            {
                                _create_at: checkDate,
                            },
                        ],
                    },
                });
            }

            const jobsData = await this.jobsRespo.getjobsall(aggregate_options);
            if (jobsData) {
                const data_job_rp = [];
                for (let index = 0; index < jobsData.length; index++) {
                    // Reminder_infor
                    jobsData[index]['reminder_saler'] = (
                        await this.userRespo.getuser({
                            id_system: jobsData[index]['id_saler'],
                        })
                    )?.infor_reminder;
                    jobsData[index]['reminder_editor'] = (
                        await this.userRespo.getuser({
                            id_system: jobsData[index]['id_editor'],
                        })
                    )?.infor_reminder;
                    jobsData[index]['reminder_customer'] = (
                        await this.customerRespo.getOne({
                            id_system: jobsData[index]['id_customer'],
                        })
                    )?.infor_reminder;

                    if (req.role === UserRules.ROLE.SALER) {
                        delete jobsData[index]['admin_cost'];
                        delete jobsData[index]['editor_cost'];
                    }
                    if (req.role === UserRules.ROLE.EDITOR || req.role === UserRules.ROLE.LEADER_EDITOR) {
                        delete jobsData[index]['admin_cost'];
                        delete jobsData[index]['saler_cost'];
                    }
                    data_job_rp.push(data_job_response(jobsData[index]));
                }
                return this.response_success(res, { data_jobs: data_job_rp }, messager.GET_JOBS_SUCCESS);
            }
            return this.response_error(res, [], messager.GET_JOBS_FAIL);
        } catch (error) {
            return this.response_error(res, error, messager.GET_JOBS_FAIL);
        }
    };

    create_jobs = async (req, res) => {
        try {
            const body = req.body;
            const auth = req.id_system;
            body.modified_by = auth;
            // Check end day and start day
            // const start_day = TimeNow();
            const end_day = new Date(body.end_day);
            // if (end_day >= start_day.setHours(0)) {
            let id_system = '';
            do {
                id_system = random_id('JOB');
            } while (
                await this.jobsRespo.is_exist({
                    id_system: id_system,
                })
            );
            const settings = await this.settingRespo.getsetting();

            // Config body
            body.id_system = id_system;
            body.id_saler = auth;
            req.role === UserRules.ROLE.ADMIN ? (body.id_admin = auth) : (body.id_admin = JobsRules.DEFAULT_VALUE);
            body.id_editor = JobsRules.DEFAULT_VALUE;
            body.status_jobs = JobsRules.STATUS_JOBS.INCOMPLETE;
            body.status_editor = JobsRules.STATUS_EDITOR.INCOMPLETE;
            body.finished_link = JobsRules.DEFAULT_VALUE;
            body.end_day = end_day;
            body.rate_saler_in_created = settings.rate_sale;
            body.exchange_rate_in_created = settings.exchange_rate;
            // Check customer
            const is_customer_exist = await this.customerRespo.is_exist({
                id_system: body.id_customer,
            });
            if (!is_customer_exist) {
                return this.response_success(res, jobsData, messager.GET_CUSTOMER_FAIL);
            }

            // Check permission
            if (req.role !== UserRules.ROLE.ADMIN) {
                delete body['editor_cost'];
            }
            body.create_by = auth;
            // Create Jobs
            const jobs = await this.jobsRespo.createjobs(body);
            const jobsData = data_job_response(jobs);

            if (jobs) {
                // Reminder_infor
                jobs['reminder_saler'] = (
                    await this.userRespo.getuser({
                        id_system: jobs['id_saler'],
                    })
                )?.infor_reminder;
                jobs['reminder_editor'] = (
                    await this.userRespo.getuser({
                        id_system: jobs['id_editor'],
                    })
                )?.infor_reminder;
                jobs['reminder_customer'] = (
                    await this.customerRespo.getOne({
                        id_system: jobs['id_customer'],
                    })
                )?.infor_reminder;

                // Create Payment for saler when saler/admin is created order successfully
                const dataPayment = {
                    id_admin: jobs.id_admin,
                    staff_is_pay: auth,
                    id_job: jobs.id_system,
                    create_by: auth,
                    rate_sale: settings.rate_sale,
                };
                await this.payrepRespo.createPayforJob(dataPayment, auth, UserRules.ROLE.SALER);
                const jobsData = data_job_response(jobs);

                if (jobsData) {
                    const createNotify = {
                        title: NotificationRules.MESSAGE.CREATE_JOB + ' ' + req.id_system,
                        created_by: req.id_system,
                        status: NotificationRules.STATUS.ADD_JOB,
                        id_job: jobs?.id_system,
                        id_saler: jobs?.id_saler,
                        id_editor: jobs?.id_editor,
                    };

                    await this.notificationRespo.jobCreated(createNotify);
                }

                return this.response_success(res, jobsData, messager.CREATE_JOBS_SUCCESS);
            }
            return this.response_error(res, [], jobs?.error);
            // }
            // return this.response_error(res, [], messager.FAIL_START_END_DAY);
        } catch (error) {
            return this.response_error(res, error, messager.CREATE_JOBS_FAIL);
        }
    };

    editorCancelJob = async (req, res) => {
        // try {
        const idJobs = req.params.id;
        const dataJobs = await this.jobsRespo.getjobs({
            id_system: idJobs,
        });
        if (!dataJobs) {
            return this.response_error(res, [], messager.GET_JOBS_FAIL);
        }
        const dataBody = {
            id_editor: JobRules.DEFAULT_VALUE,
        };
        // Update link
        const jobUpdate = await this.jobsRespo.update({ id_system: idJobs }, dataBody);

        if (jobUpdate) {
            const createNotify = {
                title: NotificationRules.MESSAGE.CANCEL_JOB + ' ' + req.id_system,
                created_by: dataJobs?.id_editor,
                status: NotificationRules.STATUS.CANCEL_JOB,
                id_job: jobUpdate?.id_system,
                id_saler: jobUpdate?.id_saler,
                id_editor: JobRules.DEFAULT_VALUE,
            };
            await this.notificationRespo.cancelJobbyEditor(createNotify);
        }
        // Change status jobs
        const job_data = await this.jobsRespo.getjobs({
            id_system: idJobs,
        });

        // Reminder_infor
        job_data['reminder_saler'] = (
            await this.userRespo.getuser({
                id_system: job_data['id_saler'],
            })
        )?.infor_reminder;
        job_data['reminder_editor'] = (
            await this.userRespo.getuser({
                id_system: job_data['id_editor'],
            })
        )?.infor_reminder;
        job_data['reminder_customer'] = (
            await this.customerRespo.getOne({
                id_system: job_data['id_customer'],
            })
        )?.infor_reminder;

        return this.response_success(res, data_job_response(job_data), messager.CANCEL_JOBS_SUCCESS);
        // } catch (error) {
        //     return this.response_error(res, error, messager.CANCEL_JOBS_FAIL);
        // }
    };

    editorUpdateJob = async (req, res) => {
        try {
            const { body } = req;
            const idJobs = req.params.id;
            const dataJobs = await this.jobsRespo.getjobs({
                id_system: idJobs,
            });
            if (!dataJobs) {
                return this.response_error(res, [], messager.GET_JOBS_FAIL);
            }
            const updateArr = dataJobs.status_editor_fix.map((value) => {
                if (value.index === dataJobs.count_fixed) {
                    value.link = body?.fixed_link;
                }
                return value;
            });
            const dataBody = {
                finished_link: body?.finished_link,
                fixed_link: body?.fixed_link,
                status_editor_fix: updateArr,
            };
            // Update link
            const jobUpdate = await this.jobsRespo.update({ id_system: idJobs }, dataBody);

            if (jobUpdate) {
                const createNotify = {
                    title: NotificationRules.MESSAGE.COMPLETE_JOB + ' ' + req.id_system,
                    created_by: dataJobs?.id_editor,
                    status: NotificationRules.STATUS.EDIT_JOB,
                    id_job: dataJobs?.id_system,
                    id_saler: dataJobs?.id_saler,
                    id_editor: dataJobs?.id_editor,
                };
                await this.notificationRespo.jobDoneByEditor(createNotify);
            }
            // Change status jobs
            const job_data = await this.jobsRespo.getjobs({
                id_system: idJobs,
            });

            // Reminder_infor
            job_data['reminder_saler'] = (
                await this.userRespo.getuser({
                    id_system: job_data['id_saler'],
                })
            )?.infor_reminder;
            job_data['reminder_editor'] = (
                await this.userRespo.getuser({
                    id_system: job_data['id_editor'],
                })
            )?.infor_reminder;
            job_data['reminder_customer'] = (
                await this.customerRespo.getOne({
                    id_system: job_data['id_customer'],
                })
            )?.infor_reminder;

            return this.response_success(res, data_job_response(job_data), messager.UPDATE_JOBS_SUCCESS);
        } catch (error) {
            return this.response_error(res, error, messager.UPDATE_JOBS_FAIL);
        }
    };

    approved_job = async (req, res) => {
        const id = req.params.id;
        const auth = req.id_system;
        // Check job in database
        const body = {};
        const data_jobs = await this.jobsRespo.getjobs({
            id_system: id,
        });

        if (!data_jobs) {
            return this.response_error(res, [], messager.GET_JOBS_FAIL);
        }

        body.modified_by = auth;
        body.is_approved_by_editor = true;
        // Update eitor or change editor
        body.id_admin = req.id_system;

        // Change status jobs is PENDING
        await this.jobsRespo.change_activity_id_system(id, {
            status_editor: JobsRules.STATUS_EDITOR.PENDING,
            status_jobs: JobsRules.STATUS_JOBS.PENDING,
        });
        // Create Payment for editor/leader ediotr when admin is assign order successfully
        const dataPayment = {
            id_admin: data_jobs.id_admin,
            staff_is_pay: auth,
            id_job: data_jobs.id_system,
            create_by: auth,
            pay_amount: data_jobs.editor_cost,
        };
        await this.payrepRespo.createPayforJob(dataPayment, auth, UserRules.ROLE.EDITOR);

        const jobs_update = await this.jobsRespo.update(
            {
                id_system: id,
            },
            body
        );
        if (!jobs_update) {
            return this.response_error(res, [], messager.DATA_INVAILD);
        }

        const jobs = await this.jobsRespo.getjobs({
            id_system: id,
        });
        // Reminder_infor
        jobs['reminder_saler'] = (
            await this.userRespo.getuser({
                id_system: jobs['id_saler'],
            })
        )?.infor_reminder;
        jobs['reminder_editor'] = (
            await this.userRespo.getuser({
                id_system: jobs['id_editor'],
            })
        )?.infor_reminder;
        jobs['reminder_customer'] = (
            await this.customerRespo.getOne({
                id_system: jobs['id_customer'],
            })
        )?.infor_reminder;
        const jobsData = data_job_response(jobs);
        return this.response_success(res, jobsData, messager.UPDATE_JOBS_SUCCESS);
    };

    update_jobs = async (req, res) => {
        try {
            const body = req.body;
            const id = req.params.id;
            const auth = req.id_system;
            // Check job in database
            const data_jobs = await this.jobsRespo.getjobs({
                id_system: id,
            });
            if (data_jobs) {
                // Check permission
                body.modified_by = auth;

                // Check end day and start day
                // const start_day = data_jobs.start_day;
                if (body?.end_day) {
                    const end_day = new Date(body?.end_day);
                    // if (end_day < start_day) {
                    //     return this.response_error(res, [], messager.FAIL_START_END_DAY);
                    // }
                    body.end_day = end_day.setHours(end_day.getHours() + 7);
                }

                // Update eitor or change editor
                if (body.editor_cost || (body?.id_editor && req.role === UserRules.ROLE.ADMIN)) {
                    if (!data_jobs.editor_cost && !body.editor_cost) {
                        return this.response_error(res, [], messager.COST_EDITOR_INVAILD);
                    }
                    body.id_admin = req.id_system;
                }
                // Change status Jobs if body have status_job
                if (body?.status_jobs_update) {
                    await this.jobsRespo.change_activity_id_system(id, {
                        status_editor: JobsRules.STATUS_EDITOR.PENDING,
                        status_jobs: JobsRules.STATUS_JOBS.PENDING,
                        status_jobs_update: body?.status_jobs_update,
                        count_fixed: data_jobs.count_fixed + 1,
                        fixed_link: JobsRules.DEFAULT_VALUE,
                        status_editor_fix: data_jobs.status_editor_fix.concat({
                            index: data_jobs.count_fixed + 1,
                            link: JobRules.DEFAULT_VALUE,
                            note: body?.note_fixed,
                        }),
                    });

                    const createNotify = {
                        title: NotificationRules.MESSAGE.FIXED + ' ' + req.id_system,
                        created_by: data_jobs?.id_saler,
                        status: NotificationRules.STATUS.EDIT_JOB,
                        id_job: data_jobs?.id_system,
                        id_saler: data_jobs?.id_saler,
                        id_editor: data_jobs?.id_editor,
                    };
                    await this.notificationRespo.jobFixed(createNotify);
                }

                const jobs_update = await this.jobsRespo.update(
                    {
                        id_system: id,
                    },
                    body
                );

                if (jobs_update) {
                    const jobs = await this.jobsRespo.getjobs({
                        id_system: id,
                    });
                    if (jobs) {
                        //-----------------NOTIFICATION-------------------
                        if (body?.status_jobs_update !== 'Fix') {
                            if (body?.id_editor && data_jobs?.id_editor === JobsRules.DEFAULT_VALUE) {
                                const createNotify = {
                                    title: NotificationRules.MESSAGE.CREATE_JOB + ' ' + req.id_system,
                                    created_by: req.id_system,
                                    status: NotificationRules.STATUS.ADD_JOB,
                                    id_job: jobs?.id_system,
                                    id_saler: jobs?.id_saler,
                                    id_editor: body?.id_editor,
                                };

                                await this.notificationRespo.AdminAddjobForEditor(createNotify);
                            } else {
                                const createNotify = {
                                    title: NotificationRules.MESSAGE.EDIT_JOB + ' ' + req.id_system,
                                    created_by: req.id_system,
                                    status: NotificationRules.STATUS.EDIT_JOB,
                                    id_job: data_jobs?.id_system,
                                    id_saler: data_jobs?.id_saler,
                                    id_editor: body?.id_editor ? body?.id_editor : data_jobs?.id_editor,
                                };
                                // body?.id_editor,
                                await this.notificationRespo.jobUpdated(createNotify);
                            }
                        }

                        if (
                            body?.id_editor &&
                            data_jobs?.id_editor !== JobsRules.DEFAULT_VALUE &&
                            body?.id_editor !== data_jobs?.id_editor
                        ) {
                            const createNotify = {
                                title: NotificationRules.MESSAGE.DELETE_JOB + ' ' + req.id_system,
                                created_by: req.id_system,
                                status: NotificationRules.STATUS.EDIT_JOB,
                                id_job: data_jobs?.id_system,
                                id_saler: data_jobs?.id_saler,
                                id_editor: data_jobs?.id_editor,
                            };
                            await this.notificationRespo.deletejobOldEditor(createNotify);
                        }
                        //----------------END-NOTIFICATION-------------------
                    }
                    // Reminder_infor
                    jobs['reminder_saler'] = (
                        await this.userRespo.getuser({
                            id_system: jobs['id_saler'],
                        })
                    )?.infor_reminder;
                    jobs['reminder_editor'] = (
                        await this.userRespo.getuser({
                            id_system: jobs['id_editor'],
                        })
                    )?.infor_reminder;
                    jobs['reminder_customer'] = (
                        await this.customerRespo.getOne({
                            id_system: jobs['id_customer'],
                        })
                    )?.infor_reminder;

                    const jobsData = data_job_response(jobs);
                    return this.response_success(res, jobsData, messager.UPDATE_JOBS_SUCCESS);
                }
                return this.response_error(res, [], messager.DATA_INVAILD);
            }
            return this.response_error(res, [], messager.GET_JOBS_FAIL);
        } catch (error) {
            return this.response_error(res, error, messager.UPDATE_JOBS_FAIL);
        }
    };

    delete_jobs = async (req, res) => {
        try {
            const id = req.params.id;
            // check ID
            const is_id_exist = await this.jobsRespo.getjobs({
                id_system: id,
            });
            if (!is_id_exist) {
                return this.response_error(res, [], messager.ID_NOT_FOUND);
            }

            const data_jobs = await this.jobsRespo.getjobs({
                id_system: id,
            });

            const remove = await this.jobsRespo.remove_jobs(id);
            if (remove) {
                await this.notificationRespo.delete_job_by_admin(data_jobs?.id_system);

                const notifyDelete = {
                    title: NotificationRules.MESSAGE.DELETE_JOB + ' ' + req.id_system,
                    created_by: req.id_system,
                    status: NotificationRules.STATUS.DELETE_JOB,
                    id_job: data_jobs?.id_system,
                    id_saler: data_jobs?.id_saler,
                    id_editor: data_jobs?.id_editor,
                };

                await this.notificationRespo.jobDeleted(notifyDelete);

                await this.payrepRespo.deletePayMany({ id_job: id });
                const nameRoom = UserRules.MESSAGE.GROUP + '-' + req.id_system;
                await this.messageRespo.deleteMessages(nameRoom);

                return this.response_success(res, [], messager.REMOVE_SUCCSSES);
            }
            return this.response_error(res, [], messager.REMOVE_FAILED);
        } catch (error) {
            return this.response_error(res, error, messager.REMOVE_FAILED);
        }
    };

    get_jobs = async (req, res) => {
        try {
            const id = req.params.id;
            // check ID
            const job_data = await this.jobsRespo.getjobs({
                id_system: id,
            });
            if (!job_data) {
                return this.response_error(res, [], messager.GET_JOBS_FAIL);
            }

            // Reminder_infor
            job_data['reminder_saler'] = (
                await this.userRespo.getuser({
                    id_system: job_data['id_saler'],
                })
            )?.infor_reminder;
            job_data['reminder_editor'] = (
                await this.userRespo.getuser({
                    id_system: job_data['id_editor'],
                })
            )?.infor_reminder;
            job_data['reminder_customer'] = (
                await this.customerRespo.getOne({
                    id_system: job_data['id_customer'],
                })
            )?.infor_reminder;

            return this.response_success(res, data_job_response(job_data), messager.GET_JOBS_SUCCESS);
        } catch (error) {
            return this.response_error(res, error, messager.GET_JOBS_FAIL);
        }
    };

    done_jobs = async (req, res) => {
        try {
            const body = req.body;
            const idJobs = req.params.id;
            const auth = req.id_system;

            const dataJobs = await this.jobsRespo.getjobs({
                id_system: idJobs,
            });

            if (!dataJobs) {
                return this.response_error(res, [], messager.UPDATE_JOBS_FAIL);
            }
            // Update link
            await this.jobsRespo.update(
                { id_system: idJobs },
                {
                    status_jobs: body?.status_jobs,
                    status_jobs_update:
                        body?.status_jobs === JobsRules.STATUS_JOBS.COMPLETE
                            ? JobsRules.STATUS_JOBS.COMPLETE
                            : dataJobs.status_jobs_update,
                    modified_by: auth,
                }
            );
            // Change status jobs

            const job_data = await this.jobsRespo.getjobs({
                id_system: idJobs,
            });

            // Reminder_infor
            job_data['reminder_saler'] = (
                await this.userRespo.getuser({
                    id_system: job_data['id_saler'],
                })
            )?.infor_reminder;
            job_data['reminder_editor'] = (
                await this.userRespo.getuser({
                    id_system: job_data['id_editor'],
                })
            )?.infor_reminder;
            job_data['reminder_customer'] = (
                await this.customerRespo.getOne({
                    id_system: job_data['id_customer'],
                })
            )?.infor_reminder;

            return this.response_success(res, data_job_response(job_data), messager.UPDATE_JOBS_SUCCESS);
        } catch (error) {
            return this.response_error(res, error, messager.UPDATE_JOBS_FAIL);
        }
    };
}

const jobController = new JobController();
module.exports = jobController;
