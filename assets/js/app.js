(function () {
  const defaults = {
    cacheTimeKey: 'cacheTime',
    cacheTimeSpan: 600, // 10 minutes (number of minutes * 60 seconds)
    errorMessageSelector: '.error-message',
    hideClassName: 'hidden',
    loadFromCache: false,
    loadingSpinnerSelector: '.loading-spinner',
    locationDataKey: 'locationData',
    locationName: 'loading...',
    weatherDataKey: 'weatherData',
  };

  const datetime = {
    formatUnixTimeAsLocalString(unixtime) {
      const date = new Date(unixtime * 1000);
      // example date.toLocaleString() '5/6/2018, 3:41:21 PM'
      return date.toLocaleString().replace(', ', ' '); // '5/6/2018 3:41:21 PM'
    },

    formatUnixTimeForSun(unixtime) {
      const hours = datetime.getHoursFromUnixTime(unixtime);
      const minutes = datetime.getMinutesFromUnixTime(unixtime);
      return `${hours}:${minutes}`;
    },

    getShortDateFromUnixTime(unixtime) {
      const date = new Date(unixtime * 1000);
      // example date.toLocaleString() '5/6/2018, 3:41:21 PM'
      return date.toLocaleString().split(',')[0]; // returns '5/6/2018'
    },

    getTimeFromUnixTime(unixtime) {
      const date = new Date(unixtime * 1000);
      // example date.toLocaleString() '5/6/2018, 3:41:21 PM'
      return date.toLocaleString().split(',')[1].trim(); // returns '3:41:21 PM'
    },

    getHoursFromUnixTime(unixtime) {
      const date = new Date(unixtime * 1000);
      let hours = date.getHours();
      hours = hours > 12 ? hours - 12 : hours;
      return hours;
    },

    getMinutesFromUnixTime(unixtime) {
      const date = new Date(unixtime * 1000);
      let minutes = date.getMinutes();
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      return minutes;
    },

    getMonthFromUnixTime(unixtime) {
      const date = new Date(unixtime * 1000);
      // example date.toDateSTring() 'Sun May 06 2018'
      return date.toDateString().split(' ')[1]; // returns 'May'
    },

    getDayFromUnixTime(unixtime) {
      const date = new Date(unixtime * 1000);
      // example date.toDateSTring() 'Sun May 06 2018'
      return date.toDateString().split(' ')[0]; // returns 'Sun'
    },

    getYearFromUnixTime(unixtime) {
      const date = new Date(unixtime * 1000);
      return date.getFullYear();
    },
  };

  const http = {
    async getLocationNameFromLatLng(lat, lng) {
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
              http.throwFetchError(response);
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
    },

    async getWeather(lat, lng) {
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
              defaults.throwFetchError(response);
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
    },

    async getLocationAndPopulateAppData() {
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
            http.getLocationNameFromLatLng(
              position.coords.latitude,
              position.coords.longitude
            ).then(name => {
              defaults.locationName = name;
              http.getWeather(
                position.coords.latitude,
                position.coords.longitude
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
    },
  };

  const templates = {
    populateLocation(data) {
      const locationArray = data.split(',');
      const city = locationArray[0].trim();
      const region = locationArray[1].trim();
      const country = locationArray[2].trim();
      const locationTemplate = `<h1 class="location">${city}, ${region} <small>${country}</small></h1>`;
      const locationEl = document.querySelector('.location');
      locationEl.innerHTML = locationTemplate;
    },

    populatePrimaryData(data) {
      const primaryDataTemplate = `
            <div class="col-xs-3 current-icon"><p><i class="wi wi-forecast-io-${data.currently.icon} has-tooltip" title="${data.currently.summary}"></i></p></div>
            <div class="col-xs-5 text-center current-conditions">
                <h2>${data.currently.summary}</h2>
            </div>
            <div class="col-xs-4 current-temp has-tooltip text-right" title="Feels like ${Math.floor(data.currently.apparentTemperature)}&deg;">
              <p class="primary-unit text-right">${Math.floor(data.currently.temperature)}&deg;</p>
            </div>
          `;
      const priamryDataEl = document.querySelector('.primary-conditions-data');
      priamryDataEl.innerHTML = primaryDataTemplate;
    },

    populateWeatherDataRowOne(data) {
      const weatherDataRowOneTemplate = `
            <div class="col-xs-4 text-center has-tooltip" title="Wind Speed">
              <p><i class="wi wi-wind wi-towards-${data.currently.windBearing}"></i> ${Math.round(data.currently.windSpeed)} mph</p>
            </div>
            <div class="col-xs-4 text-center has-tooltip" title="Humidity">
              <p><i class="wi wi-humidity"></i> ${Math.round(data.currently.humidity * 100)}%</p>
            </div>
            <div class="col-xs-4 text-center has-tooltip" title="Today's Sunrise">
              <p><i class="wi wi-sunrise"></i> ${datetime.formatUnixTimeForSun(data.daily.data[0].sunriseTime)} am</p>
            </div>
          `;
      const weatherDataRowOneEl = document.querySelector('.weather-data-row-1');
      weatherDataRowOneEl.innerHTML = weatherDataRowOneTemplate;
    },

    populateWeatherDataRowTwo(data) {
      const weatherDataRowTwoTemplate = `
            <div class="col-xs-4 text-center has-tooltip" title="Barometric Pressue">
              <p><i class="wi wi-barometer"></i> ${data.currently.pressure}in</i></p>
            </div>
            <div class="col-xs-4 text-center has-tooltip" title="Visibility">
              <p><i class="fa fa-eye"></i> ${data.currently.visibility} mi</p>
            </div>
            <div class="col-xs-4 text-center has-tooltip" title="Today's Sunset">
              <p><i class="wi wi-sunset"></i> ${datetime.formatUnixTimeForSun(data.daily.data[0].sunsetTime)} pm</p>
            </div>
          `;
      const weatherDataRowTwoEl = document.querySelector('.weather-data-row-2');
      weatherDataRowTwoEl.innerHTML = weatherDataRowTwoTemplate;
    },

    populateErrorMessage(msg) {
      const errorMessageTemplate = `
            <div class="alert alert-danger alert-dismissible error-message" role="alert">
              <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <span class="sr-only">Error:</span>
              <p>
                <span class="far fa-exclamation-circle" aria-hidden="true"></span> ${msg}
              </p>
            </div>
          `;
      const errorMessageEl = document.querySelector('.error-message');
      errorMessageEl.innerHTML = errorMessageTemplate;
    },

    populateForecastData(data, numDays = 5) {
      for (let i = 0; i < numDays; i++) {
        let forecastTemplate = `
              <p class="has-tooltip" title="${data.daily.data[i].summary}">
                <strong>${datetime.getDayFromUnixTime(data.daily.data[i].time)}</strong>
                <br>
                <i class="wi wi-forecast-io-${data.daily.data[i].icon}"></i>
                <br>
                ${Math.floor(data.daily.data[i].temperatureHigh)}&deg;/${Math.floor(data.daily.data[i].temperatureLow)}&deg;
              </p>
            `;
        let forecastEl = document.querySelector(`.forecast-${i}`);
        forecastEl.innerHTML = forecastTemplate;
      }
    },

    populateLastUpdated(data) {
      const lastUpdatedString = `
            Weather data cached at: ${datetime.formatUnixTimeAsLocalString(data.currently.time)}
            <br>
            Weather data is cached for 10 minutes.
            <br>
            Next data refresh available after: 
            ${datetime.formatUnixTimeAsLocalString(data.currently.time + defaults.cacheTimeSpan)} 
          `;
      const lastUpdatedTemplate = `
            <p class="last-updated has-tooltip" title="${lastUpdatedString}"> 
              Weather data last updated ${datetime.getTimeFromUnixTime(data.currently.time)}
            </p>
          `;
      const lastUpdatedEl = document.querySelector('.last-updated');
      lastUpdatedEl.innerHTML = lastUpdatedTemplate;
    },
  };

  const ui = {
    getBodyBgClass() {
      const hourNum = new Date().getHours();
      let bodyClass = 'night';

      if (hourNum >= 5 && hourNum <= 7) {
        bodyClass = 'morning';
      } else if (hourNum > 7 && hourNum <= 17) {
        bodyClass = 'day';
      } else if (hourNum > 17 && hourNum <= 20) {
        bodyClass = 'evening';
      }

      return bodyClass;
    },

    setBodyBgClass() {
      const bodyEl = document.querySelector('body');
      bodyEl.classList.add(ui.getBodyBgClass());
    },

    showEl(el) {
      if (el !== 'undefined') {
        switch (typeof el) {
          case 'NodeList':
            Array.from(el).forEach(function (item) {
              // console.log('item: \n' + item);
              item.classList.remove(defaults.hideClassName);
            });
            break;
          case 'object':
            if (el.length) {
              Array.from(el).forEach(function (item) {
                // console.log('item: \n' + item);
                item.classList.remove(defaults.hideClassName);
              });
            } else {
              if (el.length !== 0) {
                el.classList.remove(defaults.hideClassName);
              }
            }
            break;
          case 'string':
            document.querySelector(el).classList.remove(defaults.hideClassName);
            break;
        }
      }
    },

    hideEl(el) {
      if (el !== 'undefined') {

        switch (typeof el) {
          case 'NodeList':
            Array.from(el).forEach(function (item) {
              // console.log('item: \n' + item);
              item.classList.add(defaults.hideClassName);
            });
            break;
          case 'object':
            if (el.length) {
              Array.from(el).forEach(function (item) {
                // console.log('item: \n' + item);
                item.classList.add(defaults.hideClassName);
              });
            } else {
              if (el.length !== 0) {
                el.classList.add(defaults.hideClassName);
              }
            }
            break;
          case 'string':
            document.querySelector(el).classList.add(defaults.hideClassName);
            break;
        }
      }
    },

    showLoading() {
      const loadingSpinner = document.querySelector(defaults.loadingSpinnerSelector);
      ui.showEl(loadingSpinner);
      ui.hideUi();
    },

    hideLoading() {
      const loadingSpinner = document.querySelector(defaults.loadingSpinnerSelector);
      ui.hideEl(loadingSpinner);
      ui.showUi();
    },

    hideUi() {
      const hrAll = document.querySelectorAll('hr');
      const poweredBy = document.querySelector('.powered-by-dark-sky');
      ui.hideEl(hrAll);
      ui.hideEl(poweredBy);
    },

    showUi() {
      const hrAll = document.querySelectorAll('hr');
      const poweredBy = document.querySelector('.powered-by-dark-sky');
      ui.showEl(hrAll);
      ui.showEl(poweredBy);
    },

    initTooltips() {
      tippy('.has-tooltip', {
        arrow: true,
        size: 'large',
        livePlacement: true,
        performance: true,
      });
    },

    renderAppWithData(data) {
      templates.populatePrimaryData(data);
      templates.populateWeatherDataRowOne(data);
      templates.populateWeatherDataRowTwo(data);
      templates.populateForecastData(data);
      templates.populateLastUpdated(data);
      templates.populateLocation(defaults.locationName);
      return true;
    },
  };

  const cache = {
    useCache(cacheTime) {
      const now = Math.floor(new Date().getTime() / 1000);
      const nextUpdateTime = cacheTime + defaults.cacheTimeSpan;
      if (nextUpdateTime > now) {
        return true;
      } else {
        return false;
      }
    },

    areCachesEmpty() {
      return (
        (cache.getData(defaults.cacheTimeKey) === null) ||
        (cache.getData(defaults.weatherDataKey) === null) ||
        (cache.getData(defaults.locationDataKey) === null)
      );
    },

    initCache() {
      if (cache.areCachesEmpty()) {
        cache.resetData();
        cache.setCacheTime();
      } else {
        defaults.loadFromCache = cache.useCache(cache.getData(defaults.cacheTimeKey));
      }
      if (!defaults.loadFromCache) {
        cache.resetData();
        cache.setCacheTime();
      }
    },

    setCacheTime() {
      const cacheTime = Math.floor(new Date().getTime() / 1000);
      cache.setData(defaults.cacheTimeKey, cacheTime);
      return cacheTime;
    },

    setData(key, data) {
      const dataToSet = JSON.stringify(data);
      localStorage.setItem(key, dataToSet);
    },

    getData(key) {
      const dataToGet = localStorage.getItem(key);
      return JSON.parse(dataToGet);
    },

    clearData(key) {
      localStorage.removeItem(key);
    },

    resetData() {
      localStorage.clear();
    },
  };

  const app = {
    init() {
      ui.setBodyBgClass();
      cache.initCache();
      http.getLocationAndPopulateAppData();
      ui.initTooltips();
    }
  };

  document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
      app.init();
    }
  };
})();