const mongoose = require('mongoose');

const collectionName = 'jobs_1touch';
const JobRules = require('./../rules/jobs.rules');
const { TimeNow } = require('../utils/support.util');

const JobsSchema = new mongoose.Schema(
    {
        id_customer: {
            required: true,
            type: String,
        },
        id_saler: {
            required: true,
            type: String,
        },
        id_editor: {
            required: true,
            type: String,
        },
        id_admin: {
            required: true,
            type: String,
        },
        id_system: {
            required: true,
            type: String,
        },
        start_day: {
            required: true,
            type: Date,
            default: TimeNow,
        },
        end_day: {
            required: true,
            type: Date,
            default: TimeNow,
        },
        org_link: {
            required: true,
            type: String,
        },
        finished_link: {
            required: true,
            type: String,
        },
        group_name_job: {
            required: true,
            type: String,
        },
        type_pay: {
            type: String,
        },
        status_editor: {
            required: true,
            type: String,
            enum: [
                JobRules.STATUS_EDITOR.COMPLETE,
                JobRules.STATUS_EDITOR.INCOMPLETE,
                JobRules.STATUS_EDITOR.PENDING,
                JobRules.STATUS_EDITOR.FIXED,
            ],
        },
        total_cost: {
            required: true,
            type: Number,
        },
        editor_cost: {
            type: Number,
        },
        saler_cost: {
            type: Number,
        },
        admin_cost: {
            type: Number,
        },
        request_content: {
            required: true,
            type: String,
        },
        work_notes: {
            required: true,
            type: String,
        },
        quality_img: {
            required: true,
            type: Number,
            default: JobRules.DEFAULT_QUANTITY,
        },
        photo_types: {
            required: true,
            type: String,
        },
        status_jobs: {
            required: true,
            type: String,
            enum: [JobRules.STATUS_JOBS.COMPLETE, JobRules.STATUS_JOBS.INCOMPLETE, JobRules.STATUS_JOBS.PENDING],
        },
        status_jobs_update: {
            type: String,
            default: JobRules.DEFAULT_VALUE,
        },
        status_editor_fix: {
            type: Array,
        },
        fixed_link: {
            type: String,
        },
        rate_saler_in_created: {
            type: Number,
        },
        exchange_rate_in_created: {
            type: Number,
        },
        type_models: {
            type: String,
        },
        is_approved_by_editor: {
            type: Boolean,
            default: false,
        },
        count_fixed: {
            required: true,
            type: Number,
            default: JobRules.DEFAULT_COUNT_FIXED,
        },
        _create_at: {
            required: true,
            type: Date,
            default: TimeNow,
        },
        _modified_at: {
            required: true,
            type: Date,
            default: TimeNow,
        },
        modified_by: {
            // required: true,
            type: String,
        },
    }
    // { versionKey: false }
);

module.exports = mongoose.model('Jobs', JobsSchema, collectionName);
