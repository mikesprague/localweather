'use strict';

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
      console.log(`[SW] Registration successful with scope: ${registration.scope} `);
      registration.onupdatefound = () => {
        console.log('[SW] Update found, refresh browser to load it');
      };
    });
  }

  cache.initCache();
  data.getLocationAndPopulateAppData();
  data.initDataUpdateCheck();
  ui.initTooltips();
}
