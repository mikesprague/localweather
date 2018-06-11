'use strict';

import * as defaults from './defaults';
import * as ui from './ui';
import * as cache from './cache';
import * as app from './init';

export async function getLocationNameFromLatLng(lat, lng) {
  const url = `https://mikesprague-api.glitch.me/location-name/?lat=${lat}&lng=${lng}`;
  if (defaults.loadFromCache) {
    const cachedLocationData = cache.getData(defaults.locationDataKey);
    defaults.locationName = cachedLocationData.results[0].formatted_address;
    return cachedLocationData.results[0].formatted_address;
  } else {
    const locationData = fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(response);
        }
      })
      .then(json => {
        cache.setData(defaults.locationDataKey, json);
        defaults.locationName = json.results[0].formatted_address;
        return json.results[0].formatted_address;
      })
      .catch(error => {
        console.error(`Error in getLocationNameFromLatLng:\n ${error.message}`);
      });
    return locationData;
  }
}

export async function getWeather(lat, lng) {
  const url = `https://mikesprague-api.glitch.me/weather/?lat=${lat}&lng=${lng}`;
  if (defaults.loadFromCache) {
    const cachedWeatherData = cache.getData(defaults.weatherDataKey);
    return cachedWeatherData;
  } else {
    const weatherData = fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(response);
        }
      })
      .then(json => {
        cache.setData(defaults.weatherDataKey, json);
        return json;
      })
      .catch(error => {
        console.error(`Error in getWeather:\n ${error.message}`);
        ui.hideLoading();
      });
    return weatherData;
  }
}

export async function getLocationAndPopulateAppData() {
  ui.showLoading();
  if (defaults.loadFromCache) {
    const cachedLocationData = cache.getData(defaults.locationDataKey);
    defaults.locationName = cachedLocationData.results[0].formatted_address;
    const cachedWeatherData = cache.getData(defaults.weatherDataKey);
    ui.renderAppWithData(cachedWeatherData);
    ui.hideLoading();
  } else {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        defaults.lat = position.coords.latitude;
        defaults.lng = position.coords.longitude;
        getLocationNameFromLatLng(
          defaults.lat,
          defaults.lng
        ).then(name => {
          defaults.locationName = name;
          getWeather(
            defaults.lat,
            defaults.lng
          ).then(json => {
            ui.renderAppWithData(json);
          }).then(() => {
            ui.hideLoading();
          });
        }).catch(error => {
          cosole.error(`ERROR: ${error}`);
        });
      });
    } else {
      console.error('ERROR: Your browser must support geolocation and you must approve sharing your location with the site for the app to work')
    }
  }
}

export function checkIfDataUpdateNeeded() {
  if (!cache.useCache(cache.getData(defaults.cacheTimeKey))) {
    defaults.useCache = false;
    app.init();
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
  }, 60000);
}
