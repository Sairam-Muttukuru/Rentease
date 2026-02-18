const express = require('express');
const router = express.Router();
const announcementController = require('../../controllers/common/AnnouncementController');
const verifyToken = require('../../middlewares/AuthMiddleware');

// Landlord Routes (Protected)
router.post('/', verifyToken, announcementController.createAnnouncement);
router.get('/landlord', verifyToken, announcementController.getLandlordAnnouncements);
router.delete('/:id', verifyToken, announcementController.deleteAnnouncement);

// Tenant Routes (Protected or Public depending on requirements)
// Assuming tenant also logs in
router.get('/tenant', verifyToken, announcementController.getTenantAnnouncements);

module.exports = router;
