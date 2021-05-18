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
    <div v-show="!isminimize" class="dialogBody" :class="{hiddenDialogFooter:!showHandlePlcomplateBtn && !isViewCsFooter}">
      <slot name="dialog"></slot>
    </div>
    <div v-show="!isminimize" v-if="showHandlePlcomplateBtn" class="dialogFooter">
      <el-button type="primary" @click="saveInfo">保 存</el-button>
    </div>
    <div v-show="!isminimize" v-if="!showHandlePlcomplateBtn && isViewCsFooter" class="dialogFooter">
      <slot name="cs-footer"></slot>
    </div>
  </el-dialog>
</template>
<script>
import { Dialog, Button } from 'element-ui'
export default {
  name: 'DragDialog',
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
    showHandlePlcomplateBtn:{//是否显示只有保存按钮
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
    saveInfo (e) {
      // console.log("进入---------------------------")
      this.$emit('save-info')
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

<style lang="scss">
.el-dialog {
  margin-top: 10vh !important;
  .title {
    font-size: 14px;
  }
}
.no_select {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
}
.isminimize {
  left: 20px;
  bottom: 20px;
  top: auto;
  right: auto;
  overflow: hidden;

  .el-dialog {
    margin: 0 !important;
    width: 240px !important;
    height: 48px;
    top: 0 !important;
    left: 0 !important;
  }
  .el-dialog__header {
    cursor: auto !important;

    .el-dialog__headerbtn {
      display: none;
    }
  }
  .dialogFooter {
    position: absolute;
    bottom: 0;
  }
}
.dragDialog {
  .el-dialog {
    .el-dialog__header {
      width: 100%;
      padding: 15px 10px 15px !important;
      display: flex;
      border-bottom: 1px solid $base-line-color;
      @extend .no_select;
      cursor: auto;
      .medium {
        width: 100%;
        height: 100%;
        display: flex;
        div {
          flex: 1;
        }
        .centers {
          span {
            text-align: center;
            font-size: 16px;
            color: #606266;
          }
        }
        .icons {
          display: flex;
          justify-content: flex-end;
          i {
            color: #909399;
            font-size: 18px !important;
            display: block;
            padding: 0 7px;
            cursor: pointer;
          }
          i:hover {
            color:$base-light-color;
          }
        }
      }
      .horn {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        div {
          i {
            color: #5f6368;
            font-size: 20px !important;
          }
        }
        .lefts {
          flex: 4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            font-size: 16px;
            color: #606266;
          }
        }
        .centers {
          flex: 1;
        }
        .rights {
          flex: 1;
        }
        i:hover {
          cursor: pointer;
          color: #000;
        }
      }
      .el-dialog__headerbtn {
        top: 0;
        font-size: 24px;
      }
    }
    .el-dialog__body {
      position:relative;
      height:var(--height);

      .dialogBody {
        height: calc(100% - 50px);
        // box-shadow: inset 0px -2px 10px 1px #b0b3b2;
        overflow: auto;
        // padding: 20px 25px 20px;
        background: $base-white-color;
        &::-webkit-scrollbar {
          width: 4px;
          height: 8px;
        }
        &::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 4px;
        }
        &:hover::-webkit-scrollbar-thumb {
          background: hsla(0, 0%, 53%, 0.4);
        }
        &:hover::-webkit-scrollbar-track {
          background: hsla(0, 0%, 53%, 0.1);
        }

        &.hiddenDialogFooter{
          height:100%;
        }
      }
      .dialogFooter {
        position:absolute;
        bottom:0;
        left:0;
        width:100%;
        padding: 10px 15px;
        border-top: 1px solid $base-line-color;
        text-align: right;
        box-sizing: border-box;
        .el-button {
          padding: 7px 15px;
        }
      }
    }
  }
  .is-fullscreen {
    width: 100% !important;
    left: 0 !important;
    top: 0 !important;
    margin-top: 0 !important;
    overflow: hidden;
    position: relative;
    .el-dialog__header {
      cursor: auto !important;
    }
    .el-dialog__body {
      height: calc(100% - 50px);
      .dialogBody {
        height: calc(100% - 50px) !important;
        max-height: none !important;

        &.hiddenDialogFooter{
          height:100%!important;
        }
      }
    }
    .dialogFooter {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: #fff;
    }
  }
  .dragDialog {
    // display: flex;
    // justify-content: center;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
}
</style>
