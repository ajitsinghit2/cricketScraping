'use strict';

var summaryService = require('../services/summaryService');
var scorecardService = require('../services/scorecardService');

exports.scrapODI = function (req, res) {
    var totalPages = 81;
    summaryService.scrapSummary(totalPages, "ODISummary", 1);
    res.send('Output stored in test file!');
};

exports.scrapTest = function (req, res) {
    var totalPages = 46;
    summaryService.scrapSummary(totalPages, "TestSummary", 2);
    res.send('Output stored in test file!');
};

exports.scrapT20 = function (req, res) {
    var totalPages = 13;
    summaryService.scrapSummary(totalPages, "T20Summary", 3);
    res.send('Output stored in test file!');
};

exports.scrapScorecard = function(req, res){
    var pages =1;
    scorecardService.scrapScorecard(pages, "test scorecard");
    res.send("testing scorecard");

}

