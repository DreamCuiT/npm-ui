import P8Anchor from './src/index';

/* istanbul ignore next */
P8Anchor.install = function(Vue) {
  Vue.component(P8Anchor.name, P8Anchor);
};

export default P8Anchor;
