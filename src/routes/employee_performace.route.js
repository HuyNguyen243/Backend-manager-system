const { auth_middleware, role_middleware } = require('../middlewares/app.middleware');
const EmployPerformanceController = require('../controllers/EmployPerformanceController');
const UserRules = require('../rules/users.rules');
const router = require('express').Router();

router.get('/employee', [
    auth_middleware,
    role_middleware([UserRules.ROLE.ADMIN, UserRules.ROLE.SALER]),
    EmployPerformanceController.getKpiMonthly,
]);

router.get('/staff-performance', [
    auth_middleware,
    role_middleware([UserRules.ROLE.ADMIN]),
    EmployPerformanceController.getJobsPerformance,
]);

module.exports = router;
