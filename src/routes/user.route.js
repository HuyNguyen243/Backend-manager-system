const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const UserRules = require('../rules/users.rules');

// Middleware
const { auth_middleware, role_middleware, only_middleware } = require('../middlewares/app.middleware');

// Validation middle
const {
    create_admin_special_validation,
    create_user_validation,
    update_user_validation,
} = require('../validations/app.validation');

// Router configuration
// Router special for leader admin
router.post('/admin/create_admin', [auth_middleware, create_admin_special_validation, UserController.createAdmin]);

// Router create user
router.post('/create', [
    auth_middleware,
    create_user_validation,
    role_middleware([UserRules.ROLE.ADMIN]),
    UserController.create_user,
]);

// Router update user by admin
router.put('/:id', [
    auth_middleware,
    update_user_validation,
    role_middleware([UserRules.ROLE.ADMIN]),
    UserController.update_user,
]);

// Router update user
router.put('/infor/update/:id', [auth_middleware, only_middleware, UserController.update_user]);

router.get('/reminders/', [auth_middleware, UserController.get_reminder]);

// Router get any user by admin
router.get('/:id', [auth_middleware, role_middleware([UserRules.ROLE.ADMIN]), UserController.get_user]);

// Router get all user
router.get('/data/dashboard', [auth_middleware, role_middleware([UserRules.ROLE.ADMIN]), UserController.get_user_all]);

// Router get infor only user
router.get('/infor/:id', [auth_middleware, only_middleware, UserController.get_user]);

// Router delete user for admin
router.delete('/:id', [auth_middleware, role_middleware([UserRules.ROLE.ADMIN]), UserController.removeUser]);

router.put('/infor/status/:id', [auth_middleware, only_middleware, UserController.change_status]);

module.exports = router;
