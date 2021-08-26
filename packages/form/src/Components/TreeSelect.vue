<template>
  <div class="el-select-tree">
    <el-popover ref="elPopover"
                v-model="visible"
                transition="el-zoom-in-top"
                popper-class="el-select-tree__popover"
                trigger="click"
                :disabled="disabled"
                :placement="placement"
                @after-enter="handleScroll()">
      <!-- scrollbar wrap -->
      <el-scrollbar v-if="dataLength"
                    wrap-class="el-select-dropdown__wrap"
                    view-class="el-select-dropdown__list"
                    ref="scrollbar"
                    :class="{ 'is-empty': dataLength === 0 }">
        <el-tree ref="elTree"
                 class="el-select-tree__list"
                 :default-expand-all="defaultExpandAll"
                 :props="props"
                 :node-key="propsValue"
                 :show-checkbox="multiple"
                 :expand-on-click-node="multiple"
                 :data="data"
                 :default-expanded-keys="defaultExpandedKeys"
                 :check-strictly="checkStrictly"
                 :filter-node-method="filterNode"
                 @node-click="nodeClick"
                 @check-change="checkChange">
          <div class="el-select-tree__item"
               slot-scope="{ data }"
               :class="[disbaledClassHandle(data), treeItemClass(data)]">
            {{ data[propsLabel] }}
            <slot name="treeItemSlot"
                  :scope="data"></slot>
          </div>
        </el-tree>
      </el-scrollbar>

      <!-- empty text -->
      <p class="el-select-tree__empty"
         v-else>
        无数据
      </p>

      <!-- trigger input -->
      <el-input v-model="selectedLabel"
                ref="reference"
                slot="reference"
                :readonly="readonly"
                :validate-event="false"
                :size="size"
                :class="{
          'is-active': visible,
          'is-selected': selectedLabel,
          'is-clearable': clearable
        }"
                :disabled="disabled"
                :placeholder="placeholder">
        <i v-if="clearable"
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
import Emitter from 'element-ui/lib/mixins/emitter'

import { treeFind } from 'operation-tree-node'
// import treeEach from 'operation-tree-node/dist/treeEach.esm'
import { Popover, Scrollbar, Input, Tree } from 'element-ui'

export default {
  name: 'P8TreeSelect',
  componentName: 'P8TreeSelect',
  mixins: [Emitter],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    clearable: Boolean,
    defaultExpandAll: Boolean,
    checkStrictly: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    props: {
      type: Object,
      default () {
        return {
          value: 'value',
          label: 'label',
          children: 'children'
        }
      }
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    size: {
      type: String,
      default: Vue.prototype.$ELEMENT ? Vue.prototype.$ELEMENT.size : ''
    },
    popoverMinWidth: {
      type: Number,
      default: 0
    },
    disabled: Boolean,
    multiple: Boolean,
    value: {
      type: [Number, String, Array],
      default: ''
    },
    disabledValues: {
      type: Array,
      default () {
        return []
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    reset: {
      type: Boolean
    },
    readonly: { // input 是否是只读, 默认为只读
      type: Boolean,
      default: true
    }
  },
  computed: {
    dataLength () {
      return this.data.length
    },
    propsValue () {
      return this.props.value
    },
    propsLabel () {
      return this.props.label
    },
    defaultExpandedKeys () {
      return Array.isArray(this.value) ? this.value : [this.value]
    }
  },
  data () {
    return {
      visible: false,
      selectedLabel: ''
    }
  },
  methods: {
    valueChange (value) {
      this.$emit('change', value)
      // trigger el-form event
      // like validator
      this.dispatch('ElFormItem', 'el.form.change', value)
    },
    clear () {
      this.visible = false
      if (this.multiple) {
        this.valueChange([])
        this.$nextTick(() => {
          this.$refs.elTree.setCheckedKeys([])
        })
      } else {
        this.selectedLabel = ''
        this.valueChange('')
      }
      console.log('----clear----')
      this.$emit('tree-select-clear')
    },
    // 触发滚动条的重置
    handleScroll () {
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll()
    },
    nodeClick (data, node, component) {
      const children = data[this.props.children]
      const value = data[this.propsValue]
      if (children && children.length && !this.checkStrictly) {
        component.handleExpandIconClick()
      } else if (!this.disabledValues.includes(value) && !this.multiple && !data.disabled) {
        if (value !== this.value) {
          this.valueChange(value)
          this.selectedLabel = data[this.propsLabel]
        }
        this.visible = false
      }
    },
    checkChange () {
      this.valueChange(this.$refs.elTree.getCheckedKeys(!this.checkStrictly))
      this.setSelectedLabel()
    },
    checkSelected (value) {
      if (this.multiple) {
        return this.value.includes(value)
      } else {
        return this.value === value
      }
    },
    setSelected () {
      this.selectedLabel = ''

      const propsValue = this.propsValue
      const value = this.value

      if (String(value).length) {
        if (this.multiple) {
          this.$nextTick(() => {
            this.$refs.elTree.setCheckedKeys(this.value)
            this.setSelectedLabel()
          })
        } else {
          const selectedNode = treeFind(
            this.data,
            (node) => this.checkSelected(node[propsValue]),
            this.props
          )
          if (selectedNode) {
            this.selectedLabel = selectedNode[this.propsLabel]
          }
        }
      }
    },
    setTreeDataState () {
      const disabledValues = this.disabledValues
      treeEach(this.data, (node) => {
        node.disabled = disabledValues.includes(node[this.propsValue])
      })
    },
    setSelectedLabel () {
      const elTree = this.$refs.elTree
      const selectedNodes = elTree.getCheckedNodes(!this.checkStrictly)
      this.selectedLabel = selectedNodes
        .map((item) => item[this.propsLabel])
        .join(',')
    },
    treeItemClass (data) {
      const value = data[this.propsValue]
      return {
        selected: this.multiple ? false : this.checkSelected(value),
        'is-disabled': this.disabledValues.includes(value)
      }
    },
    disbaledClassHandle (data) { // 禁用处理适配 Boolean和String 例: disabled: true / disabled: 'true' 代表禁用;反之false为可选
      // console.log('disbaledClassHandle', data)
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
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  },
  watch: {
    value () {
      this.setSelected()
    },
    data () {
      this.setSelected()
      // this.setTreeDataState()
    },
    disabledValues () {
      this.setTreeDataState()
    },
    reset () {
      this.clear()
    },
    selectedLabel (val) {
      if (this.readonly) {
        return false
      }
      this.$refs.elTree.filter(val)
    }
  },
  created () {
    // if (this.multiple && !Array.isArray(this.value)) {
    //   console.error(
    //     '[el-select-tree]:',
    //     'props `value` must be Array if use multiple!'
    //   )
    // }
    // this.setTreeDataState()
  },
  mounted () {
    this.setSelected()
    // set the `popper` default `min-width`
    this.$nextTick(() => {
      const popper = this.$refs.elPopover.$refs.popper
      let width
      if (!this.popoverMinWidth) {
        const clientWidth = this.$el.clientWidth
        if (!clientWidth) {
          console.log(
            '[el-select-warn]:',
            'can not get `width`, please set the `popoverMinWidth`'
          )
        }
        width = clientWidth
      } else {
        width = this.popoverMinWidth
      }
      width && (popper.style.minWidth = width + 'px')
    })
  },
  components: {
    'el-popover': Popover,
    'el-scrollbar': Scrollbar,
    'el-tree': Tree,
    'el-input': Input
  }
}
</script>

