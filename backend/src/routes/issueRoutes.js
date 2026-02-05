const express = require('express');
const issueController = require('../controllers/issueController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(authMiddleware.protect); // All routes require login

router
    .route('/')
    .get(issueController.getAllIssues)
    .post(upload.array('images', 5), issueController.createIssue);

router
    .route('/:id')
    .get(issueController.getIssue);

router.patch(
    '/:id/status',
    authMiddleware.restrictTo('warden', 'maintenance', 'admin'),
    issueController.updateStatus
);

router.patch(
    '/:id/assign',
    authMiddleware.restrictTo('warden', 'admin'),
    issueController.assignIssue
);

router.patch(
    '/:id/duplicate',
    authMiddleware.restrictTo('warden', 'admin', 'maintenance'),
    issueController.markDuplicate
);

module.exports = router;
