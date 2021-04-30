import FormGenerator from './views/index';

/* istanbul ignore next */
FormGenerator.install = function(Vue) {
  Vue.component(FormGenerator.name, FormGenerator);
};

export default FormGenerator;
