import P8Contextmenu from './src/contextmenu';

/* istanbul ignore next */
P8Contextmenu.install = function(Vue) {
  Vue.component(P8Contextmenu.name, P8Contextmenu);
};

export default P8Contextmenu;
