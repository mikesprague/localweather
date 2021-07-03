const axios = require('axios');
const Bugsnag = require('@bugsnag/js');

Bugsnag.start({ apiKey: process.env.BUGSNAG_API_KEY });

exports.handler = async (event, context, callback) => {
  const { lat, lng, time, healthcheck } = event.queryStringParameters || null;
  const callbackHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (healthcheck) {
    return {
      headers: callbackHeaders,
      statusCode: 200,
      body:  JSON.stringify('API is up and running'),
    };
  }

  if (!lat) {
    return {
      headers: callbackHeaders,
      statusCode: 400,
      body:  JSON.stringify('Missing "lat" parameter'),
    };
  }
  if (!lng) {
    return {
      headers: callbackHeaders,
      statusCode: 400,
      body:  JSON.stringify('Missing "lng" parameter'),
    };
  }

  const {
    GOOGLE_MAPS_API_KEY,
    DARK_SKY_API_KEY,
    // OPEN_WEATHERMAP_API_KEI,
  } = process.env;

  const units = event.queryStringParameters.units || 'auto';
  const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const weatherApiUrl = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lng}${time ? ',' + time : ''}/?units=${units}`;
  // const openWeatherMapApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&&units=${units}&appid=${OPEN_WEATHERMAP_API_KEI}`;

  const geocodePromise = await axios.get(geocodeApiUrl)
    .then((response) => {
      const fullResults = response.data.results;
      const formattedAddress = fullResults[0].formatted_address;
      let locationName = '';
      const isUSA = formattedAddress.toLowerCase().includes('usa');
      const addressTargets = ['postal_town', 'locality', 'neighborhood', 'administrative_area_level_2', 'administrative_area_level_1', 'country'];
      addressTargets.forEach((target) => {
        if (!locationName.length) {
          fullResults.forEach((result) => {
            if (!locationName.length) {
              result.address_components.forEach((component) => {
                if (!locationName.length && component.types.indexOf(target) > -1) {
                  locationName = component.long_name;
                }
              });
            }
          });
        }
      });
      fullResults[0].address_components.forEach((component) => {
        if (isUSA && component.types.indexOf('administrative_area_level_1') > -1) {
          locationName = `${locationName}, ${component.short_name}`;
        }
        if (!isUSA && component.types.indexOf('country') > -1) {
          locationName = `${locationName}, ${component.short_name}`;
        }
      });
      // console.log(locationName);
      const locationData = {
        location: {
          locationName,
          formattedAddress,
          fullResults,
        },
      };
      return locationData;
    })
    .catch((err) => {
      console.log(err);
      return {
        headers: callbackHeaders,
        statusCode: 500,
        body: JSON.stringify(err),
      };
    });

  const weatherPromise = await axios.get(weatherApiUrl)
    .then((response) => {
      const weatherData = {
        weather: response.data,
      };
      return weatherData;
    })
    .catch((err) => (
      {
        headers: callbackHeaders,
        statusCode: 500,
        body: JSON.stringify(err),
      }
    ));

  return {
    headers: callbackHeaders,
    statusCode: 200,
    body: JSON.stringify({
      location: geocodePromise.location,
      weather: weatherPromise.weather,
    }),
  };
};
