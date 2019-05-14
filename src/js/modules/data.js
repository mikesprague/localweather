import axios from 'axios';
import * as defaults from './defaults';
import {
  useCache, getData, resetData, setCacheTime, setData,
} from './cache';

export function loadFromCache() {
  return useCache(getData(defaults.cacheTimeKey));
}

const setLocalStorageData = ((data) => {
  resetData();
  setCacheTime();
  setData(defaults.weatherDataKey, data[1].weather);
  setData(defaults.locationDataKey, data[0].location);
  setData(defaults.locationNameDataKey, data[0].location.locationName);
  setData(defaults.locationAddressDataKey, data[0].location.formattedAddress);
  setData(defaults.skipGeolocationCheckKey, true);
});

export async function getWeatherData(lat, lng) {
  if (loadFromCache()) {
    const cachedWeatherData = getData(defaults.weatherDataKey);
    return cachedWeatherData;
  }
  const url = `${defaults.apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}`;
  const weatherData = await axios.get(url)
    .then((response) => {
      setLocalStorageData(response.data);
      return response.data[1].weather;
    });
  return weatherData;
}
