const BaseRepositories = require('./BaseRepositories');
const StepImages = require('../models/StepImage');

class StepImageRespositories extends BaseRepositories {
    constructor() {
        super();
        this.model = StepImages;
    }
    get = async () => {
        const result = await this.model.find({});
        return result;
    };

    getOne = async (body) => {
        const result = await this.model.findOne(body);
        return result;
    };

    create = async (body) => {
        const newItem = await new StepImages(body);
        const result = await newItem.save();
        if (!result) {
            return false;
        }
        return result;
    };

    update = async (id, body) => {
        const result = await this.model.findByIdAndUpdate(id, body);
        if (!result) {
            return false;
        }
        return result;
    };

    delete = async (id) => {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) {
            return false;
        }
        return result;
    };
}

module.exports = StepImageRespositories;
