"use strict";

import * as defaults from "./defaults";
import { initCache } from "./cache";
import { initFontAwesomeIcons, initTooltips, showGeolocationAlert, showInstallAlert, showLoading } from "./ui";
import { initDataUpdateCheck } from "./data";


export function init() {
  // const bugsnagClient = bugsnag("c9beb7c090034128a89c8e58f261e972", { appVersion: defaults.versionString });
  // register service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      const registration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
      // console.log(`[SW] Registration Successful With Scope ${registration.scope}`);
      // check for updatees
      registration.onupdatefound = () => {
        console.info(`[SW] Latest Version Installed - Reload to Activate`);
        window.bugsnagClient.leaveBreadcrumb("[SW] Latest Version Installed - Reload to Activate");
      };
    });
  }


  window.addEventListener("offline", () => {
    // TODO: add offline handler
    // window.bugsnagClient.leaveBreadcrumb("Browser offline");
    console.log("Browser offline");
  }, false);

  window.addEventListener("online", () => {
    // window.bugsnagClient.leaveBreadcrumb("Browser online");
    console.log("Browser online");
  }, false);

  // window.onerror = function (msg, url, lineNo, columnNo, error) {
  //   // handle error
  //   // console.error("ERROR", msg, url, lineNo, columnNo, error);
  //   bugsnagClient.notify(error);
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
