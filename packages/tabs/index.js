import P8Tabs from './src/index';

/* istanbul ignore next */
P8Tabs.install = function(Vue) {
  Vue.component(P8Tabs.name, P8Tabs);
};

export default P8Tabs;
