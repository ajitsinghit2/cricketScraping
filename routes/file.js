var express = require('express');
var router = express.Router();


var fileController = require('../controllers/fileController');

router.get('/download/:filename',fileController.download);


module.exports = router;