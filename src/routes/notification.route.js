const NotificationController = require('../controllers/NotificationController');
const { auth_middleware } = require('../middlewares/app.middleware');
const router = require('express').Router();

router.get('/', [auth_middleware, NotificationController.getAll]);

module.exports = router;
