const express = require('express');
const { translate } = require('../controllers/translateController');

const route = express.Router();

route.post('/', translate);

module.exports = route;
