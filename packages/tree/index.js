import P8Tree from './src/index';

/* istanbul ignore next */
P8Tree.install = function(Vue) {
  Vue.component(P8Tree.name, P8Tree);
};

export default P8Tree;
