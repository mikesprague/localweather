import axios from 'axios';
import * as defaults from './defaults';
import { useCache, getData, setData } from './cache';

export function loadFromCache() {
  return useCache(getData(defaults.cacheTimeKey));
}

export async function getWeatherData(lat, lng) {
  if (loadFromCache()) {
    const cachedWeatherData = getData(defaults.weatherDataKey);
    return cachedWeatherData;
  }
  const url = `${defaults.apiUrl()}/location-and-weather/?lat=${lat}&lng=${lng}`;
  const weatherData = await axios.get(url)
    .then((response) => {
      setData(defaults.weatherDataKey, response.data[1].weather);
      setData(defaults.locationDataKey, response.data[0].location);
      setData(defaults.locationNameDataKey, response.data[0].location.locationName);
      setData(defaults.locationAddressDataKey, response.data[0].location.formattedAddress);
      return response.data[1].weather;
    });
  return weatherData;
}
