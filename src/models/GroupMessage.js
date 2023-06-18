const mongoose = require('mongoose');
const { Schema } = mongoose;

const collectionName = 'group_message_1touch';

const GroupMessageSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    members: {
        type: Array,
        default: [],
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    create_by: {
        type: String,
        required: true,
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
});

const GroupMessage = mongoose.model('groupMessage', GroupMessageSchema, collectionName);

module.exports = GroupMessage;
