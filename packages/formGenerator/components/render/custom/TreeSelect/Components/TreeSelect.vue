/* eslint-disable vue/no-mutating-props */
<template>
  <div class="el-select-tree"
       :style="{width: config.style.width || '100%'}">
    <el-popover ref="elPopover"
                v-model="visible"
                transition="el-zoom-in-top"
                popper-class="el-select-tree__popover"
                trigger="click"
                placement="bottom-start"
                :disabled="config.disabled"
                @after-enter="handleScroll()">

      <el-scrollbar v-if="config.__slot__.options && config.__slot__.options.length"
                    wrap-class="el-select-dropdown__wrap"
                    view-class="el-select-dropdown__list"
                    ref="scrollbar"
                    :class="{ 'is-empty': config.__slot__.options && config.__slot__.options.length === 0 }">
        <el-tree ref="elTree"
                 class="el-select-tree__list"
                 :data="config.__slot__.options"
                 :default-expand-all="config.defaultExpandAll"
                 :show-checkbox="config.multiple"
                 :expand-on-click-node="config.multiple"
                 :check-strictly="config.checkStrictly"
                 :filter-node-method="filterNode"
                 @node-click="nodeClick"
                 @check-change="checkChange">
          <div class="el-select-tree__item"
               slot-scope="{ data }"
               :class="[disbaledClassHandle(data), treeItemClass(data)]">
            {{ data.label }}
            <slot name="treeItemSlot"
                  :scope="data"></slot>
          </div>
        </el-tree>
      </el-scrollbar>

      <p class="el-select-tree__empty"
         v-else>
        无数据
      </p>

      <el-input v-model="selectedLabel"
                ref="reference"
                slot="reference"
                :readonly="config.readonly"
                :validate-event="false"
                :size="size"
                :style="{width: config.style.width || '100%'}"
                :class="{
          'is-active': visible,
          'is-selected': selectedLabel,
          'is-clearable': config.clearable
        }"
                :disabled="config.disabled"
                :placeholder="config.placeholder">
        <i v-if="config.clearable"
           @click.stop="clear()"
           slot="suffix"
           class="el-input__icon el-input__icon-close el-icon-circle-close"></i>
        <i slot="suffix"
           class="el-input__icon el-input__icon-arrow-down el-icon-arrow-down"></i>
      </el-input>
    </el-popover>
  </div>
</template>
<script>
import Vue from 'vue'
import { Popover, Scrollbar, Input, Tree } from 'element-ui'
import { treeFind, treeEach } from 'operation-tree-node'
import Emitter from '~/mixins/emitter'
export default {
  name: 'TreeSelect',
  mixins: [Emitter],
  model: {
    prop: 'value',
    event: 'change'
  },
  components: {
    'el-popover': Popover,
    'el-scrollbar': Scrollbar,
    'el-tree': Tree,
    'el-input': Input
  },
  props: {
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    formModel: {
      type: Object,
      default: function () {
        return {}
      }
    },
    value: String
  },
  watch: {
    // config: {
    //   handler: function (val) {
    //   },
    //   immediate: true,
    //   deep: true
    // },
    formModel: {
      handler: function (val) {
        const _this = this
        if (Object.keys(val).length && val[_this.config.__vModel__]) {
          _this.selectedValue = val[_this.config.__vModel__]
          _this.setSelected()
        }
      },
      immediate: true,
      deep: true
    },
    selectedLabel: function (val) {
      if (this.config.readonly) {
        return false
      }
      this.$refs.elTree.filter(val)
    },
    selectedValue: {
      handler: function (val) {
        this.formModel[this.config.__vModel__] = val
        this.valueChange(val)
      },
      immediate: true
    }
  },
  data: function () {
    return {
      visible: false,
      selectedLabel: '',
      selectedValue: this.value,
      size: Vue.prototype.$ELEMENT ? Vue.prototype.$ELEMENT.size : '',
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      }
    }
  },
  methods: {
    handleScroll: function () {
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll()
    },
    filterNode: function (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    disbaledClassHandle: function (data) { // 禁用处理适配 Boolean和String 例: disabled: true / disabled: 'true' 代表禁用;反之false为可选
      let keys = Object.keys(data)
      if (keys.indexOf('disabled') !== -1) {
        let value = data['disabled']
        let valueType = typeof value
        if ((valueType === 'boolean' && value) || (valueType === 'string' && value === 'true')) {
          return 'is-disabled'
        }
      }
      return ''
    },
    treeItemClass: function (data) {
      const valueKey = 'value'
      const value = data[valueKey]
      return {
        selected: this.multiple ? false : this.checkSelected(value)
      }
    },
    checkSelected: function (value) {
      if (this.multiple) {
        // return this.value.includes(value)
        return this.selectedValue.includes(value)
      } else {
        // return this.value === value
        return this.selectedValue === value
      }
    },
    nodeClick: function (data, node, component) {
      const childrenKey = 'children'
      const valueKey = 'value'
      const labelKey = 'label'
      const children = data[childrenKey]
      const value = data[valueKey]
      if (children && children.length && !this.config.checkStrictly) {
        component.handleExpandIconClick()
      } else if (!this.config.multiple && !data.disabled) {
        if (value !== this.selectedValue) {
          this.selectedLabel = data[labelKey]
          // this.valueChange(value)
          this.selectedValue = data[valueKey]
        }
        this.visible = false
      }
    },
    checkChange: function () {
      this.valueChange(this.$refs.elTree.getCheckedKeys(!this.checkStrictly))
      this.setSelectedLabel()
    },
    clear: function () {
      this.visible = false
      if (this.config.multiple) {
        // this.valueChange([])
        this.$nextTick(function () {
          this.$refs.elTree.setCheckedKeys([])
        })
      } else {
        this.selectedLabel = ''
        // this.valueChange('')
      }
      this.$emit('tree-select-clear')
    },
    setSelected: function () {
      var _this = this
      this.selectedLabel = ''

      const propsValue = 'value'
      const propsLabel = 'label'
      // const value = this.value
      const value = this.selectedValue
      if (String(value).length) {
        if (this.config.multiple) {
          this.$nextTick(function () {
            this.$refs.elTree.setCheckedKeys(value)
            this.setSelectedLabel()
          })
        } else {
          const selectedNode = treeFind(
            JSON.parse(JSON.stringify(this.config.__slot__.options)),
            function (node) { _this.checkSelected(node[propsValue]) },
            this.props
          )
          if (selectedNode) {
            this.selectedLabel = selectedNode[propsLabel]
          }
        }
      }
    },
    setSelectedLabel: function () {
      const elTree = this.$refs.elTree
      const selectedNodes = elTree.getCheckedNodes(!this.checkStrictly)
      this.selectedLabel = selectedNodes
        .map(function (item) { item[this.propsLabel] })
        .join(',')
    },
    valueChange: function (value) {
      this.$emit('change', value)
      this.dispatch('ElFormItem', 'el.form.change', value)
    }
  },
  mounted: function () {
    this.setSelected()
    this.$nextTick(function () {
      const popper = this.$refs.elPopover.$refs.popper
      let width
      let clientWidth = this.$el.clientWidth
      if (!clientWidth) {
        console.log(
          '[el-select-warn]:',
          'can not get width'
        )
      }
      width = clientWidth
      width && (popper.style.minWidth = width + 'px')
    })
  }
}
</script>
<style lang="scss">
.el-select-tree {
  display: inline-block;
  .el-input__icon {
    cursor: pointer;
    transition: transform 0.3s;
    &-close {
      display: none;
    }
  }
  .el-input__inner {
    cursor: pointer;
    padding-right: 30px;
  }
  .el-input {
    &:hover:not(.is-disabled) {
      .el-input__inner {
        border-color: #c0c4cc;
      }
      &.is-selected.is-clearable {
        .el-input__icon {
          &-close {
            display: inline-block;
          }
          &-arrow-down {
            display: none;
          }
        }
      }
    }
    &.is-active {
      .el-input__icon-arrow-down {
        transform: rotate(-180deg);
      }
      .el-input__inner {
        border-color: #409eff;
      }
    }
  }
  &__popover {
    padding: 0 !important;
    // extends el-select-dropdown - start
    border: 1px solid #dcdfe6 !important;
    border-radius: 4px !important;
    // extends el-select-dropdown - end
    .popper__arrow {
      left: 35px !important;
    }
  }
  &__list {
    overflow-y: auto;
    // scroll style - start
    &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #99a9bf;
    }
    // scroll style - end
  }
  &__item {
    flex: 1;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 20px;
    &.selected {
      color: #409eff;
      font-weight: bolder;
    }
    &.is-disabled {
      color: #bbbbbb;
      cursor: not-allowed;
    }
  }
  &__empty {
    padding: 40px;
    margin: 0;
    text-align: center;
    color: #606266;
    font-size: 12px;
  }
}
</style>
