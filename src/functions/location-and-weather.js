const bugsnag = require('@bugsnag/js');
const rp = require('request-promise');

exports.handler = (event, context, callback) => {
  const bugsnagClient = bugsnag(process.env.BUGSNAG_KEY);
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
      const addressTargets = ['neighborhood', 'locality', 'administrative_area_level_2', 'administrative_area_level_1'];
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
    .catch((err) => {
      console.log(err);
      callback(bugsnagClient.notify(err), {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(err),
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
    .catch((err) => {
      console.log(err);
      callback(bugsnagClient.notify(err), {
        statusCode: 500,
        headers: callbackHeaders,
        body: JSON.stringify(err),
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
  }).catch((err) => {
    console.log(err);
    callback(bugsnagClient.notify(err), {
      statusCode: 500,
      headers: callbackHeaders,
      body: JSON.stringify(err),
    });
  });
};
