const express = require("express");

const { createSize, getSizes } = require("../controllers/sizeController");

const route = express.Router();

route.post("/", upload.single("avatar"), createSize);

module.exports = route;
