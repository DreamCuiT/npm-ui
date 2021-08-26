<script>
import { Upload, Button, Row, Col } from 'element-ui'
import FilesListComp from './filesList'

export default {
  name: 'P8FormApplicationUpload',
  componentName: 'P8FormApplicationUpload',
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    uploadFiles: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    'el-uplaod': Upload,
    'el-button': Button,
    'el-rol': Row,
    'el-col': Col,
    FilesListComp
  },
  computed: {
    uploadFilesFilterByType () {
      /**
       * 过滤[props下的uploadFiles]: 根据__config__中的 fieldType 与 uploadFiles中文件对象的type 进行过滤
       */
      let fieldType = this.config.__config__.fieldType
      let filterFiles = this.uploadFiles.filter(item => item.type === fieldType)
      if (this.showList) {
        filterFiles.map(item => {
          item.name = item.fileName
          return item
        })
      }
      return filterFiles
    }
  },
  watch: {
    config: {
      handler (val, oldVal) {
        const that = this
        if (!oldVal || val['list-type'] !== oldVal['list-type']) {
          that.initListType()
        }
        that.uploadFileType = that.handleUploadFileType()
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    const { API_DEFAULT_CONFIG } = this.$sysConfig
    return {
      uploadApi: '',
      actionApi: '',
      uploadName: 'thefile',
      showList: true, //
      uploadListType: 'text', // 文件列表类型
      uploadFileType: null, // 支持上传文件类型
      filesListArr: [],
      maxSize: 0
    }
  },
  mounted () {
    this.initUrl()
    this.maxSize = this.initMaxFileSize()
  },
  methods: {
    initListType () {
      /**
       * 上传文件列表类型处理
       *    secret: 表示带密级, 手动处理 自定义
       *    text / picture / picture-card elementUI提供
       */
      const otherType = ['secret']
      let listType = this.config['list-type']
      this.showList = otherType.indexOf(listType) === -1
      this.uploadListType = otherType.indexOf(listType) === -1 ? listType : 'text'
    },
    initMaxFileSize () {
      /**
       * 上传文件的体积限制. 处理成 B
       */
      let unit = this.config.__config__.sizeUnit
      let max = this.config.__config__.fileSize
      let unitObj = {
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024
      }
      return unitObj[unit] * max
    },
    initUrl () {
      /**
       * 文件上传地址处理
       */
      let { devBaseUrl, prodBaseUrl, isDevMode } = API_DEFAULT_CONFIG
      let urlPrefix = isDevMode ? `${devBaseUrl}` : `${prodBaseUrl}`
      this.uploadApi = urlPrefix + '/attachment/upload'
    },
    customHttpRequest (params) {
      /**
       * 自定义上传方法
       */
      const that = this
      let formData = new FormData()
      formData.append(params.filename, params.file)
      this.$ajax.post(this.uploadApi, formData, { headers: { 'Authorization': that.$store.getters.token } }).then(function (res) {
        params.onSuccess(res)
      })
    },
    handleSuccess (response, file, fileList) {
      console.log(response, file, fileList, 'handleSuccess---handleSuccess')
      let uploadFile = file.response[0]
      if (uploadFile) {
        uploadFile.type = this.config.__config__.fieldType // fieldType 表单设计时,upload组件右侧面板填写的值
        this.$set(uploadFile, 'confidentialite', '') // 这里$set将密级字段放入文件对象中, 避免接口返回的文件信息无密级字段时, 密级选择回填不刷新的问题
        this.$emit('upload', uploadFile)
      }
    },
    beforeRemove (file, fileList) {
      /**
       * element-ui: 提供的删除之前的方法:
       *    file.status === 'success': 说明文件已经上传
       */
      if (file && file.status === 'success') {
        return true
      }
    },
    handleRemove (file, fileList) {
      /**
       * element-ui 自带的文件删除
       *    file.status === 'success': 说明文件已经上传
       */
      if (file && file.status === 'success') {
        this.$emit('remove', file)
      }
    },
    beforeUpload (file) {
      /**
       * 上传文件之前 限制文件类型与文件大小
       */
      let suffix = this.getUploadFileSuffix(file)
      if (!suffix || (this.uploadFileType !== 'all' && this.uploadFileType.indexOf(suffix) < 0)) {
        this.$message({
          type: 'warning',
          message: '请上传指定的文件类型'
        })
        return false
      }

      let currFileSize = file.size
      if (currFileSize > this.maxSize && this.maxSize !== 0) {
        this.$message({
          type: 'error',
          message: `文件已超过${this.config.__config__.fileSize + this.config.__config__.sizeUnit}, 请重新上传`
        })
        return false
      }
      return true
    },
    handleRemoveSecret (file) {
      /**
       * 带密级时, 文件列表删除某一行
       */
      this.$emit('remove', file)
    },
    handleStyle () {
      let labelWidth = this.config.labelWidth ? `${this.config.labelWidth}px` : null
      if (this.config.showLabel === false) labelWidth = '0'
      return {
        'uploadFilesList': {
          paddingLeft: labelWidth
        }
      }
    },
    getUploadFileSuffix (file) {
      let suffixIndex = file.name.lastIndexOf('.')
      if (suffixIndex > -1) {
        return file.name.substring(suffixIndex, file.name.length).toLowerCase()
      }
      return false
    },
    handleUploadFileType () {
      /**
       * 处理支持上传的文件类型
       */
      if (!this.config.accept) {
        // 全部类型
        return 'all'
      }
      let supportType = this.fullChar2halfChar(this.config.accept).split(',')
      let tempSaveType = []
      supportType.forEach(item => {
        switch (item) {
          case 'image/*':
            const imageAll = ['.jpeg', '.gif', '.jpg', '.png', '.bmp', '.pic']
            tempSaveType = tempSaveType.concat(imageAll)
            break
          case 'audio/*':
            const audioAll = ['.ogg', '.mp3', '.wav']
            tempSaveType = tempSaveType.concat(audioAll)
            break
          case 'video/*':
            const videoAll = ['.ogg', '.mp4', '.webm']
            tempSaveType = tempSaveType.concat(videoAll)
            break
          default:
            tempSaveType.push(item)
        }
      })
      return tempSaveType
    },
    fullChar2halfChar (str) {
      /**
       * 全角转半角
       */
      let result = ''
      for (let i = 0; i < str.length; i++) {
        // 获取当前字符的unicode编码
        let code = str.charCodeAt(i)
        // 在这个unicode编码范围中的是所有的英文字母已经各种字符
        if (code >= 65281 && code <= 65373) {
          // 把全角字符的unicode编码转换为对应半角字符的unicode码
          result += String.fromCharCode(str.charCodeAt(i) - 65248)
        } else if (code === 12288) { // 空格
          result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32)
        } else {
          result += str.charAt(i)
        }
      }
      return result
    }
  },
  render (h) {
    return (
      <div class='p8-upload'>
        <div style="min-height: 32px; display: flex">
          <el-upload name={this.uploadName}
            action={this.actionApi}
            show-file-list={this.showList}
            file-list={this.uploadFilesFilterByType}
            list-type={this.uploadListType}
            before-upload={this.beforeUpload}
            before-remove={this.beforeRemove}
            http-request={this.customHttpRequest}
            {...{ props: { 'on-success': this.handleSuccess } }}
            propsOnRemove={this.handleRemove}
          >
            <el-button type="primary" icon="el-icon-upload2"> {this.config.__config__.buttonText} </el-button>
          </el-upload>
          <span style="font-size: 12px;color: #999; padding-left: 16px">支持文件类型: {this.config.accept ? this.config.accept : '所有类型'}</span>
        </div>
        <div style={{ ...this.handleStyle().uploadFilesList }}>
          <files-list-comp listType={this.config['list-type']} filesList={this.uploadFilesFilterByType}
            onRemove={this.handleRemoveSecret}></files-list-comp>
        </div>
      </div>
    )
  }
}
</script>