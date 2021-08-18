const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const router = express.Router();
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const parseDate = (dateString) => {
  var parts = dateString.split(' ');
  // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  return new Date(2000 + parseInt(parts[2]), months.indexOf(parts[1]), parts[0]);
}

const parseNumber = (numberString) => {
  let result = parseInt(numberString.replace(/,/g, ''));
  return result ? result:0;
}


/* GET daily vaccinations. */
router.get('/vaccinations/', function (req, res, next) {
  console.log('[covid/vaccinations](get) Request received');
  let url = 'https://covidlive.com.au/report/daily-vaccinations/nsw';

  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  request(url, function (error, response, html) {

    // First we'll check to make sure no errors occurred when making the request
    if (!error) {

      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
      var $ = cheerio.load(html);
      const result = $(".DAILY-VACCINATIONS tbody tr").map((i, element) => ({
        date: parseDate($(element).find('td.DATE').text().trim()),
        dose: parseNumber($(element).find('td.DOSES').text().trim()),
        net: parseNumber($(element).find('td.NET span').text().trim())
      })).get();
      // The first element is the header.
      result.splice(0, 1);
      // console.log(JSON.stringify(result))

      // Send the JSON as a response to the client
      res.send(result);
    } else {
      console.error('[covid/vaccinations](get) error occured:', error);
      next(error);
    }

  });
  console.log('[covid/vaccinations](get) Done.');
});

/**
 * Gets the daily cases in NSW
 */
router.get('/cases', function (req, res, next) {
  console.log('[covid/cases](get) Request received');
  let url = 'https://covidlive.com.au/report/daily-cases/nsw';

  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  request(url, function (error, response, html) {

    // First we'll check to make sure no errors occurred when making the request
    if (!error) {

      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
      var $ = cheerio.load(html);
      const result = $(".DAILY-CASES tbody tr").map((i, element) => ({
        date: parseDate($(element).find('td.DATE').text().trim()),
        new: parseNumber($(element).find('td.NEW').text().trim()),
        cases: parseNumber($(element).find('td.CASES').text().trim()),
        net: parseNumber($(element).find('td.NET span').text().trim())
      })).get();
      // The first element is the header.
      result.splice(0, 1);
      // console.log(JSON.stringify(result))

      // Send the JSON as a response to the client
      res.send(result);
    } else {
      console.error('[covid/cases](get) error occured:', error);
      next(error);
    }

  });
  console.log('[covid/cases](get) Done.');

});


module.exports = router;
