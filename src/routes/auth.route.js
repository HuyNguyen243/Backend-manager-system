const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Middleware
const { auth_middleware_for_token, auth_middleware } = require('../middlewares/app.middleware');

// Validation middle
const { auth_login_validation, forgot_validation, reset_validation } = require('../validations/app.validation');

// Router Controller
// Router login
router.post('/login', [auth_login_validation, AuthController.login]);

// check token expried
router.post('/token', [auth_middleware_for_token, AuthController.checktoken]);

router.delete('/logout', [auth_middleware, AuthController.logout]);

// forget mail
router.post('/password-reset', [forgot_validation, AuthController.forgotpassword]);

// reset password
router.put('/password-reset/:id', [reset_validation, AuthController.resetpassword]);
module.exports = router;
