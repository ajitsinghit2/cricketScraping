var express = require('express');
var router = express.Router();


var fileController = require('../controllers/FileController');

router.get('/download/:filename',fileController.download);


module.exports = router;