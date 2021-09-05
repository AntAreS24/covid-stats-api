const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const router = express.Router();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let cacheVaccination = {};
let cacheCase = {};

const parseDate = (dateString) => {
  var parts = dateString.split(" ");
  // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  return new Date(2000 + parseInt(parts[2]), months.indexOf(parts[1]), parts[0]);
};

const parseNumber = (numberString) => {
  let result = parseInt(numberString.replace(/,/g, ""));
  return result ? result : 0;
};

const getFormattedDate = (date) => {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return year + "/" + month + "/" + day;
};

module.exports = function (logger) {
  /* GET daily vaccinations. */
  router.get("/vaccinations/", function (req, res, next) {
    console.log("[covid/vaccinations](get) Request received");
    if (cacheVaccination[getFormattedDate(new Date())]) {
      console.log("[covid/vaccinations](get) Entry found in cacheVaccination.");
      res.send(cacheVaccination[getFormattedDate(new Date())]);
    } else {
      let url = "https://covidlive.com.au/report/daily-vaccinations/nsw";

      // The structure of our request call
      // The first parameter is our URL
      // The callback function takes 3 parameters, an error, response status code and the html
      request(url, function (error, response, html) {
        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
          // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
          var $ = cheerio.load(html);
          const result = $(".DAILY-VACCINATIONS tbody tr")
            .map((i, element) => ({
              date: parseDate($(element).find("td.DATE").text().trim()),
              dose: parseNumber($(element).find("td.DOSES").text().trim()),
              net: parseNumber($(element).find("td.NET span").text().trim()),
            }))
            .get();
          // The first element is the header.
          result.splice(0, 1);
          // console.log(JSON.stringify(result))

          const maxDate = Math.max(...result.map((e) => e.date));
          if (getFormattedDate(new Date(maxDate)) === getFormattedDate(new Date())) {
            console.log("[covid/vaccinations](get) Creating new entry in cacheVaccination.");
            cacheVaccination[getFormattedDate(new Date())] = result;
          } else {
            console.log("[covid/vaccinations](get) Still yesterday's result.");
          }

          // Send the JSON as a response to the client
          res.send(result);
        } else {
          console.error("[covid/vaccinations](get) error occured:", error);
          next(error);
        }
      });
    }
    console.log("[covid/vaccinations](get) Done.");
  });

  /**
   * Gets the daily cases in NSW
   */
  router.get("/cases", function (req, res, next) {
    console.log("[covid/cases](get) Request received");
    if (cacheCase[getFormattedDate(new Date())]) {
      console.log("[covid/cases](get) Entry found in cacheCase.");
      res.send(cacheCase[getFormattedDate(new Date())]);
    } else {
      let url = "https://covidlive.com.au/report/daily-cases/nsw";

      // The structure of our request call
      // The first parameter is our URL
      // The callback function takes 3 parameters, an error, response status code and the html
      request(url, function (error, response, html) {
        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
          // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
          var $ = cheerio.load(html);
          const result = $(".DAILY-CASES tbody tr")
            .map((i, element) => ({
              date: parseDate($(element).find("td.DATE").text().trim()),
              new: parseNumber($(element).find("td.NEW").text().trim()),
              cases: parseNumber($(element).find("td.CASES").text().trim()),
              net: parseNumber($(element).find("td.NET span").text().trim()),
            }))
            .get();
          // The first element is the header.
          result.splice(0, 1);
          // console.log(JSON.stringify(result))

          const maxDate = Math.max(...result.map((e) => e.date));
          if (getFormattedDate(new Date(maxDate)) === getFormattedDate(new Date())) {
            console.log("[covid/cases](get) Creating new entry in cacheCase.");
            cacheCase[getFormattedDate(new Date())] = result;
          } else {
            console.log("[covid/cases](get) Still yesterday's result.");
          }

          // Send the JSON as a response to the client
          res.send(result);
        } else {
          console.error("[covid/cases](get) error occured:", error);
          next(error);
        }
      });
    }
    console.log("[covid/cases](get) Done.");
  });
  return router;
};
