import P8Cron from './src/index';

/* istanbul ignore next */
P8Cron.install = function(Vue) {
  Vue.component(P8Cron.name, P8Cron);
};

export default P8Cron;
