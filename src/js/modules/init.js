import bugsnag from '@bugsnag/js';
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

window.bugsnagClient = bugsnag({
  apiKey: 'c9beb7c090034128a89c8e58f261e972',
  appVersion: `${defaults.versionString}`,
  releaseStage,
  notifyReleaseStages: ['development', 'production'],
});

export function registerServiceWorker() {
  window.isUpdateAvailable = new Promise((resolve) => {
    if ('serviceWorker' in navigator) {
      // register service worker
      window.addEventListener('load', async () => {
        const registration = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
        // console.log(`[SW] Registration Successful With Scope ${registration.scope}`);
        // check for updatees
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (
              installingWorker.state === 'installed'
              && navigator.serviceWorker.controller
              && hasApprovedLocationSharing()
            ) {
              resolve(true);
            } else {
              resolve(false);
            }
          };
        };
      });
    }
  });
}

registerServiceWorker();

export function init() {
  window.isUpdateAvailable.then((updateAvailable) => {
    if (updateAvailable) {
      showInstallAlert();
    }
  });

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
