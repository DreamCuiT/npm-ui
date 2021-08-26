

const componentChild = {}
/**
 * 将./custom中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const customFiles = require.context('./custom', false, /\index.js$/)
const keys = customFiles.keys() || []
keys.forEach(key => {
  // const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = customFiles(key).default
  componentChild[value.name] = value
})

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
      // mountSlotFlies.call(this, h, confClone, children)

      // 将字符串类型的事件，发送为消息
      // emitEvents.call(this, confClone)

      // 将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
      // buildDataObject.call(this, confClone, dataObject, this.watchPageData)

      return h(this.conf.__config__.tag, dataObject, children)
    }
  },
  render (h) {
    return this.watchRender(h)
  }
}
