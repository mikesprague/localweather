'use strict';

import * as defaults from './modules/defaults';
import * as app from './modules/init';

document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    app.init();
  }
  // if (document.readyState === "complete") {
  //   console.log("Yo yo yo");
  //   fontawesome.dom.i2svg();
  // }
};
// window.onerror = function (msg, url, lineNo, columnNo, error) {
//   // ... handle error ...
//   return false;
// };
