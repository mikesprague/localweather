"use strict";

import * as defaults from "./defaults";
import { initCache } from "./cache";
import { initFontAwesomeIcons, initTooltips, showGeolocationAlert, showInstallAlert, showLoading } from "./ui";
import { initDataUpdateCheck } from "./data";

export function init() {
  // register service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      const registration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
      // registration was successful
      // console.log(`[SW] Registration Successful With Scope ${registration.scope}`);
      // check for updatees
      registration.onupdatefound = () => {
        // showInstallAlert();
        console.info(`[SW] Latest Version Installed - Reload to Activate`);
      };
    });
  }

  window.addEventListener("offline", () => {
    location.replace("/offline.html");
  }, false);

  window.addEventListener("online", () => {
    location.replace("/");
  }, false);

  // window.onerror = function (msg, url, lineNo, columnNo, error) {
  //   // handle error
  //   console.error("ERROR", msg, url, lineNo, columnNo, error);
  //   return false;
  // };

  if (defaults.isOnline()) {
    initCache();
    showGeolocationAlert();
    initDataUpdateCheck();
    initTooltips();
  } else {
    initFontAwesomeIcons();
    initTooltips();
  }
}
