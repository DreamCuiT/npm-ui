<template>
  <el-form-item v-show="fields.fieldName && fields.type !== 'hidden'"
                :label="fields.labelText"
                :prop="fields.fieldName"
                :rules="validator(fields.rules)">
    <el-input v-if="fields.fieldName && fields.type === 'text'"
              v-model="formData[fields.fieldName]"
              v-bind="fields.fieldConfig"
              :placeholder="fields.placeholder"
              clearable></el-input>
    <el-input v-else-if="fields.fieldName && fields.type === 'textarea'"
              type="textarea"
              v-model="formData[fields.fieldName]"
              v-bind="fields.fieldConfig"
              :placeholder="fields.placeholder"
              clearable></el-input>
    <el-select v-else-if="fields.fieldName && fields.type === 'select'"
               v-model="formData[fields.fieldName]"
               v-bind="fields.fieldConfig"
               :placeholder="fields.placeholder"
               style="width:100%;"
               clearable>
      <el-option v-for="item in ((fields.options&&fields.options.length)?fields.options:options)"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"></el-option>
    </el-select>
    <el-select v-else-if="fields.fieldName && fields.type === 'multiple'"
               v-model="formData[fields.fieldName]"
               multiple
               clearable
               v-bind="fields.fieldConfig"
               :placeholder="fields.placeholder"
               style="width:100%;">
      <el-option v-for="item in ((fields.options&&fields.options.length)?fields.options:options)"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"></el-option>
    </el-select>
    <tree-select v-else-if="fields.fieldName && fields.type === 'treeSelect'"
                 :default-expand-all="fields.defaultExpandAll"
                 :default-expanded-keys="fields.defaultExpandedKeys"
                 :multiple="fields.multiple"
                 :placeholder="fields.placeholder"
                 :disabled="fields.disabled"
                 :data="(fields.treeData&&fields.treeData.length)?fields.treeData:options"
                 :props="fields.treeProps"
                 :disabled-values="fields.disabledValues"
                 :check-strictly="fields.checkStrictly"
                 :clearable="fields.clearable"
                 :reset="fields.reset"
                 v-model="formData[fields.fieldName]"
                 style="width:100%;"></tree-select>
    <el-input-number v-else-if="fields.fieldName && fields.type === 'number'"
                     :min="(fields.min || fields.min === 0) ? fields.min : 1"
                     :max="fields.max"
                     v-model="formData[fields.fieldName]"
                     v-bind="fields.fieldConfig"
                     :placeholder="fields.placeholder"
                     style="width:100%;"></el-input-number>
    <el-radio-group v-else-if="fields.fieldName && fields.type === 'radio' && Array.isArray(fields.options)"
                    v-model="formData[fields.fieldName]"
                    v-bind="fields.fieldConfig"
                    :placeholder="fields.placeholder">
      <el-radio v-for="item in ((fields.options&&fields.options.length)?fields.options:options)"
                :key="item.value"
                :label="item.value"
                :value="item.value">{{item.label}}</el-radio>
    </el-radio-group>
    <el-radio-group v-else-if="fields.fieldName && fields.type === 'radioButton' && Array.isArray(fields.options)"
                    v-model="formData[fields.fieldName]"
                    v-bind="fields.fieldConfig">
      <el-radio-button v-for="item in ((fields.options&&fields.options.length)?fields.options:options)"
                       :key="item.value"
                       :label="item.value"
                       :value="item.value">{{item.label}}</el-radio-button>
    </el-radio-group>
    <el-checkbox v-else-if="fields.fieldName && fields.type === 'checkbox'"
                 v-model="formData[fields.fieldName]"
                 v-bind="fields.fieldConfig"
                 :placeholder="fields.placeholder">{{fields.label}}</el-checkbox>
    <el-checkbox-group v-else-if="fields.fieldName && fields.type === 'checkboxGroup' && Array.isArray(fields.options)"
                       v-model="formData[fields.fieldName]"
                       v-bind="fields.fieldConfig"
                       :placeholder="fields.placeholder">
      <el-checkbox v-for="item in ((fields.options&&fields.options.length)?fields.options:options)"
                   :key="item.value"
                   :label="item.value"
                   :value="item.value">{{item.label}}</el-checkbox>
    </el-checkbox-group>
    <el-date-picker v-else-if="fields.fieldName && fields.type === 'datetime'"
                    v-model="formData[fields.fieldName]"
                    type="date"
                    v-bind="fields.fieldConfig"
                    :placeholder="fields.placeholder"
                    style="width:100%;"
                    clearable></el-date-picker>
    <el-date-picker v-else-if="fields.fieldName && fields.type === 'datetimeRange'"
                    v-model="formData[fields.fieldName]"
                    v-bind="fields.fieldConfig"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width:100%;"
                    clearable></el-date-picker>
    <el-switch v-else-if="fields.fieldName && fields.type === 'switch'"
               v-model="formData[fields.fieldName]"
               active-color="#13ce66"
               inactive-color="#ff4949"
               v-bind="fields.fieldConfig"
               :placeholder="fields.placeholder"></el-switch>
  </el-form-item>
</template>
<script>
import Vue from 'vue'
import { FormItem, Input, InputNumber, Radio, RadioGroup, RadioButton, Checkbox, CheckboxGroup, Switch, Select, Option, DatePicker } from 'element-ui'
import TreeSelect from '../../../form/src/Components/TreeSelect'
import { generateTree } from '../../../../src/utils/generateTree'
import Validate from '../../../../src/utils/extendValidate/extendValidate'
// 表单校验
Vue.use(Validate)
export default {
  name: 'FieldRender',
  props: {
    formData: {
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
    },
    view: {
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
        // 将options数据回填至dataSource中
        that.fields.options = that.options
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
    TreeSelect

  }
}
</script>
<style lang="scss">
</style>
