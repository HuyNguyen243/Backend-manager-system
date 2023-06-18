const BaseRepositories = require('./BaseRepositories');
const JobModel = require('../models/Jobs');
const SettingRepositories = require('../repositories/SettingReponsitories');

class JobRepositories extends BaseRepositories {
    settingrepositories;
    constructor() {
        super();
        this.model = JobModel;
        this.settingrepositories = new SettingRepositories();
    }
    getjobs = async (query) => {
        const user = this.model.findOne(query);
        return user;
    };
    getjobsall = async (query) => {
        this.query = query;
        // IGNORE DELETED USER
        this.query.push({ $match: { deleted: null } });

        const jobsall = await this.model.aggregate(this.query);
        return jobsall;
    };
    createjobs = async (jobs_obj) => {
        const new_jobs = new JobModel(jobs_obj);
        return await new_jobs.save();
    };
    remove_jobs = async (id_system) => {
        return await this.delete({ id_system: id_system });
    };
    change_activity = async (id, status) => {
        let id_change = { _id: id };
        return await this.update(id_change, status);
    };
    change_activity_id_system = async (id, status) => {
        let id_change = { id_system: id };
        return await this.update(id_change, status);
    };
}

module.exports = JobRepositories;
