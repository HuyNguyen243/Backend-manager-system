const BaseRepositories = require('./BaseRepositories');
const Message = require('../models/Message');
const Users = require('../models/Users');
const JobRepositories = require('./JobRepositories');
const CustomerResponsitories = require('./CustomerResponsitories');

const UserRules = require('../rules/users.rules');
const fs = require('fs');
class MessageRepositories extends BaseRepositories {
    jobRepositories;
    customerResponsitories;
    constructor() {
        super();
        this.model = Message;
        this.jobRepositories = new JobRepositories();
        this.customerResponsitories = new CustomerResponsitories();
    }

    getMembers = async () => {
        const query = [
            {
                $project: {
                    _id: 1,
                    fullname: 1,
                    role: 1,
                    id_system: 1,
                    status: 1,
                    newMessages: 1,
                    _modified_at: 1,
                    notification_count: 1,
                },
            },

            { $sort: { _id: 1 } },
        ];

        const messages = await this.model.find({
            _day_expired: { $lte: new Date() },
        });

        if (messages?.length > 0) {
            for (let i = 0; i < messages?.length; i++) {
                await this.delete_img_storage(messages[i]?.images);
            }
        }
        await this.model.deleteMany({
            _day_expired: { $lte: new Date() },
        });
        const users = await Users.aggregate(query);
        return await users;
    };

    getRooms = async (id_system) => {
        if (id_system) {
            const getJobs = await this.jobRepositories.getjobsall([]);

            const arrGroups = [];
            for (let job of getJobs) {
                arrGroups.push(UserRules?.MESSAGE.GROUP + '-' + job.id_system);
            }
            const arrRooms = [];

            const rooms = await this.model.aggregate([
                { $match: { members: { $in: [id_system, '$members'] } } },
                // {
                //     $match: {
                //         type: { $not: /GROUP/g },
                //     },
                // },
                {
                    $group: {
                        _id: '$to',
                        type: { $last: '$type' },
                        content: { $last: '$content' },
                        time: { $last: '$time' },
                        from: { $last: '$from' },
                        members: { $last: '$members' },
                    },
                },
                { $sort: { time: -1 } },
            ]);

            for (let room of rooms) {
                if (room.type === UserRules?.MESSAGE.USER) {
                    arrRooms.push(room);
                }
                if (room.type === UserRules?.MESSAGE.GROUP) {
                    if (arrGroups.includes(room._id)) {
                        arrRooms.push(room);
                        const id_job = room._id?.split('-')?.[1];
                        if (id_job) {
                            const getJobById = await this.jobRepositories.getjobs({ id_system: id_job });
                            if (getJobById) {
                                room.information_job = getJobById;
                                if (getJobById?.id_customer) {
                                    const getCustomerById = await this.customerResponsitories.getOne({
                                        id_system: getJobById?.id_customer,
                                    });
                                    if (getCustomerById) {
                                        room.customer = getCustomerById;
                                    } else {
                                        room.customer = null;
                                    }
                                }
                            } else {
                                room.information_job = null;
                            }
                        }
                    }
                }
            }

            return arrRooms;
        }
    };

    sortRoomMessagesByDate = async (messages) => {
        return messages.sort(function (a, b) {
            let date_1 = a._id.date.split('/');
            let date_2 = b._id.date.split('/');

            date_1 = date_1[2] + date_1[1] + date_1[0];
            date_2 = date_2[2] + date_2[1] + date_2[0];

            return Number(date_1) < Number(date_2) ? -1 : 1;
        });
    };

    getLastMessagesFromRoom = async (room) => {
        const messages = await this.model.aggregate([
            { $match: { to: room } },
            {
                $group: {
                    _id: {
                        room: '$to',
                        date: '$date',
                    },
                    messagesByDate: { $push: '$$ROOT' },
                },
            },
        ]);

        const filesImages = messages.map((msg) => {
            msg?.messagesByDate?.map((item) => {
                if (item?.images && item?.images?.length > 0) {
                    const file = item?.images.map((image) => {
                        const folder = '/imagesOfMessages/';
                        return (image = folder + image);
                    });
                    return (item.images = file);
                } else {
                    return;
                }
            });
            return msg;
        });
        const result = await this.sortRoomMessagesByDate(filesImages);
        return result;
    };

    createMessage = async (room, content, sender, time, date, members, type, group_id, images, nameImage) => {
        const today = new Date();
        const _day_expired = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        const rs = {
            content,
            from: sender,
            time,
            date,
            to: room,
            members,
            type,
            _day_expired,
        };
        if (type === 'GROUP') {
            rs.group_id = group_id;
        }

        if (images && nameImage) {
            const splitted = images?.split(';base64,');
            if (splitted[1]) {
                const pathImg = (__dirname + 'public/imagesOfMessages').replace('src/repositories', '');

                fs.writeFileSync(pathImg + '/' + nameImage, splitted[1], { encoding: 'base64' }, function (err) {
                    console.log(err);
                });
                rs.images = [nameImage];
            }
        }

        const message = await new this.model(rs);
        return await message.save();
    };

    updateNotifications = async (room, member) => {
        const User = await Users.findOne({ id_system: member });
        const result = User.newMessages;
        if (!User.newMessages[room]) {
            result[room] = 1;
        } else {
            result[room] = result[room] + 1;
        }
        if (typeof result === 'object') {
            await Users.findOneAndUpdate({ id_system: member }, { newMessages: result });
        }
    };

    notifications = async (room, receiver) => {
        const status = await this.checkstatus(receiver);
        if (status === UserRules.STATUS.ONLINE) {
            await this.updateNotifications(room, receiver);
        }
    };

    resetNotifications = async (room, id_system) => {
        const User = await Users.findOne({ id_system: id_system });

        if (User) {
            let fn = User.newMessages;
            if (Object.keys(fn).includes(room)) {
                delete fn[room];
                await Users.findOneAndUpdate({ id_system: id_system }, { newMessages: fn });
            }
        }
    };

    checkstatus = async (userReceived) => {
        const user = await Users.findOne({ id_system: userReceived });
        if (user?.status) {
            return user.status;
        }
        return null;
    };

    checkrole = async (id_system) => {
        const user = await Users.findOne({ id_system: id_system });
        return await user?.role;
    };

    deleteMessages = async (room) => {
        const messages = await this.getLastMessagesFromRoom(room);
        const imgs = [];
        messages.map((msg) => {
            msg?.messagesByDate?.map((item) => {
                if (item.images.length > 0) {
                    item?.images?.map((image) => {
                        imgs.push(image);
                    });
                }
            });
        });

        await this.delete_img_storage(imgs);
        await this.model.deleteMany({ to: room });

        const users = await Users.find({});
        const UsersRemoveGroupAlert = users?.map((user) => {
            const alert = user?.newMessages;
            delete alert[room];
            return {
                id_system: user?.id_system,
                newMessages: alert,
            };
        });
        for (const user of UsersRemoveGroupAlert) {
            await Users.findOneAndUpdate({ id_system: user.id_system }, { newMessages: user.newMessages });
        }
    };

    readAllMessages = async (id_system) => {
        await Users.findOneAndUpdate({ id_system }, { newMessages: {} });
    };

    delete_img_storage = async (imgs) => {
        if (imgs.length > 0) {
            for (const img of imgs) {
                const pathImg = (__dirname + 'public/imagesOfMessages').replace('src/repositories', '');

                const checkFileisExist = this.fileisExist(`${pathImg}/${img}`);
                if (checkFileisExist) {
                    fs.unlinkSync(`${pathImg}/${img}`);
                }
            }
        }
    };

    fileisExist = (path) => {
        try {
            fs.accessSync(path, fs.constants.F_OK);
            console.log('File exists');
            return true;
        } catch (error) {
            return false;
        }
    };
}

module.exports = MessageRepositories;
