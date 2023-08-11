const user = require("../models/user");
const video = require("../models/video");
const { success, error } = require("../utils/responseWrapper");
const getVideo = async (req, res) => {
  // video of a particular id
  try {
    const { videoId } = req.body;
    const Video = await video.findById(videoId);
    return res.send(success(200, { Video }));
  } catch (e) {
    console.log("error from getvideo of a particular id side ", e);
  }
};
const addView = async (req, res) => {
  try {
    const videoview = await video.findById(req.params.id);
    videoview.views += 1;
    await video.save();
    return res.send(success(200, "views has been updated"));
  } catch (e) {
    console.log("error from addview side ", e);
  }
};
const randomvideos = async (req, res) => {
  try {
    // sample is used to generate random documents. the size will be 40 over here
    const Video = await video.aggregate([{ $sample: { size: 40 } }]);
    return res.send(success(200, { Video }));
  } catch (e) {
    console.log("error from randomvideos side ", e);
  }
};
const trendingVideos = async (req, res) => {
  try {
    const Video = await video.find().sort({ views: -1 });
    return res.send(success(200, { Video }));
  } catch (e) {
    console.log("error from trendingvideo side ", e);
  }
};
const subscribeVideos = async (req, res) => {
  try {
    const User = await user.findById(req._id);
    const subscribeUsers = User.subscribeUsers;
    const list = await Promise.all(
      subscribeUsers.map((channelId) => {
        return video.find({ userId: channelId });
      })
    );
    const Video = list.flat().sort((a, b) => b.createdAt - a.createdAt);
    return res.send(success(200, { Video }));
  } catch (e) {
    console.log("error from subscibevideo side ", e);
  }
};
const getByTags = async (req, res) => {
  const tags = req.query.tags.split(",");
  try {
    const tagVideo = await video.find({ tags: { $in: tags } }).limit(20);
    return res.send(success(200, { tagVideo }));
  } catch (e) {
    console.log("error from getByTags side ", e);
  }
};
const search = async (req, res) => {
  try {
    const query = req.query.q;
    // options will make uppercase and lowercase same means ES===es
    const searchvideo = await video
      .find({ title: { $regex: query, $options: "i" } })
      .limit(20);
    return res.send(success(200, { searchvideo }));
  } catch (e) {
    console.log("error from search side ", e);
  }
};
const addVideo = async (req, res) => {
  const newVideo = new video({ userId: req._id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    return res.send(success(200, { savedVideo }));
  } catch (e) {
    console.log("error from newvideo side ", e);
  }
};
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (id != req._id) {
      return res.send(error(403, "only user can update the video"));
    }
    const video = await video.findById(id);
    if (!video) {
      return res.send(error(404, "video not found"));
    }
    const updatedVideo = await video.findByIdAndUpdate(id, {
      $set: req.body,
    });
    await updatedVideo.save();
    return res.send(success(200, updatedVideo));
  } catch (e) {
    console.log("error from updateVideo side ", e);
  }
};
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (id != req._id) {
      return res.send(error(403, "only user can delete the video"));
    }
    const video = await video.findByIdAndDelete(id);
    return res.send(success(200, "the video is deleted"));
  } catch (e) {
    console.log("error from deleteVideo side ", e);
  }
};

module.exports = {
  addVideo,
  getVideo,
  updateVideo,
  deleteVideo,
  addView,
  trendingVideos,
  randomvideos,
  subscribeVideos,
  getByTags,
  search,
};
