const router = require('express').Router();
const JobController = require('../controllers/JobController');
const JobRules = require('../rules/jobs.rules');

// Validation middle
const {
    create_job_validation,
    update_job_validation,
    done_job_validation,
    editor_update_job_validation,
} = require('../validations/app.validation');

// Middleware
const { auth_middleware, role_middleware, only_middleware } = require('../middlewares/app.middleware');

// Router get all jobs
router.get('/data/dashboard', [auth_middleware, JobController.get_jobs_all]);

router.put('/update/:id', [
    auth_middleware,
    editor_update_job_validation,
    role_middleware([JobRules.ROLE.EDITOR]),
    JobController.editorUpdateJob,
]);

router.put('/editor-cancel/:id', [
    auth_middleware,
    role_middleware([JobRules.ROLE.EDITOR, JobRules.ROLE.LEADER_EDITOR]),
    JobController.editorCancelJob,
]);

// Router create jobs
router.post('/', [
    auth_middleware,
    create_job_validation,
    role_middleware([JobRules.ROLE.ADMIN, JobRules.ROLE.SALER]),
    JobController.create_jobs,
]);

// Router update jobs
router.put('/:id', [
    auth_middleware,
    update_job_validation,
    role_middleware([JobRules.ROLE.ADMIN, JobRules.ROLE.SALER]),
    JobController.update_jobs,
]);

// Router update jobs
router.put('/approved-by-editor/:id', [
    auth_middleware,
    role_middleware([JobRules.ROLE.EDITOR, JobRules.ROLE.LEADER_EDITOR]),
    JobController.approved_job,
]);

// Router update editor link done
router.put('/done/:id', [
    auth_middleware,
    done_job_validation,
    role_middleware([JobRules.ROLE.ADMIN, JobRules.ROLE.SALER]),
    JobController.done_jobs,
]);

// // Router delete jobs by admin
router.delete('/:id', [
    auth_middleware,
    role_middleware([JobRules.ROLE.ADMIN, JobRules.ROLE.SALER]),
    JobController.delete_jobs,
]);

router.get('/:id', [auth_middleware, only_middleware, JobController.get_jobs]);

// Get Jobs by admin
router.get('/admin/:id', [auth_middleware, role_middleware([JobRules.ROLE.ADMIN]), JobController.get_jobs]);

module.exports = router;
