import P8Bpm from './src/index';
import P8ProcessApproval from './src/processApprovalView';
import P8ProcessDefinition from './src/processDefinitionView';

/* istanbul ignore next */
P8Bpm.install = function(Vue) {
  Vue.component(P8Bpm.name, P8Bpm);
};
P8ProcessApproval.install = function(Vue) {
  Vue.component(P8ProcessApproval.name, P8ProcessApproval);
};
P8ProcessDefinition.install = function(Vue) {
  Vue.component(P8ProcessDefinition.name, P8ProcessDefinition);
};

export {
  P8Bpm,
  P8ProcessApproval,
  P8ProcessDefinition
};
