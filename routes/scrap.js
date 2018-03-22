var express = require('express');
var router = express.Router();

var scrapController = require('../controllers/scrapController');

router.get('/ODI', scrapController.scrapODI);
router.get('/TEST', scrapController.scrapTest);
router.get('/T20', scrapController.scrapT20);
router.get('/scorecard', scrapController.scrapScorecard);





module.exports = router;