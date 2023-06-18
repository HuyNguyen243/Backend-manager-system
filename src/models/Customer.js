const mongoose = require('mongoose');
const { Schema } = mongoose;

const collectionName = 'customer_1touch';
const CustomerSchema = new Schema(
    {
        id_system: {
            required: true,
            type: String,
        },
        create_by: {
            required: true,
            type: String,
        },
        fullname: {
            required: true,
            type: String,
        },
        email: {
            required: true,
            type: String,
        },
        link: {
            required: true,
            type: String,
        },
        country: {
            required: true,
            type: String,
        },
        city: {
            required: true,
            type: String,
        },
        infor_reminder: {
            required: true,
            type: String,
        },
        _create_at: {
            type: Date,
            required: true,
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

module.exports = mongoose.model('Customer', CustomerSchema, collectionName);
