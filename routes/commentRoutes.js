const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const requireUser = require("../middleware/requireUser");
router.get("/:videoId", requireUser, commentController.getComment);
router.post("/", requireUser, commentController.addComment);
router.delete("/:id", requireUser, commentController.deleteComment);
module.exports = router;
