<template>
  <el-input v-if="item.filter.type === 'text'"
            v-model="item.filter.val"
            size='medium'
            v-bind="item.filter.fieldConfig"
            clearable
            @click.stop.native
            v-on:keyup.enter.native="$emit('columnFiter', item)"
            @blur="$emit('columnFiter', item)"
            @clear="$emit('columnReset', item)"
            placeholder="请输入"></el-input>
  <el-select v-else-if="item.filter.type === 'select'"
              v-model="item.filter.val"
              v-bind="item.filter.fieldConfig"
              placeholder="请选择"
              style="width:100%;"
              clearable
              size='medium'
              @clear="$emit('columnReset', item)"
              @change="$emit('columnFiter', item)">
    <el-option v-for="items in ((item.filter.options&&item.filter.options.length)?item.filter.options:options)"
                :key="items.value"
                :label="items.label"
                :value="items.value"></el-option>
  </el-select>
  <el-select v-else-if="item.filter.type === 'multiple'"
              v-model="item.filter.val"
              multiple
              clearable
              size='medium'
              v-bind="item.filter.fieldConfig"
              placeholder="请选择"
              @clear="$emit('columnReset', item)"
              @change="$emit('columnFiter', item)"
              style="width:100%;">
    <el-option v-for="items in ((item.filter.options&&item.filter.options.length)?item.filter.options:options)"
                :key="items.value"
                :label="items.label"
                :value="items.value"></el-option>
  </el-select>
  <!-- <tree-select v-else-if="item.filter.type === 'treeSelect'"
                :default-expand-all="item.filter.defaultExpandAll"
                :default-expanded-keys="item.filter.defaultExpandedKeys"
                :multiple="item.filter.multiple"
                placeholder="请选择"
                :disabled="item.filter.disabled"
                :data="(item.filter.treeData&&item.filter.treeData.length)?item.filter.treeData:options"
                :props="item.filter.treeProps"
                :disabled-values="item.filter.disabledValues"
                :check-strictly="item.filter.checkStrictly"
                :clearable="item.filter.clearable"
                :reset="item.filter.reset"
                v-model="item.filter.val"
                size='medium'
                @click.stop.native
                @change="$emit('columnFiter', item)"
                style="width:100%;"></tree-select> -->
  <el-date-picker v-else-if="item.filter.type === 'datetime'"
                  v-model="item.filter.val"
                  type="date"
                  size='medium'
                  v-bind="item.filter.fieldConfig"
                  placeholder="请选择"
                  style="width:100%;"
                  @click.stop.native
                  @clear="$emit('columnReset', item)"
                  @change="$emit('columnFiter', item)"
                  clearable></el-date-picker>
  <el-date-picker v-else-if="item.filter.type === 'datetimeRange'"
                  v-model="item.filter.val"
                  v-bind="item.filter.fieldConfig"
                  type="daterange"
                  size='medium'
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width:100%;"
                  @click.stop.native
                  clearable></el-date-picker>
</template>
<script>

import { Input, Select, Option, DatePicker } from 'element-ui'
import { generateTree } from '../../../src/utils/generateTree'
export default {
  name: 'TableSearchFieldRender',
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    fields: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
      options: []
    }
  },
  mounted () {
    let that = this
    if (this.item.filter.optionUrl && this.item.filter.optionUrl.api) {
      this.$api[this.item.filter.optionUrl.api](this.item.filter.optionUrl.params ? this.item.filter.optionUrl.params : {}).then(res => {
        if (that.item.filter.optionUrl.label || that.item.filter.optionUrl.value) {
          if (res[0].children) {
            let props = {
              label: that.item.filter.optionUrl.label || null,
              value: that.item.filter.optionUrl.value || null
            }
            that.options = that.treeDataHandle(res, props)
          } else {
            that.options = res.map(items => {
              if (that.item.filter.optionUrl.label) {
                items.label = items[that.item.filter.optionUrl.label]
              }
              if (that.item.filter.optionUrl.value) {
                items.value = items[that.item.filter.optionUrl.value]
              }
              return items
            })
            if (that.item.filter.type === 'treeSelect') {
              that.options = generateTree(that.options, that.item.filter.optionUrl.pId)
            }
          }
        } else {
          if (that.item.filter.type === 'treeSelect') {
            if (res[0].children) {
              that.options = res
            } else {
              that.options = generateTree(res, that.item.filter.optionUrl.pId)
            }
          } else {
            that.options = res
          }
        }
        // 将options数据回填至dataSource中
        // that.item.filter.options = that.options
        this.$emit('field-mounted')
      }).catch(err => {
        console.log(err)
      })
    } else {
      that.$emit('field-mounted')
    }
  },
  methods: {
    treeDataHandle (treeData, props = { label: '', value: '' }) {
      treeData.forEach(node => {
        if (props.label) {
          node.label = node[props.label]
        }
        if (props.label) {
          node.value = node[props.value]
        }
        if (node.children && node.children.length) {
          this.treeDataHandle(node.children, props)
        }
      })
      return treeData
    }
  },
  components: {
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
    'el-date-picker': DatePicker

  }
}
</script>
