const BaseRepositories = require('./BaseRepositories');
const Pay = require('../models/Pays');
const UserRules = require('../rules/users.rules');
const { data_pay_response } = require('../utils/app.util');
const { random_id } = require('../utils/support.util');

class PayReponsitories extends BaseRepositories {
    constructor() {
        super();
        this.model = Pay;
    }
    get = async (query) => {
        this.query = query;

        this.query.push({
            $match: { deleted: null },
        });

        const result = await this.model.aggregate(this.query);
        return result;
    };

    create = async (pay_obj) => {
        const newPay = await new Pay(pay_obj);
        const pay = await newPay.save();
        const result = data_pay_response(pay);
        if (!result) {
            return false;
        }
        return result;
    };

    createMany = async (pay_obj) => {
        const pay = await Pay.insertMany(pay_obj);
        const result = data_pay_response(pay);
        if (!result) {
            return false;
        }
        return result;
    };

    update = async (id, body) => {
        const result = await this.model.findOneAndUpdate({ id_system: id }, body);
        if (!result) {
            return false;
        }
        return result;
    };

    delete = async (query) => {
        const result = await this.model.findOneAndRemove(query);
        if (!result) {
            return false;
        }
        return result;
    };

    deletePayMany = async (query) => {
        const result = await this.model.deleteMany(query);
        if (!result) {
            return false;
        }
        return result;
    };

    createPayforJob = async (data, auth, role) => {
        let id_system_create = '';
        do {
            id_system_create = random_id(UserRules.ROLE.PAY);
        } while (
            await this.find_obj({
                id_system: id_system_create,
            })
        );
        const pay_obj = [];
        if (data.staff_is_pay !== data.id_admin) {
            pay_obj.push({
                id_job: data.id_job,
                id_system: id_system_create,
                create_by: auth,
                staff_is_pay: data.staff_is_pay,
                rate_sale: data?.rate_sale,
                pay_role: role,
                pay_amount: data?.pay_amount,
            });
        }
        // Check payment is exist
        let aggregate_options = [
            {
                $match: {
                    id_job: data.id_job,
                    pay_role: role,
                },
            },
        ];
        const check_pay = await this.get(aggregate_options);
        if (check_pay.length < 1 && pay_obj.length > 0) {
            console.log('Create new payment');
            return await this.create(pay_obj[0]);
        }

        for (let index = 0; index < check_pay.length; index++) {
            if (check_pay[index]?.pay_role === UserRules.ROLE.EDITOR) {
                await this.update(check_pay[index].id_system, {
                    staff_is_pay: data?.staff_is_pay,
                    pay_amount: data?.pay_amount,
                });
            }
        }
    };
}

module.exports = PayReponsitories;
