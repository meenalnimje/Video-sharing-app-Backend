const comments = require("../models/comments");
const video = require("../models/video");
const { success, error } = require("../utils/responseWrapper");
const addComment = async (req, res) => {
  try {
    const newComment = new comments({ userId: req._id, ...req.body });
    await newComment.save();
    return res.send(success(201, { newComment }));
  } catch (e) {
    console.log("this error is from addComment side ", e);
  }
};
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const commentToDelete = await comments.findById(id);
    const videoid = commentToDelete.videoId;
    const Video = await video.findById(videoid);
    if (req._id === commentToDelete.userId || req._id === Video?.userId) {
      await comments.findByIdAndDelete(id);
      return res.send(success(200, "comment has been deleted"));
    } else {
      return res.send(error(403, "only owner can delete the comment"));
    }
  } catch (e) {
    console.log("this error is from delete comment side ", e);
  }
};
const getComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comment = await comments.find({ videoId: videoId });
    return res.send(success(200, { comment }));
  } catch (e) {
    console.log("this error is from get comment side ", e);
  }
};
module.exports = { addComment, getComment, deleteComment };
