const BaseRepositories = require('./BaseRepositories');
const UserModel = require('../models/Users');
const UserRules = require('../rules/users.rules');
const fs = require('fs');

class UserRepositories extends BaseRepositories {
    constructor() {
        super();
        this.model = UserModel;
    }
    getuser = async (query) => {
        const user = this.model.findOne(query);
        return user;
    };
    getuserall = async (query) => {
        const userall = this.model.aggregate(query);
        return userall;
    };
    createAdmin = async (user_obj) => {
        user_obj.fullname = 'Leader Admin';
        user_obj.births = 0;
        user_obj.phone = 0;
        user_obj.address = 'Da Nang';
        user_obj.create_by = '810198.A.2022';
        user_obj.role = UserRules.ROLE.ADMIN;
        user_obj.infor_reminder = 'ADMIN_IT';
        const new_user = new UserModel(user_obj);
        const user = await new_user.save();
        return user;
    };

    create = async (user_obj) => {
        const new_user = new UserModel(user_obj);
        const user = await new_user.save();
        return user;
    };

    remove_user = async (id_system) => {
        return await this.delete({ id_system: id_system });
    };
    remove_image_to_public = async (image) => {
        const pathImg = (__dirname + 'public/images').replace('src/repositories', '');

        const checkFileisExist = this.fileisExist(`${pathImg}/${image}`);
        if (checkFileisExist) {
            fs.unlinkSync(`${pathImg}/${image}`);
        }
    };

    fileisExist = (path) => {
        try {
            fs.accessSync(path, fs.constants.F_OK);
            console.log('File exists');
            return true;
        } catch (error) {
            // Handle error here
            return false;
        }
    };

    get_reminder = async () => {
        const query = [
            {
                $group: {
                    _id: {
                        _id: '$_id',
                        id_system: '$id_system',
                        infor_reminder: '$infor_reminder',
                    },
                },
            },
        ];
        const userReminder = this.model.aggregate(query);
        return userReminder;
    };

    change_activity = async (id, status) => {
        let id_change = { _id: id };
        const members = await this.model.find();
        global.io.emit('get-members', members);
        const result = await this.update(id_change, status);
        return result;
    };
}

module.exports = UserRepositories;
