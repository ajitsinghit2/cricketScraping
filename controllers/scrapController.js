'use strict';

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var summary = require('../models/summary');
var _ = require('lodash');
var counter = 1;
var allMatchesSummary = [];


function writeToFile(json, fileName) {

    fs.writeFile(fileName + '.json', JSON.stringify(json, null, 4).replace(/]|[[]/g, ''), function (err) {
        if (!err)
            console.log('File successfully written! - Check your project directory for the ' + fileName + '.json file: ');
        else
            console.log('Error writing to file');
    })
}

function getURL(type, pageNo) {

    var urlODI = 'http://stats.espncricinfo.com/ci/engine/stats/index.html?class=2;page=' + pageNo + ';template=results;type=aggregate;view=results';
    var urlTest = 'http://stats.espncricinfo.com/ci/engine/stats/index.html?class=1;page=' + pageNo + ';template=results;type=aggregate;view=results';
    var urlT20 = 'http://stats.espncricinfo.com/ci/engine/stats/index.html?class=3;page=' + pageNo + ';template=results;type=aggregate;view=results';

    if (type == 1)
        return urlODI;
    else if (type == 2)
        return urlTest;
    else
        return urlT20;
}

function ScrapSummary(pageNo, type, cb) {

    var url = getURL(type, pageNo);

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var json = [];

            $('table.engineTable').eq(2).filter(function () {
                var rows = $(this).find("tr");
                var index = 1;
                if (rows.length > 1) {
                    rows.not("thead tr").each(function () {
                        var match = new summary();
                        var row = $(this);
                        var matchBetween = $(row).find("td").eq(5).text();

                        match.team1 = matchBetween.split("v")[0];
                        match.team2 = matchBetween.split("v")[1];
                        match.winner = $(row).find("td").eq(0).text();
                        match.margin = $(row).find("td").eq(2).text();
                        match.ballsLeft = $(row).find("td").eq(3).text();
                        match.date = $(row).find("td").eq(7).text();
                        match.matchNumber = counter;
                        match.groundId = $("#engine-dd" + index + " ul li:nth-child(1) a").attr("href");
                        match.scoreCardId = $("#engine-dd" + index + " ul li:nth-child(3) a").attr("href");
                        counter++;
                        index++;
                        json.push(match);
                    });
                }
            })
        }
        //send data in callback
        cb(pageNo, null, json);
    });
}


exports.scrapODI = function (req, res) {
    var totalPages = 81;
    var finished = _.after(totalPages, writeToFile);

    for (var i = 1; i <= totalPages; i++)
        ScrapSummary(i, 1, callBackMethod);

    function callBackMethod(pageNo, err, data) {

        if (data.length > 0) {
            console.log(data);
            allMatchesSummary.push(data);
        }
        else
            console.log("Nothing to show for Page: " + pageNo);

        finished(allMatchesSummary, "ODISummary");
    }

    res.send('Output stored in test file!');
};

exports.scrapTest = function (req, res) {
    var totalPages = 46;
    var finished = _.after(totalPages, writeToFile);

    for (var i = 1; i <= totalPages; i++)
        ScrapSummary(i, 2, callBackMethod);

    function callBackMethod(pageNo, err, data) {

        if (data.length > 0) {
            console.log(data);
            allMatchesSummary.push(data);
        }
        else
            console.log("Nothing to show for Page: " + pageNo);

        finished(allMatchesSummary, "TestSummary");
    }

    res.send('Output stored in test file!');
};


exports.scrapT20 = function (req, res) {
    var totalPages = 13;
    var finished = _.after(totalPages, writeToFile);

    for (var i = 1; i <= totalPages; i++)
        ScrapSummary(i, 3, callBackMethod);

    function callBackMethod(pageNo, err, data) {

        if (data.length > 0) {
            console.log(data);
            allMatchesSummary.push(data);
        }
        else
            console.log("Nothing to show for Page: " + pageNo);

        finished(allMatchesSummary, "T20Summary");
    }

    res.send('Output stored in test file!');
};


