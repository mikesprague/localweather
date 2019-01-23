import '../scss/styles.scss';
import { init } from './modules/init';

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    init();
  }
};
