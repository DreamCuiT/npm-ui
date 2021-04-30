// import { deepClone } from '../../utils/index'

const componentChild = {}
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', false, /\.js$/)
const keys = slotsFiles.keys() || []
keys.forEach(key => {
  const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = slotsFiles(key).default
  componentChild[tag] = value
})

function vModel (dataObject, defaultValue) {
  dataObject.props.value = defaultValue

  dataObject.on.input = val => {
    this.$emit('input', val)
  }
}

function mountSlotFlies (h, confClone, children) {
  const childObjs = componentChild[confClone.__config__.tag]
  if (childObjs) {
    Object.keys(childObjs).forEach(key => {
      const childFunc = childObjs[key]
      if (confClone.__slot__ && confClone.__slot__[key]) {
        children.push(childFunc(h, confClone, key))
      }
    })
  }
}

function emitEvents (confClone) {
  ['on', 'nativeOn'].forEach(attr => {
    const eventKeyList = Object.keys(confClone[attr] || {})
    eventKeyList.forEach(key => {
      const val = confClone[attr][key]
      if (typeof val === 'string') {
        confClone[attr][key] = event => this.$emit(val, event)
      }
    })
  })
}

function buildDataObject (confClone, dataObject, pageData) {
  Object.keys(confClone).forEach(key => {
    const val = confClone[key]
    if (key === '__vModel__') {
      if (confClone.__config__.variable && confClone.__config__.variable.startsWith('$')) { // 处理系统参数变量
        const paramArr = confClone.__config__.variable.trim().split('.')
        if (pageData[paramArr[0]]) {
          let defaultValue = pageData[paramArr[0]][paramArr[1]]
          vModel.call(this, dataObject, defaultValue)
          confClone.__config__.defaultValue = defaultValue
        } else if (paramArr[0] === '$COMPUTED' || paramArr[0] === '$LABEL') { // 计算器功能，目前只支持加法运算，支持资金label合计显示，803独有功能
          vModel.call(this, dataObject, confClone.__config__.defaultValue)
        }
      } else if (confClone.__config__.variable && confClone.__config__.variable.startsWith('#') && !confClone.__config__.defaultValue) { // 处理系统方法变量
        const variableFunName = confClone.__config__.variable.trim().slice(1)
        let defaultValue = this.$store.state.user.sysVars.methods[variableFunName]()
        vModel.call(this, dataObject, defaultValue)
        confClone.__config__.defaultValue = defaultValue
      } else {
        vModel.call(this, dataObject, confClone.__config__.defaultValue)
      }
    } else if (dataObject[key]) {
      dataObject[key] = { ...dataObject[key], ...val }
    } else {
      dataObject.attrs[key] = val
    }
  })

  // 清理属性
  clearAttrs(dataObject)
}

function clearAttrs (dataObject) {
  delete dataObject.attrs.__config__
  delete dataObject.attrs.__slot__
  delete dataObject.attrs.__methods__
}

function makeDataObject () {
  return {
    attrs: {},
    props: {},
    nativeOn: {},
    on: {},
    style: {}
  }
}

export default {
  props: {
    conf: {
      type: Object,
      required: true
    },
    // 页面级参数，包括系统参数级各种组件出参
    pageData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    watchPageData () {
      return this.pageData
    }
  },
  methods: {
    watchRender (h) {
      const dataObject = makeDataObject()
      // const confClone = deepClone(this.conf)
      const confClone = this.conf
      const children = this.$slots.default || []

      // 如果slots文件夹存在与当前tag同名的文件，则执行文件中的代码
      mountSlotFlies.call(this, h, confClone, children)

      // 将字符串类型的事件，发送为消息
      emitEvents.call(this, confClone)

      // 将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
      buildDataObject.call(this, confClone, dataObject, this.watchPageData)

      return h(this.conf.__config__.tag, dataObject, children)
    }
  },
  render (h) {
    return this.watchRender(h)
  }
}
