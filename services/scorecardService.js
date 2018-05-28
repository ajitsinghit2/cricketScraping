'use strict';

var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');

var summary = require('../models/summary');
var counter = 1;
var allMatchesSummary = [];
var fileController = require('../controllers/fileController');
let inning = require('../models/innings');
let batsman = require('../models/batsman');
let PlayerCount = 11;

function parseBattingSection(battingSection) {

    let inningsTeam = new inning();
    battingSection.find('.flex-row').each(function(i, elem) {
        if(i<PlayerCount){
            var $ = cheerio.load(this);

            let batsmanStats = new batsman();
            batsmanStats.batsmanName = $(this).find('div.cell.batsmen').text();
        
            let stats = [];
            $(this).find('div.runs').each(function(i,elem){
                stats.push($(this).text());
            });
    
            batsmanStats.strikeRate = stats.pop();
            batsmanStats.six = stats.pop();
            batsmanStats.four = stats.pop();
            batsmanStats.ball = stats.pop();
            batsmanStats.minute = stats.pop();
            batsmanStats.run = stats.pop();
            inningsTeam.batsmans.push(batsmanStats);
            console.log(batsmanStats);
    }

       // console.log( $(this).find('.runs').length);
        //$(this).find('.runs')
        //$(this).find

        //parse batting card

        //parse total batting
        //parse yet to bat
        //parse fall of wickets
    });

    console.log(inningsTeam);

    return inningsTeam;

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
