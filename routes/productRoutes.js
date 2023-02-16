const express = require("express");
const {
  createProduct,
  getProductByID,
  getProductsQuery,
  getProducts,
  likeProduct,
} = require("../controllers/productController");
const upload = require("../middlewares/upload");
const route = express.Router();

route.post("/query", getProductsQuery);
route.post("/test-query", getProducts);
route.post("/like", likeProduct);
route.post("/", upload.array("imgs", 3), createProduct);

route.get("/:id", getProductByID);

module.exports = route;
