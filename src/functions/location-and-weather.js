const bugsnag = require('@bugsnag/js');
const FunctionShield = require('@puresec/function-shield');
const rp = require('request-promise');

const bugsnagClient = bugsnag(process.env.BUGSNAG_KEY);
FunctionShield.configure({
  policy: {
    outbound_connectivity: 'alert',
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

  const units = event.queryStringParameters.units || 'auto';
  const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const weatherApiUrl = `https://api.darksky.net/forecast/${process.env.DARK_SKY_KEY}/${lat},${lng}/?units=${units}`;

  const geocodeOptions = {
    uri: geocodeApiUrl,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  const geocodePromise = rp(geocodeOptions)
    .then((response) => {
      const fullResults = response.results;
      const formattedAddress = response.results[0].formatted_address;
      let locationName = '';
      const addressTargets = ['neighborhood', 'locality', 'administrative_area_level_1'];
      addressTargets.map((target) => {
        if (!locationName.length) {
          response.results.map((result) => {
            if (!locationName.length) {
              result.address_components.map((component) => {
                if (!locationName.length && component.types.indexOf(target) > -1) {
                  locationName = component.long_name;
                }
              });
            }
          });
        }
      });
      if (locationName.length) {
        // console.log(locationName);
        const locationData = {
          location: {
            locationName,
            formattedAddress,
            fullResults,
          },
        };
        return locationData;
      }
    })
    .catch((error) => {
      // console.error(error);
      callback(bugsnagClient.notify(error), {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(error),
      });
    });

  const weatherOptions = {
    uri: weatherApiUrl,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true,
  };
  const weatherPromise = rp(weatherOptions)
    .then((response) => {
      const weatherData = {
        weather: response,
      };
      return weatherData;
    })
    .catch((error) => {
      // console.error(error);
      callback(bugsnagClient.notify(error), {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(error),
      });
    });

  Promise.all(
    [geocodePromise, weatherPromise],
  ).then((response) => {
    callback(null, {
      statusCode: 200,
      headers: callbackHeaders,
      body: JSON.stringify(response),
    });
  }).catch((error) => {
    // console.error(error);
    callback(bugsnagClient.notify(error), {
      statusCode: 500,
      headers: callbackHeaders,
      body: JSON.stringify(error),
    });
  });
};
