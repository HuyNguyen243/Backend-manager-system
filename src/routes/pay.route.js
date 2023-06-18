const router = require('express').Router();
const PayController = require('../controllers/PayController');
const UserRules = require('../rules/users.rules');
const { auth_middleware, only_middleware, role_middleware } = require('../middlewares/app.middleware');

router.get('/payment-staff', [auth_middleware, role_middleware([UserRules.ROLE.ADMIN]), PayController.getPayStaff]);

router.get('/:id', [auth_middleware, only_middleware, PayController.getPays]);

// router.post("/",[
//     auth_middleware,
//     create_pay_special_validation,
//     role_middleware([UserRules.ROLE.ADMIN]),
//     PayController.create
// ])

router.put('/:id', [auth_middleware, only_middleware, PayController.update]);

// router.delete("/:id",[
//     auth_middleware,
//     role_middleware([UserRules.ROLE.ADMIN]),
//     PayController.delete
// ])

module.exports = router;
