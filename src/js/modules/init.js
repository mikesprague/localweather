import * as defaults from "./defaults";
import { populateAppShell } from "./templates";
import { initCache } from "./cache";
import { initFontAwesomeIcons, initTooltips, showGeolocationAlert } from "./ui";
import { initDataUpdateCheck } from "./data";

export function init() {
  if ("serviceWorker" in navigator) {
    // register service worker
    window.addEventListener("load", async () => {
      const registration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
      // console.log(`[SW] Registration Successful With Scope ${registration.scope}`);
      // check for updatees
      registration.onupdatefound = () => {
        console.info(`[SW] Latest Version Installed - Reload to Activate`);
      };
    });

    // this.clients.matchAll().then(clients => {
    //   clients.forEach(client => client.postMessage("Latest Version Installed"));
    // });
  }

  // window.addEventListener("message", event => {
  //   console.log(event);
  // }, false);

  window.addEventListener("offline", () => {
    // TODO: add offline handler
    console.log("Browser offline");
  }, false);

  window.addEventListener("online", () => {
    // TODO: add online handler
    console.log("Browser online");
  }, false);

  // window.onerror = function (msg, url, lineNo, columnNo, error) {
  //   console.error("ERROR", msg, url, lineNo, columnNo, error);
  //   // return false;
  // };

  if (defaults.isOnline()) {
    populateAppShell();
    initCache();
    showGeolocationAlert();
    initDataUpdateCheck();
  } else {
    initFontAwesomeIcons();
  }
  initTooltips();
}
