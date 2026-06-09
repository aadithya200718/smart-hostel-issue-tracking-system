const express = require('express');
const auxController = require('../controllers/auxController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Reusing existing upload configuration

const router = express.Router();

router.use(authMiddleware.protect);

// Announcements
router.route('/announcements')
    .get(auxController.getAnnouncements)
    .post(authMiddleware.restrictTo('admin', 'warden'), auxController.createAnnouncement);

// Lost & Found
router.route('/lost-found')
    .get(auxController.getLostItems)
    .post(upload.single('image'), auxController.reportLostItem);
