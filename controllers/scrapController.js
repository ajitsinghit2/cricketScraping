'use strict';

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var summary = require('../models/summary');
var _ = require('lodash');

var output;

function writeToFile(json, year) {

    fs.writeFile('output.json', JSON.stringify(json, null, 4).replace(/]|[[]/g, ''), function (err) {
        if (!err)
            console.log('File successfully written! - Check your project directory for the output.json file: ' + year);
        else
            console.log('Error writing to file');
    })
}


function ScrapSummaryBasedOnTeamAndYear(teamNo, year, type, cb) {

    var url = 'http://stats.espncricinfo.com/ci/engine/records/team/match_results.html?class=2;id=' + year + ';team=' + teamNo + ';type=year';
 
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var json = [];

            $('table.engineTable').first().filter(function () {
                var rows = $(this).find("tr");
                if (rows.length > 1) {
                    rows.not("thead tr").each(function () {
                        var match = new summary();
                        var row = $(this);
                        match.team1 = $(row).find("td").eq(0).text();
                        match.team2 = $(row).find("td").eq(1).text();
                        match.winner = $(row).find("td").eq(2).text();
                        match.margin = $(row).find("td").eq(3).text();
                        match.date = $(row).find("td").eq(5).text();
                        match.number = $(row).find("td").eq(6).text();

                        json.push(match);
                    });
                }
            })
        }
        //send data in callback
        cb(year, null, json);
    });
}


exports.scrapper = function (req, res) {

    var startYear = 1950;
    var endYear = 2018

    var allMatchesSummaryForTeam = [];
    var finished = _.after(endYear-startYear, writeToFile);

    for (var i = 1950; i < 2018; i++) {
        ScrapSummaryBasedOnTeamAndYear(7, i, 1, callBackMethod);
    }



    function callBackMethod(year, err, data) {

        if (data.length > 0) {
            console.log("year:" + year);
            console.log(data);
            allMatchesSummaryForTeam.push(data);
        }
        else
            console.log("Nothing to show for year: " + i);

        finished(allMatchesSummaryForTeam, i);
    }

    res.send('Output stored in test file!');


};