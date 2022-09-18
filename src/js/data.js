import axios from 'axios';
import { getData, setCacheTime, setData, useCache } from './cache.js';
import { defaults } from './defaults.js';
import { apiUrl } from './helpers.js';

const setLocalStorageData = (data) => {
  setCacheTime();
  setData(defaults.weatherDataKey, data.weather);
  setData(defaults.locationDataKey, data.location);
  setData(defaults.locationNameDataKey, data.location.locationName);
  setData(defaults.locationAddressDataKey, data.location.formattedAddress);
  setData(defaults.skipGeolocationCheckKey, true);
};

export async function getWeatherData(lat, lng) {
  if (useCache(getData(defaults.cacheTimeKey))) {
    const cachedWeatherData = getData(defaults.weatherDataKey);
    return cachedWeatherData;
  }
  const url = `${apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}`;
  const weatherData = await axios.get(url).then((response) => {
    // console.log(response.data);
    setLocalStorageData(response.data);
    return response.data.weather;
  });
  return weatherData;
}
