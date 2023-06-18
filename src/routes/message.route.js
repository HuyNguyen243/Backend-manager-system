const { auth_middleware, role_middleware } = require('../middlewares/app.middleware');
const GroupMessageController = require('../controllers/GroupMessageController');
const MessageController = require('../controllers/MessageController');
const { group_message_validation } = require('../validations/app.validation');
const UserRules = require('../rules/users.rules');
const router = require('express').Router();

router.post('/messages/allroom', [auth_middleware, MessageController.uploadimages]);

router.post('/images', [auth_middleware, MessageController.uploadimages]);

router.post('/', [
    group_message_validation,
    auth_middleware,
    role_middleware([UserRules.ROLE.ADMIN]),
    GroupMessageController.create,
]);

router.put('/:id', [auth_middleware, role_middleware([UserRules.ROLE.ADMIN]), GroupMessageController.update]);

router.delete('/:id', [auth_middleware, role_middleware([UserRules.ROLE.ADMIN]), GroupMessageController.delete]);

module.exports = router;
