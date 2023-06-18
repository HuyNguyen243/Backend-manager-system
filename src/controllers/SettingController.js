const BaseController = require('./BaseController');
const SettingReponsitories = require('../repositories/SettingReponsitories');
const UserRepositories = require('../repositories/UserRepositories');
const messager = require('../utils/constain.util');
const { random_id } = require('../utils/support.util');
const { data_setting_response } = require('../utils/data.util');
class SettingController extends BaseController {
    settingRespo;
    userRespo;
    constructor() {
        super();
        this.settingRespo = new SettingReponsitories();
        this.userRespo = new UserRepositories();
    }

    get_setting = async (req, res) => {
        try {
            const result = await this.settingRespo.getsetting();

            if (!result) {
                return this.response_error(res, [], messager.GET_SETTING_FAIL);
            }
            return this.response_success(res, data_setting_response(result), messager.GET_SETTING_SUCCESS);
        } catch (error) {
            return this.response_error(res, [], messager.GET_SETTING_FAIL);
        }
    };

    create_setting = async (req, res) => {
        try {
            const body = req.body;
            let id_system = '';
            do {
                id_system = random_id('SETTING');
            } while (
                await this.settingRespo.is_exist({
                    id_system: id_system,
                })
            );
            body.id_system = id_system;
            body.id_admin = req.id_system;
            const result = await this.settingRespo.create(body);
            if (!result) {
                return this.response_error(res, [], messager.CREATE_SETTING_FAIL);
            }
            return this.response_success(res, result, messager.CREATE_SETTING_SUCCESS);
        } catch (error) {
            return this.response_error(res, error, messager.CREATE_SETTING_FAIL);
        }
    };

    update_setting = async (req, res) => {
        try {
            const body = req.body;
            const id = req.params.id;
            // check id
            const id_user_exists = await this.userRespo.getuser({
                id_system: id,
            });
            if (!id_user_exists) {
                return this.response_error(res, [], messager.GET_USER_FAIL);
            }
            body.id_admin_last_update = id;
            const result = await this.settingRespo.update(
                {
                    mode: 'system_setting',
                },
                body
            );
            if (!result) {
                return this.response_error(res, [], messager.UPDATE_SETTING_FAIL);
            }
            return this.response_success(res, data_setting_response(body), messager.UPDATE_SETTING_SUCCESS);
        } catch (error) {
            return this.response_error(res, [], messager.UPDATE_SETTING_FAIL);
        }
    };

    delete_setting = async (req, res) => {
        try {
            const result = await this.settingRespo.delete();
            if (!result) {
                return this.response_error(res, [], messager.DELETE_SETTING_FAIL);
            }
            return this.response_success(res, [], messager.DELETE_SETTING_SUCCESS);
        } catch (error) {
            return this.response_error(res, [], messager.DELETE_SETTING_FAIL);
        }
    };
}

const settingController = new SettingController();

module.exports = settingController;
