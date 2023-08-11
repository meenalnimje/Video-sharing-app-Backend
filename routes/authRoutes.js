const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/refreshtoken", authController.refreshAccessToken);
router.post("/logout", authController.logout);
router.post("/googlelogin", authController.googleLogin);
module.exports = router;
