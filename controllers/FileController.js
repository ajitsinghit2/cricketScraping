'use strict';

var fs = require('fs');
var path = require('path');


exports.writeToFile = function (json, fileName) {

    fs.writeFile("output/" + fileName + '.json', JSON.stringify(json, null, 4), function (err) {
        if (!err)
            console.log('File successfully written! - Check your project directory for the ' + fileName + '.json file: ');
        else
            console.log('Error writing to file');
    })
}


exports.download = function (req, res) {

    var file = path.resolve('./output') + '/' + req.params.filename;
    res.download(file);
}