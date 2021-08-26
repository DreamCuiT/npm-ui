import FormApplicationView from '../formGenerator/components/parser/parserView.vue';

/* istanbul ignore next */
FormApplicationView.install = function(Vue) {
  Vue.component(FormApplicationView.name, FormApplicationView);
};

export default FormApplicationView;
