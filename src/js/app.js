'use strict';

import * as app from './modules/init';

window.addEventListener('offline', () => {
  location.replace('/offline.html')
});

window.addEventListener('online', () => {
  location.replace('/')
});

document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    app.init();
  }
};
