
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
        state: {
          sysConfig:{}
        },
        mutations: {
          SET_SYSCONFIG (state, data) {
            state.sysConfig = data
          },
        },
        actions: {
          ASYNC_SET_SYSCONFIG ({ commit }, data) {
            commit('SET_SYSCONFIG', data)
          }
        }
})
