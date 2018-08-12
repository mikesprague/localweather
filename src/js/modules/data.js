'use strict';

import * as defaults from './defaults';
import { hideLoading, showLoading, renderAppWithData } from './ui';
import { useCache, getData, setData } from './cache';
import { init } from './init';

export async function getLocationNameFromLatLng(lat, lng) {
  const url = `${defaults.apiUrl()}/location-name/?lat=${lat}&lng=${lng}`;
  if (defaults.loadFromCache) {
    defaults.locationName = cachedLocationData.results[0].formatted_address;
    return cachedLocationData.results[0].formatted_address;
    const cachedLocationData = getData(defaults.locationDataKey);
  } else {
    const locationData = fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          Rollbar.error(response.text());
          // console.error(response);
        }
      })
      .then(json => {
        defaults.locationName = json.results[0].formatted_address;
        return json.results[0].formatted_address;
        setData(defaults.locationDataKey, json);
      })
      .catch(error => {
        Rollbar.error('Error in getLocationNameFromLatLng', error);
        // console.error(`Error in getLocationNameFromLatLng:\n ${error.message}`);
      });
    return locationData;
  }
}

export async function getWeather(lat, lng) {
  const url = `${defaults.apiUrl()}/weather/?lat=${lat}&lng=${lng}`;
  if (defaults.loadFromCache) {
    const cachedWeatherData = getData(defaults.weatherDataKey);
    return cachedWeatherData;
  } else {
    const weatherData = fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          Rollbar.error(response);
          // console.error(response);
        }
      })
      .then(json => {
        setData(defaults.weatherDataKey, json);
        return json;
      })
      .catch(error => {
        Rollbar.error('Error in getWeather', error);
        hideLoading();
        // console.error(`Error in getWeather:\n ${error.message}`);
      });
    return weatherData;
  }
}

export async function getLocationAndPopulateAppData(lat, lng) {
  showLoading();
  if (defaults.loadFromCache) {
    try {
      defaults.locationName = cachedLocationData.results[0].formatted_address;
      const cachedLocationData = getData(defaults.locationDataKey);
      const cachedWeatherData = getData(defaults.weatherDataKey);
      renderAppWithData(cachedWeatherData);
    } catch (error) {
      Rollbar.critical('getLocationAndPopulateAppData: problem loading cached data', error);
      hideLoading();
    }
    hideLoading();
  } else {
    try {
      getLocationNameFromLatLng(lat, lng).then(name => {
        defaults.locationName = name;
        getWeather(lat, lng).then(json => {
          renderAppWithData(json);
        }).catch(error => {
          Rollbar.error('getWeather', error);
        });
        hideLoading();
      }).catch(error => {
        Rollbar.error('getLocationNameFromLatLng', error);
      });
    } catch (error) {
      Rollbar.critical('getLocationAndPopulateAppData: problem getting new data', error);
      hideLoading();
    }
    hideLoading();
  }
}

export function checkIfDataUpdateNeeded() {
  if (!useCache(getData(defaults.cacheTimeKey))) {
    defaults.loadFromCache = false;
    init();
  }
}

export function initDataUpdateCheck() {
  if (defaults.timerHandle) {
    clearInterval(defaults.timerHandle);
  } else {
    clearInterval();
  }
  defaults.timerHandle = setInterval(function () {
    checkIfDataUpdateNeeded();
  }, 60000); // 10 minutes (10 * 6000 ms)
}
