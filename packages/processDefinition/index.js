import P8ProcessDefinition from '../bpm/src/processDefinitionView';

P8ProcessDefinition.install = function(Vue) {
  Vue.component(P8ProcessDefinition.name, P8ProcessDefinition);
};

export default P8ProcessDefinition;
