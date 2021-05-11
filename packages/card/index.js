import P8Card from './src/index';

/* istanbul ignore next */
P8Card.install = function(Vue) {
  Vue.component(P8Card.name, P8Card);
};

export default P8Card;
