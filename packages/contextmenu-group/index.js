import P8ContextmenuGroup from '../contextmenu/src/contextmenu-group';

/* istanbul ignore next */
P8ContextmenuGroup.install = function(Vue) {
  Vue.component(P8ContextmenuGroup.name, P8ContextmenuGroup);
};

export default P8ContextmenuGroup;
