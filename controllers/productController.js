const catchAsync = require("../middlewares/catchAsync");
const Product = require("../models/Product");

const ApiError = require("../utils/ApiError");

exports.createProduct = catchAsync(async (req, res) => {
  const {
    name,
    category,
    colors,
    description,
    price,
    rating,
    size,
    type,
    badge,
  } = req.body;
  const isExistedProduct = await Product.findOne({ name });
  if (isExistedProduct) {
    throw new ApiError(400, "Product is existed");
  }

  const imgUrls = req.files.map((val) => {
    return `/api/v1/file/${val.filename}`;
  });

  const product = await Product.create({
    name,
    category,
    colors,
    description,
    imgs: imgUrls,
    price,
    rating,
    size,
    type,
    badge,
  });
  const products = await Product.find({});

  res.status(200).json({
    success: true,
    data: product,
  });
});

// test get product
exports.getProducts = catchAsync(async (req, res) => {
  const { name, categories, price, colors, size, email } = req.body;
  // {name: "Jordan", category: {$in: ["Slippers"]}, colors: {$in: ["red"]}, price: {$lte: 500}, size: {$eq: 45}}

  const query = {};

  if (name) {
    const regex = new RegExp(name, "gi");
    console.log("regex", regex);
    query.name = { $in: [regex] };
  }
  if (categories.length) {
    query.category = { $in: categories };
  }
  if (price) {
    query.price = { $lte: price };
  }
  if (colors.length) {
    query.colors = { $in: colors };
  }
  if (size) {
    query.size = { $eq: size };
  }

  // const query = {
  //   name,
  //   category: { $in: category },
  //   colors: { $in: colors },
  //   price: { $lte: price },
  //   size: { $eq: size },
  // };

  Product.find(query)
    .select("-createdAt -updatedAt -__v")
    .populate("userLiked", "email")
    .exec((err, data) => {
      if (err) {
        throw new ApiError(400, err.message);
      }
      if (email) {
        const filter = data.filter((val) => {
          const emailUsers = val.userLiked.map((user) => user.email);
          return emailUsers.includes(email);
        });
        return res.status(200).json({
          success: true,
          data: filter,
        });
      }
      res.status(200).json({
        success: true,
        data,
      });
    });
});

exports.getProductsQuery = catchAsync(async (req, res) => {
  const { name, categories, price, colors, size } = req.body;
  // {name: "Jordan", category: {$in: ["Slippers"]}, colors: {$in: ["red"]}, price: {$lte: 500}, size: {$eq: 55}}

  const query = {};
  if (name) {
    const regex = new RegExp(name, "gi");
    query.name = { $in: [regex] };
  }
  if (categories.length) {
    query.category = { $in: categories };
  }
  if (price) {
    query.price = { $lte: price };
  }
  if (colors.length) {
    query.colors = { $in: colors };
  }
  if (size) {
    query.size = { $eq: size };
  }
  // const query = {
  //   name,
  //   category: { $in: category },
  //   colors: { $in: colors },
  //   price: { $lte: price },
  //   size: { $eq: size },
  // };

  const product = await Product.find(query).select(
    "-createdAt -updatedAt -__v"
  );

  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.getProductByID = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).select(
    "-createdAt -updatedAt -__v"
  );
  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.likeProduct = catchAsync(async (req, res) => {
  const { userID, productID } = req.body;
  const product = await Product.findById(productID);
  if (product.userLiked.includes(userID)) {
    product.userLiked.pop(userID);
  } else {
    product.userLiked.push(userID);
  }
  await product.save();
  res.status(200).json({
    success: true,
  });
});
