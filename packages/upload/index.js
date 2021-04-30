import P8Upload from './src/index';

/* istanbul ignore next */
P8Upload.install = function(Vue) {
  Vue.component(P8Upload.name, P8Upload);
};

export default P8Upload;
