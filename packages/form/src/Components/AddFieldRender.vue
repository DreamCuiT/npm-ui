<template>
  <el-form-item :label="fields.labelText"
                :prop="fieldName + '.' + index + '.' + fields.fieldName"
                :label-width="fields.labelWidth ? fields.labelWidth : ''"
                :rules="validator(fields.rules)">
    <span v-if="fields.fieldName && fields.type === 'view'">
      <span>{{ k[fields.fieldName] }}</span>
    </span>
    <span v-if="fields.fieldName && fields.type === 'link'">
      <span>
        <el-link :underline="true"
                 @click="fields.callback(k)">{{ k[fields.fieldName] }}</el-link>
      </span>
    </span>
    <template v-if="fields.fieldName && fields.type === 'uploadView'">
      <common-file-view :uploadFiles="k[fields.fieldName]"
                        :filesLayout="fields.filesLayout || 'card'"
                        :filesDownloadKey="
          fields.filesDownloadKey || { id: 'id', fileName: 'fileName' }
        "></common-file-view>
    </template>
    <el-input v-if="fields.fieldName && fields.type === 'text'"
              v-model="k[fields.fieldName]"
              v-bind="fields.fieldConfig"
              :placeholder="fields.placeholder"
              clearable></el-input>
    <el-input v-else-if="fields.fieldName && fields.type === 'textarea'"
              type="textarea"
              :placeholder="fields.placeholder"
              v-model="k[fields.fieldName]"
              v-bind="fields.fieldConfig"
              clearable></el-input>
    <el-select v-else-if="fields.fieldName && fields.type === 'select'"
               v-model="k[fields.fieldName]"
               v-bind="fields.fieldConfig"
               :placeholder="fields.placeholder"
               style="width: 100%"
               clearable>
      <el-option v-for="item in fields.options && fields.options.length
          ? fields.options
          : options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"></el-option>
    </el-select>
    <el-select v-else-if="fields.fieldName && fields.type === 'multiple'"
               v-model="k[fields.fieldName]"
               multiple
               collapse-tags
               v-bind="fields.fieldConfig"
               :placeholder="fields.placeholder"
               style="width: 100%"
               clearable>
      <el-option v-for="item in fields.options && fields.options.length
          ? fields.options
          : options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"></el-option>
    </el-select>
    <tree-select v-else-if="fields.fieldName && fields.type === 'treeSelect'"
                 :default-expand-all="fields.defaultExpandAll"
                 :multiple="fields.multiple"
                 :placeholder="fields.placeholder"
                 :disabled="fields.disabled"
                 :data="
        fields.treeData && fields.treeData.length ? fields.treeData : options
      "
                 :props="fields.treeProps"
                 :disabled-values="fields.disabledValues"
                 :check-strictly="fields.checkStrictly"
                 :clearable="fields.clearable"
                 v-model="k[fields.fieldName]"
                 style="width: 100%"></tree-select>
    <el-input-number v-else-if="fields.fieldName && fields.type === 'number'"
                     :min="fields.min ? fields.min : 1"
                     v-model="k[fields.fieldName]"
                     v-bind="fields.fieldConfig"
                     :placeholder="fields.placeholder"
                     style="width: 100%"></el-input-number>
    <el-radio-group v-else-if="
        fields.fieldName &&
        fields.type === 'radio' &&
        Array.isArray(fields.options)
      "
                    v-model="k[fields.fieldName]"
                    v-bind="fields.fieldConfig">
      <el-radio v-for="item in fields.options && fields.options.length
          ? fields.options
          : options"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-radio>
    </el-radio-group>
    <el-radio-group v-else-if="
        fields.fieldName &&
        fields.type === 'radioButton' &&
        Array.isArray(fields.options)
      "
                    v-model="k[fields.fieldName]"
                    v-bind="fields.fieldConfig">
      <el-radio-button v-for="item in fields.options && fields.options.length
          ? fields.options
          : options"
                       :key="item.value"
                       :label="item.value"
                       :value="item.value">{{ item.label }}</el-radio-button>
    </el-radio-group>
    <el-checkbox v-else-if="fields.fieldName && fields.type === 'checkbox'"
                 :label="fields.labelText"
                 v-model="k[fields.fieldName]"
                 v-bind="fields.fieldConfig">{{ fields.label }}</el-checkbox>
    <el-checkbox-group v-else-if="
        fields.fieldName &&
        fields.type === 'checkboxGroup' &&
        Array.isArray(fields.options)
      "
                       v-model="k[fields.fieldName]"
                       v-bind="fields.fieldConfig">
      <el-checkbox v-for="item in fields.options && fields.options.length
          ? fields.options
          : options"
                   :key="item.value"
                   :label="item.value"
                   :value="item.value">{{ item.label }}</el-checkbox>
    </el-checkbox-group>
    <el-date-picker v-else-if="fields.fieldName && fields.type === 'datetime'"
                    v-model="k[fields.fieldName]"
                    v-bind="fields.fieldConfig"
                    type="date"
                    :placeholder="fields.placeholder"
                    style="width: 100%"
                    clearable></el-date-picker>
    <el-date-picker v-else-if="fields.fieldName && fields.type === 'datetimeRange'"
                    v-model="k[fields.fieldName]"
                    v-bind="fields.fieldConfig"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    clearable></el-date-picker>
    <el-switch v-else-if="fields.fieldName && fields.type === 'switch'"
               v-model="k[fields.fieldName]"
               v-bind="fields.fieldConfig"
               active-color="#13ce66"
               inactive-color="#ff4949"></el-switch>
  </el-form-item>
</template>
<script>

import { FormItem, Input, InputNumber, Radio, RadioGroup, RadioButton, Checkbox, CheckboxGroup, Switch, Select, Option, DatePicker,Link } from 'element-ui'
import TreeSelect from './TreeSelect'
import { generateTree } from '../../../../src/utils/generateTree'
import CommonFileView from '../../../fileView'

export default {
  name: 'FieldRender',
  props: {
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
    },
    fieldName: {
      type: String
    },
    index: {
      type: Number
    },
    k: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: () => {
    return {
      LogFormatData: {},
      options: []
    }
  },
  computed: {
    getLogFormatData () {
      return this.LogFormatData
    }
  },
  mounted () {
    let that = this
    if (this.fields.optionUrl && this.fields.optionUrl.api) {
      this.$api[this.fields.optionUrl.api](this.fields.optionUrl.params ? this.fields.optionUrl.params : {}).then(res => {
        if (that.fields.optionUrl.label || that.fields.optionUrl.value) {
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
            that.options = generateTree(that.options, 'pId')
          }
        } else {
          if (that.fields.type === 'treeSelect') {
            that.options = generateTree(res, 'pId')
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
    this.watchFormData()
  },
  methods: {
    // 数据初始化完成记录初始值
    watchFormData () {
      const fieldType = ['treeSelect', 'select', 'multiple']
      let before = deepClone(this.formData)[this.fields.fieldName] || ''
      if (fieldType.includes(this.fields.type)) {
        before = this.getLabel(this.fields, before)
      }
      const { fieldName: column, labelText: columnName } = this.fields
      this.$watch('formData.' + this.fields.fieldName + '', (newValue, oldValue) => {
        let after = newValue
        if (fieldType.includes(this.fields.type)) {
          after = this.getLabel(this.fields, newValue)
        }
        this.LogFormatData = {
          column,
          columnName,
          before,
          after
        }
      })
    },
    getLabel (fields, value) {
      let label = ''
      let options = []
      switch (fields.type) {
        case 'select':
          options = (fields.options && fields.options.length) ? fields.options : this.options
          label = options.filter(item => {
            return item.value === value
          })
          label = label.map((obj, index) => { return obj.label }).join(',')
          break
        case 'treeSelect':
          label = this.$refs['treeselect' + fields.fieldName].selectedLabel
          break
        case 'multiple':
          options = (fields.options && fields.options.length) ? fields.options : this.options
          if (Array.isArray(value)) {
            label = options.filter(item => {
              return value.join(',').includes(item.value)
            })
          }
          label = label.map((obj, index) => { return obj.label }).join(',')
          break
      }
      return label
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
    'el-link': Link,
    TreeSelect,
    CommonFileView
  }
}
</script>
