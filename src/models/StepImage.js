const mongoose = require('mongoose');

const collectionName = 'settings_1touch';

const StepsImageSchema = new mongoose.Schema(
    {
        step_image: {
            required: true,
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

module.exports = mongoose.model('StepsImage', StepsImageSchema, collectionName);
