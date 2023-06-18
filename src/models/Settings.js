const mongoose = require('mongoose');

const collectionName = 'settings_1touch';

const SettingsSchema = new mongoose.Schema(
    {
        id_system: {
            required: true,
            type: String,
        },
        exchange_rate: {
            required: true,
            type: Number,
        },
        type_img: {
            type: Array,
        },
        type_fixed: {
            type: Array,
        },
        // type_pay: {
        //     type: Array,
        // },
        type_define_image: {
            type: Array,
        },
        rate_sale: {
            required: true,
            type: Number,
        },
        id_admin_last_update: {
            type: String,
        },
        _create_at: {
            required: true,
            type: Date,
            default: Date.now,
        },
        _modified_at: {
            required: true,
            type: Date,
            default: Date.now,
        },
    }
    // { versionKey: false }
);

module.exports = mongoose.model('Settings', SettingsSchema, collectionName);
