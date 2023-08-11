// update user
// get user
// delete user
// subscribe  and unsubscribe user

const User = require("../models/user");
const video = require("../models/video");
const { success, error } = require("../utils/responseWrapper");
const getUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.send(error(404, "User not found form backend"));
    }
    return res.send(success(200, { user }));
  } catch (e) {
    console.log("this error is from getUser side ", e);
    return res.send(error(500, e.message));
  }
};
const getMyProfile = async (req, res) => {
  try {
    const id = req._id;
    const user = await User.findById(id);
    if (!user) {
      return res.send(error(404, "User not found"));
    }
    return res.send(success(200, { user }));
  } catch (e) {
    console.log("this error is from getUser side ", e);
    return res.send(error(500, e.message));
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  // in froent end add image as well
  const { name } = req.body;
  if (id !== req._id) {
    return res.send(error(403, "You can update only your account"));
  }
  if (!name) {
    return res.send(error(400, "Enter the name field"));
  }
  try {
    const userId = req._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.send(error(404, "User not found"));
    }
    user.name = name;
    await user.save();
    return res.send(success(200, { user }));
  } catch (e) {
    console.log("this error is from updateUser side ", e);
    return res.send(error(500, e.message));
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (id !== req._id) {
    return res.send(error(403, "You can delete only your account"));
  }
  try {
    const userId = req._id;
    const user = await User.findByIdAndDelete(userId);
    return res.send(success(200, "User has been deleted"));
  } catch (e) {
    console.log("this error is from updateUser side ", e);
    return res.send(error(500, e.message));
  }
};
const subscribeUser = async (req, res) => {
  const { idToSubsribe } = req.body;
  const user = await User.findById(req._id);
  if (user.subscribeUsers.includes(idToSubsribe)) {
    const index = user.subscribeUsers.indexOf(idToSubsribe);
    user.subscribeUsers.splice(index, 1);
    user.subscribers = user.subscribers - 1;
  } else {
    user.subscribeUsers.push(idToSubsribe);
    user.subscribers = user.subscribers + 1;
  }
  await user.save();
  return res.send(success(200, idToSubsribe));
};
const like = async (req, res) => {
  const { videoId } = req.body;
  const videotolike = await video.findById(videoId);
  if (!videotolike) {
    return res.send(error(404, "Video not found"));
  } else {
    if (videotolike.likes.includes(req._id)) {
      const index = videotolike.likes.indexOf(req._id);
      videotolike.likes.splice(index, 1);
      await videotolike.save();
    } else {
      videotolike.likes.push(req._id);
      await videotolike.save();
    }
    return res.send(success(200, req._id));
  }
};
const dislike = async (req, res) => {
  const { videoId } = req.body;
  const videotodislike = await video.findById(videoId);
  if (!videotodislike) {
    return res.send(error(404, "Video not found"));
  } else {
    if (videotodislike.dislikes.includes(req._id)) {
      const index = videotodislike.dislikes.indexOf(req._id);
      videotodislike.dislikes.splice(index, 1);
      await videotodislike.save();
    } else {
      videotodislike.dislikes.push(req._id);
      await videotodislike.save();
    }
    return res.send(success(200, req._id));
  }
};
module.exports = {
  getMyProfile,
  updateUser,
  getUser,
  deleteUser,
  subscribeUser,
  like,
  dislike,
};
