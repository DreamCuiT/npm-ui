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
                autosize
                :maxlength="fields.maxlength?fields.maxlength:120"
                v-bind="fields.fieldConfig"
                :placeholder="fields.placeholder"
                clearable></el-input>
      <el-input v-else-if="fields.fieldName && fields.type === 'textarea'"
                type="textarea"
                :maxlength="fields.maxlength?fields.maxlength:500"
                :placeholder="fields.placeholder"
                autosize
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
                   :show-checkbox="fields.showCheckbox"
                   v-model="formData[fields.fieldName]"
                   :ref="`treeselect${fields.fieldName}`"
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
                      :picker-options="pickerOptions"
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
    },
    logdata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: () => {
    return {
      watchTag: null,
      watchOptionsTag: null,
      options: [],
      treeData: [],
      pickerOptions: {}
    }
  },
  created () {
  },
  async mounted () {
    let that = this
    // 开始时间与结束时间相互限制
    if (this.fields.pickerOptions && Object.keys(this.fields.pickerOptions).length) {
      this.pickerOptions = {
        disabledDate: time => {
          // comparedFieldName比较字段名
          let dateVal = this.formData[this.fields.pickerOptions.comparedFieldName]
          if (dateVal) {
            if (this.fields.pickerOptions.disabledRelation === 'start') {
              return time.getTime() > new Date(dateVal).getTime()
            } else {
              return time.getTime() < new Date(dateVal).getTime() - 24 * 60 * 60 * 1000
            }
          }
        }
      }
    }
    if (this.fields.optionUrl && this.fields.optionUrl.api) {
      let res = await this.$api[this.fields.optionUrl.api](this.fields.optionUrl.params ? this.fields.optionUrl.params : {})
      // .then(res => {
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
          that.treeData = res
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
      // }).catch(err => {
      //   console.log(err)
      // })
    } else {
      that.$emit('field-mounted')
    }
    this.watchFormData()
    this.watchFieldOptions()
  },
  methods: {
    // 下拉数据或者其他fields.options初始化完成
    watchFieldOptions () {
      if (this.watchOptionsTag) {
        this.watchOptionsTag()
      }
      this.watchOptionsTag = this.$watch('fields.options', (newValue, oldValue) => {
        if (newValue.length) {
          let isEqualN = JSON.stringify(newValue) === JSON.stringify(oldValue)
          // 只在第一次赋值options时需要触发，后面再赋值就不需要触发
          !isEqualN && (oldValue === undefined || oldValue.length === 0) && this.watchFormData()
        }
      }, {
        deep: true
      })
    },
    // 数据初始化完成记录初始值
    watchFormData () {
      if (this.fields.type === 'view') return
      const fieldType = ['treeSelect', 'select', 'multiple', 'checkboxGroup']
      let before = deepClone(this.formData)[this.fields.fieldName]
      if (fieldType.includes(this.fields.type)) {
        before = this.getLabel(this.fields, before)
      }
      const { fieldName: column, labelText: columnName } = this.fields
      if (this.watchTag) {
        this.watchTag()
      }
      this.watchTag = this.$watch('formData.' + this.fields.fieldName + '', (newValue, oldValue) => {
        let after = newValue
        if (fieldType.includes(this.fields.type)) {
          after = this.getLabel(this.fields, newValue)
        }
        this.$emit('update-logdata', {
          [this.fields.fieldName]: {
            column,
            columnName,
            before,
            after
          }
        })
      }, {
        immediate: true
      })
    },
    getLabel (fields, value) {
      let label = ''
      let options = []
      switch (fields.type) {
        case 'select':
          options = (fields.options && fields.options.length) ? fields.options : this.options
          if (Array.isArray(value)) {
            if (value.length === 1) {
              label = options.filter(item => {
                return value[0].includes(item.value)
              })
            } else {
              label = options.filter(item => {
                return value.join(',').includes(item.value)
              })
            }
          } else {
            label = options.filter(item => {
              return item.value === value
            })
          }
          label = label.length === 1 ? label[0].label : label.map((obj, index) => { return obj.label }).join(',')
          break
        case 'treeSelect':
          options = (fields.treeData && fields.treeData.length ? fields.treeData : this.treeData)
          if (Array.isArray(value)) {
            if (value.length === 1) {
              label = options.filter(item => {
                return value[0].includes(item.value)
              })
            } else {
              label = options.filter(item => {
                return value.join(',').includes(item.value)
              })
            }
          } else {
            label = options.filter(item => {
              return item.value === value
            })
          }
          label = label.length === 1 ? label[0].label : label.map((obj, index) => { return obj.label }).join(',')
          // label = this.$refs['treeselect' + fields.fieldName].selectedLabel
          break
        case 'multiple':
          options = (fields.options && fields.options.length) ? fields.options : this.options
          if (Array.isArray(value)) {
            if (value.length === 1) {
              label = options.filter(item => {
                return value[0].includes(item.value)
              })
            } else {
              label = options.filter(item => {
                return value.join(',').includes(item.value)
              })
            }
          }
          label = label.length === 1 ? label[0].label : label.map((obj, index) => { return obj.label }).join(',')
          break
        case 'checkboxGroup':
          options = (fields.options && fields.options.length) ? fields.options : this.options
          if (Array.isArray(value)) {
            label = options.filter(item => {
              return value.join(',').includes(item.value)
            })
          } else {
            label = options.filter(item => {
              return item.value === value
            })
          }
          label = label.length === 1 ? label[0].label : label.map((obj, index) => { return obj.label }).join(',')
          break
      }
      return label
    },
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
