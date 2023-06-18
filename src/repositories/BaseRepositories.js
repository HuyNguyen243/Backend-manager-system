class BaseRepositories {
    model;

    constructor() {}
    is_exist = async (query) => {
        const is_exist = await this.model.exists(query);
        return is_exist;
    };
    find_obj = async (query) => {
        const find = await this.model.findOne(query);
        return find;
    };
    delete = async (query) => {
        const deleted = await this.model.findOneAndDelete(query);
        return deleted;
    };
    update = async (query, data) => {
        let date = new Date();
        date.setHours(date.getHours() + 7);
        data._modified_at = date;
        const updated = await this.model.findOneAndUpdate(query, data);

        return updated;
    };
}

module.exports = BaseRepositories;
