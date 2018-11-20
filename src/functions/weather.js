"use strict";

const request = require("request");
const rp = require("request-promise");
const bugsnag = require("bugsnag");

exports.handler = function(event, context, callback) {
  const lat = event.queryStringParameters.lat;
  const lng = event.queryStringParameters.lng;
  if (!lat) {
    callback(null, {
      statusCode: 400,
      body: "Missing 'lat' parameter",
    });
  }
  if (!lng) {
    callback(null, {
      statusCode: 400,
      body: "Missing 'lng' parameter",
    });
  }
  const apiUrlToCall = `https://api.darksky.net/forecast/${process.env.DARK_SKY_KEY}/${lat},${lng}/?&units=auto`;
  const rpOptions = {
    uri: apiUrlToCall,
    headers: {
        "User-Agent": "Request-Promise"
    },
    json: true
  };
  rp(rpOptions)
  .then(body => {
    callback(null, {
      statusCode: 200,
      body: body,
    });
  })
  .catch(err => {
    callback(bugsnag.notify(new Error(err)), {
      statusCode: 500,
      body: err,
    });
  });
};