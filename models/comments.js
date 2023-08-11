const mongoose = require("mongoose");
const commnetsSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    videoId: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("commentsYt", commnetsSchema);
