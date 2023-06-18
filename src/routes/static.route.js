const express = require('express');
const StaticController = require('../controllers/StaticController');
const router = express.Router();

// Router Controller
// Router GUI
router.get('/', [StaticController.getUI]);

module.exports = router;
