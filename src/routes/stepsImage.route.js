const router = require('express').Router();
const StepsImageController = require('../controllers/StepsImageController');
const { step_image_validation } = require('../validations/app.validation');
const UserRules = require('../rules/users.rules');

const { auth_middleware, role_middleware } = require('../middlewares/app.middleware');

router.get('/', [auth_middleware, role_middleware([UserRules.ROLE.ADMIN]), StepsImageController.get]);

router.post('/', [
    auth_middleware,
    step_image_validation,
    role_middleware([UserRules.ROLE.ADMIN]),
    StepsImageController.create,
]);
// Create only one by IT

router.put('/:id', [
    auth_middleware,
    step_image_validation,
    role_middleware([UserRules.ROLE.ADMIN]),
    StepsImageController.update,
]);
// Delelte not run, can run by IT
router.delete('/:id', [auth_middleware, role_middleware([UserRules.ROLE.ADMIN]), StepsImageController.delete]);

module.exports = router;
