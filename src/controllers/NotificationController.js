const NotificationResponsitories = require('../repositories/NotificationRepositories');
const BaseController = require('./BaseController');
const messager = require('../utils/constain.util');

class NotificationController extends BaseController {
    notificationRespo;
    constructor() {
        super();
        this.notificationRespo = new NotificationResponsitories();
    }

    getAll = async (req, res) => {
        const notifications = await this.notificationRespo.getAll(req.id_system, req.query.page);
        if (notifications) {
            return this.response_success(res, notifications, messager.CREATE_NOTIFICATION_SUCCESS);
        } else {
            return this.response_error(res, [], messager.CREATE_NOTIFICATION_FAIL);
        }
    };

    get = async (id_system, socket) => {
        const notifications = await this.notificationRespo.get(id_system);
        socket.emit('notifications-of-id-system', notifications);
    };

    resetNotify = async (id, id_system, socket) => {
        const resetNotification = await this.notificationRespo.resetNotify(id, id_system);
        if (resetNotification) {
            socket.emit('is_reset_notify', true);
        }
    };

    reset_count_notifications = async (id_system, socket) => {
        const resetNotification = await this.notificationRespo.reset_count_notifications(id_system);
        if (resetNotification) {
            socket.emit('is_reset_count_notify', true);
        }
    };
}

const notificationController = new NotificationController();
module.exports = notificationController;
