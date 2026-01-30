const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");
const auth = require("../middlewares/AuthMiddleware");

router.get("/", auth, NotificationController.getNotifications);
router.patch("/:id/read", auth, NotificationController.markAsRead);
router.patch("/read-all", auth, NotificationController.markAllAsRead);

module.exports = router;
