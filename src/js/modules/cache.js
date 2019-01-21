import * as defaults from "./defaults";

export function useCache(cacheTime) {
  const now = Math.round(new Date().getTime() / 1000);
  const nextUpdateTime = cacheTime + defaults.cacheTimeSpan;
  if (nextUpdateTime > now && !areCachesEmpty()) {
    return true;
  } else {
    return false;
  }
}

export function areCachesEmpty() {
  return (
    (getData(defaults.cacheTimeKey) === null) ||
    (getData(defaults.weatherDataKey) === null) ||
    (getData(defaults.locationDataKey) === null) ||
    (getData(defaults.locationNameDataKey) === null)
  );
}

export function initCache() {
  if (areCachesEmpty()) {
    resetData();
    setCacheTime();
  } else {
    defaults.loadFromCache = useCache(getData(defaults.cacheTimeKey));
  }
  if (!defaults.loadFromCache) {
    resetData();
    setCacheTime();
  }
}

export function setCacheTime() {
  const cacheTime = Math.round(new Date().getTime() / 1000);
  setData(defaults.cacheTimeKey, cacheTime);
  return cacheTime;
}

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
