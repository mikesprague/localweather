import '../scss/styles.scss';
import { init } from './modules/init';
import { initFontAwesomeIcons, hasApprovedLocationSharing } from './modules/ui';

window.addEventListener('offline', () => {
  // console.log('Browser offline');
  window.location.replace('/offline.html');
  // TODO: improve offline experience
  //  - make last retrieved weather data viewable
  //  - pause update checks until online
  //    - add functions for pause and resume
  //  - make offline notice across top above location
}, false);

window.addEventListener('online', () => {
  // console.log('Browser online');
  window.location.replace('/');
}, false);

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    if (hasApprovedLocationSharing()) {
      init();
    } else {
      initFontAwesomeIcons();
      document.querySelector('.btn-init-app').addEventListener('click', () => {
        init();
      });
    }
  }
};
