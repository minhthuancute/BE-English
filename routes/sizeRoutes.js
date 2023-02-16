const express = require("express");

const { createSize, getSizes } = require("../controllers/sizeController");

const route = express.Router();

route.post("/", createSize);
route.get("/", getSizes);

module.exports = route;
