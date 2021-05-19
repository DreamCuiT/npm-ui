<template>
  <div class="icon-selector-wrap">
    <div class="operation" v-if="existDefaultBtn || colorPicker">
      <el-button v-if="existDefaultBtn" type="primary" plain class="btn-save" @click="handleSaveSelected">确定</el-button>
      <div class="selected-color" v-if="colorPicker">
        <span>选择颜色: </span>
        <el-color-picker
          class="btn-color"
          v-model="color"
          size="mini"
          show-alpha
          :predefine="predefineColors"
          @change="handleColorChange">
        </el-color-picker>
      </div>
    </div>
    <el-tabs class="icon-tabs-wrap" v-model="tabActive" @tab-click="handleClick" :style="{height: (existDefaultBtn || colorPicker) ? 'calc(100% - 50px)' : '100%'}">
      <el-tab-pane v-for="item in iconJson" :key="item.key" :label="item.title" :name="item.key">
        <ul class="icon-list">
          <VuePerfectScrollbar class="scroll-area">
            <li v-for="(name,cindex) in item.icons" :key="cindex" :style="{color}" :class="{'active': activeClassHandle(name)}" @click="handleSelectIcon(name, item.key)">
              <span>
                <p-icon :name="name" :prefixName="item.key"></p-icon>
              </span>
            </li>
          </VuePerfectScrollbar>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { Tabs, TabPane, Button, ColorPicker } from 'element-ui'
import Icon from '../components/icon'
import iconJson from './iconJson'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
export default {
  name: 'P8IconSelector',
  componentName: 'P8IconSelector',
  props: {
    selectedName: { // 选中图标的名字
      type: String || Array
    },
    selectedColor: {
      type: String,
      default: '#606060'
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    colorPicker: {
      type: Boolean,
      default: false
    },
    existDefaultBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      iconJson,
      tabActive: iconJson[0].key,
      selected: [],
      color: this.selectedColor,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)'
      ]
    }
  },
  watch: {
    selectedName: {
      handler: function (val) {
        // console.log('selectedName', val)
        if (val && typeof val === 'string') {
          if (this.multiple) {
            this.selected.push(val)
          } else {
            this.$set(this.selected, 0, val)
          }
        } else if (Object.prototype.toString.call(val) === '[object Array]') {
          this.selected = val
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClick (tab, event) {

    },
    handleSelectIcon (name, key) {
      if (this.multiple) {
        let index = this.selected.indexOf(key + ' ' + name)
        index < 0 ? this.selected.push(key + ' ' + name) : this.selected.splice(index, 1)
      } else {
        this.$set(this.selected, 0, key + ' ' + name)
      }
      this.$emit('icon-select', { icon: this.multiple ? this.selected : this.selected[0], color: this.color })
    },
    handleSaveSelected () {
      this.$emit('btn-save', { icon: this.multiple ? this.selected : this.selected[0], color: this.color })
    },
    handleColorChange (val) { // 选择色值时, 若有选中图标则 $emit
      if (this.selected && this.selected.length) {
        this.$emit('icon-select', { icon: this.multiple ? this.selected : this.selected[0], color: this.color })
      }
    },
    activeClassHandle (name) {
      return this.selected.some(item => item.indexOf(name) !== -1)
    }
  },
  components: {
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'p-icon': Icon,
    'el-button': Button,
    'el-color-picker': ColorPicker,
    VuePerfectScrollbar
  }
}
</script>
<style lang="scss" scoped>
  .icon-selector-wrap {
    height: 100%;
    .operation {
      box-sizing: border-box;
      height: 50px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      .selected-color {
        line-height: 50px;
        margin-left: 20px;
        display: flex;
        align-items: center
      }
    }
  }
  .icon-tabs-wrap.el-tabs.el-tabs--top {
    height: 100%;
    /deep/ .el-tabs__nav-wrap.is-top {
      padding: 0 6px;
    }
    /deep/ .el-tabs__content {
      height: calc(100% - 40px);
      .el-tab-pane {
        height: 100%;
      }
    }
  }
  .icon-list {
    height: 100%;
    position: relative;
    &:after {
      content: '';
      clear: both;
      display: block;
    }
    .scroll-area {
      width: 100%;
      height: 100%;
    }
    li {
      float: left;
      width: 10%;
      height: 50px;
      margin-right: -1px;
      margin-bottom: -1px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover, &.active {
        color: #2196F3 !important;
        cursor: pointer;
      }
      span {
        text-align: center;
      }
      i {
        display: block;
        font-size: 18px;
      }
      .icon-name {
        display: inline-block;
      }
    }
  }
</style>
