<template>
  <div :class="classes">
    <span class="resize-icon"></span>
    <!-- :class="up ? 'el-icon-caret-left' : 'el-icon-caret-right'" -->
  </div>
</template>

<script>
  export default {
    props: {
      split: {
        validator (value) {
          return ['vertical', 'horizontal'].indexOf(value) >= 0
        },
        required: true
      },
      className: String,
      up: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      classes () {
        const classes = ['splitter-pane-resizer', this.split, this.className]
        return classes.join(' ')
      }
    }
  }
</script>

<style lang="scss" scoped>
.splitter-pane-resizer {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  /* background: #000; */
  position: absolute;
  /* opacity: .2; */
  z-index: 1;
  -moz-background-clip: padding;
  -webkit-background-clip: padding;
  background-clip: padding-box;
}

.splitter-pane-resizer.horizontal {
  height: 11px;
  margin: -5px 0;
  border-top: 5px solid rgba(255, 255, 255, 0);
  border-bottom: 5px solid rgba(255, 255, 255, 0);
  cursor: row-resize;
  width: 100%;
}

.splitter-pane-resizer.vertical {
  width: 11px;
  height: 100%;
  margin-left: -8px;
  border-left: 5px solid rgba(255, 255, 255, 0);
  border-right: 5px solid rgba(255, 255, 255, 0);
  cursor: col-resize;
}

.splitter-pane-resizer .resize-icon {
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(-50%, -50%);
  /* font-size: 24px;
  color: #4185f4; */
  background: url('./resizer.png') no-repeat;
  background-size: 100% 100%;
  width: 32px;
  height: 32px;
}
</style>
