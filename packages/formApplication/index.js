import FormApplication from '../formGenerator/components/parser/parser';

/* istanbul ignore next */
FormApplication.install = function(Vue) {
  Vue.component(FormApplication.name, FormApplication);
};

export default FormApplication;
