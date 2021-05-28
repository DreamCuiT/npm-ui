<template>
  <div>
    <el-row v-for="(k,index) in formData[fieldName]" :key="k.key" class="addField" :class="{'vertical':addFieldsLayout == 'vertical'}">
      <template v-for="item in addFields">
        <el-col
          v-if="addFieldsLayout == 'horizontal'"
          :span="item.col?item.col:(Math.floor(22/addFields.length))"
          :key="item.fieldName"
        >
          <el-form-item class="el-form-item__upload" v-if="item.fieldName && item.type === 'upload'" :label="item.labelText"
                  :prop="fieldName + '.' + index + '.' + item.fieldName"
                  :label-width="item.labelWidth ? item.labelWidth : ''"
                  :rules="item.rules || item.listType === 'secret' ? uploadDefaultRules() : []">
            <common-upload ref="commonupload" :files="formData[fieldName][index][item.fieldName] || []" :listType="item.listType" :maxLimit="item.maxLimit" :uploadConfig="item.uploadConfig || {}"
                  @upload="(file) => { uploadFile(file, item, index) }"
                  @remove="(file) => { removedFile(file, item, index) }">
            </common-upload>
          </el-form-item>

          <add-field-render v-else :fields="item" :fieldName="fieldName" :k="k" :index="index"></add-field-render>
        </el-col>
        <el-col v-else-if="addFieldsLayout == 'vertical'" :span="item.colLayout === 'doubleCol'?11:(item.colLayout === 'singleCol'?22:7)" :key="item.fieldName">
          <el-form-item class="el-form-item__upload" v-if="item.fieldName && item.type === 'upload'" :label="item.labelText"
                  :prop="fieldName + '.' + index + '.' + item.fieldName"
                  :label-width="item.labelWidth ? item.labelWidth : ''"
                  :rules="item.rules || item.listType === 'secret' ? uploadDefaultRules() : []">
            <common-upload ref="commonupload" :files="formData[fieldName][index][item.fieldName] || []" :listType="item.listType" :maxLimit="item.maxLimit" :uploadConfig="item.uploadConfig || {}"
                  @upload="(file) => { uploadFile(file, item, index) }"
                  @remove="(file) => { removedFile(file, item, index) }">
            </common-upload>
          </el-form-item>

          <add-field-render v-else :fields="item" :fieldName="fieldName" :k="k" :index="index"></add-field-render>
        </el-col>
      </template>
      <el-col v-if="!isView" :span="2" class="delete-cell">
        <i class="el-icon-delete" @click="() => remove(k)"></i>
      </el-col>
    </el-row>
    <el-row v-if="!isView">
      <el-col :span="24">
        <el-button type="dashed" style="width: 100%" @click="add">
          <i class="el-icon-plus"></i>
          添加
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Row, Col, Button, FormItem } from 'element-ui'
import AddFieldRender from './AddFieldRender'
import CommonUpload from '../../../upload'
import upLoad from '~/mixins/upload'
// import { uploadDefaultRules } from '../../../upload/src/Components/Function'
export default {
  name: 'AddField',
  mixins:[upLoad],
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-button': Button,
    'el-form-item': FormItem,
    AddFieldRender,
    CommonUpload
  },
  props: {
    addFieldsLayout: {
      type: String,
      default: 'horizontal'
    },
    addFields: {
      type: Array,
      default: () => []
    },
    fieldName: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addValue: {},
      // uploadDefaultRules: this.uploadDefaultRules()
    }
  },
  mounted () {
    // console.log(this.addFields, 'addFields')
    this.addFields.map(item => {
      if (item.type === 'upload') {
        this.addValue[item.fieldName] = []
      } else {
        this.addValue[item.fieldName] = item.defaultValue
      }
    })
    this.$emit('field-mounted')
    console.log(this.addValue, 'addValue')
  },
  methods: {
    add () {
      console.log('add', this.addValue, { key: Date.now() })
      this.formData[this.fieldName].push({ ...this.addValue, ...{ key: Date.now(), indexNo: this.formData[this.fieldName].length }, uploadFiles: [] })
    },
    remove (k) {
      console.log('remove', k)
      var index = this.formData[this.fieldName].indexOf(k)
      if (index !== -1) {
        if (index < this.formData[this.fieldName].length - 1) { // indexNo处理
          this.formData[this.fieldName].map((item, i) => {
            if (i > index) {
              item.indexNo = i - 1
            }
          })
        }
        this.formData[this.fieldName].splice(index, 1)
      }
      // console.log('remove', this.formData[this.fieldName])
    },
    uploadFile (file, field, index) {
      this.formData[this.fieldName][index][field.fieldName] = this.$refs.commonupload[0].commonUploadFile(file, this.formData[this.fieldName][index][field.fieldName])
    },
    removedFile (file, field, index) {
      this.formData[this.fieldName][index][field.fieldName] = this.$refs.commonupload[0].commonRemoveFile(file, this.formData[this.fieldName][index][field.fieldName])
    }
  }
}
</script>
