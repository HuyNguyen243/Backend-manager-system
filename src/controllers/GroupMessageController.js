const BaseController = require('./BaseController');
const messager = require('../utils/constain.util');
const groupMessageResponsitores = require('../repositories/GroupMessageRepositories');
const MessageRepositories = require('../repositories/MessageRepositories');
const UserRules = require('../rules/users.rules');

class GroupMessageController extends BaseController {
    groupMessageRespo;
    messageRepo;
    constructor() {
        super();
        this.groupMessageRespo = new groupMessageResponsitores();
        this.messageRepo = new MessageRepositories();
    }

    get_group_preview = async (id_system, socket) => {
        const result = await this.groupMessageRespo.get_group_preview(id_system);
        if (result) {
            socket.emit('groups-preview', result);
        }
    };

    get = async (id_system, socket) => {
        const result = await this.groupMessageRespo.get(id_system);
        if (result) {
            socket.emit('groups', result);
        }
    };

    create = async (req, res) => {
        try {
            const result = await this.groupMessageRespo.create(req.body);
            if (result) {
                global.io.emit('isCreated', true);
                return this.response_success(res, result, messager.CREATE_GROUP_SUCCESS);
            } else {
                return this.response_error(res, [], messager.CREATE_GROUP_FAIL);
            }
        } catch (error) {
            return this.response_error(res, [], messager.CREATE_GROUP_FAIL);
        }
    };

    update = async (req, res) => {
        try {
            const { id } = req.params;
            const update = await this.groupMessageRespo.update(id, req.body);
            if (update) {
                return this.response_success(res, [], messager.UPDATE_GROUP_SUCCESS);
            }
            return this.response_error(res, [], messager.UPDATE_GROUP_FAIL);
        } catch (error) {
            return this.response_error(res, [], messager.UPDATE_GROUP_FAIL);
        }
    };

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.groupMessageRespo.delete(id);
            if (result) {
                const nameRoom = UserRules.MESSAGE.GROUP + '-' + id;
                await this.messageRepo.deleteMessages(nameRoom);
                return this.response_success(res, [], messager.DELETE_GROUP_SUCCESS);
            }
            return this.response_error(res, [], messager.DELETE_GROUP_FAIL);
        } catch (error) {
            return this.response_error(res, [], messager.DELETE_GROUP_FAIL);
        }
    };
}

const groupMessageController = new GroupMessageController();
module.exports = groupMessageController;
