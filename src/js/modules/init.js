import bugsnag from '@bugsnag/js';
import LogRocket from 'logrocket';
import { register } from 'register-service-worker';
import * as defaults from './defaults';
import {
  initCache,
  getData,
} from './cache';
import {
  initFontAwesomeIcons,
  initTooltips,
  initGeolocation,
  hasApprovedLocationSharing,
  refreshLastUpdatedTime,
  showInstallAlert,
} from './ui';
import { loadFromCache } from './data';

const releaseStage = process.env.NODE_ENV || 'production';

LogRocket.init('skxlwh/localweatherio');

bugsnag.beforeNotify = (data) => {
  /* eslint-disable no-param-reassign */
  data.metaData.sessionURL = LogRocket.sessionURL;
  /* eslint-enable no-param-reassign */
  return data;
};

window.bugsnagClient = bugsnag({
  apiKey: 'c9beb7c090034128a89c8e58f261e972',
  appVersion: `${defaults.versionString}`,
  releaseStage,
  notifyReleaseStages: ['development', 'production'],
});

export function registerServiceWorker() {
  register('/service-worker.js', {
    // ready() {
    //   console.log('Service worker is active.');
    // },
    // registered(registration) {
    //   console.log('Service worker has been registered.', registration);
    // },
    // cached(registration) {
    //   console.log('Content has been cached for offline use.', registration);
    // },
    // updatefound(registration) {
    //   console.log('New content is downloading.', registration);
    // },
    updated() { // updated(registration)
      if (hasApprovedLocationSharing()) {
        showInstallAlert();
      }
    },
    offline() {
      console.info('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
}

registerServiceWorker();

export function init() {
  // window.onerror = (msg, url, lineNo, columnNo, error) => {
  //   console.error('ERROR', msg, url, lineNo, columnNo, error);
  //   hideLoading();
  //   /* eslint-disable no-undef */
  //   bugsnagClient.notify(new Error(msg)); // defined in html page
  //   /* eslint-enable no-undef */
  //   return false;
  // };

  const initDataUpdateCheck = () => {
    if (defaults.timerHandle) {
      clearInterval(defaults.timerHandle);
    } else {
      clearInterval();
    }
    defaults.timerHandle = setInterval(() => {
      if (!loadFromCache()) {
        init();
        return;
      }
      refreshLastUpdatedTime(getData(defaults.weatherDataKey));
      initTooltips();
    }, (10 * 1000)); // (num seconds * 1000 milliseconds)
  };

  initCache();
  initGeolocation();
  initDataUpdateCheck();
  initTooltips();
}

export function initOffline() {
  initFontAwesomeIcons();
}
