"use strict";

import * as defaults from "./defaults";
import { hideLoading, showLoading, renderAppWithData } from "./ui";
import { useCache, getData, setData } from "./cache";
import { init } from "./init";

export function loadFromCache() {
  return useCache(getData(defaults.cacheTimeKey));
}

export async function getLocationNameFromLatLng(lat, lng) {
  const url = `${defaults.apiUrl()}/location-name/?lat=${lat}&lng=${lng}`;
  if (loadFromCache()) {
    const cachedLocationData = getData(defaults.locationDataKey);
    const cachedLocationName = getData(defaults.locationNameDataKey);
    try {
      defaults.locationName = cachedLocationName;
      return parseLocationNameFromFormattedAddress(cachedLocationName);
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
        const fullLocationName = json.results[0].formatted_address;
        const shortLocationName = parseLocationNameFromFormattedAddress(fullLocationName);
        setData(defaults.locationNameDataKey, fullLocationName);
        defaults.locationName = fullLocationName;
        return shortLocationName;
      })
      .catch(error => {
        Rollbar.error(error);
      });
    return locationData;
  }
}

export function parseLocationNameFromFormattedAddress(address) {
  try {
    const cityPosition = address.split(",").length > 2 ? address.split(",").length - 3 : 0;
    return address.split(",")[cityPosition].trim();
  } catch (error) {
    Rollbar.error("parseLocationNameFromFormattedAddress", error);
  }
}

export async function getWeather(lat, lng) {
  const url = `${defaults.apiUrl()}/weather/?lat=${lat}&lng=${lng}`;
  if (loadFromCache()) {
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
  if (loadFromCache()) {
    try {
      const cachedLocationData = getData(defaults.locationDataKey);
      defaults.locationName = cachedLocationData.formatted_address;
      const cachedWeatherData = getData(defaults.weatherDataKey);
      renderAppWithData(cachedWeatherData);
    } catch (error) {
      Rollbar.critical("getLocationAndPopulateAppData: problem loading cached data", error);
      hideLoading();
    }
    hideLoading();
  } else {
    showLoading();
    try {
      getLocationNameFromLatLng(lat, lng).then(name => {
        // console.log(name);
        getWeather(lat, lng).then(json => {
          renderAppWithData(json);
        }).catch(error => {
          Rollbar.error("getWeather", error);
        });
        hideLoading();
      }).catch(error => {
        Rollbar.error("getLocationNameFromLatLng", error);
      });
    } catch (error) {
      Rollbar.critical("getLocationAndPopulateAppData: problem getting new data", error);
      hideLoading();
    }
    hideLoading();
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
