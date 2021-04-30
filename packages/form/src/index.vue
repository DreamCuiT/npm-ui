<template>
  <el-form ref="form"
           :model="formData"
           :label-width="labelWidth"
           class="formList"
           style="height:100%">
    <el-row :class="{'existBtn':(existDefaultBtn || existCustomBtn)}">
      <template v-for="item in renderDataSource">
        <el-col v-if="item.type == 'blank'"
                :span="item.colLayout === 'doubleCol'?12:24"
                :key="item.slotName">
          <el-form-item class="el-form-item__blank"
                        :label="item.labelText"
                        :prop="item.slotName"
                        :label-width="item.labelWidth ? item.labelWidth : ''"
                        :rules="item.rules">
            <slot :name="item.slotName"></slot>
          </el-form-item>
        </el-col>
        <el-col v-else-if="item.type == 'addField'"
                :span="item.colLayout === 'doubleCol'?12:24"
                :key="item.fieldName">
          <el-form-item :label="item.labelText"
                        :prop="item.fieldName"
                        :label-width="item.labelWidth ? item.labelWidth : ''">
            <add-field :add-fields-layout="item.addFieldLayout"
                       :addFields="item.children"
                       :fieldName="item.fieldName"
                       :formData="form"
                       :isView="item.isView"
                       @field-mounted="otherSumRender"></add-field>
          </el-form-item>
        </el-col>
        <el-col v-else-if="item.type == 'alert'"
                :span="item.colLayout === 'doubleCol'?12:24"
                :key="item.fieldName">
          <el-alert :title="item.labelText"
                    :effect="item.effect"
                    :alertType="item.alertType"
                    :closable="false">
          </el-alert>
        </el-col>
        <el-col v-else-if="item.type == 'upload'"
                :span="item.colLayout === 'doubleCol'?12:24"
                :key="item.fieldName">
          <el-form-item class="el-form-item__upload"
                        :label="item.labelText"
                        :prop="item.fieldName"
                        :label-width="item.labelWidth ? item.labelWidth : ''"
                        :rules="item.rules || item.listType === 'secret' ? uploadDefaultRules : []">
            <common-upload ref="commonupload"
                           :files="form[item.fieldName] || []"
                           :listType="item.listType"
                           :maxLimit="item.maxLimit"
                           :uploadConfig="item.uploadConfig || {}"
                           @upload="(file) => { uploadFile(file, item) }"
                           @remove="(file) => { removedFile(file, item) }">
            </common-upload>
          </el-form-item>
        </el-col>

        <field-render v-else
                      @field-mounted="sumRender"
                      :fields="item"
                      :key="item.fieldName"
                      :formData="form"
                      :view="viewData"
                      :comp="comp"></field-render>
      </template>
    </el-row>
    <el-row v-if="existDefaultBtn && !existCustomBtn"
            :class="{'formBtn':(existDefaultBtn || existCustomBtn)}">
      <el-col :span="24"
              class="flex-right">
        <slot name="btn"></slot>
        <el-button type="primary"
                   :icon="loadingVisible"
                   :disabled="isDisable"
                   @click="handleSubmit">保存</el-button>
      </el-col>
    </el-row>
    <el-row v-if="!existDefaultBtn && existCustomBtn"
            :class="{'formBtn':(existDefaultBtn || existCustomBtn)}">
      <el-col :span="24"
              class="flex-right">
        <slot name="customBtn"></slot>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { Form, FormItem, Row, Col, Button, Alert } from 'element-ui'
import FieldRender from './Components/FieldRender'
import AddField from './Components/AddField'
import CommonUpload from '../../upload'
import { uploadDefaultRules } from '../../upload/src/Components/Function.js'
export default {
  name: 'P8Form',
  componentName: 'P8Form',
  props: {
    comp: {
      type: Object
    },
    form: {
      type: Object,
      required: true
    },
    dataSource: {
      type: Array
    },
    isCustomValidate: {// 保存时自否有自定义校验
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    api: {
      type: String,
      default: ''
    },
    otherParam: {// 保存页面自定义的参数
      type: Object,
      default: function () {
        return {}
      }
    },
    existDefaultBtn: {// 是否显示表单自带的保存按钮，默认显示，与existCustomBtn对立
      type: Boolean,
      default: true
    },
    existCustomBtn: {// 是否显示自定义的表单按钮，默认不显示，与existDefaultBtn对立
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formElementNum: 0,
      renderedNum: 0,
      viewData: {},
      isDisable: false,
      loadingVisible: '',
      uploadDefaultRules: uploadDefaultRules()
    }
  },
  mounted () {

  },
  computed: {
    formData () {
      let formDataObj = {}
      this.dataSource.map(item => {
        if (item.fieldName || item.slotName) {
          formDataObj[item.fieldName] = item.defaultValue
        }
      })
      let realData = { ...formDataObj, ...this.form }
      this.$emit('form-data-change', { 'formData': realData, 'dataSource': this.dataSource })
      return realData
    },
    // 将edit页面中传入的dataSource进行二次封装
    renderDataSource () {
      let elementType = ['blank', 'upload', 'addField', 'hidden']
      let that = this
      return this.dataSource.map(function (item) {
        // 记录edit json中type类型不包含'blank'与'upload'的元素个数，用于寻找调用表单数据接口（给修改页面赋值）的时机
        if (elementType.indexOf(item.type) === -1) {
          that.formElementNum += 1
        }
        // edit json中如何没有设置fieldConfig，则将fieldConfig设置为空
        if (!item.fieldConfig) {
          item.fieldConfig = {}
        }
        return item
      })
    }
  },
  watch: {

  },
  methods: {
    sumRender () {
      this.renderedNum++
      if (this.formElementNum === this.renderedNum) {
        this.$emit('rendered')
      }
    },
    otherSumRender () {
      if (this.formElementNum === 0) {
        this.$emit('rendered')
      }
    },
    handleParams (obj) {
      // 判断必须为obj
      if (!(Object.prototype.toString.call(obj) === '[object Object]')) {
        return {}
      }
      let tempObj = {}
      for (let [key, value] of Object.entries(obj)) {
        // if(value == null) value = '';
        // if (Array.isArray(value) && value.length <= 0) continue
        if (Object.prototype.toString.call(value) === '[object Function]') continue

        if (this.datetimeTotimeStamp) {
          // 若是为true,则转为时间戳
          if (Object.prototype.toString.call(value) === '[object Object]' && value._isAMomentObject) {
            // 判断moment
            value = value.valueOf()
          }
          if (Array.isArray(value) && value[0]._isAMomentObject && value[1]._isAMomentObject) {
            // 判断moment
            value = value.map(item => item.valueOf())
          }
        }
        if (this.datetimeFormat) {
          if (Object.prototype.toString.call(value) === '[object Object]' && value._isAMomentObject) {
            // 判断moment，保存时将时间格式设置为'YYYY-MM-DD'
            value = Moment(value).format('YYYY-MM-DD')
          }
          if (Array.isArray(value) && value[0]._isAMomentObject && value[1]._isAMomentObject) {
            // 判断moment，保存时将时间格式设置为'YYYY-MM-DD'
            value = value.map(item => Moment(item).format('YYYY-MM-DD'))
          }
        }
        // 若是为字符串则清除两边空格
        if (value && typeof value === 'string') {
          value = value.trim()
        }
        tempObj[key] = value
      }

      return tempObj
    },
    handleSubmit (e) {
      e.preventDefault()
      this.validate().then((queryParams) => {
        let saveParams = { ...queryParams, ...this.otherParam }
        if (this.isCustomValidate) {
          this.$emit('custom-validate', saveParams)
        } else {
          this.submitForm(saveParams, this.api)
        }
      }).catch(() => {
        console.log('上传文件失败！')
      })
    },
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(isValid => {
          if (isValid) {
            let params = Object.assign({}, this.formData)
            const queryParams = this.handleParams(params)
            console.log('处理后的表单数据', queryParams)
            resolve(queryParams)
          }
        })
      })
    },
    submitForm (params, api) {
      this.loadingVisible = 'el-icon-loading'
      this.isDisable = true
      this.saveForm(api, params).then((res) => {
        this.successSave(res)
      }).catch(function (e) {
        console.log(e, '异步失败的操作')
      })
    },
    saveForm (api, params, urlParam) {
      let that = this
      return new Promise((resolve, reject) => {
        that.$api[that.api](params, urlParam).then(function (res) {
          resolve(res)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    successSave (res) {
      if (res === false) {
        return
      }
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
      this.$emit('saved', res)
      this.loadingVisible = ''
      this.isDisable = false
    },
    setViewFields (data) { // 给查看页面赋值
      this.viewData = data
    },
    uploadFile (file, field) {
      this.formData[field.fieldName] = this.$refs.commonupload[0].commonUploadFile(file, this.formData[field.fieldName])
    },
    removedFile (file, field) {
      this.formData[field.fieldName] = this.$refs.commonupload[0].commonRemoveFile(file, this.formData[field.fieldName])
    }
  },
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
    'el-button': Button,
    'el-alert': Alert,
    FieldRender,
    AddField,
    CommonUpload
  }
}
</script>