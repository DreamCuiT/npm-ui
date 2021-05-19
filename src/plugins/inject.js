// import websocket from '@/plugins/websocket'
// import promise from './promise'
import contextmenu from '../directives/contextmenu.js';
import { Loading, MessageBox, Message } from 'element-ui'
// 系统错误捕获
const errorHandler = (error, vm, info) => {
  console.error(`${error.toString()}`)
}
export default {
  install (Vue, opts = {}) {
    // 框架基础需求的element-ui components
    Vue.prototype.$loading = Loading.service
    Vue.prototype.$message = Message
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$prompt = MessageBox.prompt
    Vue.prototype.$ELEMENT = { size: 'small' }
    Vue.prototype.$bus = new Vue() // 事件传递: 嵌套深层组件(两层以上)时, 内层组件的操作影响外层组件中的数据时, 可以使用,否则不建议使用 
    Vue.config.errorHandler = errorHandler
    Vue.prototype.$throw = (error) => errorHandler(error, this)
    // Vue.use(promise)
    // Vue.use(websocket)
    Vue.use(Loading.directive)
    // elementUI select下拉框选择图标回显
    Vue.directive('contextmenu', contextmenu)
    Vue.directive('select-icon', {
      /**
       * 指令的钩子函数
       *  bind: 第一次绑定到元素时调用
       *  unbind: 解绑时调用, 也只调用一次
       *  insert: 绑定元素插入父节点时调用
       *  update: 所在节点虚拟dom更新时调用
       *  componentUpdated: 所在节点及子节点所有虚拟dom更新时调用
       * 钩子函数参数: fn(el, binding)
       *  el: 绑定的dom对象
       *  binding: 对象,包含以下属性
       *    name: 指令名, 不包含 v- 前缀, 只是自己起的自定义指令的名字 如: select-icon
       *    rawName: 指令名, 包含 v- 前缀, 使用时书写的全部 如: v-select-icon:tt.stop
       *    value: 指令绑定的值 使用: v-selectIcon="bindValue"
       *    oldValue: 指定绑定的前一个值
       *    arg: 传给指令的参数名 / 值(动态传递), 可选 非动态参数: v-select-icon:bindValue / 动态参数: v-selectIcon:[bindValue] 这种可接收到传递的值
       *    oldArg: 指令参数的 名字 / 前一个值 对应上面arg用法的值
       *    expression: 字符串形式的指令表达式.
       *    modifiers: 包含修饰符的对象 如: {stop: true}
       */
      bind (el, binding) {
        // console.log(el, binding, '自定义指令-bind')
        if (binding.value) {
          const iconDom = document.createElement('span')
          iconDom.setAttribute('class', 'el-input__prefix--custom')
          let classValue = binding.arg.filter(item => item.value === binding.value)[0].label
          iconDom.innerHTML = `<i class="${classValue}"></i>`
          el.children[0].appendChild(iconDom)
          const inputDom = el.children[0].children[0]
          el.children[0].insertBefore(iconDom, inputDom)
        }
      },
      unbind (el, binding) {
        // console.log(el, binding, '自定义指令-unbind')
      },
      insert (el, binding) {
        // console.log(el, binding, '自定义指令-insert')
      },
      undate (el, binding) {
        console.log(el, binding, '自定义指令-undate')
      },
      componentUpdated (el, binding) {
        // console.log(el, binding, '自定义指令-componentUpdated')
        if (binding.value) {
          // value(v-model绑定的值)有值
          const icon = el.children[0].children[0].children[0]
          if (binding.oldValue && icon) {
            // 旧值存在(表示change)且icon元素也存在: 此时更新icon的class类名
            const icon = el.children[0].children[0].children[0]
            let classValue = binding.arg.filter(item => item.value === binding.value)[0].label
            icon.setAttribute('class', classValue)
          } else {
            // 创建icon回显的元素并绑定class类名,并插入input框的前面[添加到父节点(第二层div)]
            const iconDom = document.createElement('span')
            iconDom.setAttribute('class', 'el-input__prefix--custom')
            let classValue = binding.arg.filter(item => item.value === binding.value)[0].label
            iconDom.innerHTML = `<i class="${classValue}"></i>`
            el.children[0].appendChild(iconDom)
            const inputDom = el.children[0].children[0]
            el.children[0].insertBefore(iconDom, inputDom)
          }
        } else {
          /**
           * value没值
           *  1. 表示清空 此时删除手动创建的元素 [根据获取到的dom的class名进行判断后进行删除操作]
           *  2. 当前select存在的页面初始加载时(v-if控制), 也会被触发, 此时不需要清空
          */
          const removeDom = el.children[0].children[0]
          let removeClass = removeDom.getAttribute('class')
          if (removeClass.indexOf('el-input__inner') === -1) {
            el.children[0].removeChild(removeDom)
          }
        }
      }
    })
  }
}
