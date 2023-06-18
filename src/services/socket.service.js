const MessageController = require('../controllers/MessageController');
const GroupMessageController = require('../controllers/GroupMessageController');
const NotificationController = require('../controllers/NotificationController');
const User = require('../models/Users');

class WebSockets {
    connection(client) {
        client.on('join', async (userId) => {
            await User.findOneAndUpdate({ id_system: userId }, { socket_id: client.id });
            client.join(userId);
        });
        console.log('socket connected');

        client.on('get-members', MessageController.getmembers);

        //JOIN ROOM AND GET MESSAGE
        client.on('join-room', (room) => MessageController.joinRoom(room, client));

        client.on(
            'message-room',
            (room, content, sender, time, date, members, type, groups_id, receiver, images, nameImage) => {
                MessageController.sendMessage(
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
                    client
                );
            }
        );

        client.on('messages-by-id-system', (id_system) => MessageController.allRooms(id_system, client));

        // //NOTIFYCATION MESSAGES
        client.on('new-notifications', MessageController.addNewNotifications);

        client.on('reset-notifications', MessageController.resetNewNotifications);

        // //GROUP
        client.on('groups', (id_system) => GroupMessageController.get(id_system, client));

        client.on('member-outgroup', async () => {
            client.emit('member-outgroup');
        });

        client.on('read-all-messages', (id_system) => MessageController.readAllMess(id_system, client));

        client.on('groups-preview', (id_system) => GroupMessageController.get_group_preview(id_system, client));

        //NOTIFY
        client.on('notifications-of-id-system', (id_system) => NotificationController.get(id_system, client));

        client.on('reset-notify', (id, id_system) => NotificationController.resetNotify(id, id_system, client));

        client.on('reset-count-notify', (id_system) =>
            NotificationController.reset_count_notifications(id_system, client)
        );

        client.on('end', function () {
            console.log('socket disconnected');
            client.disconnect();
        });
    }
}

const webSockets = new WebSockets();
module.exports = webSockets;
