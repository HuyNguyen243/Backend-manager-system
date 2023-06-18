const mongoose = require('mongoose');

const collectionName = 'users_1touch';
const UserRules = require('./../rules/users.rules');
const { TimeNow } = require('../utils/support.util');
const UsersSchema = new mongoose.Schema(
    {
        username: {
            required: true,
            type: String,
        },
        password: {
            required: true,
            type: String,
        },
        fullname: {
            required: true,
            type: String,
        },
        births: {
            type: Date,
            default: TimeNow,
        },
        phone: {
            required: true,
            type: String,
        },
        email: {
            required: true,
            type: String,
        },
        address: {
            type: String,
        },
        infor_reminder: {
            required: true,
            type: String,
        },
        role: {
            required: true,
            type: String,
            enum: [UserRules.ROLE.SALER, UserRules.ROLE.EDITOR, UserRules.ROLE.LEADER_EDITOR, UserRules.ROLE.ADMIN],
        },
        create_by: {
            required: true,
            type: String,
        },
        status: {
            required: true,
            type: String,
            enum: [UserRules.STATUS.ONLINE, UserRules.STATUS.OFFLINE, UserRules.STATUS.LEAVE],
            default: UserRules.STATUS.OFFLINE,
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
        payment_method: {
            type: String,
            default: 'Chuyển khoản',
        },
        nameBank: {
            type: String,
        },
        number_account_payment: {
            type: String,
        },
        name_account_payment: {
            type: String,
        },
        avatar: {
            type: String,
        },
        newMessages: {
            type: Object,
            default: {},
        },
        notification_count: {
            type: Number,
            default: 0,
        },
        socket_id: {
            type: String,
        },
        _create_at: {
            type: Date,
            required: true,
            default: TimeNow,
        },
        kpi_saler: {
            type: Number,
        },
        _modified_at: {
            required: true,
            type: Date,
            default: TimeNow,
        },
    }
    // { versionKey: false }
);

UsersSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('Users', UsersSchema, collectionName);
