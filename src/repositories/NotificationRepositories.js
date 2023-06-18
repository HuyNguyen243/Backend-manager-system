const Notifications = require('../models/Notification');
const BaseRepositories = require('./BaseRepositories');
const Users = require('../models/Users');

const NotificationRules = require('../rules/notification.rules');
const UserRules = require('../rules/users.rules');

class NotificationResponsitories extends BaseRepositories {
    constructor() {
        super();
        this.model = Notifications;
    }

    getAll = async (id_system, page) => {
        let Page = NotificationRules.PAGE.SKIP;
        if (page) {
            Page = page;
        }
        const notifications = await this.model.aggregate([
            { $match: { members: { $in: [id_system, '$members'] } } },
            { $sort: { _create_at: -1 } },
            { $skip: Number(Page) },
            { $limit: 10 },
        ]);
        return notifications;
    };

    get = async (id_system) => {
        const notifications = await this.model.aggregate([
            { $match: { members: { $in: [id_system, '$members'] } } },
            { $sort: { _create_at: -1 } },
            { $limit: 1 },
        ]);
        return notifications;
    };

    get_one_job = async (id) => {
        const notifications = await this.model.findOne({ _id: id });
        return notifications;
    };

    delete_job_editor = async (body) => {
        if (NotificationRules.STATUS.DELETE_JOB == body.status) {
            const members = [];
            let userActiveNotify = {};

            const checkeditor = await this.checkRole(body.id_editor);
            if (checkeditor === UserRules.ROLE.EDITOR) {
                members.push(body.id_editor);
                userActiveNotify[body.id_editor] = true;
            }

            await this.createNotify(members, userActiveNotify, body);
        }
    };

    updateJobByEditor = async (body) => {
        const members = [];
        let userActiveNotify = {};
        const getAllAdmin = await this.getAllAdmin();

        for (const member of getAllAdmin) {
            userActiveNotify[member.id_system] = true;
            members.push(member.id_system);
        }
        const checkUserCreateJob = await this.checkRole(body.id_saler);

        if (checkUserCreateJob === UserRules.ROLE.SALER) {
            members.push(body.id_saler);
            userActiveNotify[body.id_saler] = true;
        }
        await this.update_count_notify_by_id_system(members);
        body.member_check_notify = userActiveNotify;
        body.members = members;
        const result = await new this.model(body);
        global.io.emit('is_created_notify', result);
        await result.save();
    };

    AdminAddjobForEditor = async (body) => {
        const members = [];
        let userActiveNotify = {};

        const checkeditor = await this.checkRole(body.id_editor);
        if (checkeditor === UserRules.ROLE.EDITOR) {
            members.push(body.id_editor);
            userActiveNotify[body.id_editor] = true;
        }

        await this.createNotify(members, userActiveNotify, body);
    };

    jobCreated = async (body) => {
        const members = [];
        let userActiveNotify = {};
        const getAllAdmin = await this.getAllAdmin();

        const checkSalesCreateJob = await this.checkRole(body.id_saler);
        if (checkSalesCreateJob === UserRules.ROLE.SALER) {
            members.push(body.id_saler);
            userActiveNotify[body.id_saler] = true;

            for (const member of getAllAdmin) {
                userActiveNotify[member.id_system] = true;
                members.push(member.id_system);
            }
        }

        await this.createNotify(members, userActiveNotify, body);
    };

    jobUpdated = async (body) => {
        const members = [];
        let userActiveNotify = {};
        const checkRoleUserCreated = await this.checkRole(body.created_by);
        const checkSalesCreateJob = await this.checkRole(body.id_saler);
        const checkEditor = await this.checkRole(body.id_editor);

        if (checkRoleUserCreated === UserRules.ROLE.ADMIN) {
            if (checkSalesCreateJob === UserRules.ROLE.SALER) {
                members.push(body.id_saler);
                userActiveNotify[body.id_saler] = true;
            }
        }

        if (checkRoleUserCreated === UserRules.ROLE.SALER) {
            const getAllAdmin = await this.getAllAdmin();
            for (const member of getAllAdmin) {
                userActiveNotify[member.id_system] = true;
                members.push(member.id_system);
            }
        }

        if (checkEditor) {
            members.push(body.id_editor);
            userActiveNotify[body.id_editor] = true;
        }

        await this.createNotify(members, userActiveNotify, body);
    };

    jobDeleted = async (body) => {
        const members = [];
        let userActiveNotify = {};
        const checkRoleUserCreated = await this.checkRole(body.created_by);
        const checkSalesCreateJob = await this.checkRole(body.id_saler);
        const checkEditor = await this.checkRole(body.id_editor);

        if (checkRoleUserCreated === UserRules.ROLE.ADMIN) {
            if (checkSalesCreateJob === UserRules.ROLE.SALER) {
                members.push(body.id_saler);
                userActiveNotify[body.id_saler] = true;
            }
        }

        if (checkRoleUserCreated === UserRules.ROLE.SALER) {
            const getAllAdmin = await this.getAllAdmin();
            for (const member of getAllAdmin) {
                userActiveNotify[member.id_system] = true;
                members.push(member.id_system);
            }
        }

        if (checkEditor) {
            members.push(body.id_editor);
            userActiveNotify[body.id_editor] = true;
        }
        await this.createNotify(members, userActiveNotify, body);
    };

    jobDoneByEditor = async (body) => {
        const members = [];
        let userActiveNotify = {};
        const getAllAdmin = await this.getAllAdmin();

        for (const member of getAllAdmin) {
            userActiveNotify[member.id_system] = true;
            members.push(member.id_system);
        }

        const checkSalesCreateJob = await this.checkRole(body.id_saler);
        if (checkSalesCreateJob === UserRules.ROLE.SALER) {
            members.push(body.id_saler);
            userActiveNotify[body.id_saler] = true;
        }
        await this.createNotify(members, userActiveNotify, body);
    };

    jobFixed = async (body) => {
        const members = [];
        let userActiveNotify = {};
        const checkEditor = await this.checkRole(body.id_editor);

        if (checkEditor) {
            members.push(body.id_editor);
            userActiveNotify[body.id_editor] = true;
        }
        await this.createNotify(members, userActiveNotify, body);
    };

    deletejobOldEditor = async (body) => {
        const members = [];
        let userActiveNotify = {};
        const checkEditor = await this.checkRole(body.id_editor);

        if (checkEditor) {
            members.push(body.id_editor);
            userActiveNotify[body.id_editor] = true;
        }
        await this.createNotify(members, userActiveNotify, body);
    };

    cancelJobbyEditor = async (body) => {
        const members = [];
        let userActiveNotify = {};
        const getAllAdmin = await this.getAllAdmin();

        for (const member of getAllAdmin) {
            userActiveNotify[member.id_system] = true;
            members.push(member.id_system);
        }
        await this.createNotify(members, userActiveNotify, body);
    };
    // AccessJobBySales =  async(body)=>{
    //     const members = [];
    //     let userActiveNotify = {};
    //     const checkEditor = await this.checkRole(body.id_editor);

    //     if(checkEditor){
    //         members.push(body.id_editor);
    //         userActiveNotify[body.id_editor] = true;
    //     }

    //     await this.createNotify(members, userActiveNotify, body)
    // }

    createNotify = async (members, userActiveNotify, body) => {
        await this.update_count_notify_by_id_system(members);
        body.member_check_notify = userActiveNotify;
        body.members = members;
        delete body?.old_editor;
        const result = await new this.model(body);
        global.io.emit('is_created_notify', result);
        await result.save();
    };

    delete_job_by_admin = async (id) => {
        await this.model.deleteMany({ id_job: id });
    };

    resetNotify = async (id, id_system) => {
        const notification = await this.get_one_job(id);
        if (notification) {
            const reset = notification.member_check_notify;
            if (Object.keys(reset).includes(id_system)) {
                delete reset[id_system];
            }
            reset[id_system] = false;
            const rs = { member_check_notify: reset };
            return await this.model.findOneAndUpdate({ _id: id }, rs);
        }
    };

    getAllAdmin = async () => {
        const getAllAdmin = await Users.aggregate([
            { $match: { role: UserRules.ROLE.ADMIN } },
            { $project: { id_system: 1 } },
        ]);
        return getAllAdmin;
    };

    checkRole = async (id_system) => {
        const user = await Users.findOne({ id_system: id_system });
        if (user) {
            return user.role;
        }
    };

    update_count_notify_by_id_system = async (members) => {
        if (members.length > 0) {
            for (const mb of members) {
                const user = await Users.findOne({ id_system: mb });
                let count;
                if (!user?.notification_count) {
                    count = 0;
                } else {
                    count = user?.notification_count;
                }
                const notify = count + 1;
                await Users.findOneAndUpdate({ id_system: mb }, { notification_count: notify });
            }
        } else {
            console.log('No Update notify user');
        }
    };

    reset_count_notifications = async (id) => {
        const result = await Users.findOneAndUpdate({ id_system: id }, { notification_count: 0 });
        return result;
    };
}

module.exports = NotificationResponsitories;
