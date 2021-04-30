import P8Search from './src/index';

/* istanbul ignore next */
P8Search.install = function(Vue) {
  Vue.component(P8Search.name, P8Search);
};

export default P8Search;
