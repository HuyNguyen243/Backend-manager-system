const BaseRepositories = require('./BaseRepositories');
const GroupMessage = require('../models/GroupMessage');
const Message = require('../models/Message');
const UserRules = require('../rules/users.rules');
const NotificationResponsitories = require('./NotificationRepositories');

class GroupMessageResponsitories extends BaseRepositories {
    notificationResponsitories;
    constructor() {
        super();
        this.model = GroupMessage;
        this.notificationResponsitories = new NotificationResponsitories();
    }

    get_group_preview = async (id_system) => {
        const checkrole = await this.notificationResponsitories.checkRole(id_system);

        if (checkrole === UserRules.ROLE.ADMIN) {
            const getAllRoom = await Message.aggregate([
                {
                    $match: {
                        members: { $nin: [id_system, '$members'] },
                        type: UserRules.MESSAGE.USER,
                    },
                },
                {
                    $group: {
                        _id: {
                            _id: '$to',
                            name: '$to',
                            members: '$members',
                            type: 'USER_VIEW',
                            create_by: null,
                        },
                    },
                },
            ]);
            return getAllRoom;
        }
    };

    get = async (id_system) => {
        const groups = await this.model.aggregate([
            { $match: { members: { $in: [id_system, '$members'] } } },
            { $sort: { _modified_at: 1 } },
        ]);

        return groups;
    };
    create = async (data) => {
        const group = await new this.model(data);
        const result = await group.save();
        if (result) {
            return result;
        }
        return false;
    };

    update = async (id, data) => {
        const privateRoom = await this.model.find({ _id: id });

        const update = await this.model.findOneAndUpdate({ _id: id }, data);
        if (update) {
            const membersdeleted = [];
            for (let room of privateRoom) {
                if (room?.members) {
                    const room_members = room?.members;
                    for (let member of room_members) {
                        if (!data?.members.includes(member)) {
                            membersdeleted.push(member);
                        }
                    }
                }
            }

            global.io.emit('isEdit', {
                isEdit: true,
                members: membersdeleted,
                nameRoom: data?.name,
                room: privateRoom?.[0]?.type + '-' + privateRoom?.[0]?._id,
            });
            return update;
        }

        return false;
    };

    delete = async (id) => {
        const privateRoom = await this.model.find({ _id: id });
        const remove = await this.model.findOneAndRemove({ _id: id });

        if (remove) {
            const nameRoom = UserRules.MESSAGE.GROUP + '-' + id;
            await Message.deleteMany({ to: nameRoom });

            global.io.emit('isDelete', {
                isDelete: true,
                members: privateRoom?.[0]?.members,
                nameRoom: privateRoom?.[0].name,
                room: privateRoom?.[0]?.type + '-' + privateRoom?.[0]?._id,
            });
            return remove;
        } else {
            return false;
        }
    };
}

module.exports = GroupMessageResponsitories;
