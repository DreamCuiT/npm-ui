<template>
  <div class="search-wrapper"
       :style="{ width: searchWidth }">
    <el-form ref="inputForm"
             size="medium"
             @submit.native.prevent>
      <el-form-item prop="formInput">
        <el-input placeholder="点击下拉搜索"
                  v-model="searchVal"
                  readonly
                  prefix-icon="el-icon-search"
                  :disabled="!defaultSearch"
                  v-on:keyup.enter.native="enterSearch"
                  v-on:click.native="toggleAdvanced">
          <template slot="suffix">
            <i v-if="searchVal"
               class="el-icon-close"
               v-on:click.stop="removeSearchVal"></i>
            <i :class="advanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <transition name="bounce">
      <el-form v-show="advanced"
               ref="searchForm"
               :model="formData"
               :label-width="labelWidth"
               class="search-contain"
               :style="{ width: searchContainWidth }">
        <el-row>
          <template v-for="item in renderDataSource">
            <el-col :key="item.fieldName"
                    :span="item.colLayout === 'doubleCol'?12:24">
              <search-field-render :fields="item"
                                   :formData="formField"></search-field-render>
            </el-col>
          </template>
        </el-row>
        <el-row>
          <el-col :span="24"
                  class="flex-right">
            <el-button type="primary"
                       @click="search">查询</el-button>
            <el-button style="margin-left: 8px"
                       @click="reSet">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </transition>
  </div>
</template>
<script>
import { Form, Row, Col, Button, FormItem, Input } from 'element-ui'
import moment from 'moment'
import SearchFieldRender from './Components/SearchFieldRender'

export default {
  name: 'SearchFormList',
  props: {
    form: {
      type: Object,
      default: function () {
        return {}
      }
    },
    labelWidth: {
      type: String,
      default: '90px'
    },
    dataSource: {
      type: Array,
      default: function () {
        return []
      }
    },
    searchWidth: {
      type: String,
      default: '450px'
    },
    searchContainWidth: {
      type: String,
      default: '450px'
    },
    resetAfterToSearch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchVal: '',
      advanced: false,
      loadingVisible: false,
      separator: ';',
      formField: this.form,
      defaultSearch: '',
      setInputDefault: false, // 设置查询条件中的第一个输入框default: true
      dateDataIndex: [] // 日期fieldName集合
    }
  },
  computed: {

    renderDataSource () {
      // 重组传入的数据，合并全局配置，子项的配置优先全局
      const _this = this
      this.dataSource.map(item => {
        if (item.default) {
          _this.setInputDefault = true
        }
      })
      return this.dataSource.map(function (item) {
        // 查询组件没有设置默认输入fieldName时，则选择第一个输入型组件作为默认输入组件
        if (!_this.setInputDefault) {
          if (item.type === 'text') {
            item.default = true
            _this.setInputDefault = true
          }
        }
        if (!item.fieldConfig) {
          item.fieldConfig = {}
        }
        if (item.type === 'treeSelect') {
          _this.$set(item, 'reset', false)
        }
        return item
      })
    },
    formData () {
      let formDataObj = {}
      let that = this
      this.renderDataSource.map(item => {
        if (item.fieldName) {
          formDataObj[item.fieldName] = item.defaultValue
        }
        if (item.default) {
          that.defaultSearch = item.fieldName
        }
        if (item.type === 'checkboxGroup') {
          that.$set(that.formField, item.fieldName, that.formField[item.fieldName] || item.defaultValue || [])
        }
        if ((item.type === 'datetime' || item.type === 'datetimeRange') && that.dateDataIndex.indexOf(item.fieldName) === -1) {
          that.dateDataIndex.push(item.fieldName)
        }
      })
      return { ...formDataObj, ...this.formField }
    }
  },
  methods: {
    search () {
      this.$refs.searchForm.validate(isValid => {
        if (isValid) {
          const queryParams = this.handleParams(this.formData)
          this.changeInputVal(queryParams)
          this.$emit('search', queryParams)// 搜集查询条件数据，触发父页面的查询条件
        }
      })
    },
    enterSearch () {
      const queryParams = {}
      queryParams[this.defaultSearch] = this.searchVal
      queryParams.current = 1
      this.$emit('search', queryParams)
    },
    toggleAdvanced () { // 切换查询条件展开与收缩按钮
      this.advanced = !this.advanced
    },
    reSet () { // 查询条件重置
      this.customResetHandle()
      this.$emit('re-set')
      this.changeInputVal(this.formData, 're-set')
      if (this.resetAfterToSearch) {
        this.search()
      }
      this.advanced = true
    },
    removeSearchVal () {
      this.reSet()
      this.advanced = false
    },
    customResetHandle () {
      this.$refs.searchForm.resetFields()
      const _this = this
      const typeArray = ['multiple', 'treeSelect', 'checkboxGroup', 'datetimeRange']
      const typeBoolean = ['switch']
      // treeSelect组件reset
      let treeSelect = this.renderDataSource.filter(item => item.type === 'treeSelect')
      if (treeSelect && treeSelect.length) {
        treeSelect.map(treeItem => {
          treeItem.reset = !treeItem.reset
        })
      }
      // treeSelect组件reset结束

      _this.renderDataSource.forEach(item => {
        let type = item.type
        let fieldName = item.fieldName
        if (typeArray.indexOf(type) !== -1 || (type === 'select' && item.fieldConfig.multiple)) {
          _this.formData[fieldName] = []
        } else if (typeBoolean.indexOf(type) !== -1) {
          _this.formData[fieldName] = false
        } else {
          _this.formData[fieldName] = ''
        }
      })
      this.formField = this.formData
    },
    changeInputVal (queryParams, type) {
      let _this = this
      let inputVal = ''
      if (!type) {
        this.renderDataSource.map(item => {
          if (queryParams[item.fieldName] && (typeof (queryParams[item.fieldName]) === 'boolean' || queryParams[item.fieldName].length)) {
            switch (item.type) {
              case 'select':
              case 'radio':
              case 'radioButton':
                inputVal += _this.setSelectVal(item, queryParams)
                break
              case 'multiple':
              case 'checkboxGroup':
                inputVal += _this.setMultipleVal(item, queryParams)
                break
              case 'treeSelect':
                inputVal += _this.setTreeSelectVal(item, queryParams)
                break
              case 'datetime':
              case 'datetimeRange':
                inputVal += _this.setDateVal(item, queryParams)
                break
              case 'year':
                inputVal += _this.setYearDateVal(item, queryParams)
                break
              default:
                inputVal += (item.labelText + ':' + (queryParams[item.fieldName] === true ? '是' : (queryParams[item.fieldName] === false ? '否' : queryParams[item.fieldName])) + _this.separator)
            }
          }
        })
      }
      this.searchVal = inputVal.slice(0, -1)
      this.advanced = false
    },
    // select单选 radioGroup单选框组
    setSelectVal (item, queryParams) {
      let _this = this
      let valStr = ''
      item.options.map(optionItem => {
        if (item.optionUrl.label || item.optionUrl.value) {
          if (optionItem[item.optionUrl.value] === queryParams[item.fieldName]) {
            valStr = (item.labelText + ':' + optionItem[item.optionUrl.label] + _this.separator)
          }
        } else {
          if (optionItem.value === queryParams[item.fieldName]) {
            valStr = (item.labelText + ':' + optionItem.label + _this.separator)
          }
        }
      })

      return valStr
    },
    // select多选 checkboxGroup多选框组
    setMultipleVal (item, queryParams) {
      let _this = this
      let valStr = ''
      let multipleLabelArr = []
      item.options.map(optionItem => {
        if (item.optionUrl.label || item.optionUrl.value) {
          queryParams[item.fieldName].map(valueItem => {
            if (valueItem === optionItem[item.optionUrl.value]) {
              multipleLabelArr.push(optionItem[item.optionUrl.label])
            }
          })
        } else {
          queryParams[item.fieldName].map(valueItem => {
            if (valueItem === optionItem.value) {
              multipleLabelArr.push(optionItem.label)
            }
          })
        }
      })
      valStr = (item.labelText + ':' + multipleLabelArr + _this.separator)

      return valStr
    },
    // treeSelect
    setTreeSelectVal (item, queryParams) {
      let _this = this
      let fieldLable = item.labelText
      let fieldValue = queryParams[item.fieldName]
      let valStr = ''
      if (item.multiple) {
        let multipleLabelArr = []
        fieldValue.map(valueItem => {
          if (valueItem === item.options[0].value) {
            multipleLabelArr.push(item.options[0].label)
          } else if (item.options[0].children && item.options[0].children.length) {
            multipleLabelArr = this.treeMultipleDataHandle(item.options[0].children, valueItem, multipleLabelArr)
          }
        })
        valStr = (item.labelText + ':' + multipleLabelArr + _this.separator)
      } else {
        if (item.options[0].value === fieldValue) {
          valStr = (fieldLable + ':' + item.options[0].label + _this.separator)
        } else if (item.options[0].children && item.options[0].children.length) {
          valStr = this.treeSingleDataHandle(item.options[0].children, fieldLable, fieldValue, valStr)
        }
      }

      return valStr
    },
    // treeSelect单选递归
    treeSingleDataHandle (nodeData, fieldLable, fieldValue, inputVal) {
      let _this = this
      nodeData.map(item => {
        if (item.value === fieldValue) {
          inputVal = (fieldLable + ':' + item.label + this.separator)
        } else if (item.children && item.children.length) {
          inputVal = _this.treeSingleDataHandle(item.children, fieldLable, fieldValue, inputVal)
        }
      })
      return inputVal
    },
    // treeSelect多选递归
    treeMultipleDataHandle (nodeData, fieldValue, multipleLabelArr) {
      let _this = this
      nodeData.map(item => {
        if (item.value === fieldValue) {
          multipleLabelArr.push(item.label)
        }
        if (item.children && item.children.length) {
          _this.treeMultipleDataHandle(item.children, fieldValue, multipleLabelArr)
        }
      })
      return multipleLabelArr
    },
    // datetimeRange 选择日期
    setDateVal (item, queryParams) {
      let valStr = ''
      if (Array.isArray(queryParams[item.fieldName])) {
        valStr = queryParams[item.fieldName][0] + '~' + queryParams[item.fieldName][1]
      } else {
        valStr = item.fieldName
      }
      valStr = (item.labelText + ':' + valStr + this.separator)
      return valStr
    },
    setYearDateVal (item, queryParams) {
      console.log(queryParams[item.fieldName], 'itemitemitemitemitemitemitemitemitemitemitem')
      let yearStr = moment(queryParams[item.fieldName]).format('YYYY')
      let valStr = (item.labelText + ':' + yearStr + this.separator)
      return valStr
    },
    handleParams (obj) {
      // 判断必须为obj
      if (!(Object.prototype.toString.call(obj) === '[object Object]')) {
        return {}
      }
      let tempObj = {}
      for (let [key, value] of Object.entries(obj)) {
        if (value && this.dateDataIndex.indexOf(key) !== -1) {
          if (Array.isArray(value)) {
            value = value.map(item => moment(item).format('YYYY-MM-DD'))
          } else {
            // 判断moment，保存时将时间格式设置为'YYYY-MM-DD'
            value = moment(value).format('YYYY-MM-DD')
          }
        }
        // 若是为字符串则清除两边空格
        if (value && typeof value === 'string') {
          value = value.trim()
        }
        tempObj[key] = value
      }
      return tempObj
    }

  },
  components: {
    'el-form': Form,
    'el-row': Row,
    'el-col': Col,
    'el-button': Button,
    'el-form-item': FormItem,
    'el-input': Input,
    SearchFieldRender
  }
}
</script>
