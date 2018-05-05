(function () {
  const app = {
    altUnitSelector: '.alt-unit',
    bodySelector: 'body',
    btnGeolocationSelector: '.btn-geolocation',
    btnPostalCodeSelector: '.btn-postal-code',
    data: null,
    defaultLat: '42.4396',
    defaultLng: '-76.4970',
    locationName: 'Ithaca, NY, USA',
    errorMessageSelector: '.error-message',
    hideClassName: 'hidden',
    hrSelector: 'hr',
    linkToggleUnitsSelector: '.link-toggle-units',
    loadingSpinnerSelector: '.loading-spinner',
    postalCodeFieldSelector: '.postal-code',
    primaryUnitSelector: '.primary-unit',
    searchControlsSelector: '.search-controls',
    unitToggleSelector: '.current-temp p',
  };

  app.getBodyBgClass = () => {
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
  };

  app.setBodyBgClass = () => {
    const bodyEl = document.querySelector(app.bodySelector);
    bodyEl.classList.add(app.getBodyBgClass());
  };

  app.showEl = (el) => {
    if (el !== 'undefined') {
      if (NodeList.prototype.isPrototypeOf(el)) {
        el.forEach(function (item) {
          item.classList.remove(app.hideClassName);
        });
      } else {
        el.classList.remove(app.hideClassName);
      }
    }
  };

  app.hideEl = (el) => {
    if (el !== 'undefined') {
      if (NodeList.prototype.isPrototypeOf(el)) {
        el.forEach(function (item) {
          item.classList.add(app.hideClassName);
        });
      } else {
        el.classList.add(app.hideClassName);
      }
    }
  };

  app.showLoading = () => {
    const loadingSpinner = document.querySelector(app.loadingSpinnerSelector);
    app.showEl(loadingSpinner);
    app.hideUi();
  };

  app.hideLoading = () => {
    const loadingSpinner = document.querySelector(app.loadingSpinnerSelector);
    app.hideEl(loadingSpinner);
    app.showUi();
  };

  app.hideUi = () => {
    const hrAll = document.querySelectorAll(app.hrSelector);
    const searchControls = document.querySelectorAll(app.searchControlsSelector);
    const linkToggleUnits = document.querySelectorAll(app.linkToggleUnitsSelector);
    app.hideEl(hrAll);
    app.hideEl(searchControls);
    app.hideEl(linkToggleUnits);
  };

  app.showUi = () => {
    const hrAll = document.querySelectorAll(app.hrSelector);
    const searchControls = document.querySelectorAll(app.searchControlsSelector);
    const linkToggleUnits = document.querySelectorAll(app.linkToggleUnitsSelector);
    app.showEl(hrAll);
    app.showEl(searchControls);
    app.showEl(linkToggleUnits);
  };

  app.initTooltips = () => {
    // $("[data-toggle=\"tooltip\"]").tooltip();
  };

  app.initBtnLocation = () => {
    const btnGeoLocation = document.querySelector(app.btnGeolocationSelector);
    btnGeoLocation.addEventListener('click', function (e) {
      // $(this).tooltip('hide');
      app.getLocation();
    });
  };

  app.initBtnPostalCode = () => {
    const btnPostalCode = document.querySelector(app.btnPostalCodeSelector)
    btnPostalCode.addEventListener('click', function (e) {
      // $(this).parent().tooltip('hide');
      app.submitPostalCodeSearch();
    });
    btnPostalCode.setAttribute("disabled", "disabled");
  };

  app.initPostalCodeField = () => {
    const postalCodeField = document.querySelector(app.postalCodeFieldSelector);
    postalCodeField.addEventListener('keypress', function (e) {
      if (e.which === 13) {
        app.submitPostalCodeSearch();
      }
    });
    postalCodeField.setAttribute("disabled", "disabled");
  };

  app.submitPostalCodeSearch = () => {
    const postalCodeField = document.querySelector(app.postalCodeFieldSelector);
    const postalCode = postalCodeField.value;

    if (postalCode.trim() === '') {
      app.showError('Please enter a valid postal code and try again.');
    } else {
      // app.removeError();
      app.getWeather(postalCode);
    }
  };

  app.showError = (msg) => {
    console.log('ERROR: \n' + msg);
    // const errorMessageEl = document.querySelector('#template-error-message');
    // const errorMessageTemplate = errorMessageEl.innerHTML;

    // const errorMessageView = {
    //   error_message: msg
    // };
    // const errorMessageString = Mustache.render(errorMessageTemplate, errorMessageView);

    // if (!$(".error-message").is(":visible")) {
    //   $("hr:first").after(errorMessageString);
    // }
  };

  app.removeError = () => {
    app.errorMessageEl.remove();
  };

  app.showAltUnit = () => {
    const primaryUnit = document.querySelectorAll(app.primaryUnitSelector);
    const altUnit = document.querySelectorAll(app.altUnitSelector);
    app.hideEl(primaryUnit);
    app.showEl(altUnit);
  };

  app.showPrimaryUnit = () => {
    const primaryUnit = document.querySelectorAll(app.primaryUnitSelector);
    const altUnit = document.querySelectorAll(app.altUnitSelector);
    app.hideEl(altUnit);
    app.showEl(primaryUnit);
  };

  app.initUnitToggle = () => {
    const unitToggle = document.querySelector(app.unitToggleSelector);
    unitToggle.addEventListener('click', function (event) {
      if (this.classList.contains('primary-unit')) {
        app.showAltUnit();
      } else {
        app.showPrimaryUnit();
      }
    });
    // $(this).parent().tooltip("hide");
  };

  app.initUnitToggleLink = () => {
    const linkToggleUnits = document.querySelectorAll(app.linkToggleUnitsSelector);
    const unitToggle = document.querySelector(app.unitToggleSelector);
    linkToggleUnits.forEach(function (el) {
      el.addEventListener('click', function (event) {
        if (unitToggle.classList.contains('primary-unit')) {
          app.showAltUnit();
        } else {
          app.showPrimaryUnit();
        }
      });
    });
  };

  app.getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position.coords.latitude + "," + position.coords.longitude);
        app.getLocationNameFromLatLng(`${position.coords.latitude},${position.coords.longitude}`);
        app.getWeather(position.coords.latitude + "," + position.coords.longitude);
      });
    } else {
      app.showError('Your browser does not support this feature. Try using your postal code.');
    }
  }

  app.populateLocation = (data) => {
    const locationArray = data.split(',');
    const city = locationArray[0].trim();
    const region = locationArray[1].trim();
    const country = locationArray[2].trim();
    const locationTemplate = `<h1 class="location">${city}, ${region} <small>${country}</small></h1>`;
    const locationEl = document.querySelector('.location');
    locationEl.innerHTML = locationTemplate;
  };

  app.populatePrimaryData = (data) => {
    const primaryDataTemplate = `
      <div class="col-sm-4 col-xs-3 current-icon"><p><i class="wi wi-forecast-io-${data.currently.icon}"></i></p></div>
      <div class="col-sm-4 col-xs-5 text-center current-conditions">
        <h2>Currently<br><small>${data.currently.summary}</small></h2>
      </div>
      <div class="col-sm-4 col-xs-4 current-temp" data-toggle="tooltip" title="Click to toggle Fahrenheit/Celsius">
        <p class="primary-unit">${Math.floor(data.currently.temperature)}<i class="wi wi-degrees"></i>F</p>
      </div>
    `;
    const priamryDataEl = document.querySelector('.primary-conditions-data');
    priamryDataEl.innerHTML = primaryDataTemplate;
  };

  app.populateWeatherDataRowOne = (data) => {
    const weatherDataRowOneTemplate = `
      <div class="col-xs-4 text-center" data-toggle="tooltip" title="Wind Speed">
        <p>${Math.round(data.currently.windSpeed)} mph <i class="wi wi-wind wi-towards-${data.currently.windBearing}"></i></p>
      </div>
      <div class="col-xs-4 text-center" data-toggle="tooltip" title="Humidity">
        <p><i class="wi wi-humidity"></i> ${data.currently.humidity * 100}%</p>
      </div>
      <div class="col-xs-4 text-center" data-toggle="tooltip" title="Today's Sunrise">
        <p><i class="wi wi-sunrise"></i> ${app.formatUnixTimeForSun(data.daily.data[0].sunriseTime)} am</p>
      </div>
    `;
    const weatherDataRowOneEl = document.querySelector('.weather-data-row-1');
    weatherDataRowOneEl.innerHTML = weatherDataRowOneTemplate;
  };

  app.populateWeatherDataRowTwo = (data) => {
    const weatherDataRowTwoTemplate = `
      <div class="col-xs-4 text-center" data-toggle="tooltip" title="Barometric Pressue">
        <p><i class="wi wi-barometer"></i> ${data.currently.pressure}in</i></p>
      </div>
      <div class="col-xs-4 text-center" data-toggle="tooltip" title="Visibility">
        <p><i class="fa fa-eye"></i> ${data.currently.visibility} mi</p>
      </div>
      <div class="col-xs-4 text-center" data-toggle="tooltip" title="Today's Sunset">
        <p><i class="wi wi-sunset"></i> ${app.formatUnixTimeForSun(data.daily.data[0].sunsetTime)} pm</p>
      </div>
    `;
    const weatherDataRowTwoEl = document.querySelector('.weather-data-row-2');
    weatherDataRowTwoEl.innerHTML = weatherDataRowTwoTemplate;
  };

  app.populateForecastData = (data, numDays = 5) => {
    for (let i = 0; i < numDays; i++) {
      let forecastTemplate = `
        <p data-toggle="tooltip" title="${data.daily.data[i].summary}">
          <strong>${app.getDayFromUnixTime(data.daily.data[i].time)}</strong>
          <br>
          <i class="wi wi-forecast-io-${data.daily.data[i].icon}"></i>
          <br>
          <span class="primary-unit">${Math.floor(data.daily.data[i].temperatureLow)}<i class="wi wi-degrees"></i>/${Math.floor(data.daily.data[i].temperatureHigh)}<i class="wi wi-degrees"></i></span>
        </p>
      `;
      let forecastEl = document.querySelector(`.forecast-${i}`);
      forecastEl.innerHTML = forecastTemplate;
    }
  };

  app.populateLastUpdated = (data) => {
    const lastUpdatedTemplate = `
      <p class="last-upstaed">
        Forecast data last updated: ${app.formatUnixTime(data.currently.time)}.
      </p>
    `;
    const lastUpdatedEl = document.querySelector('.last-updated');
    lastUpdatedEl.innerHTML = lastUpdatedTemplate;
  };

  app.formatUnixTime = (unixtime) => {
    const date = new Date(unixtime * 1000);
    return date.toString();
  };

  app.formatUnixTimeForSun = (unixtime) => {
    const date = new Date(unixtime * 1000);
    let hours = date.getHours();
    if (hours > 12) {
      hours = hours - 12;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
  };

  app.getDayFromUnixTime = (unixtime) => {
    const date = new Date(unixtime * 1000);
    return date.toDateString().split(' ')[0];
  };

  app.getLocationNameFromLatLng = (lat, lng) => {
    const url = `https://mikesprague-api.glitch.me/location-name/?lat=${lat}&lng=${lng}`;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          app.throwFetchError(response);
        }
      })
      .then(json => {
        const returnName = json.results[0].formatted_address;
        app.locationName = returnName;
        return returnName;
      })
      .catch(error => {
        console.error(`Error in getLocationNameFromLatLng:\n ${error.message}`);
      });
  };

  app.setData = (key, data) => {
    var todoData = JSON.stringify(data);
    localStorage.setItem(key, todoData);
  };

  app.getData = (key) => {
    var todoData = localStorage.getItem(key);
    return JSON.parse(todoData);
  };

  app.throwFetchError = (response) => {
    let errorMessage = `${response.status} ({response.statusText)`;
    let error = new Error(errorMessage);
    throw (error);
  };

  app.renderAppWithData = (data) => {
    // app.getLocationNameFromLatLng(`${lat},${lng}`);
    app.populatePrimaryData(data);
    app.populateWeatherDataRowOne(data);
    app.populateWeatherDataRowTwo(data);
    app.populateForecastData(data);
    app.populateLastUpdated(data);
    app.initUnitToggleLink();
    app.initTooltips();
    app.populateLocation(app.locationName);
  };

  app.getWeather = (lat, lng) => {
    const url = `https://mikesprague-api.glitch.me/weather/?lat=${lat}&lng=${lng}`;
    app.showLoading();
    app.getLocationNameFromLatLng(`${lat}`, `${lng}`);
    fetch(url)
      .then(response => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          app.throwFetchError(response);
        }
      })
      .then(json => {
        // console.log(json);
        app.renderAppWithData(json);
      })
      .catch(error => {
        console.error(`Error in getWeather:\n ${error.message}`);
        // app.showError("There was a problem retrieving your weather conditions. Please try again.");
        app.hideLoading();
      });

    app.hideLoading();
  };

  app.init = () => {
    app.setBodyBgClass();
    app.initBtnLocation();
    app.initBtnPostalCode();
    app.initPostalCodeField();
    app.initTooltips();
    app.getWeather(app.defaultLat, app.defaultLng);
  };

  document.onreadystatechange = function () {
    if (document.readyState === "complete") {
      app.init();
    }
  };
})();