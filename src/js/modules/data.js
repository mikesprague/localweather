import axios from 'axios';
import * as defaults from './defaults';
import { hideLoading, renderAppWithData, showLoading } from './ui';
import { useCache, getData, setData } from './cache';

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
    const locationData = await axios.get(url)
      .then((response) => {
        setData(defaults.locationDataKey, response.data);
        const fullLocationName = response.data.results[0].formatted_address;
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
  const weatherData = await axios.get(url)
    .then((response) => {
      setData(defaults.weatherDataKey, response.data);
      return response.data;
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
