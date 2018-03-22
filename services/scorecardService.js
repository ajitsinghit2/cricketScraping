'use strict';

var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');

var summary = require('../models/summary');
var counter = 1;
var allMatchesSummary = [];
var fileController = require('../controllers/fileController');


function parseBattingSection(battingSection) {

    battingSection.find('.flex-row').each(function(i, elem) {
        console.log("here");
        var $ = cheerio.load(this);
        console.log($(this).find('div.wrap div.batsmen').text());
        console.log($(this).find('div.runs').text());
       // console.log( $(this).find('.runs').length);
        //$(this).find('.runs')
        //$(this).find

        //parse batting card

        //parse total batting
        //parse yet to bat
        //parse fall of wickets
    });

}

function parseBowlingSection(){

}

function populateInnings(scorecard){
    var battingSection = scorecard.find('div.scorecard-section');
    parseBattingSection(battingSection);
    parseBowlingSection();
}


function parseScorecard(html) {
    var $ = html;
    var match =[];

    $('article.sub-module.scorecard').each(function(i, elem) {
        console.log("Innings "+ i);
        match.push(populateInnings( $(this)));
    });

    return match;
}


function scoreCardHTML(matchNo, cb) {
    var url = 'http://stats.espncricinfo.com/ci/engine/match/244510.html';
    console.log(url);
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var matchData = parseScorecard($);
        }
        //send data in callback
        cb(matchNo, null, matchData);
    });

}

exports.scrapScorecard= function(totalPages, outputFilename) {

    var finished = _.after(totalPages, fileController.writeToFile);

    scoreCardHTML(1,  callBackMethod);

    function callBackMethod(pageNo, err, data) {

        if (data!=undefined || data.length > 0) {
            console.log(data);
            allMatchesSummary.push(data);
        }
        else
            console.log("Nothing to show for Page: " + pageNo);

        finished(allMatchesSummary, outputFilename);
    }
}
