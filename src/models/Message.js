const mongoose = require('mongoose');
const { Schema } = mongoose;

const collectionName = 'messages_1touch';

const MessageSchema = new Schema({
    content: {
        type: String,
    },
    title: {
        type: String,
    },
    images: {
        type: Array,
    },
    notification: {
        type: String,
    },
    socketId: {
        type: String,
    },
    time: {
        type: Date,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    from: {
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
    group_id: {
        type: String,
    },
    _day_expired: {
        type: Date,
        required: true,
    },
    _create_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Message = mongoose.model('Message', MessageSchema, collectionName);

module.exports = Message;
