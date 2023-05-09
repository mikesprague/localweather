export const onRequestGet = async (context) => {
  const CACHE_NAME = 'localweather-io';
  const { request } = context;

  const cache = await caches.open(CACHE_NAME);
  const cachedData = await cache.match(request);

  if (cachedData) {
    console.log('🚀 using cached data!');

    const returnData = await cachedData.json();

    return new Response(JSON.stringify(returnData), cachedData);
  }

  console.log('😢 no cache, fetching new data');

  const { cf, url } = context.request;

  const urlParams = new URL(url).searchParams;

  const healthcheck = urlParams.get('healthcheck');
  let lat = urlParams.get('lat') || cf.latitude;
  let lng = urlParams.get('lng') || cf.longitude;
  const units = urlParams.get('units') || 'us';
  const time = urlParams.get('time');

  lat = parseFloat(lat).toFixed(5).toString();
  lng = parseFloat(lng).toFixed(5).toString();

  if (healthcheck) {
    return new Response(JSON.stringify('API is up and running'), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { GOOGLE_MAPS_API_KEY, VISUAL_CROSSING_API_KEY } = context.env;

  const timeString = time ? `,${time}` : '';
  const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const weatherApiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lng}?key=${VISUAL_CROSSING_API_KEY}&unitGroup=${units}`;
  console.log(weatherApiUrl);
  const geocodePromise = await fetch(geocodeApiUrl)
    .then(async (response) => {
      const data = await response.json();
      // console.log(data);
      const fullResults = data.results;
      const formattedAddress = fullResults[0].formatted_address.replace(
        'Seneca Falls',
        'Seneca Moistens',
      );
      let locationName = '';
      const isUSA = formattedAddress.toLowerCase().includes('usa');
      const addressTargets = [
        'postal_town',
        'locality',
        'neighborhood',
        'administrative_area_level_2',
        'administrative_area_level_1',
        'country',
      ];

      addressTargets.forEach((target) => {
        if (!locationName.length) {
          fullResults.forEach((result) => {
            if (!locationName.length) {
              result.address_components.forEach((component) => {
                if (
                  !locationName.length &&
                  component.types.indexOf(target) > -1
                ) {
                  locationName = component.long_name;
                }
              });
            }
          });
        }
      });

      fullResults[0].address_components.forEach((component) => {
        if (
          isUSA &&
          component.types.indexOf('administrative_area_level_1') > -1
        ) {
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
    .catch((error) => {
      console.error(error);

      return new Response(JSON.stringify(error), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    });

  const weatherPromise = await fetch(weatherApiUrl)
    .then(async (response) => {
      const weather = await response.json();
      const weatherData = {
        weather,
      };

      return weatherData;
    })
    .catch((error) => {
      console.error(error);

      return new Response(JSON.stringify(error), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  // console.log(geocodePromise.location);

  const returnData = JSON.stringify({
    location: geocodePromise.location,
    weather: weatherPromise.weather,
  });

  const response = new Response(returnData, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=300, s-maxage=300',
    },
  });

  // cache data;
  context.waitUntil(cache.put(request, response.clone()));

  return response;
};
