'use strict';

var fs = require('fs');
var path = require('path');


exports.writeToFile = function(json, fileName) {

    fs.writeFile(fileName + '.json', JSON.stringify(json, null, 4), function (err) {
        if (!err)
            console.log('File successfully written! - Check your project directory for the ' + fileName + '.json file: ');
        else
            console.log('Error writing to file');
    })
}


exports.download = function (req, res){
    console.log(req.params.filename)
    var file = path.resolve('./') + '/'+req.params.filename;
    res.download(file);
}