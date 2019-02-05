const bugsnag = require('@bugsnag/js');
const AWS = require('aws-sdk');
const FunctionShield = require('@puresec/function-shield');
const rp = require('request-promise');

const bugsnagClient = bugsnag(process.env.BUGSNAG_KEY);
FunctionShield.configure({
  policy: {
    outbound_connectivity: 'block',
    read_write_tmp: 'block',
    create_child_process: 'block',
    read_handler: 'block',
  },
  token: process.env.FUNCTION_SHIELD_TOKEN,
});

exports.handler = (event, context, callback) => {
  const { lat, lng } = event.queryStringParameters;
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (!lat) {
    callback(null, {
      statusCode: 400,
      headers: callbackHeaders,
      body: 'Missing "lat" parameter',
    });
  }
  if (!lng) {
    callback(null, {
      statusCode: 400,
      headers: callbackHeaders,
      body: 'Missing "lng" parameter',
    });
  }

  const apiUrlToCall = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const rpOptions = {
    uri: apiUrlToCall,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  rp(rpOptions)
    .then((body) => {
      callback(null, {
        statusCode: 200,
        headers: callbackHeaders,
        body: JSON.stringify(body),
      });
    })
    .catch((err) => {
      callback(bugsnagClient.notify(err), {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(err),
      });
    });
};
