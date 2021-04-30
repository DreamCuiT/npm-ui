import Vue from 'vue'
import Vuex from 'vuex'
// combined modules
import modules from './combindModules'
// import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  // getters
})
