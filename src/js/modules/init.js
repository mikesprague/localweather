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
    }, 30000); // 5 minutes (5 * 6000 ms)
  };

  initCache();
  initGeolocation();
  initDataUpdateCheck();
  initTooltips();
}

export function initOffline() {
  initFontAwesomeIcons();
}
