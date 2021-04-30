const API_DEFAULT_CONFIG  = {
  devBaseUrl: 'http://192.168.0.96:9090',
  prodBaseUrl: 'http://192.168.0.96:9090',
  isDevMode: process.env.NODE_ENV !== 'production',
  isDebug: false,
  sep: '.'
}
const AXIOS_DEFAULT_CONFIG = {
  timeout: 5000
}
const GLOBAL_CONST = {
  token: {
    tokenKey: `基于流程精益化管理系统_PLATFORM`
  },
}

export default {
  API_DEFAULT_CONFIG,
  AXIOS_DEFAULT_CONFIG,
  GLOBAL_CONST
}