const router = require('express').Router();
const SettingController = require('../controllers/SettingController');
const {
    update_setting_special_validation,
    create_setting_special_validation,
} = require('../validations/app.validation');
const UserRules = require('../rules/users.rules');

const { auth_middleware, role_middleware, auth_middleware_admin_it } = require('../middlewares/app.middleware');

router.get('/', [auth_middleware, SettingController.get_setting]);

// Create only one by IT
router.post('/', [
    auth_middleware,
    create_setting_special_validation,
    role_middleware([UserRules.ROLE.ADMIN]),
    SettingController.create_setting,
]);
// Update admin
router.put('/:id', [
    auth_middleware,
    update_setting_special_validation,
    role_middleware([UserRules.ROLE.ADMIN]),
    SettingController.update_setting,
]);
// Delelte not run, can run by IT
router.delete('/', [
    auth_middleware_admin_it,
    role_middleware([UserRules.ROLE.ADMIN]),
    SettingController.delete_setting,
]);

module.exports = router;
