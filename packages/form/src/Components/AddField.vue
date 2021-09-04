<template>
  <div>
    <el-row v-for="(k,index) in formData[fieldName]"
            :key="k.key"
            class="addField"
            :class="{'vertical':addFieldsLayout == 'vertical'}">
      <template v-for="item in addFields">
        <el-col v-if="addFieldsLayout == 'horizontal'"
                :span="item.col?item.col:(Math.floor(22/addFields.length))"
                :key="item.fieldName">
          <el-form-item class="el-form-item__upload"
                        v-if="item.fieldName && item.type === 'upload'"
                        :label="item.labelText"
                        :prop="fieldName + '.' + index + '.' + item.fieldName"
                        :label-width="item.labelWidth ? item.labelWidth : ''"
                        :rules="item.rules || item.listType === 'secret' ? uploadDefaultRules() : []">
            <common-upload ref="commonupload"
                           :files="formData[fieldName][index][item.fieldName] || []"
                           :listType="item.listType"
                           :num="item.num"
                           :params="item.params"
                           :maxLimit="item.maxLimit"
                           :uploadConfig="item.uploadConfig || {}"
                           @upload="(file) => { uploadFile(file, item, index) }"
                           @remove="(file) => { removedFile(file, item, index) }">
            </common-upload>
          </el-form-item>

          <add-field-render v-else
                            :ref="`addField${index}`"
                            :fields="item"
                            :fieldName="fieldName"
                            :k="k"
                            :index="index"></add-field-render>
        </el-col>
        <el-col v-else-if="addFieldsLayout == 'vertical'"
                :span="item.colLayout === 'doubleCol'?11:(item.colLayout === 'singleCol'?22:7)"
                :key="item.fieldName">
          <el-form-item class="el-form-item__upload"
                        v-if="item.fieldName && item.type === 'upload'"
                        :label="item.labelText"
                        :prop="fieldName + '.' + index + '.' + item.fieldName"
                        :label-width="item.labelWidth ? item.labelWidth : ''"
                        :rules="item.rules || item.listType === 'secret' ? uploadDefaultRules() : []">
            <common-upload ref="commonupload"
                           :files="formData[fieldName][index][item.fieldName] || []"
                           :listType="item.listType"
                           :num="item.num"
                           :params="item.params"
                           :maxLimit="item.maxLimit"
                           :uploadConfig="item.uploadConfig || {}"
                           @upload="(file) => { uploadFile(file, item, index) }"
                           @remove="(file) => { removedFile(file, item, index) }">
            </common-upload>
          </el-form-item>

          <add-field-render v-else
                            :fields="item"
                            :fieldName="fieldName"
                            :k="k"
                            :index="index"></add-field-render>
        </el-col>
      </template>
      <el-col v-if="!isView"
              :span="2"
              class="delete-cell">
        <i class="el-icon-delete"
           @click="() => remove(k)"></i>
      </el-col>
    </el-row>
    <el-row v-if="!isView">
      <el-col :span="24">
        <el-button type="dashed"
                   style="width: 100%"
                   @click="add">
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
  mixins: [upLoad],
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
      logData: [],
      deleteData: [],
      logDataChildren: [],
      logDataChildrenColumns: [
        {
          type: 'text',
          labelText: '',
          fieldName: 'confidentialite'
        }, {
          type: 'text',
          labelText: '',
          fieldName: 'fileLink'
        }, {
          type: 'text',
          labelText: '',
          fieldName: 'fileName'
        }, {
          type: 'text',
          labelText: '',
          fieldName: 'filePath'
        }, {
          type: 'text',
          labelText: '',
          fieldName: 'fileType'
        }, {
          type: 'text',
          labelText: '',
          fieldName: 'id'
        }, {
          type: 'text',
          labelText: '',
          fieldName: 'name'
        }, {
          type: 'text',
          labelText: '',
          fieldName: 'secretDate'
        }, {
          type: 'text',
          labelText: '',
          fieldName: 'type'
        }, {
          type: 'text',
          labelText: '',
          fieldName: 'uid'
        }, {
          type: 'text',
          labelText: '',
          fieldName: 'url'
        }
      ],
      addValue: {},
      uploadDefaultRules: uploadDefaultRules()
    }
  },
  computed: {
    getLogFormatData () {
      let logData = []
      if (!this.logData.length) { // 新增时
        logData = this.formData[this.fieldName].map((item, index) => {
          return {
            createType: this.getCreateType(item),
            objectId: this.getObjectId(item),
            objectName: this.getObjectName(item),
            objectSecretGrade: this.getObjectSecretGrade(item),
            logData: this.getLogAddFields.map((i, d) => {
              return {
                column: i.fieldName,
                columnName: i.labelText,
                before: '',
                after: item[i.fieldName]
              }
            }).filter(i => {
              return i.before !== i.after
            })
          }
        }).filter(i => {
          return i.logData.length
        })
      } else { // 编辑时 合并删除数据createType为3
        logData = this.formData[this.fieldName].map((item, index) => {
          return {
            createType: this.getCreateType(item),
            objectId: this.getObjectId(item),
            objectName: this.getObjectName(item),
            objectSecretGrade: this.getObjectSecretGrade(item),
            logData: this.getLogAddFields.map((i, d) => {
              return {
                column: i.fieldName,
                columnName: i.labelText,
                before: this.logData[index][d]['before'],
                after: item[i.fieldName]
              }
            }).filter(i => {
              return i.before !== i.after
            })
          }
        }).concat(this.deleteData.map((item, index) => {
          return {
            createType: '3',
            objectId: this.getObjectId(item),
            objectName: this.getObjectName(item),
            objectSecretGrade: this.getObjectSecretGrade(item),
            logData: []
          }
        })).filter(i => {
          return i.logData.length || i.createType === '3'
        })
      }
      return logData
    },
    getLogDataChildren () {
      let logDataChildren = []
      this.formData[this.fieldName].forEach((item, index) => {
        logDataChildren = logDataChildren.concat(item.uploadFiles)
      })
      logDataChildren = logDataChildren.map((item, index) => {
        return {
          createType: this.getCreateType(item),
          objectId: this.getObjectId(item),
          objectName: this.getObjectName(item),
          objectSecretGrade: this.getObjectSecretGrade(item),
          logData: this.logDataChildrenColumns.map((i, d) => {
            return {
              column: i.fieldName,
              columnName: i.labelText,
              before: this.getBeforeLogDataChildren[index][i.fieldName],
              after: item[i.fieldName]
            }
          }).filter(i => {
            return i.before !== i.after
          })
        }
      }).filter(i => {
        return i.logData.length || i.createType === '3'
      })
      return logDataChildren
    },
    getBeforeLogDataChildren () {
      return JSON.parse(JSON.stringify(this.logDataChildren))
    },
    getLogAddFields () {
      const dataType = ['view', 'upload']
      return this.addFields.filter(item => {
        return !dataType.includes(item.type)
      })
    },
    getLogUpload () {
      const dataType = ['upload']
      return this.addFields.filter(item => {
        return dataType.includes(item.type)
      })
    }
  },
  watch: {
    getLogFormatData: {
      handler: function (value) {
      },
      deep: true
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
    // 数据初始化完成记录初始值
    initDataDone () {
      const beforeData = deepClone(this.formData[this.fieldName])
      this.logData = beforeData.map(item => {
        return this.getLogAddFields.map(i => {
          return {
            column: i.fieldName,
            columnName: i.labelText,
            before: item[i.fieldName]
          }
        })
      })
      this.logDataChildren = []
      beforeData.forEach((item, index) => {
        this.logDataChildren = [...this.logDataChildren, ...item.uploadFiles]
      })
    },
    // 新旧值参数获取
    getCreateType (data) {
      if ('id' in data && data.id) {
        return '2'
      } else {
        return '1'
      }
    },
    getObjectId (data) {
      if ('id' in data) {
        return data.id
      } else {
        return ''
      }
    },
    getObjectName (data) {
      if ('name' in data) {
        return data.name
      } else {
        return ''
      }
    },
    getObjectSecretGrade (data) {
      if ('secretGrade' in data) {
        return data.secretGrade
      } else {
        return ''
      }
    },
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
        let deleteItem = this.formData[this.fieldName].splice(index, 1)
        if ('id' in deleteItem[0] && deleteItem[0].id) {
          this.deleteData = this.deleteData.concat(deleteItem)
        }
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
