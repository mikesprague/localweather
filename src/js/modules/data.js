import axios from 'axios';
import * as defaults from './defaults';
import { useCache, getData, setData } from './cache';

export function loadFromCache() {
  return useCache(getData(defaults.cacheTimeKey));
}

const setLocalStorageData = ((data) => {
  setData(defaults.weatherDataKey, data[1].weather);
  setData(defaults.locationDataKey, data[0].location);
  setData(defaults.locationNameDataKey, data[0].location.locationName);
  setData(defaults.locationAddressDataKey, data[0].location.formattedAddress);
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
