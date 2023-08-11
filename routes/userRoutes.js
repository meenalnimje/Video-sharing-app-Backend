const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requireUser = require("../middleware/requireUser");
router.put("/:id", requireUser, userController.updateUser);
router.delete("/:id", requireUser, userController.deleteUser);
router.post("/find/userinfo", userController.getUser);
router.get("/find/", requireUser, userController.getMyProfile);
router.post("/sub", requireUser, userController.subscribeUser);
router.post("/like", requireUser, userController.like);
router.post("/dislike", requireUser, userController.dislike);
module.exports = router;
