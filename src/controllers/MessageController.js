const MessageRepositories = require('../repositories/MessageRepositories');
const BaseController = require('./BaseController');
const UserRules = require('../rules/users.rules');
const messager = require('../utils/constain.util');
const { multiImage } = require('../services/multer.service');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
class MessageController extends BaseController {
    messRespo;
    constructor() {
        super();
        this.messRespo = new MessageRepositories();
    }

    getmembers = async () => {
        //SEND ALL MEMBERS
        try {
            const users = await this.messRespo.getMembers();
            if (users) {
                global.io.emit('get-members', users);
            }
        } catch (error) {
            global.io.emit('get-members', []);
        }
    };

    readAllMess = async (id_system, socket) => {
        try {
            await this.messRespo.readAllMessages(id_system);
            const getRoomsById = await this.messRespo.getRooms(id_system);
            const members = await this.messRespo.getMembers();
            socket.emit('messages-by-id-system', getRoomsById);
            global.io.emit('get-members', members);
        } catch (error) {
            socket.emit('messages-by-id-system', []);
            global.io.emit('get-members', []);
        }
    };

    allRooms = async (id_system, socket) => {
        try {
            const getRoomsById = await this.messRespo.getRooms(id_system);
            socket.emit('messages-by-id-system', getRoomsById);
        } catch (error) {
            socket.emit('messages-by-id-system', []);
        }
        //SEND ALL ROOMS
    };

    joinRoom = async (room, socket) => {
        socket.join(room);
        const roomMessages = await this.messRespo.getLastMessagesFromRoom(room, socket);
        socket.emit('room-messages', roomMessages);
        // JOIN ROOM AND THEN , CHECK ROOM GET MESSAGES AND SORT
    };

    sendMessage = async (
        room,
        content,
        sender,
        time,
        date,
        members,
        type,
        groups_id,
        receiver,
        images,
        nameImage,
        socket
    ) => {
        //SAVE AND SEND MESSAGES
        await this.messRespo.createMessage(
            room,
            content,
            sender,
            time,
            date,
            members,
            type,
            groups_id,
            images,
            nameImage
        );

        const roomMessages = await this.messRespo.getLastMessagesFromRoom(room, socket);
        await this.allRooms(sender, socket);

        global.io.to(room).emit('room-messages', roomMessages);
        global.io.emit('user-send-message', true);

        //IF USER OR USERS IN GROUP OFFLINE OR LEAVE SEND NOTIFICATION
        if (room?.includes(UserRules.MESSAGE.USER)) {
            // const status = await this.messRespo.checkstatus(receiver);
            // if (status && (status === UserRules.STATUS.OFFLINE || status === UserRules.STATUS.LEAVE)) {
            // await this.messRespo.updateNotifications(room, receiver);
            await this.addNewNotifications(room, receiver);
            // }
        } else if (room?.includes(UserRules.MESSAGE.GROUP)) {
            const received = members.filter((member) => member !== sender);
            for (let member of received) {
                // const status = await this.messRespo.checkstatus(member);
                // if (status && (status === UserRules.STATUS.OFFLINE || status === UserRules.STATUS.LEAVE)) {
                // await this.messRespo.updateNotifications(room, member);
                await this.addNewNotifications(room, member);
                // }
            }
        }
        //SEND  NOTIFICATION
        socket.broadcast.emit('notifications', room, receiver, members, sender);
    };

    addNewNotifications = async (room, receiver) => {
        //SEND NOTIFICATION IF USER IN ANOTHER ROOM AND ONLINE
        await this.messRespo.notifications(room, receiver);
        await this.getmembers();
    };

    resetNewNotifications = async (room, id_system) => {
        //USER RESET NOTIFICATION AFTER JOIN ROOM
        await this.messRespo.resetNotifications(room, id_system);
        const members = await this.messRespo.getMembers();
        global.io.emit('get-members', members);
    };

    uploadimages = async (req, res) => {
        try {
            await multiImage(req, res);
            const images = req.files;

            for (let i = 0; i < images.length; i++) {
                await sharp(images[i]?.path)
                    .resize(200, 200)
                    .jpeg({ quality: 90 })
                    .toFile(path.resolve(images[i]?.destination, '../resized', images[i]?.originalname));
                fs.unlinkSync(path.resolve(images[i]?.destination, '../resized', images[i]?.originalname));
            }
            return this.response_success(res, 'success', messager.UPLOAD_IMAGES_MESSAGES_SUCCESS);
        } catch (error) {
            return this.response_error(res, [], messager.UPLOAD_IMAGES_MESSAGES_FAILED);
        }
    };
}

const messageController = new MessageController();
module.exports = messageController;
