import Bugsnag from '@bugsnag/js';
import { getData, resetData, useCache } from './cache.js';
import { defaults } from './defaults.js';
import { handleError } from './helpers.js';
import {
  hasApprovedLocationSharing,
  hideEl,
  hideLoading,
  initFontAwesomeIcons,
  initGeolocation,
  initTooltips,
  refreshLastUpdatedTime,
  showEl,
  showInstallAlert,
} from './ui.js';

const releaseStage = process.env.NODE_ENV || 'production';

let timerHandle = defaults.timerHandle;

window.bugsnagClient = Bugsnag.start({
  apiKey: 'c9beb7c090034128a89c8e58f261e972',
  appVersion: `${defaults.versionString}`,
  releaseStage,
  notifyReleaseStages: ['production'],
});

export function init() {
  if (!useCache(getData(defaults.cacheTimeKey))) {
    resetData();
  }

  window.onerror = (msg, url, lineNo, columnNo, error) => {
    hideLoading();
    handleError(error);
    return false;
  };

  const initOnline = () => {
    const initDataUpdateCheck = () => {
      if (timerHandle) {
        clearInterval(timerHandle);
      } else {
        clearInterval();
      }
      timerHandle = setInterval(() => {
        if (!useCache(getData(defaults.cacheTimeKey))) {
          init();
          return;
        }
        refreshLastUpdatedTime(getData(defaults.weatherDataKey));
        initTooltips();
      }, 10 * 1000); // (num seconds * 1000 milliseconds)
    };
    hideEl('.offline-notification');
    initFontAwesomeIcons();
    initTooltips();
    initGeolocation();
    initDataUpdateCheck();
  };

  const initOffline = () => {
    if (timerHandle) {
      clearInterval(timerHandle);
    } else {
      clearInterval();
    }
    showEl('.offline-notification');
    refreshLastUpdatedTime(getData(defaults.weatherDataKey));
    initFontAwesomeIcons();
    initTooltips();
  };

  window.addEventListener(
    'offline',
    () => {
      initOffline();
    },
    false
  );

  window.addEventListener(
    'online',
    () => {
      resetData();
      initOnline();
    },
    false
  );

  initOnline();
}
