import P8ProcessApproval from '../bpm/src/processApprovalView';

P8ProcessApproval.install = function(Vue) {
  Vue.component(P8ProcessApproval.name, P8ProcessApproval);
};

export default P8ProcessApproval;
