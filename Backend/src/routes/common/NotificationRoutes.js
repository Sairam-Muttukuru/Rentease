const express = require("express");
const router = express.Router();
const NotificationController = require("../../controllers/common/NotificationController");
const auth = require("../../middlewares/AuthMiddleware");

router.get("/", auth, NotificationController.getNotifications);
router.patch("/:id/read", auth, NotificationController.markAsRead);
router.patch("/read-all", auth, NotificationController.markAllAsRead);
router.post("/vacate-request", auth, NotificationController.requestVacate);

module.exports = router;
