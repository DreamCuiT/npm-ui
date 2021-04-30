import Cookie from 'vue-cookie'
import { getSession, removeSession } from './session'

import store from '~/store'
const { GLOBAL_CONST } = store.state.sysConfig
const TOKEN_KEY = GLOBAL_CONST.token.tokenKey

function getToken () {
  return Cookie.get(TOKEN_KEY) ? Cookie.get(TOKEN_KEY) : getSession(TOKEN_KEY)
}


function removeToken () {
  Cookie.get(TOKEN_KEY) ? Cookie.delete(TOKEN_KEY) : removeSession(TOKEN_KEY)
}

export {
  getToken,
  removeToken
}
