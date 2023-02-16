const express = require("express");

const {
  login,
  register,
  getProfile,
  refreshToken,
  updateProfile,
} = require("../controllers/authController");

const route = express.Router();

route.post("/login", login);
route.post("/register", register);
route.patch("/me", updateProfile);
route.get("/me", getProfile);
route.post("/refresh-token", refreshToken);

module.exports = route;
