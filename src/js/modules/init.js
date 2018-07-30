'use strict';

import * as defaults from './defaults';
import * as cache from './cache';
import * as ui from './ui';
import * as data from './data';

export function init() {
  // register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      // registration was successful
      // console.log(`[SW] Registration Successful With Scope ${registration.scope}`);
      // check for updatees
      registration.onupdatefound = () => {
        console.info(`[SW] New Version Found - Refresh Browser to Load`);
        ui.showInstallAlert();
      };
    });
  }

  window.addEventListener('offline', () => {
    location.replace('/offline.html')
  }, false);

  window.addEventListener('online', () => {
    location.replace('/')
  }, false);

  // window.onerror = function (msg, url, lineNo, columnNo, error) {
  //   // handle error
  //   console.error("ERROR", msg, url, lineNo, columnNo, error);
  //   return false;
  // };

  if (defaults.isOnline()) {
    cache.initCache();
    data.getLocationAndPopulateAppData();
    data.initDataUpdateCheck();
    ui.initTooltips();
  } else {
    ui.initFontAwesomeIcons();
    ui.initTooltips();
  }
}
