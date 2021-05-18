import P8SplitPane from './src/index';

/* istanbul ignore next */
P8SplitPane.install = function(Vue) {
  Vue.component(P8SplitPane.name, P8SplitPane);
};

export default P8SplitPane;
