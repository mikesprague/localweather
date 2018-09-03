"use strict";

import * as app from "./modules/init";

document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    app.init();
  }
};
