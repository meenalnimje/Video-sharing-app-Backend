const express = require("express");
const app = express();
const dbConnect = require("./dbConnect");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config("./.env");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/comment", commentRoutes);
app.listen(8800, () => {
  dbConnect();
  console.log(`server started at ${8800}`);
});
