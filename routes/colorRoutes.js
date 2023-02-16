const express = require("express");

const { createColor, getColors } = require("../controllers/colorController");

const route = express.Router();

route.post("/", createColor);
route.get("/", getColors);

module.exports = route;
