const catchAsync = require("../middlewares/catchAsync");
const Size = require("../models/Size");

exports.getSizes = catchAsync(async (req, res) => {
  const sizes = await Size.find({}).sort({ sizeName: 1 });

  res.status(200).json({
    success: true,
    data: sizes,
  });
});

exports.createSize = catchAsync(async (req, res) => {
  const { sizeName } = req.body;
  const size = await Size.create({ sizeName });

  res.status(200).json({
    success: true,
    data: size,
  });
});
