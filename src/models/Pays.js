const mongoose = require('mongoose');

const collectionName = 'pays_1touch';
const PayRules = require('./../rules/pays.rules');

const PaysSchema = new mongoose.Schema(
    {
        id_job: {
            required: true,
            type: String,
        },
        id_system: {
            required: true,
            type: String,
        },
        create_by: {
            required: true,
            type: String,
        },
        staff_is_pay: {
            required: true,
            type: String,
        },
        pay_role: {
            required: true,
            enum: [PayRules.STATUS_FOR_ROLE.SALER, PayRules.STATUS_FOR_ROLE.EDITOR],
            type: String,
        },
        rate_sale: {
            type: Number,
        },
        pay_amount: {
            type: Number,
        },
        status: {
            type: String,
            enum: [PayRules.STATUS.PAID, PayRules.STATUS.UNPAID, PayRules.STATUS.CANCEL],
            default: PayRules.STATUS.UNPAID,
        },
        _create_at: {
            type: Date,
            default: Date.now,
        },
        _modified_at: {
            type: Date,
            default: Date.now,
        },
    }
    // { versionKey: false }
);

module.exports = mongoose.model('Pays', PaysSchema, collectionName);
