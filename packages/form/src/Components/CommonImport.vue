<template>
  <el-form ref="form" :model="formData" label-width="100">
    <el-form-item :label="fields.lableText" :rules="fields.rules">
      <el-upload
              :action="actionApi"
              list-type="text"
              ref="upload"
              v-bind="fields.uploadConfig"
              name="thefile"
              :http-request="requestFun"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleChange"
      >
      <template v-if="fields.uploadConfig.drag">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </template>
      <template v-else>
        <el-button><i class="el-icon-upload2"></i> 上传附件 </el-button>
      </template>
      </el-upload>
    </el-form-item>
    <ul class="el-upload-list el-upload-list--text">
      <li v-for="(item,index) in fileList" :key="index" class="el-upload-list__item is-success">
        <div :style={marginLeft:labelWidth} v-if="Object.keys(item).length>0">
          <el-row>
              <el-col :span="14">
                  <i :class="getFileType(item.name?item.name.substring(item.name.lastIndexOf('.')+1):'')" style="font-size:14px;"></i>
                  <span>{{item.name}}</span>
              </el-col>
              <el-col :span="8" style="margin-top:-4px;">
                  <el-form-item label="密级：" :prop="'confidentialiteList.'+index+'.confidentialite'">
                      <el-select
                              style="width:85px; margin-left:10px;"
                              allow-clear
                              placeholder="请选择密级"
                              v-model="formData['confidentialiteList'][index].confidentialite"
                      >
                        <el-option label="公开" value="gongkai"></el-option>
                        <el-option label="秘密" value="mimi"></el-option>
                      </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="2">
                  <i class="el-icon-close" @click="removeSecret(item)"></i>
              </el-col>
          </el-row>
        </div>
      </li>
    </ul>
    <el-row>
      <el-col :span="24" class="flex-right">
        <el-button type="primary" @click="handleSubmit">上传</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { Form, FormItem, Upload, Button, Row, Col, Select, Option } from 'element-ui'
// import { API_DEFAULT_CONFIG } from '@/config/settings'

export default {
  name: 'P8Import',
  componentName: 'P8Import',
  props: {
    fields: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    uploadApi: {
      type: String
    }
  },
  data () {
    const { API_DEFAULT_CONFIG } = this.$sysConfig
    return {
      urlPrefix: '',
      api_default_config: API_DEFAULT_CONFIG,
      actionApi: '',
      fileList: [],
      thefileList: []
    }
  },
  mounted () {
    let { devBaseUrl, prodBaseUrl, isDevMode } = this.api_default_config
    this.urlPrefix = isDevMode ? `${devBaseUrl}` : `${prodBaseUrl}`
  },
  watch: {
    thefileList (val, oldVal) {
      let that = this
      if (val.length === that.formData['confidentialiteList'].length) {
        let formData = new FormData()
        val.map((item, index) => {
          formData.append('thefile', item)
          formData.append('confidentialiteList', that.formData['confidentialiteList'][index])
        })
        that.$ajax.post(that.urlPrefix + that.uploadApi, formData, { headers: { 'Authorization': that.$store.getters.token } }).then(function (res) {
          that.$emit('save-success', res)
        })
      }
    }
  },
  methods: {
    requestFun (params) {
      this.thefileList.push(params.file)
    },
    removeSecret (key) {
      let index = this.fileList.indexOf(key)
      if (index !== -1) {
        this.fileList.splice(index, 1)
        this.formData['confidentialiteList'].splice(index, 1)
        this.thefileList = []
      }
    },
    handleChange (file, fileList) {
      this.formData['confidentialiteList'].push({
        confidentialite: ''
      })

      this.fileList = fileList
      this.thefileList = []
    },
    handleSubmit () {
      this.$refs.upload.submit()
    },
    // 数组去重
    distinct (arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (arr[i].name === arr[j].name) {
            arr.splice(j, 1)
            len--
            j--
          }
        }
      }
      return arr
    },
    /*
    * 用来根据附件类型的名称返回一个对应的图标
    * @param type
    * return
    * */
    getFileType (type) {
      switch (type) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return 'el-icon-picture-outline'
        default:
          return 'el-icon-document'
      }
    }
  },
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-upload': Upload,
    'el-button': Button,
    'el-row': Row,
    'el-col': Col,
    'el-select': Select,
    'el-option': Option
  }
}
</script>
