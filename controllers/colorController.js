const catchAsync = require("../middlewares/catchAsync");
const Color = require("../models/Color");

exports.getColors = catchAsync(async (req, res) => {
  const colors = await Color.find({});
  res.status(200).json({
    success: true,
    data: colors,
  });
});

exports.createColor = catchAsync(async (req, res) => {
  const { colorName } = req.body;
  const color = await Color.create({ colorName });
  res.status(200).json({
    success: true,
    data: color,
  });
});
