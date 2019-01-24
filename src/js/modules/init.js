import * as defaults from './defaults';
import { initCache } from './cache';
import {
  initFontAwesomeIcons,
  initTooltips,
  initGeolocation,
  hasApprovedLocationSharing,
  showInstallAlert,
  hideLoading,
} from './ui';
import { loadFromCache } from './data';

export function init() {
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

  window.isUpdateAvailable.then((updateAvailable) => {
    if (updateAvailable) {
      showInstallAlert();
    }
  });

  window.addEventListener('offline', () => {
    // TODO: add offline handler
    console.log('Browser offline');
  }, false);

  window.addEventListener('online', () => {
    // TODO: add online handler
    console.log('Browser online');
  }, false);

  window.onerror = () => {
    // console.error('ERROR', msg, url, lineNo, columnNo, error);
    hideLoading();
    // return false;
  };

  const checkIfDataUpdateNeeded = () => {
    if (!loadFromCache) {
      init();
    }
  };

  const initDataUpdateCheck = () => {
    if (defaults.timerHandle) {
      clearInterval(defaults.timerHandle);
    } else {
      clearInterval();
    }
    defaults.timerHandle = setInterval(() => {
      checkIfDataUpdateNeeded();
    }, 30000); // 10 minutes (10 * 6000 ms)
  };

  if (defaults.isOnline()) {
    initCache();
    initGeolocation();
    initDataUpdateCheck();
  } else {
    initFontAwesomeIcons();
  }
  initTooltips();
}
