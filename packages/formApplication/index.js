import FormApplication from '../formGenerator/components/parser/Parser.vue';

/* istanbul ignore next */
FormApplication.install = function(Vue) {
  Vue.component(FormApplication.name, FormApplication);
};

export default FormApplication;
