const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/SubscriptionController');
// Middleware
const { auth_middleware } = require('../middlewares/app.middleware');

router.post('/', [auth_middleware, SubscriptionController.pushNotificationSubscription]);

// check token expried
router.post('/:id', [auth_middleware, SubscriptionController.sendPushNotification]);

module.exports = router;
