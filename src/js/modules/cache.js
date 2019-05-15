import * as defaults from './defaults';

export function setData(key, data) {
  const dataToSet = JSON.stringify(data);
  localStorage.setItem(key, dataToSet);
}

export function getData(key) {
  const dataToGet = localStorage.getItem(key);
  return JSON.parse(dataToGet);
}

export function clearData(key) {
  localStorage.removeItem(key);
}

export function resetData() {
  localStorage.clear();
}

export function areCachesEmpty() {
  return (
    (getData(defaults.cacheTimeKey) === null)
    || (getData(defaults.weatherDataKey) === null)
    || (getData(defaults.locationDataKey) === null)
    || (getData(defaults.locationNameDataKey) === null)
    || (getData(defaults.locationAddressDataKey) === null)
  );
}

export function useCache(cacheTime) {
  const now = Math.round(new Date().getTime() / 1000);
  const nextUpdateTime = cacheTime + defaults.cacheTimeSpan;
  if (nextUpdateTime > now && !areCachesEmpty()) {
    return true;
  }
  resetData();
  return false;
}

export function setCacheTime() {
  const cacheTime = Math.round(new Date().getTime() / 1000);
  setData(defaults.cacheTimeKey, cacheTime);
  return cacheTime;
}
