import * as defaults from './defaults';
import { hideLoading, renderAppWithData, showLoading } from './ui';
import { useCache, getData, setData } from './cache';
import { init } from './init';

export function loadFromCache() {
  return useCache(getData(defaults.cacheTimeKey));
}

export function parseLocationNameFromFormattedAddress(address) {
  try {
    const cityPosition = address.split(',').length > 2 ? address.split(',').length - 3 : 0;
    return address.split(',')[cityPosition].trim();
  } catch (error) {
    /* eslint-disable no-undef */
    return bugsnagClient.notify(error); // defined in html page
    /* eslint-enable no-undef */
  }
}

export async function getLocationNameFromLatLng(lat, lng) {
  const url = `${defaults.apiUrl()}/location-name/?lat=${lat}&lng=${lng}`;
  if (loadFromCache()) {
    const cachedLocationName = getData(defaults.locationNameDataKey);
    try {
      defaults.locationName = cachedLocationName;
      return parseLocationNameFromFormattedAddress(cachedLocationName);
    } catch (error) {
      /* eslint-disable no-undef */
      bugsnagClient.notify(error); // defined in html page
      /* eslint-enable no-undef */
      return defaults.locationName;
    }
  } else {
    const locationData = fetch(url)
      .then((response) => {
        if (!response.ok) {
          /* eslint-disable no-undef */
          return bugsnagClient.notify(new Error(response)); // defined in html page
          /* eslint-enable no-undef */
        }
        return response.json();
      })
      .then((json) => {
        setData(defaults.locationDataKey, json);
        const fullLocationName = json.results[0].formatted_address;
        const shortLocationName = parseLocationNameFromFormattedAddress(fullLocationName);
        setData(defaults.locationNameDataKey, fullLocationName);
        defaults.locationName = fullLocationName;
        return shortLocationName;
      })
      .catch((error) => {
        /* eslint-disable no-undef */
        bugsnagClient.notify(error); // defined in html page
        /* eslint-enable no-undef */
      });
    return locationData;
  }
}

export async function getWeather(lat, lng) {
  const url = `${defaults.apiUrl()}/weather/?lat=${lat}&lng=${lng}`;
  if (loadFromCache()) {
    const cachedWeatherData = getData(defaults.weatherDataKey);
    return cachedWeatherData;
  }
  const weatherData = fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      /* eslint-disable no-undef */
      return bugsnagClient.notify(new Error(response)); // defined in html page
      /* eslint-enable no-undef */
    })
    .then((json) => {
      setData(defaults.weatherDataKey, json);
      return json;
    })
    .catch((error) => {
      /* eslint-disable no-undef */
      bugsnagClient.notify(error); // defined in html page
      /* eslint-enable no-undef */
      hideLoading();
    });
  return weatherData;
}

export async function getLocationAndPopulateAppData(lat, lng) {
  showLoading('... loading weather data ...');
  if (loadFromCache()) {
    try {
      const cachedLocationData = getData(defaults.locationDataKey);
      defaults.locationName = cachedLocationData.formatted_address;
      const cachedWeatherData = getData(defaults.weatherDataKey);
      renderAppWithData(cachedWeatherData);
    } catch (error) {
      /* eslint-disable no-undef */
      bugsnagClient.notify(error); // defined in html page
      /* eslint-enable no-undef */
      hideLoading();
    }
  } else {
    try {
      getLocationNameFromLatLng(lat, lng).then(() => {
        // console.log(name);
        getWeather(lat, lng).then((json) => {
          renderAppWithData(json);
        }).catch((error) => {
          /* eslint-disable no-undef */
          bugsnagClient.notify(error); // defined in html page
          /* eslint-enable no-undef */
        });
      }).catch((error) => {
        /* eslint-disable no-undef */
        bugsnagClient.notify(error); // defined in html page
        /* eslint-enable no-undef */
      });
    } catch (error) {
      /* eslint-disable no-undef */
      bugsnagClient.notify(error); // defined in html page
      /* eslint-enable no-undef */
      hideLoading();
    }
  }
}

export function checkIfDataUpdateNeeded() {
  if (!loadFromCache()) {
    init();
  }
}

export function initDataUpdateCheck() {
  if (defaults.timerHandle) {
    clearInterval(defaults.timerHandle);
  } else {
    clearInterval();
  }
  defaults.timerHandle = setInterval(() => {
    checkIfDataUpdateNeeded();
  }, 60000); // 10 minutes (10 * 6000 ms)
}
