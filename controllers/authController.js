const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { success, error } = require("../utils/responseWrapper");
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (e) {
    console.log("error from generateAccessToken side ", e);
  }
};
const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_KEY, {
      expiresIn: "1y",
    });
    return token;
  } catch (e) {
    console.log("error from generateRefreshToken side ", e);
  }
};
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.send(error(400, "All fields are required"));
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send(error(409, "User already exits"));
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashPassword,
    });
    await user.save();
    return res.send(success(200, "User created successfully"));
  } catch (e) {
    console.log("error ", e);
    return res.send(error(500, `this error is from signup side ${e}`));
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send(error(400, "All fields are required"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.send(error(404, "User not registered"));
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.send(error(403, "Incorrect password"));
    }
    // in this project jwt is access_token and we are sending user
    const accessToken = generateAccessToken({ _id: user._id });
    const refreshToken = generateRefreshToken({ _id: user._id });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, { accessToken }));
  } catch (e) {
    return res.send(error(500, `this error is from login side ${e}`));
  }
};
const refreshAccessToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.send(error(401, "Refresh token in cookie is required"));
  }
  const refreshToken = cookies.jwt;
  console.log("refresh token", refreshToken);
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });
    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log("this error is from refreshAccessToken side", e);
    return res.send(error(500, e.message));
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "user logged out"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const googleLogin = async (req, res) => {
  try {
    const { name, email, img } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const accessToken = generateAccessToken({ _id: user._id });
      const refreshToken = generateRefreshToken({ _id: user._id });
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return res.send(success(200, { accessToken }));
    } else {
      const user = new User({
        name,
        email,
        image: img,
        fromGoogle: true,
      });
      await user.save();
      const accessToken = generateAccessToken({ _id: user._id });
      const refreshToken = generateRefreshToken({ _id: user._id });
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return res.send(success(200, { accessToken }));
    }
  } catch (e) {
    console.log("this error is from googleLogin side", e);
  }
};
module.exports = {
  signup,
  login,
  googleLogin,
  logout,
  refreshAccessToken,
};
