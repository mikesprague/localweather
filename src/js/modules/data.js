'use strict';

import * as defaults from './defaults';
import { hideLoading, showLoading, renderAppWithData } from './ui';
import { useCache, getData, setData } from './cache';
import { init } from './init';

export async function getLocationNameFromLatLng(lat, lng) {
  const url = `${defaults.apiUrl()}/location-name/?lat=${lat}&lng=${lng}`;
  if (defaults.loadFromCache) {
    const cachedLocationData = getData(defaults.locationDataKey);
    try {
      return parseLocationNameFromFormattedAddress(defaults.locationName);
    } catch(error) {
      Rollbar.error(error);
      return defaults.locationName;
    }
  } else {
    const locationData = fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          Rollbar.error(response);
        }
      })
      .then(json => {
        setData(defaults.locationDataKey, json);
        const locationName = parseLocationNameFromFormattedAddress(json.formatted_address);
        defaults.locationName = json.formatted_address;
        return locationName;
      })
      .catch(error => {
        Rollbar.error(error);
      });
    return locationData;
  }
}

export function parseLocationNameFromFormattedAddress(address) {
  try {
    const cityPosition = address.split(',').length > 2 ? address.split(',').length - 3 : 0;
    return address.split(',')[cityPosition].trim();
  } catch (error) {
    Rollbar.error(error);
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
        }
      })
      .then(json => {
        setData(defaults.weatherDataKey, json);
        return json;
      })
      .catch(error => {
        Rollbar.error(error);
        hideLoading();
      });
    return weatherData;
  }
}

export async function getLocationAndPopulateAppData(lat, lng) {
  showLoading();
  if (defaults.loadFromCache) {
    try {
      const cachedLocationData = getData(defaults.locationDataKey);
      defaults.locationName = cachedLocationData.formatted_address;
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
        // console.log(name);
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
