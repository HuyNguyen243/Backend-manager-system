const BaseRepositories = require('./BaseRepositories');
const Setting = require('../models/Settings');

class SettingReponsitories extends BaseRepositories {
    constructor() {
        super();
        this.model = Setting;
    }
    getsetting = async () => {
        const setting = await this.model.findOne().sort({ created: -1 });
        return setting;
    };

    create = async (body) => {
        const setting = await new Setting(body);
        const result = await setting.save();
        if (!result) {
            return false;
        }
        return result;
    };

    updatesetting = async (body) => {
        const result = await this.model.updateMany(body);
        if (!result) {
            return false;
        }
        return result;
    };

    delete = async () => {
        const result = await this.model.deleteMany();
        if (!result) {
            return false;
        }
        return result;
    };
}

module.exports = SettingReponsitories;
