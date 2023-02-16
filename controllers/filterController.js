const catchAsync = require("../middlewares/catchAsync");
const Category = require("../models/Category");
const Color = require("../models/Color");
const Size = require("../models/Size");

exports.getFilters = catchAsync(async (req, res) => {
  const categories = await Category.find({});
  const colors = await Color.find({});
  const sizes = await Size.find({}).sort({ sizeName: 1 });

  res.status(200).json({
    success: true,
    data: {
      categories,
      colors,
      sizes,
    },
  });
});
