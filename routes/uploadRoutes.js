const express = require("express");
const { uploadAvtar } = require("../controllers/uploadController");
const upload = require("../middlewares/upload");

const route = express.Router();

route.post("/avatar/:userId?", upload.single("avatar"), uploadAvtar);

module.exports = route;
