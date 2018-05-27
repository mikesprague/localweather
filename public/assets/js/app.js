(function () {
  const defaults = {
    cacheTimeKey: 'cacheTime',
    cacheTimeSpan: 600, // 10 minutes (number of minutes * 60 seconds)
    errorMessageSelector: '.error-message',
    hideClassName: 'hide-me',
    lat: 0,
    lng: 0,
    loadFromCache: false,
    loadingSpinnerSelector: '.loading-spinner',
    locationDataKey: 'locationData',
    locationName: 'loading...',
    timerHandle: 0,
    title: 'localweather.io (powered by Dark Sky)',
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

    getHourAndPeriodFromUnixTime(unixtime) {
      const date = new Date(unixtime * 1000);
      let hours = date.getHours();
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours > 12 ? hours -= 12 : hours;
      hours = hours === 0 ? hours = 12 : hours;
      return `${hours}${period}`;
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

  const data = {
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
              data.throwFetchError(response);
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
            defaults.lat = position.coords.latitude;
            defaults.lng = position.coords.longitude;
            data.getLocationNameFromLatLng(
              defaults.lat,
              defaults.lng
            ).then(name => {
              defaults.locationName = name;
              data.getWeather(
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
    },

    checkIfDataUpdateNeeded() {
      if (!cache.useCache(cache.getData(defaults.cacheTimeKey))) {
        defaults.useCache = false;
        app.init();
      }
    },

    initDataUpdateCheck() {
      if (defaults.timerHandle) {
        clearInterval(defaults.timerHandle);
      } else {
        clearInterval();
      }
      defaults.timerHandle = setInterval(function () {
        data.checkIfDataUpdateNeeded();
      }, 60000);
    }
  };

  const templates = {
    populateLocation(data) {
      const city = defaults.locationName.split(',')[0].trim();;
      const currentConditionsTooltip = `
        <div class='text-left'>
          <strong>RIGHT NOW:</strong> ${data.currently.summary}
          <hr>
        </div>
        <div class='text-left'>
          <strong>TODAY:</strong> ${data.hourly.summary}
          <hr>
        </div>
        <div class='text-left'>
          <strong>THIS WEEK:</strong> ${data.daily.summary}
          <hr>
        </div>
      `;
      const locationTemplate = `<h1 class="location has-tooltip" title="${currentConditionsTooltip}">${city}</h1>`;

      const locationEl = document.querySelector('.location');
      locationEl.innerHTML = locationTemplate;
    },

    populatePrimaryData(data) {
      const primaryDataTemplate = `
        <div class="col-3 current-icon">
          <p class="has-tooltip text-center" title="${data.currently.summary}">
            <i class="wi wi-forecast-io-${data.currently.icon}"></i>
          </p>
        </div>
        <div class="col-6 text-center current-conditions p-0">
            <h2>
              ${data.currently.summary}
              <!-- <small class="d-none">${data.hourly.summary}</small> -->
            </h2>
        </div>
        <div class="col-3 current-temp text-center">
          <p class="primary-unit text-center has-tooltip" title="Feels like ${Math.round(data.currently.apparentTemperature)}&deg;">
            ${Math.round(data.currently.temperature)}<i class="wi wi-degrees"></i>
          </p>
        </div>
      `;
      const priamryDataEl = document.querySelector('.primary-conditions-data');
      priamryDataEl.innerHTML = primaryDataTemplate;
    },

    populateWeatherData(data) {
      const moonUi = ui.getMoonUi(data);
      const weatherDataTemplate = `
        <div class="col col-md-2 text-center has-tooltip" title="Wind Speed">
          <p><i class="wi wi-wind from-${data.currently.windBearing}-deg"></i><br>${Math.round(data.currently.windSpeed)}mph</p>
        </div>
        <div class="col col-md-2 text-center has-tooltip" title="Chance of Precipitation">
          <p><i class="fas fa-umbrella"></i><br>${Math.round(data.currently.precipProbability * 100)}%</p>
        </div>
        <div class="col col-md-2 text-center has-tooltip" title="UV Index">
          <p><i class="fas fa-sun"></i><br>${Math.round(data.currently.uvIndex)}</p>
        </div>
        <div class="col col-md-2 text-center has-tooltip" title="Visibility">
          <p><i class="fas fa-eye"></i><br>${data.currently.visibility}mi</p>
        </div>
        <div class="col col-md-2 d-none d-md-block text-center has-tooltip" title="Cloud Cover">
          <p><i class="fas fa-cloud"></i><br>${Math.round(data.currently.cloudCover * 100)}%</p>
        </div>
        <div class="col col-md-2 text-center has-tooltip" title="Today's Sunrise">
          <p><i class="wi wi-sunrise"></i><br>${datetime.formatUnixTimeForSun(data.daily.data[0].sunriseTime)}am</p>
        </div>
        <div class="col col-md-2 text-center has-tooltip" title="Barometric Pressue">
          <p><i class="wi wi-barometer"></i><br>${Math.round(data.currently.pressure)}mb</i></p>
        </div>
        <div class="col col-md-2 text-center has-tooltip" title="Humidity">
          <p><i class="wi wi-humidity"></i><br>${Math.round(data.currently.humidity * 100)}%</p>
        </div>
        <div class="col col-md-2 text-center has-tooltip" title="Dew Point">
          <p><i class="wi wi-raindrop"></i><br>${Math.round(data.currently.dewPoint)}<i class="wi wi-degrees"></i></p>
        </div>
        <div class="col col-md-2 text-center has-tooltip" title="Feels Like">
          <p><i class="wi wi-thermometer"></i><br>${Math.round(data.currently.apparentTemperature)}<i class="wi wi-degrees"></i></p>
        </div>
        <div class="col col-md-2 d-none d-md-block text-center has-tooltip" title="Today's Moon Phase">
          <p><i class="wi ${moonUi.icon}"></i><br>${moonUi.phase}</p>
        </div>
        <div class="col col-md-2 text-center has-tooltip" title="Today's Sunset">
          <p><i class="wi wi-sunset"></i><br>${datetime.formatUnixTimeForSun(data.daily.data[0].sunsetTime)}pm</p>
        </div>
      `;
      const weatherDataEl = document.querySelector('.current-weather-data');
      weatherDataEl.innerHTML = weatherDataTemplate;
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

    populateForecastData(data, numDays = 7) {
      for (let i = 0; i < numDays; i++) {
        let next = i + 1;
        let forecastTemplate = `
          <p class="has-tooltip" title="${data.daily.data[next].summary}">
            <strong>${datetime.getDayFromUnixTime(data.daily.data[next].time)}</strong>
            <br>
            <i class="wi wi-forecast-io-${data.daily.data[next].icon}"></i>
            <br>
            ${Math.round(data.daily.data[next].temperatureHigh)}&deg;/${Math.round(data.daily.data[next].temperatureLow)}&deg;
          </p>
        `;
        let forecastEl = document.querySelector(`.forecast-${next}`);
        forecastEl.innerHTML = forecastTemplate;
      }
    },

    populateHourlyData(data, numHours = 12) {
      for (let i = 0; i < numHours; i++) {
        let next = i + 1;
        let precipitationText = Math.floor(data.hourly.data[next].precipProbability * 100) ?
          `${Math.floor(data.hourly.data[next].precipProbability * 100)}% chance of ${data.hourly.data[next].precipType}` :
          "No precipitation";
        let hourlyTemplate = `
          <p class="has-tooltip" title="${data.hourly.data[next].summary}<br>${precipitationText}">
            <strong>${datetime.getHourAndPeriodFromUnixTime(data.hourly.data[next].time)}</strong>
            <br>
            <i class="wi wi-forecast-io-${data.hourly.data[next].icon}"></i>
            ${Math.round(data.hourly.data[next].apparentTemperature)}&deg;
          </p>
        `;
        let hourlyEl = document.querySelector(`.hourly-${next}`);
        hourlyEl.innerHTML = hourlyTemplate;
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
    getMoonUi(data) {
      const intAge = Math.round(Math.fround(data.daily.data[0].moonPhase * 29).toFixed(1));
      const iconPrefix = "wi-moon-alt";
      let iconSuffix = "";
      let phaseText = "";
      if (intAge > 0 && intAge < 7) {
        iconSuffix = `waxing-crescent-${intAge}`;
        phaseText = "Waxing Crescent";
      } else if (intAge === 7) {
        iconSuffix = "first-quarter";
        phaseText = "First Quarter";
      } else if (intAge > 7 && intAge < 14) {
        iconSuffix = `waxing-gibbous-${intAge - 7}`;
        phaseText = "Waxing Gibbous";
      } else if (intAge === 14) {
        iconSuffix = "full";
        phaseText = "Full Moon";
      } else if (intAge > 14 && intAge < 21) {
        iconSuffix = `waning-gibbous-${intAge - 14}`;
        phaseText = "Waning Gibbous";
      } else if (intAge === 21) {
        iconSuffix === "third-quarter";
        phaseText = "Third Quarter";
      } else if (intAge > 21 && intAge < 28) {
        iconSuffix = `waning-crescent-${intAge - 21}`;
        phaseText = "Waning Crescent";
      } else if (intAge >= 28 || intAge === 0) {
        iconSuffix = "new";
        phaseText = "New Moon";
      }
      return {
        "icon": `${iconPrefix}-${iconSuffix}`,
        "phase": phaseText,
      };
    },

    getBodyBgClass(data) {
      let bodyClass = 'night';

      const hourNum = new Date().getHours();
      if (hourNum >= 5 && hourNum <= 7) {
        bodyClass = 'sunrise';
      } else if (hourNum > 7 && hourNum <= 17) {
        bodyClass = 'day';
      } else if (hourNum > 17 && hourNum <= 20) {
        bodyClass = 'sunset';
      }

      if (data) {
        const cloudCover = Math.round(data.currently.cloudCover * 100);
        bodyClass = cloudCover > 50 ? `${bodyClass}-cloudy` : bodyClass;
      }

      return bodyClass;
    },

    setBodyBgClass(className) {
      const bodyEl = document.querySelector('body');
      bodyEl.classList.add(className);
    },

    setFavicon(data) {
      const currentIcon = data.currently.icon;
      let iconTags = document.getElementsByClassName('favicon');
      const iconPath = `assets/images/favicons/${currentIcon}.png`;
      Array.from(iconTags).forEach(function (iconTag) {
        iconTag.setAttribute('href', iconPath);
      });
    },

    setTitle(data) {
      const newTitle = `${Math.round(data.currently.temperature)}° ${data.currently.summary} | ${defaults.title}`;
      window.document.title = newTitle;
    },

    showEl(el) {
      if (el !== 'undefined') {
        switch (typeof el) {
          case 'NodeList':
            Array.from(el).forEach(function (item) {
              item.classList.remove(defaults.hideClassName);
            });
            break;
          case 'object':
            if (el.length) {
              Array.from(el).forEach(function (item) {
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
              item.classList.add(defaults.hideClassName);
            });
            break;
          case 'object':
            if (el.length) {
              Array.from(el).forEach(function (item) {
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
      const rows = document.querySelectorAll('.weather-data .row');
      const hrAll = document.getElementsByTagName('hr');
      const poweredBy = document.querySelector('.powered-by-dark-sky');
      ui.hideEl(rows);
      ui.hideEl(hrAll);
      ui.hideEl(poweredBy);
    },

    showUi() {
      const rows = document.querySelectorAll('.weather-data .row');
      const hrAll = document.getElementsByTagName('hr');
      const poweredBy = document.querySelector('.powered-by-dark-sky');
      ui.showEl(rows);
      ui.showEl(hrAll);
      ui.showEl(poweredBy);
      ui.initTooltips();
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
      ui.setBodyBgClass(ui.getBodyBgClass(data));
      templates.populatePrimaryData(data);
      templates.populateWeatherData(data);
      templates.populateForecastData(data);
      templates.populateHourlyData(data);
      templates.populateLastUpdated(data);
      templates.populateLocation(data);
      ui.setFavicon(data);
      ui.setTitle(data);
      ui.initTooltips();
      return true;
    },
  };

  const cache = {
    useCache(cacheTime) {
      const now = Math.round(new Date().getTime() / 1000);
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
      const cacheTime = Math.round(new Date().getTime() / 1000);
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
      cache.initCache();
      data.getLocationAndPopulateAppData();
      data.initDataUpdateCheck();
      ui.setBodyBgClass(ui.getBodyBgClass());
      ui.initTooltips();
    }
  };

  document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
      app.init();
    }
  };
})();
