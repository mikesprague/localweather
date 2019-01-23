const bugsnag = require('bugsnag').register(`${process.env.BUGSNAG_KEY}`);
const rp = require('request-promise');

exports.handler = (event, context, callback) => {
  const { lat, lng } = event.queryStringParameters;
  const units = event.queryStringParameters.units || 'auto';

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
  const apiUrlToCall = `https://api.darksky.net/forecast/${process.env.DARK_SKY_KEY}/${lat},${lng}/?units=${units}`;
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
      callback(bugsnag.notify(new Error(err)), {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(err),
      });
    });
};
