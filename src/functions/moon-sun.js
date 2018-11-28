"use strict";

const request = require("request");
const rp = require("request-promise");
const bugsnag = require("bugsnag");

bugsnag.register(`${process.env.BUGSNAG_KEY}`);

exports.handler = function(event, context, callback) {
  const lat = event.queryStringParameters.lat;
  const lng = event.queryStringParameters.lng;
  const tz = event.queryStringParameters.tz || "-4";
  const callbackHeaders = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (!lat) {
    callback(null, {
      statusCode: 400,
      headers: callbackHeaders,
      body: "Missing 'lat' parameter",
    });
  }
  if (!lng) {
    callback(null, {
      statusCode: 400,
      headers: callbackHeaders,
      body: "Missing 'lng' parameter",
    });
  }
  const apiUrlToCall = `https://api.usno.navy.mil/rstt/oneday?date=today&id=LWio&tz=${tz}&coords=${lat},${lng}`;
  const rpOptions = {
    uri: apiUrlToCall,
    headers: {
        "User-Agent": "Request-Promise"
    },
    insecure: true,
    json: true,
    rejectUnauthorized: false,
    strictSSL: false
  };
  rp(rpOptions)
  .then(body => {
    callback(null, {
      statusCode: 200,
      headers: callbackHeaders,
      body: JSON.stringify(body),
    });
  })
  .catch(err => {
    callback(bugsnag.notify(new Error(err)), {
      statusCode: 500,
      headers: callbackHeaders,
      body: JSON.stringify(err),
    });
  });
};
