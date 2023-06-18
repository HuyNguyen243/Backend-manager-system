const BaseRepositories = require('./BaseRepositories');
const Customer = require('../models/Customer');
const { data_customer_response } = require('../utils/app.util');

class CustomerResponsitories extends BaseRepositories {
    constructor() {
        super();
        this.model = Customer;
    }

    get = async (query) => {
        this.query = query;
        // IGNORE DELETED USER
        this.query.push({ $match: { deleted: null } });

        const result = await this.model.aggregate(this.query);
        if (result) {
            const newRes = result.map((customer) => {
                return data_customer_response(customer);
            });
            return newRes;
        } else {
            return false;
        }
    };

    getOne = async (query) => {
        const customer = this.model.findOne(query);
        return customer;
    };

    create = async (customer_obj) => {
        const newCustomer = await new Customer(customer_obj);
        const customer = await newCustomer.save();
        const result = data_customer_response(customer);
        return result;
    };

    update_customer = async (id, body) => {
        const result = await this.model.findOneAndUpdate({ id_system: id }, body);

        if (!result) {
            return false;
        }
        return result;
    };

    delete = async (id) => {
        const result = await this.model.findOneAndRemove({ id_system: id });
        if (!result) {
            return false;
        }
        return result;
    };
    emailIsExist = async (email) => {
        const emailIsExist = await this.model.findOne({ email: email });
        return emailIsExist ? true : false;
    };

    getAggregate = async (obj) => {
        const result = await this.model.aggregate(obj);
        return result;
    };
}

module.exports = CustomerResponsitories;
