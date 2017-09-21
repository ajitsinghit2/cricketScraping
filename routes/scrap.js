var express = require('express');
var router = express.Router();

var scrapController = require('../controllers/scrapController');

router.get('/', scrapController.scrapper);

module.exports = router;