<template>
  <el-dialog
    v-dialogDrag
    ref="dragDialog"
    class="dragDialog"
    :title="title"
    :fullscreen="isfullscreen"
    :visible="visible"
    :append-to-body="true"
    destroy-on-close
    :close-on-click-modal="false"
    :show-close="false"
    :width="width"
    :class="isminimize ? 'isminimize' : ''"
    v-bind="dialogConfig"
    :style="{ '--height': renderDialogHeight + 'px' }"
  >
    <div v-show="!isminimize" slot="title" class="medium">
      <div class="title">
        <span>{{ title }}</span>
      </div>
      <div class="icons">
        <!-- <i class="el-icon-minus" style="font-size: 24px" @click="minimize"></i> -->
        <i
          :class="
            isfullscreen ? 'p8 icon-dialog-exit-fullscreen' : 'p8 icon-dialog-fullscreen'
          "
          @click="isFullscreen"
        ></i>
        <i
          class="p8 icon-close"
          style="font-size: 17px!important;"
          @click="closeDialog"
        ></i>
      </div>
    </div>
    <div v-show="isminimize" slot="title" class="horn">
      <div class="lefts title">
        <span>{{ title }}</span>
      </div>
      <div class="centers">
        <i
          class="p8 icon-dialog-fullscreen"
          @click="minimize"
        ></i>
      </div>
      <div class="rights">
        <i
          class="el-icon-close"
          style="font-size: 17px!important;"
          @click="closeDialog"
        ></i>
      </div>
    </div>
    <div v-show="!isminimize" class="dialogBody" :class="{hiddenDialogFooter:!showHandleBtn && !isViewCsFooter}">
      <slot name="dialog"></slot>
    </div>
    <div v-show="!isminimize" v-if="showHandleBtn" class="dialogFooter">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </div>
    <div v-show="!isminimize" v-if="!showHandleBtn && isViewCsFooter" class="dialogFooter">
      <slot name="cs-footer"></slot>
    </div>
  </el-dialog>
</template>
<script>
import { Dialog, Button } from 'element-ui'
export default {
  name: 'P8Dragdialog',
  componentName: 'P8Dragdialog',
  components: {
    'el-dialog': Dialog,
    'el-button': Button
  },
  data () {
    const mh = document.documentElement.clientHeight - 300
    return {
      dialogMaxHeight: mh + 'px',
      isfullscreen: false, // 全屏
      isminimize: false // 最小化
    }
  },
  props: {
    width: {
      type: String,
      default: '50%'
    },
    title: {
      type: String,
      default: ''
    },
    showHandleBtn: { // 是否显示脚部
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      defalut: false
    },
    dialogConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dialogHeight: {
      type: Number,
      default: 400
    },
    isViewCsFooter: {
      type: Boolean,
      defalut: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        const el = this.$refs.dragDialog.$el.querySelector('.el-dialog')
        el.style.left = 0
        el.style.top = 0
      }
    }
  },
  computed: {
    renderDialogHeight () {
      return this.dialogHeight > this.dialogMaxHeight ? this.dialogMaxHeight : this.dialogHeight
    }
  },
  methods: {
    // 最小化
    minimize () {
      this.isminimize = !this.isminimize
      if (this.isfullscreen) this.isfullscreen = !this.isfullscreen
    },
    handleCancel () {
      this.$emit('handle-cancel')
    },
    handleOk (e) {
      this.$emit('handle-ok')
    },
    // 关闭弹窗
    closeDialog () {
      this.$emit('close')
    },
    // 全屏
    isFullscreen () {
      this.isfullscreen = !this.isfullscreen
      this.$emit('isfullscreen', this.isfullscreen)
    }
  },
  directives: {
    dialogDrag: {
      bind (el, binding, vnode, oldVnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header')
        const dragDom = el.querySelector('.el-dialog')
        dialogHeaderEl.style.cursor = 'move'
        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
        // const fixedX =
        // const fixedY =
        dialogHeaderEl.onmousedown = (e) => {
          // 判断当前是否为全屏状态
          const path = event.path || (event.composedPath && event.composedPath())
          const isFull = path.find(s => {
            if (s.className === undefined) {
              return false
            } else {
              return s.className.indexOf('is-fullscreen') > -1
            }
          })
          if (isFull !== undefined) {
            return
          }
          const isMinix = path.find(s => {
            if (s.className === undefined) {
              return false
            } else {
              return s.className.indexOf('isminimize') > -1
            }
          })
          if (isMinix !== undefined) {
            return
          }
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - dialogHeaderEl.offsetLeft
          const disY = e.clientY - dialogHeaderEl.offsetTop

          // 获取到的值带px 正则匹配替换
          let styL, styT

          // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
          if (sty.left.includes('%')) {
            styL = +document.body.clientWidth * (+sty.left.replace('%', '') / 100)
            styT = +document.body.clientHeight * (+sty.top.replace('%', '') / 100)
          } else {
            styL = +sty.left.replace('px', '')
            styT = +sty.top.replace('px', '')
          }

          document.onmousemove = function (e) {
            // 通过事件委托，计算移动的距离
            const l = e.clientX - disX
            const t = e.clientY - disY
            // 移动当前元素
            dragDom.style.left = `${l + styL}px`
            dragDom.style.top = `${t + styT}px`
            // const dom = e.path.find(s => s.querySelector('.el-dialog')).children[0]
            //
            // if (dom.offsetTop < 0) {
            //   dragDom.style.top = `0px`
            // }
            // if (dom.offsetLeft < 0) {
            //   dragDom.style.left = `0px`
            // }

            // 将此时的位置传出去
            // binding.value({x:e.pageX,y:e.pageY})
          }

          document.onmouseup = function (e) {
            const dragDom = el.querySelector('.el-dialog')
            const offsetLeft = dragDom.offsetLeft
            const offsetTop = dragDom.offsetTop
            const left = Number(dragDom.style.left.replace('px', ''))
            const top = Number(dragDom.style.top.replace('px', ''))
            const windowWidth = window.innerWidth
            const windowHeight = window.innerHeight - 50
            const offsetRight = offsetLeft + dragDom.offsetWidth - windowWidth
            const offsetBottom = offsetTop + dragDom.offsetHeight - windowHeight
            // 拖拽边界控制
            if (offsetLeft < 0 && offsetTop < 0) { // 左上
              dragDom.style.left = (left - offsetLeft + 30) + 'px'
              dragDom.style.top = (top - offsetTop + 30) + 'px'
            } else if (offsetRight > 0 && offsetTop < 0) { // 右上
              dragDom.style.left = (left - offsetRight - 30) + 'px'
              dragDom.style.top = (top - offsetTop + 30) + 'px'
            } else if (offsetLeft < 0 && offsetBottom > 0) { // 左下
              dragDom.style.left = (left - offsetLeft + 30) + 'px'
              dragDom.style.top = (top - offsetBottom) + 'px'
            } else if (offsetRight > 0 && offsetBottom > 0) { // 右下
              dragDom.style.left = (left - offsetRight - 30) + 'px'
              dragDom.style.top = (top - offsetBottom) + 'px'
            } else if (offsetLeft < 0) { // 左
              dragDom.style.left = (left - offsetLeft + 30) + 'px'
            } else if (offsetTop < 0) { // 上
              dragDom.style.top = (top - offsetTop + 30) + 'px'
            } else if (offsetRight > 0) { // 右
              dragDom.style.left = (left - offsetRight - 30) + 'px'
            } else if (offsetBottom > 0) { // 下
              dragDom.style.top = (top - offsetBottom) + 'px'
            }
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  }
}
</script>

