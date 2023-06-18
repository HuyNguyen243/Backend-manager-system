const router = require('express').Router();
const CustomerController = require('../controllers/CustomerController');
const { create_customer_special_validation } = require('../validations/app.validation');
const { auth_middleware, role_middleware } = require('../middlewares/app.middleware');
const UserRules = require('../rules/users.rules');

router.get('/', [
    auth_middleware,
    role_middleware([UserRules.ROLE.ADMIN, UserRules.ROLE.SALER]),
    CustomerController.get,
]);

router.get('/:id', [
    auth_middleware,
    role_middleware([UserRules.ROLE.ADMIN, UserRules.ROLE.SALER]),
    CustomerController.getOne,
]);

router.post('/', [
    auth_middleware,
    create_customer_special_validation,
    role_middleware([UserRules.ROLE.ADMIN, UserRules.ROLE.SALER]),
    CustomerController.create,
]);

router.put('/:id', [
    auth_middleware,
    role_middleware([UserRules.ROLE.ADMIN, UserRules.ROLE.SALER]),
    CustomerController.update,
]);

router.delete('/:id', [
    auth_middleware,
    role_middleware([UserRules.ROLE.ADMIN, UserRules.ROLE.SALER]),
    CustomerController.delete,
]);

module.exports = router;
