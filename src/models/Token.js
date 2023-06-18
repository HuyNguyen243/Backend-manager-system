const mongoose = require('mongoose');

const collectionName = 'token_1touch';
const { TimeNow } = require('../utils/support.util');

const TokenSchema = new mongoose.Schema(
    {
        _id_activity: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
        },
        ip: {
            required: true,
            type: String,
        },
        last_activity: {
            required: true,
            type: Date,
            default: TimeNow,
        },
        last_login: {
            required: true,
            type: Date,
            default: TimeNow,
        },
        access_token: {
            required: true,
            type: String,
        },
        refresh_token: {
            required: true,
            type: String,
        },
        exp_ac: {
            required: true,
            type: Number,
        },
        exp_rt: {
            required: true,
            type: Number,
        },
        _create_at: {
            type: Date,
            default: TimeNow,
        },
        _modified_at: {
            required: true,
            type: Date,
            default: TimeNow,
        },
    }
    // { versionKey: false }
);

module.exports = mongoose.model('Token', TokenSchema, collectionName);
