import axios from 'axios';
import * as defaults from './defaults';
import { useCache, getData, setData } from './cache';

export function loadFromCache() {
  return useCache(getData(defaults.cacheTimeKey));
}

export async function getWeatherData(lat, lng) {
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
      // add error notification to user with option to reload/retry
      defaults.handleError(error);
    });
  return weatherData;
}
