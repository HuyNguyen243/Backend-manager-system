const BaseController = require('./BaseController');
const JobRepositories = require('../repositories/JobRepositories');
const messager = require('../utils/constain.util');
const { format_date_query } = require('../utils/support.util');

const JobRules = require('../rules/jobs.rules');
const UserRules = require('../rules/users.rules');

const SettingReponsitories = require('../repositories/SettingReponsitories');
const NotificationResponsitories = require('../repositories/NotificationRepositories');
const UserRepositories = require('../repositories/UserRepositories');

class EmployPerformanceController extends BaseController {
    jobsRespo;
    settingRespo;
    notificationRespo;
    userRespo;
    constructor() {
        super();
        this.jobsRespo = new JobRepositories();
        this.settingRespo = new SettingReponsitories();
        this.notificationRespo = new NotificationResponsitories();
        this.userRespo = new UserRepositories();
    }
    getKpiMonthly = async (req, res) => {
        try {
            const { id, start_date, end_date } = req.query;
            let aggregate_options = [];

            let id_system_only_user = req.id_system;
            const role = await this.notificationRespo.checkRole(req.id_system);
            if (role !== UserRules.ROLE.ADMIN) {
                aggregate_options = [{ $match: { id_saler: req.id_system } }];
            } else {
                //ADMIN GET ALL JOBS BUT IF HAS PARAM ID , SELECT BY ID ( ID SYSTEM )
                if (id) {
                    aggregate_options = [{ $match: { id_saler: id } }];
                    id_system_only_user = id;
                }
            }

            // IF HAVE PARAM DATE
            if (start_date && end_date) {
                const date = format_date_query(start_date, end_date);
                aggregate_options.push({
                    $match: {
                        _create_at: date,
                    },
                });
            } else {
                //ELSE GET FIRST AND LAST DATE ON MONTH
                const date = new Date();
                const firstDay = this.convertDate(new Date(date.getFullYear(), date.getMonth(), 1));
                const lastDay = this.convertDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
                const obj = format_date_query(firstDay, lastDay);

                aggregate_options.push({
                    $match: {
                        _create_at: obj,
                    },
                });
            }

            let JOB_COMPLETE;
            let JOB_INCOMPLETE;
            let JOB_PENDING;
            let TOTAL_COST_JOBS = 0;
            let BONUS = 0;
            let KPI = 0;

            let TOTAL_COST_JOB_BY_STATUS_COMPLETE = 0;

            const user = await this.userRespo.find_obj({ id_system: id_system_only_user });
            const AMOUNT_ACHIVED = user?.kpi_saler || 0;
            const jobs = await this.jobsRespo.getjobsall(aggregate_options);

            if (jobs) {
                JOB_COMPLETE = jobs.filter((job) => {
                    return job?.status_jobs === JobRules.STATUS_JOBS.COMPLETE;
                });
                JOB_INCOMPLETE = jobs.filter((job) => {
                    return job?.status_jobs === JobRules.STATUS_JOBS.INCOMPLETE;
                });
                JOB_PENDING = jobs.filter((job) => {
                    return job?.status_jobs === JobRules.STATUS_JOBS.PENDING;
                });

                for (const job of jobs) {
                    TOTAL_COST_JOBS += job?.total_cost;
                    if (job?.status_jobs === JobRules.STATUS_JOBS.COMPLETE) {
                        BONUS += (job?.total_cost * job?.rate_saler_in_created) / 100;
                        TOTAL_COST_JOB_BY_STATUS_COMPLETE += job?.total_cost;
                    }
                }

                if (TOTAL_COST_JOB_BY_STATUS_COMPLETE > 0) {
                    KPI = (TOTAL_COST_JOB_BY_STATUS_COMPLETE * 100) / AMOUNT_ACHIVED;
                }

                const result = {
                    job_complete: JOB_COMPLETE?.length,
                    job_incomplete: JOB_INCOMPLETE?.length,
                    job_pending: JOB_PENDING?.length,
                    bonus: BONUS,
                    cost_jobs: TOTAL_COST_JOBS,
                    kpi: KPI + '%',
                };

                return this.response_success(res, result, messager.GET_PERFORMCE_SUCCESS);
            }
        } catch (error) {
            return this.response_error(res, error, messager.GET_PERFORMCE_FAIL);
        }
    };

    convertDate = (date) => {
        const mnth = (date?.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date?.getFullYear();
        return [day, mnth, year].join('-');
    };

    getJobsPerformance = async (req, res) => {
        try {
            const { start_date, end_date, role } = req.query;

            let aggregate_options = [
                {
                    $group: {
                        _id: role === UserRules.ROLE.EDITOR ? '$id_editor' : '$id_saler',
                        jobs: { $push: '$$ROOT' },
                    },
                },
            ];

            if (!role || role === UserRules.ROLE.EDITOR) {
                aggregate_options.unshift({
                    $match: {
                        id_editor: { $not: JobRules.DEFAULT_VALUE },
                    },
                });
            }

            // JobRules
            if (start_date && end_date) {
                const date = format_date_query(start_date, end_date);
                aggregate_options.unshift({
                    $match: {
                        _create_at: date,
                    },
                });
            } else {
                //ELSE GET FIRST AND LAST DATE ON MONTH
                const date = new Date();
                const firstDay = this.convertDate(new Date(date.getFullYear(), date.getMonth(), 1));
                const lastDay = this.convertDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
                const obj = format_date_query(firstDay, lastDay);

                aggregate_options.unshift({
                    $match: {
                        _create_at: obj,
                    },
                });
            }

            const jobsOfStaffs = await this.jobsRespo.getjobsall(aggregate_options);

            if (jobsOfStaffs) {
                const rs = [];
                for (const job of jobsOfStaffs) {
                    const user = await this.userRespo.find_obj({ id_system: job?._id });
                    job.reminder_staff = user?.infor_reminder;
                    job.fullname = user?.fullname;
                    job.kpi_saler = user?.kpi_saler || 0;
                    job.role = user?.role;
                    rs.push(job);
                }

                const newJobs = rs
                    .filter((el) => el.role !== UserRules.ROLE.ADMIN)
                    .map((el) => {
                        return (el = this.formatDataForStaff(el, true));
                    });
                return this.response_success(res, newJobs, messager.GET_PERFORMCE_SUCCESS);
            }
        } catch (error) {
            return this.response_error(res, error, messager.GET_PERFORMCE_FAIL);
        }
    };

    formatVND = (currency) => {
        return currency?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    formatDataForStaff = (inforStaff) => {
        const rs = {};
        rs.fullname = inforStaff.fullname;
        rs.reminder_staff = inforStaff.reminder_staff;
        rs.fullname = inforStaff.fullname;
        rs.kpi_saler = inforStaff.kpi_saler || 0;

        const totalCostJobComplete = inforStaff.jobs.reduce((sum, job) => {
            if (job?.status_jobs === JobRules.STATUS_JOBS.COMPLETE) {
                return (sum += Number(job.total_cost));
            }
            return sum;
        }, 0);

        rs.job_incomplete = inforStaff.jobs.filter((job) => {
            return job?.status_jobs === JobRules.STATUS_JOBS.INCOMPLETE;
        })?.length;
        rs.job_complete = inforStaff.jobs.filter((job) => {
            return job?.status_jobs === JobRules.STATUS_JOBS.COMPLETE;
        })?.length;
        rs.job_pending = inforStaff.jobs.filter((job) => {
            return job?.status_jobs === JobRules.STATUS_JOBS.PENDING;
        })?.length;
        rs.cost_jobs =
            inforStaff.jobs.reduce((sum, job) => {
                if (job.total_cost) {
                    return (sum += Number(job.total_cost));
                }
                return sum;
            }, 0) + ' $';
        const bonus = inforStaff.jobs.reduce((sum, job) => {
            if (job?.status_jobs === JobRules.STATUS_JOBS.COMPLETE) {
                if (inforStaff?.role === (UserRules.ROLE.EDITOR || UserRules.ROLE.LEADER_EDITOR)) {
                    if (job.editor_cost) {
                        return (sum += Number(job.editor_cost));
                    }
                } else {
                    if (job.total_cost && job?.rate_saler_in_created) {
                        return (sum += (job?.total_cost * job?.rate_saler_in_created) / 100);
                    }
                }
            }
            return sum;
        }, 0);

        rs.bonus = `${
            inforStaff?.role !== (UserRules.ROLE.EDITOR || UserRules.ROLE.LEADER_EDITOR)
                ? bonus.toFixed(2)
                : this.formatVND(bonus)
        } ${inforStaff?.role === (UserRules.ROLE.EDITOR || UserRules.ROLE.LEADER_EDITOR) ? 'vnđ' : '$'}`;
        rs.kpi =
            inforStaff.kpi_saler && inforStaff.kpi_saler > 0
                ? ((totalCostJobComplete * 100) / inforStaff.kpi_saler).toFixed(2) + '%'
                : 0 + '%';
        if (inforStaff?.role === UserRules.ROLE.EDITOR || inforStaff?.role === UserRules.ROLE.LEADER_EDITOR) {
            rs.kpi = 0 + '%';
        }
        return rs;
    };
}

const employPerformanceController = new EmployPerformanceController();
module.exports = employPerformanceController;
