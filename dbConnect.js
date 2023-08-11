const mongoose = require("mongoose");
module.exports = async () => {
  const mongoURL = `mongodb+srv://meenakshi:${process.env.DATABASE_KEY}@cluster0.4g5xdvl.mongodb.net/?retryWrites=true&w=majority`;
  try {
    const connect = await mongoose.connect(mongoURL);
    console.log(`mongodb connected ${connect.connection.host}`);
  } catch (e) {
    console.log("error:mongodb connection side", e);
    process.exit(1);
  }
};
