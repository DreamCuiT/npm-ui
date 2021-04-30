import P8FileView from './src/index';

/* istanbul ignore next */
P8FileView.install = function(Vue) {
  Vue.component(P8FileView.name, P8FileView);
};

export default P8FileView;
