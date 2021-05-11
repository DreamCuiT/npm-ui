import P8InfiniteScroll from './src/index';

/* istanbul ignore next */
P8InfiniteScroll.install = function(Vue) {
  Vue.component(P8InfiniteScroll.name, P8InfiniteScroll);
};

export default P8InfiniteScroll;
