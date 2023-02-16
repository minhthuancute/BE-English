const catchAsync = require("../middlewares/catchAsync");
const Category = require("../models/Category");

exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json({
    success: true,
    data: categories,
  });
});

exports.createCategory = catchAsync(async (req, res) => {
  const { categoryName } = req.body;
  const category = await Category.create({ categoryName });
  res.status(200).json({
    success: true,
    data: category,
  });
});
