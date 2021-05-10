// import { API_DEFAULT_CONFIG } from '@/config/settings'
import store from '~/store'
const { API_DEFAULT_CONFIG } = store.state.sysConfig
const uploadUrl = () => {
  let { devBaseUrl, prodBaseUrl, isDevMode } = API_DEFAULT_CONFIG
  let urlPrefix = isDevMode ? `${devBaseUrl}` : `${prodBaseUrl}`
  return urlPrefix + '/attachment/upload'
}

/**
 * @function downloadFile 附件下载
 * @param {*} file 附件
 * @param {*} comp this 代表当前页面 用于提示信息
 * @param {*} bindKey 文件下载所需字段的key, 该字段不传则使用默认值
 *                    fileIdKey: 文件id对应key / fileNameKey: 文件name对应的key / confValueKey: 文件密级对应key
 */
const downloadFile = (file, comp, bindKey = { fileIdKey: 'id', fileNameKey: 'fileName', confValueKey: 'confidentialite' }) => {
  if (!comp) {
    console.error('downloadFile : 文件下载方法缺少指定参数-comp[this对象]')
    return
  }
  const normalKey = { fileIdKey: 'id', fileNameKey: 'fileName', confValueKey: 'confidentialite' }
  // bindKey = { ...normalKey, ...bindKey }
  const userConfidentialiteList = store.user.state.userInfo.confidentialiteList
  if (file[bindKey.confValueKey]) {
    let filter = userConfidentialiteList.filter(item => item.id === file[bindKey.confValueKey])
    if (!filter.length) {
      comp.$message({
        type: 'error',
        message: '密级权限不足，无法下载查看'
      })
      return
    }
  }
  if (!file[bindKey.fileIdKey]) {
    comp.$message({
      type: 'error',
      message: '文件Id不存在, 请先保存数据'
    })
    return
  }
  comp.$api['SystemSettings.getFileUrl']({ attachmentId: file[bindKey.fileIdKey] }, { responseType: 'blob' }).then(backJson => {
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(new Blob([backJson.data]))
    link.download = file[bindKey.fileNameKey]
    document.body.appendChild(link)

    link.click()
    window.URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  }).catch(err => {
    if (err.type === 'application/json') {
      comp.$message({
        type: 'error',
        message: '文件不存在'
      })
    }
  }).finally(() => {
    // this.search.exportLoading = false
  })
}

const uploadDefaultRules = () => {
  return [
    {
      validator: (rule, value) => {
        return new Promise((resolve, reject) => {
          if (value && value.length) {
            let temp = 0
            value.forEach(file => {
              if (!file.confidentialite) {
                temp += 1
              }
            })
            if (temp) {
              let rejectMsg = '请选择文件对应密级'
              reject(rejectMsg)
            } else {
              resolve()
            }
          } else {
            resolve()
          }
        })
      }
    }
  ]
}

/**
 * @function getConfidentialiteLabel 获取附件密级对应的文本
 * @param {*} file 附件
 * @param {*} confValueKey 附件密级value值对应的key
 */
const getConfidentialiteLabel = (file, confValueKey = 'confidentialite') => {
  const systemSecrets = store.getters.systemSecretConfig
  let filter = systemSecrets.filter(item => item.value === file[confValueKey])
  if (filter.length) {
    return filter[0].label
  }
}

export {
  uploadUrl,
  downloadFile,
  uploadDefaultRules,
  getConfidentialiteLabel
}
