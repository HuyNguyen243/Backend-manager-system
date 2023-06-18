const BaseController = require('./BaseController');
const StepsImageRepositories = require('../repositories/StepsImageRepositories');
const messager = require('../utils/constain.util');
const { data_setting_response } = require('../utils/data.util');

class SettingController extends BaseController {
    stepsImageRepo;
    constructor() {
        super();
        this.stepsImageRepo = new StepsImageRepositories();
    }

    get = async (req, res) => {
        try {
            const result = await this.stepsImageRepo.get({});

            if (!result) {
                return this.response_error(res, [], messager.GET_STEP_IMAGE_FAIL);
            }

            return this.response_success(res, result, messager.GET_STEP_IMAGE_SUCCESS);
        } catch (error) {
            return this.response_error(res, [], messager.GET_STEP_IMAGE_FAIL);
        }
    };
    // Create only one
    create = async (req, res) => {
        try {
            const { step_image } = req.body;
            if (step_image) {
                const checkStepIsExist = this.stepsImageRepo({ step_image: step_image });
                if (checkStepIsExist) {
                    return this.response_error(res, [], messager.CREATE_STEP_IMAGE_ISEXIST);
                }
                const result = await this.stepsImageRepo.create({ step_image: step_image });
                if (!result) {
                    return this.response_error(res, [], messager.CREATE_STEP_IMAGE_FAIL);
                }
                return this.response_success(res, result, messager.CREATE_STEP_IMAGE_SUCCESS);
            }
        } catch (error) {
            return this.response_error(res, error, messager.CREATE_STEP_IMAGE_FAIL);
        }
    };

    update = async (req, res) => {
        try {
            const { step_image } = req.body;
            const { id } = req.params;
            // check id
            const checkStepIsExist = this.stepsImageRepo({ step_image: step_image });

            if (checkStepIsExist) {
                return this.response_error(res, [], messager.UPDATE_STEP_IMAGE_ISEXIST_FAILED);
            }

            const result = await this.stepsImageRepo.update(id, { step_image: step_image });

            if (!result) {
                return this.response_error(res, [], messager.UPDATE_STEP_IMAGE_FAIL);
            }
            return this.response_success(res, data_setting_response(result), messager.UPDATE_STEP_IMAGE_SUCCESS);
        } catch (error) {
            return this.response_error(res, [], messager.UPDATE_STEP_IMAGE_FAIL);
        }
    };

    delete = async (req, res) => {
        try {
            const { id } = req.params;

            const result = await this.stepsImageRepo.delete(id);
            if (!result) {
                return this.response_error(res, [], messager.DELETE_STEP_IMAGE_FAIL);
            }
            return this.response_success(res, [], messager.DELETE_STEP_IMAGE_SUCCESS);
        } catch (error) {
            return this.response_error(res, [], messager.DELETE_STEP_IMAGE_FAIL);
        }
    };
}

const settingController = new SettingController();

module.exports = settingController;
