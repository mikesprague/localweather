'use strict';

import * as defaults from './defaults';
import * as cache from './cache';
import * as data from './data';
import * as ui from './ui';

export function init() {
  // register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      // registration was successful
      console.log(`[SW] Registration Successful With Scope ${registration.scope}`);
      // check for updatees
      registration.onupdatefound = () => {
        console.info('[SW] New Version Found - Refresh Browser to Load');
      };
    });
  }

  window.addEventListener('online', function (e) {
    defaults.isOnline = true;
  }, false);

  window.addEventListener('offline', function (e) {
    defaults.isOnline = false;
  }, false);

  window.onerror = function (msg, url, lineNo, columnNo, error) {
    // handle error
    console.error("ERROR", msg, url, lineNo, columnNo, error);
    return false;
  };

  cache.initCache();
  data.getLocationAndPopulateAppData();
  data.initDataUpdateCheck();
  ui.initTooltips();
}
