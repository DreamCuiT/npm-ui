import P8Wrapper from './src/index';

/* istanbul ignore next */
P8Wrapper.install = function(Vue) {
  Vue.component(P8Wrapper.name, P8Wrapper);
};

export default P8Wrapper;
