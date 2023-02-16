const catchAsync = require("../middlewares/catchAsync");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");

exports.uploadAvtar = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const token = req.headers.authorization.split(" ")[1];
  const client = jwt.verify(token, process.env.JWT_SECRET);

  if (!req.file) {
    throw new ApiError(400, "You must select avatar.");
  }
  const avatarUrl = `/file/${req.file.filename}`;
  const user = await User.findById(userId);
  if (client.email !== user.email) {
    throw new ApiError(401, " Unauthorize");
  }
  user.avatar = avatarUrl;
  await user.save();
  return res.status(200).json({
    success: true,
    avatarUrl,
  });
});
