const mongoose = require('mongoose');
const { Schema } = mongoose;

const collectionName = 'notification_1touch';
const NotificationRules = require('../rules/notification.rules');

const NotificationSchema = new Schema({
    title: {
        type: String,
    },
    created_by: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: [
            NotificationRules.STATUS.ADD_JOB,
            NotificationRules.STATUS.COMPLETE_JOB,
            NotificationRules.STATUS.CREATE_JOB,
            NotificationRules.STATUS.DELETE_JOB,
            NotificationRules.STATUS.EDIT_JOB,
            NotificationRules.STATUS.FIXED,
            NotificationRules.STATUS.PAYMENT_JOB_PAID,
            NotificationRules.STATUS.PAYMENT_JOB_UNPAY,
            NotificationRules.STATUS.CANCEL_JOB,
        ],
    },
    id_job: {
        type: String,
        required: true,
    },
    id_editor: {
        type: String,
    },
    id_saler: {
        type: String,
    },
    member_check_notify: {
        type: Object,
        required: true,
        default: {},
    },
    members: {
        type: Array,
        required: true,
        default: [],
    },
    _create_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Notification = mongoose.model('Notification', NotificationSchema, collectionName);

module.exports = Notification;
