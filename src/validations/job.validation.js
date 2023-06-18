const { response_error, clean_body } = require('../utils/app.util');
const constants = require('../../constants');
const { make, regex } = require('simple-body-validator');
const message = require('../utils/constain.util');

const jobs_Rules = {
    id_customer: 'required',
    end_day: 'required|date',
    org_link: ['required', regex(constants.LINK_REGEX)],
    request_content: 'required',
    work_notes: 'required',
    quality_img: 'required|min:1|integer',
    type_models: 'string',
    photo_types: 'string',
    total_cost: 'required|min:1|numeric',
    editor_cost: 'numeric',
    group_name_job: 'required|string',
};

const update_jobs_rules = {
    end_day: 'date',
    org_link: regex(constants.LINK_REGEX),
    request_content: 'string|min:1',
    work_notes: 'string|min:1',
    quality_img: 'min:1|integer',
    type_models: 'string',
    photo_types: 'string',
    total_cost: 'min:0|numeric',
    editor_cost: 'numeric',
    saler_cost: 'numeric',
    admin_cost: 'numeric',
    id_editor: 'string',
    group_name_job: 'string',
    type_pay: 'string',
    status_jobs_update: 'string',
    note_fixed: 'string',
};

const done_jobs = {
    status_jobs: 'required|string',
};

const editor_update_job = {
    finished_link: regex(constants.LINK_REGEX),
    fixed_link: regex(constants.LINK_REGEX),
};

const done_job_validation = async (req, res, next) => {
    const check_validation = make(req.body, done_jobs);
    req.body = clean_body(req.body, done_jobs);
    if (check_validation.validate()) {
        return next();
    }
    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};

const create_job_validation = async (req, res, next) => {
    const check_validation = make(req.body, jobs_Rules);
    req.body = clean_body(req.body, jobs_Rules);
    if (check_validation.validate()) {
        return next();
    }
    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};

const update_job_validation = async (req, res, next) => {
    const check_validation = make(req.body, update_jobs_rules);
    req.body = clean_body(req.body, update_jobs_rules);
    if (check_validation.validate()) {
        return next();
    }
    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};

const editor_update_job_validation = async (req, res, next) => {
    const check_validation = make(req.body, editor_update_job);
    req.body = clean_body(req.body, editor_update_job);
    if (check_validation.validate()) {
        return next();
    }
    return response_error(res, check_validation.errors().all(), message.INVAILD_INPUT);
};

module.exports = {
    create_job_validation,
    update_job_validation,
    done_job_validation,
    editor_update_job_validation,
};
