const express = require("express");
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");

const route = express.Router();

route.post("/", createCategory);
route.get("/", getCategories);

module.exports = route;
