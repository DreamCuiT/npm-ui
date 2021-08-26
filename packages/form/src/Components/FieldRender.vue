/* eslint-disable vue/no-mutating-props */
<template>
  <el-col v-show="fields.fieldName && fields.type !== 'hidden'"
          :span="fields.colLayout === 'doubleCol' ? 12 : 24">
    <el-form-item v-if="fields.fieldName && fields.type === 'view'"
                  class="view-item"
                  :label-width="fields.labelWidth ? fields.labelWidth : ''">
      <span :style="fields.style"
            style="font-weight: bolder"
            slot="label">
        {{ fields.labelText }}
        <el-tooltip placement="top"
                    :content="fields.tip">
          <i v-if="fields.tip"
             class="el-icon-warning-outline"></i>
        </el-tooltip>
      </span>
      <template v-if="fields.viewOptions">
        <div class="view"
             v-text="viewContentByOptions(formData[fields.fieldName], fields)"></div>
      </template>
      <template v-else>
        <div v-if="!fields.formatter"
             class="view">{{formData[fields.fieldName]}}</div>
        <div v-if="fields.formatter"
             class="view">{{
          fields.formatter(
            undefined,
            undefined,
            formData[fields.fieldName],
            undefined
          )
        }}</div>
      </template>
    </el-form-item>
    <el-form-item v-else-if="fields.fieldName && fields.type === 'uploadView'"
                  :label-width="fields.labelWidth ? fields.labelWidth : ''">
      <span :style="fields.style"
            style="font-weight: bolder"
            slot="label">
        {{ fields.labelText }}
        <el-tooltip placement="top"
                    :content="fields.tip">
          <i v-if="fields.tip"
             class="el-icon-warning-outline"></i>
        </el-tooltip>
      </span>
      <common-file-view :uploadFiles="formData[fields.fieldName]"
                        :filesLayout="fields.filesLayout"></common-file-view>
    </el-form-item>
    <el-form-item v-else
                  :prop="fields.fieldName"
                  :label-width="fields.labelWidth ? fields.labelWidth : ''"
                  :rules="validator(fields.rules)">
      <span :style="fields.style"
            slot="label">
        {{ fields.labelText }}
        <el-tooltip placement="top"
                    :content="fields.tip">
          <i v-if="fields.tip"
             class="el-icon-warning-outline"></i>
        </el-tooltip>
      </span>
      <el-input v-if="fields.fieldName && fields.type === 'text'"
                v-model="formData[fields.fieldName]"
                v-bind="fields.fieldConfig"
                :placeholder="fields.placeholder"
                clearable></el-input>
      <el-input v-else-if="fields.fieldName && fields.type === 'textarea'"
                type="textarea"
                :placeholder="fields.placeholder"
                v-model="formData[fields.fieldName]"
                v-bind="fields.fieldConfig"
                clearable></el-input>
      <el-input type="hidden"
                v-else-if="fields.fieldName && fields.type === 'hidden'"
                v-model="formData[fields.fieldName]"></el-input>
      <el-select v-else-if="fields.fieldName && fields.type === 'select'"
                 v-model="formData[fields.fieldName]"
                 v-bind="fields.fieldConfig"
                 :placeholder="fields.placeholder"
                 style="width: 100%"
                 clearable
                 @change="fields.eventHandle && fields.eventHandle.change && comp[fields.eventHandle.change](formData[fields.fieldName])">
        <el-option v-for="item in fields.options && fields.options.length ? fields.options : options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
                   :disabled="item.disabled"></el-option>
      </el-select>
      <el-select v-else-if="fields.fieldName && fields.type === 'multiple'"
                 v-model="formData[fields.fieldName]"
                 multiple
                 v-bind="fields.fieldConfig"
                 :placeholder="fields.placeholder"
                 style="width: 100%"
                 clearable>
        <el-option v-for="item in fields.options && fields.options.length ? fields.options : options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
                   :disabled="item.disabled"></el-option>
      </el-select>
      <tree-select v-else-if="fields.fieldName && fields.type === 'treeSelect'"
                   :default-expand-all="fields.defaultExpandAll"
                   :default-expanded-keys="fields.defaultExpandedKeys"
                   :multiple="fields.multiple"
                   :placeholder="fields.placeholder"
                   :disabled="fields.disabled"
                   :data=" fields.treeData && fields.treeData.length ? fields.treeData : options"
                   :props="fields.treeProps"
                   :disabled-values="fields.disabledValues"
                   :check-strictly="fields.checkStrictly"
                   :clearable="fields.clearable"
                   v-model="formData[fields.fieldName]"
                   style="width: 100%"></tree-select>
      <el-input-number v-else-if="fields.fieldName && fields.type === 'number'"
                       :min="fields.minName ? formData[fields.minName] : fields.min || fields.min === 0 ? fields.min : 1 "
                       :max="fields.maxName ? formData[fields.maxName] : fields.max"
                       v-model="formData[fields.fieldName]"
                       v-bind="fields.fieldConfig"
                       :placeholder="fields.placeholder"
                       @change="fields.eventHandle && fields.eventHandle.change && comp[fields.eventHandle.change](formData[fields.fieldName])"
                       style="width: 100%"></el-input-number>
      <el-radio-group v-else-if="fields.fieldName && fields.type === 'radio' && Array.isArray(fields.options)"
                      v-model="formData[fields.fieldName]"
                      v-bind="fields.fieldConfig">
        <el-radio v-for="item in fields.options && fields.options.length ? fields.options : options"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
      <el-radio-group v-else-if="fields.fieldName && fields.type === 'radioButton' && Array.isArray(fields.options)"
                      v-model="formData[fields.fieldName]"
                      v-bind="fields.fieldConfig">
        <el-radio-button v-for="item in fields.options && fields.options.length ? fields.options : options"
                         :key="item.value"
                         :label="item.value"
                         :value="item.value">{{ item.label }}</el-radio-button>
      </el-radio-group>
      <el-checkbox v-else-if="fields.fieldName && fields.type === 'checkbox'"
                   :label="fields.labelText"
                   v-model="formData[fields.fieldName]"
                   v-bind="fields.fieldConfig">{{ fields.label }}</el-checkbox>
      <el-checkbox-group v-else-if="fields.fieldName && fields.type === 'checkboxGroup' && Array.isArray(fields.options) "
                         v-model="formData[fields.fieldName]"
                         v-bind="fields.fieldConfig">
        <el-checkbox v-for="item in fields.options && fields.options.length ? fields.options : options"
                     :key="item.value"
                     :label="item.value"
                     :value="item.value">{{ item.label }}</el-checkbox>
      </el-checkbox-group>
      <el-date-picker v-else-if="fields.fieldName && fields.type === 'datetime'"
                      v-model="formData[fields.fieldName]"
                      v-bind="fields.fieldConfig"
                      type="date"
                      :placeholder="fields.placeholder"
                      style="width: 100%"
                      :clearable="fields.fieldConfig && Object.keys(fields.fieldConfig).indexOf('clearable') > -1 ? fields.fieldConfig.clearable : true"
                      @change="fields.eventHandle && fields.eventHandle.change && comp[fields.eventHandle.change](formData[fields.fieldName])">
      </el-date-picker>
      <el-date-picker v-else-if="fields.fieldName && fields.type === 'datetimeRange'"
                      v-model="formData[fields.fieldName]"
                      v-bind="fields.fieldConfig"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%"
                      :clearable="fields.fieldConfig && Object.keys(fields.fieldConfig).indexOf('clearable') > -1 ? fields.fieldConfig.clearable : true"></el-date-picker>
      <el-switch v-else-if="fields.fieldName && fields.type === 'switch'"
                 v-model="formData[fields.fieldName]"
                 v-bind="fields.fieldConfig"
                 active-color="#13ce66"
                 inactive-color="#ff4949"></el-switch>
    </el-form-item>
  </el-col>
</template>
<script>
import Vue from 'vue'
import { Col, FormItem, Input, InputNumber, Radio, RadioGroup, RadioButton, Checkbox, CheckboxGroup, Switch, Select, Option, DatePicker, Tooltip } from 'element-ui'
import TreeSelect from './TreeSelect'
import { generateTree } from '~/utils/generateTree'
import CommonFileView from 'packages/fileView'
import Validate from '~/utils/extendValidate/extendValidate'
// 表单校验
Vue.use(Validate)
export default {
  name: 'FieldRender',
  props: {
    comp: {
      type: Object
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fields: {
      type: Object,
      default: () => {
        return {}
      }
    },
    view: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: () => {
    return {
      options: []
    }
  },
  mounted () {
    let that = this
    if (this.fields.optionUrl && this.fields.optionUrl.api) {
      this.$api[this.fields.optionUrl.api](this.fields.optionUrl.params ? this.fields.optionUrl.params : {}).then(res => {
        if (that.fields.optionUrl.label || that.fields.optionUrl.value) {
          if (res[0].children) {
            let props = {
              label: that.fields.optionUrl.label || null,
              value: that.fields.optionUrl.value || null
            }
            that.options = that.treeDataHandle(res, props)
          } else {
            that.options = res.map(item => {
              if (that.fields.optionUrl.label) {
                item.label = item[that.fields.optionUrl.label]
              }
              if (that.fields.optionUrl.value) {
                item.value = item[that.fields.optionUrl.value]
              }
              return item
            })
            if (that.fields.type === 'treeSelect') {
              that.options = generateTree(that.options, that.fields.optionUrl.pId)
            }
          }
        } else {
          if (that.fields.type === 'treeSelect') {
            if (res[0].children) {
              that.options = res
            } else {
              that.options = generateTree(res, that.fields.optionUrl.pId)
            }
          } else {
            that.options = res
          }
        }
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
    },
    viewContentByOptions (value, fields) {
      /**
       * @function 处理view类型下,但可编辑下的类型为(select/radio)可选择情况,view展示成对应的label文本,不展示选中的value.
       *           这里目前只处理了 value为 String 后续需要可继续完善
       */
      const options = fields.options && fields.options.length ? fields.options : this.options
      if (options.length && value) {
        let labels = []
        if (typeof value === 'string') {
          const valueArr = value.split(',')
          valueArr.forEach(v => {
            options.forEach(obj => {
              if (v === obj.value) {
                labels.push(obj.label)
              }
            })
          })
        }
        return labels.join(',')
      }
      return ''
    }
  },
  components: {
    'el-col': Col,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-input-number': InputNumber,
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-checkbox': Checkbox,
    'el-checkbox-group': CheckboxGroup,
    'el-switch': Switch,
    'el-select': Select,
    'el-option': Option,
    'el-date-picker': DatePicker,
    'el-tooltip': Tooltip,
    TreeSelect,
    CommonFileView
  }
}
</script>
