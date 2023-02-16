const catchAsync = require("../middlewares/catchAsync");
const Cart = require("../models/Cart");

exports.getAllItem = catchAsync(async (req, res) => {
  const carts = await Cart.find({});

  res.status(200).json({
    success: true,
    data: carts,
  });
});

app.post("/api/v1/file", upload.single("avatar"), (req, res, next) => {
  if (!req.file) {
    throw new ApiError(400, "you must select a file.");
  }
  const imgUrl = `/api/v1/file/${req.file.filename}`;

  return res.status(200).json({
    imgUrl,
  });
});

app.post("/api/v1/files", upload.array("imgs", 50), (req, res, next) => {
  if (!req.files) {
    throw new ApiError(400, "you must select files.");
  }
  const imgUrl = `/api/v1/file/${req.files.filename}`;
  console.log("files", req.files);

  return res.status(200).json({
    imgUrl,
  });
});
