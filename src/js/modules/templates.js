"use strict";

import * as defaults from "./defaults";
import { getMoonUi, registerAlertClickHandler } from "./ui";
import { parseLocationNameFromFormattedAddress } from "./data";
import { getData } from "./cache";
import {
  formatUnixTimeAsLocalString, formatUnixTimeForSun, getDayFromUnixTime, getHourAndPeriodFromUnixTime, getTimeFromUnixTime
} from "./datetime";

export function populateLocation(data) {
  const locationName = getData(defaults.locationNameDataKey);
  const locationTemplate = `
    <h1 class="title is-1 has-text-centered has-tooltip" title="
      <i class='fas fa-fw fa-globe'></i>
      <strong>${locationName}</strong>
      <br>
      <i class='fas fa-fw fa-map-marker-alt'></i>
      ${Math.fround(data.latitude).toFixed(4)},${data.longitude.toFixed(4)}
    ">${parseLocationNameFromFormattedAddress(locationName)}</h1>
  `;
  const locationEl = document.querySelector(".location");
  locationEl.innerHTML = locationTemplate;
}

export function populatePrimaryData(data) {
  const currentConditionsTooltip = `
    <div class='primarySummaryWrapper'>
      <div class='columns is-mobile'>
        <div class='column'>
          <strong>RIGHT NOW</strong>
          <i class='wi wi-fw wi-forecast-io-${data.currently.icon}'></i>
          <br>
          ${Math.round(data.currently.temperature)}&deg;
          ${data.currently.summary}
        </div>
        <div class='column'>
          <strong>NEXT HOUR</strong>
          <i class='wi wi-fw wi-forecast-io-${data.hourly.data[1].icon}'></i>
          <br>
          ${Math.round(data.hourly.data[1].temperature)}&deg;
          ${data.hourly.data[1].summary}
        </div>
      </div>
      <div class='columns is-mobile'>
        <div class='column'>
          <strong>TODAY</strong>
          <i class='wi wi-fw wi-forecast-io-${data.daily.data[0].icon}'></i>
          <br>
          ${Math.round(data.daily.data[0].temperatureHigh)}&deg;/
          ${Math.round(data.daily.data[0].temperatureLow)}&deg;
          ${data.daily.data[0].summary}
        </div>
      </div>
      <div class='columns is-mobile'>
        <div class='column'>
          <strong>NEXT 7 DAYS</strong>
          <i class='wi wi-fw wi-forecast-io-${data.daily.icon}'></i>
          <br>
          ${data.daily.summary}
        </div>
      </div>
    </div>
  `;
  const locationName = getData(defaults.locationNameDataKey);
  const primaryDataTemplate = `
    <div class="column is-one-quarter has-text-right current-icon">
      <i class="wi wi-fw wi-forecast-io-${data.currently.icon}"></i>
    </div>
    <div class="column is-half current-conditions">
      <div class="content has-text-center">
        <h2 class="subtitle is-1 has-text-center has-tooltip" title="${currentConditionsTooltip}">
          ${data.currently.summary}
        </h2>
      </div>
    </div>
    <div class="column is-one-quarter has-text-left current-temp">
      <span>${Math.round(data.currently.temperature)}&deg;</span>
    </div>
  `;
  const priamryDataEl = document.querySelector(".primary-conditions-data");
  priamryDataEl.innerHTML = primaryDataTemplate;
}

export function populateWeatherData(data) {
  const moonUi = getMoonUi(data);
  const weatherDataTemplate = `
    <div class="columns is-mobile is-vcentered">
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" title="Wind">
        <p>
          <i class="wi wi-fw wi-strong-wind"></i>
          <br>
          <i class="wi wi-fw wi-wind from-${data.currently.windBearing}-deg"></i>${Math.round(data.currently.windSpeed)}mph
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" title="Precipitation">
        <p>
          <i class="fas fa-fw fa-umbrella"></i>
          <br>
          ${Math.round(data.currently.precipProbability * 100)}%
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" title="UV">
        <p>
          <i class="fas fa-fw fa-sun"></i>
          <br>
          ${Math.round(data.currently.uvIndex)}
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" title="Visibility">
        <p>
          <i class="fas fa-fw fa-eye"></i>
          <br>
          ${data.currently.visibility}mi
        </p>
      </div>
      <div class="column is-hidden-mobile has-text-centered has-tooltip" title="Cloud Cover">
        <p>
          <i class="fas fa-fw fa-cloud"></i>
          <br>
          ${Math.round(data.currently.cloudCover * 100)}%
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" title="Sunrise">
        <p>
          <i class="wi wi-sunrise"></i>
          <br>
          ${formatUnixTimeForSun(data.daily.data[0].sunriseTime)}am
        </p>
      </div>
    </div>
    <div class="columns is-mobile is-vcentered">
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" title="Pressure">
        <p>
          <i class="wi wi-fw wi-barometer"></i>
          <br>
          ${Math.round(data.currently.pressure)}mb</i>
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" title="Humidity">
        <p>
          <i class="wi wi-fw wi-humidity"></i>
          <br>
          ${Math.round(data.currently.humidity * 100)}%
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" title="Dew Point">
        <p>
          <i class="wi wi-fw wi-raindrop"></i>
          <br>
          ${Math.round(data.currently.dewPoint)}&deg;</i>
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" title="Feels Like">
        <p>
          <i class="wi wi-fw wi-thermometer"></i>
          <br>
          ${Math.round(data.currently.apparentTemperature)}&deg;</i>
        </p>
      </div>
      <div class="column is-hidden-mobile has-text-centered has-tooltip" title="Moon">
        <p class="moon-phase">
          <i class="wi wi-fw ${moonUi.icon}"></i>
          <br>
          ${moonUi.phase}
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" title="Sunset">
        <p>
          <i class="wi wi-fw wi-sunset"></i>
          <br>${formatUnixTimeForSun(data.daily.data[0].sunsetTime)}pm
        </p>
      </div>
    </div>
  `;
  const weatherDataEl = document.querySelector(".current-weather-data");
  weatherDataEl.innerHTML = weatherDataTemplate;
}

export function populateForecastData(data, numDays = 7) {
  const forecastWrappers = `
    <div class="column is-mobile has-text-centered forecast-1 is-one-quarter-mobile"></div>
    <div class="column is-mobile has-text-centered forecast-2 is-one-quarter-mobile"></div>
    <div class="column is-mobile has-text-centered forecast-3 is-one-quarter-mobile"></div>
    <div class="column is-mobile has-text-centered forecast-4 is-one-quarter-mobile"></div>
    <div class="column is-mobile has-text-centered forecast-5 is-hidden-mobile"></div>
    <div class="column is-mobile has-text-centered forecast-6 is-hidden-touch"></div>
    <div class="column is-mobile has-text-centered forecast-7 is-hidden-touch"></div>
  `;
  const forecastWrappersEl = document.querySelector(".forecast-data");
  forecastWrappersEl.innerHTML = forecastWrappers;
  for (let i = 0; i < numDays; i++) {
    let next = i + 1;
    let forecastTemplate = `
      <p class="has-tooltip" title="${data.daily.data[next].summary}">
        <strong>${getDayFromUnixTime(data.daily.data[next].time)}</strong>
        <br>
        <i class="wi wi-fw wi-forecast-io-${data.daily.data[next].icon}"></i>
        <br>
        ${Math.round(data.daily.data[next].temperatureHigh)}&deg;/${Math.round(data.daily.data[next].temperatureLow)}&deg;
      </p>
    `;
    let forecastEl = document.querySelector(`.forecast-${next}`);
    forecastEl.innerHTML = forecastTemplate;
  }
}

export function populateHourlyData(data, numHours = 12) {
  const hourlyWrappers = `
    <div class="column has-text-centered hourly-1"></div>
    <div class="column has-text-centered hourly-2"></div>
    <div class="column has-text-centered hourly-3"></div>
    <div class="column has-text-centered hourly-4"></div>
    <div class="column has-text-centered hourly-5"></div>
    <div class="column has-text-centered hourly-6 is-hidden-mobile"></div>
    <div class="column has-text-centered hourly-7 is-hidden-mobile"></div>
    <div class="column has-text-centered hourly-8 is-hidden-touch"></div>
    <div class="column has-text-centered hourly-9 is-hidden-touch"></div>
    <div class="column has-text-centered hourly-10 is-hidden-touch"></div>
    <div class="column has-text-centered hourly-11 is-hidden-touch"></div>
    <div class="column has-text-centered hourly-12 is-hidden-touch"></div>
  `;
  const hourlyWrappersEl = document.querySelector(".hourly-data");
  hourlyWrappersEl.innerHTML = hourlyWrappers;
  for (let i = 0; i < numHours; i++) {
    let next = i + 1;
    let hourlyPopup = `
      <!-- more complete detail here -->
    `;
    let precipitationText = Math.floor(data.hourly.data[next].precipProbability * 100) ?
      `${Math.floor(data.hourly.data[next].precipProbability * 100)}% chance of ${data.hourly.data[next].precipType}` :
      "No precipitation";
    let hourlyTemplate = `
      <p class="has-tooltip" title="${data.hourly.data[next].summary}<br>${precipitationText}">
        <strong>${getHourAndPeriodFromUnixTime(data.hourly.data[next].time)}</strong>
        <br>
        <i class="wi wi-fw wi-forecast-io-${data.hourly.data[next].icon}"></i> ${Math.round(data.hourly.data[next].temperature)}&deg;
      </p>
    `;
    let hourlyEl = document.querySelector(`.hourly-${next}`);
    hourlyEl.innerHTML = hourlyTemplate;
  }
}

export function populateAlertMessage(title, msg, type, icon) {
  const alertMessageTemplate = `
    <article class="message is-${type}">
      <div class="message-header">
        <p><i class="${icon}"></i> ${title}</p>
        <span class="icon"><i class="fas fa-fw fa-plus-square"></i></span>
      </div>
      <div class="message-body">
        <p>${msg}</p>
      </div>
    </article>
  `;
  const alertContainer = document.querySelector(".alert-container");
  alertContainer.innerHTML = alertMessageTemplate;
  document.querySelector("article .message-body").classList.add(defaults.hideClassName);
  registerAlertClickHandler();
}

export function populateLastUpdated(data) {
  const lastUpdatedString = `
    Weather data cached at: ${formatUnixTimeAsLocalString(data.currently.time)}
    <br>
    Weather data is cached for 10 minutes.
    <br>
    Next data refresh available after:
    ${formatUnixTimeAsLocalString(data.currently.time + defaults.cacheTimeSpan)}
  `;
  const lastUpdatedTemplate = `
    <p class="last-updated has-tooltip" title="${lastUpdatedString}">
      Weather data last updated ${getTimeFromUnixTime(data.currently.time)}
    </p>
  `;
  const lastUpdatedEl = document.querySelector(".last-updated-time");
  lastUpdatedEl.innerHTML = lastUpdatedTemplate;
}

export function populateFooter() {
  const footerTemplate = `
    <div class="column">
      <div class="content has-text-right">
        <a href="https://localweather.io" title="LocalWeather.io ${defaults.versionString}">
          LocalWeather.io ${defaults.versionString}
        </a>
      </div>
    </div>
    <div class="column">
      <div class="content has-text-centered">
        <a href="https://darksky.net/poweredby/" target="_blank" rel="noopener" title="Powered by Dark Sky">
          <i class="fas fa-tint"></i> Powered by Dark Sky
        </a>
      </div>
    </div>
    <div class="column">
      <div class="content has-text-left">
        <a href="https://github.com/mikesprague/local-weather/" rel="noopener" target="_blank" title="Coded by Michael Sprague">
          <i class="fas fa-code"></i> by Michael Sprague
        </a>
      </div>
    </div>
  `;
  const footerEl = document.querySelector(".powered-by-dark-sky");
  footerEl.innerHTML = footerTemplate;
}
