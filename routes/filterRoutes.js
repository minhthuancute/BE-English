const express = require("express");

const { getFilters } = require("../controllers/filterController");

const route = express.Router();

route.get("/", getFilters);

module.exports = route;
