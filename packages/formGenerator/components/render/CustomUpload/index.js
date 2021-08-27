import Vue from 'vue'
import { Upload, Button, Row, Col } from 'element-ui'
import FilesListComp from './Components/filesList'

export default Vue.component('CustomUpload', {
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
      let { devBaseUrl, prodBaseUrl, isDevMode } = this.$sysConfig.API_DEFAULT_CONFIG
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
      this.$ajax.post(this.uploadApi, formData, { headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6aGFuZ3NhbiIsImF1dGgiOiJiYXNlRGF0YTplZGl0UmVzLGZsaWdodDpyZW1vdmUsb3V0cHV0Rmxvdzp1cGRhdGVGbG93LGVuZ2luZTpleHBvcnRFeGNlbCxSdWxlTWFuYWdlOmV4cG9ydCxicERlcGFydG1lbnQ6bGlzdCxBY3Rpdml0eTpyZW1vdmUsRG9jdW1lbnRNYW5hZ2VtZW50OmRvd25sb2FkLEV2YWx1YXRpb246ZXhwb3J0RXhjZWwsZmxpZ2h0OmV4cG9ydEV4Y2VsLG91dHB1dEZsb3c6Y29weUZsb3csc3lzdGVtQXNzZXNzOmV4cG9ydEV4Y2VsLFJ1bGVNYW5hZ2U6c2F2ZSxGdW5UZWFtTWFuYWdlbWVudDpkZXRhaWxzUHJvamVjdFRlYW1TZXR0aW5ncyxRdWFsaXR5U3VwZXJ2aXNpb246cmVtb3ZlLGJ1bGxldGluOmltcG9ydEV4Y2VsLFRoaXJkUG9ydE1hbmFnZW1lbnQ6bGlzdCxmaWxlTWFuYWdlOmV4cG9ydEV4Y2VsLG1hbmFnZUFwcHJhaXNlOmlzc3VlLHByb2Nlc3NEZWZpbml0aW9uOmJwbW5TYXZlLGJhc2VEYXRhOmNyZWF0ZUNsYXNzaWZ5LFRoaXJkUG9ydFVudXN1YWxNYW5hZ2VtZW50OmRvUmV0cnksYnBEZXBhcnRtZW50OnJlbW92ZSxidWxsZXRpbjpleHBvcnRFeGNlbCxVbmNvcnJlY3Rpb25JdGVtczppbXBvcnRFeGNlbCxDaGVja291dEFyY2hpdmVzOmltcG9ydEV4Y2VsLERldmljZTpleHBvcnRFeGNlbCxwcm9kdWN0T3JnYW5pemF0aW9uOnJlbW92ZSxwcm9kdWN0RmlsZTpzYXZlLGltcHJvdmVUcmFjdDpyZW1vdmUsaW1wb3J0YW50UmVjZXB0aW9uOnJlbW92ZSxRdWFsaXR5U3VwZXJ2aXNpb246c2F2ZSxUaGlyZFBvcnRNYW5hZ2VtZW50OnVwZGF0ZVRoaXJkUGFydEludGVyZmFjZSxFdmFsdWF0aW9uOnNhdmUsZGF0YXNvdXJjZS1zdG9yYWdlLEV2YWx1YXRpb246aW1wb3J0RXhjZWwsd2hvbGVEZXNjcmliZTpkZWxldGUsYW5hbHlzaXNSZXBvcnQ6ZXhwb3J0RXhjZWwsU2NoZWR1bGVyVGFza01hbmFnZW1lbnQ6c2NoZWR1bGVyVGFza05vcm1hbCxBY3Rpdml0eTpleHBvcnQsYmFzZURhdGE6ZWRpdERpYyxjb21wb25lbnRzLXNlbGVjdCxDdXN0b21lck9waW5pb246c2F2ZSxhbmFseXNpc1JlcG9ydDppbXBvcnRFeGNlbCxVbmNvcnJlY3Rpb25JdGVtczpyZW1vdmUsUHJvamVjdDpyZW1vdmUsdG96ZXJvOmV4cG9ydEV4Y2VsLHByb2Nlc3NEZWZpbml0aW9uOmxpc3QsZWFybHlXYXJuaW5nOmFkZE1lbnUsc3lzdGVtQXNzZXNzOnJlbW92ZSxleHBvc3VyZTppbXBvcnQsY2FzZTpzYXZlLERvY3VtZW50TWFuYWdlbWVudDplZGl0LFNjaGVkdWxlclRhc2tNYW5hZ2VtZW50OnNjaGVkdWxlclRhc2tEZWxldGUsRG9jdW1lbnRNYW5hZ2VtZW50OmluZGV4LEZ1blBsYW5NYXJrTWFuYWdlbWVudDpzdG9wUGxhbkxvZ28sY29tbW9uUmVzb3VyY2VzUGxhbjpzYXZlLFRlbXBsYXRlOnNhdmUsbWFuYWdlQXBwcmFpc2U6aW1wb3J0LGNhc2U6aW1wb3J0RXhjZWwsbWVtb3JhYmlsaWE6aW1wb3J0RXhjZWwsVGhpcmRQb3J0VW51c3VhbE1hbmFnZW1lbnQ6bGlzdCxDdXN0b21lck9waW5pb246cmVtb3ZlLFNjaGVkdWxlclRhc2tNYW5hZ2VtZW50OnNjaGVkdWxlclRhc2tWaWV3LEZ1blBsYW5NYXJrTWFuYWdlbWVudDpyZW1vdmVQbGFuTG9nbyxEb2N1bWVudE1hbmFnZW1lbnQ6dmlldyxUaGlyZFBvcnRSZWNvcmRNYW5hZ2VtZW50Omxpc3QsUHJvamVjdDpzYXZlLG1hbmFnZUFwcHJhaXNlOnJlbW92ZSxTY2llbnRpZmljOnJlbW92ZSxzdGFuZGFyZDp1cGRhdGVLVGVhbXMsYmFzZURhdGE6ZGVsZXRlRmlsZUNsYXNzaWZ5LFF1YWxpdHlTdXBlcnZpc2lvbjpleHBvcnRFeGNlbCxpbXByb3ZlVHJhY3Q6aW1wb3J0RXhjZWwsRnVuVGVhbU1hbmFnZW1lbnQ6bGlzdCxtb2RlbDptb2RpZnlNZW51LG1vZGVsQ3VzdG9taXphdGlvbjppbmRleCx3aG9sZURlc2NyaWJlOnNhdmUsUnVsZU1hbmFnZTpyZW1vdmUsc3lzdGVtQXNzZXNzOmltcG9ydEV4Y2VsLEZ1blBsYW5NYXJrTWFuYWdlbWVudDpzdGFydFBsYW5Mb2dvLFVuY29ycmVjdGlvbkl0ZW1zOnNhdmUsdXNlcjpsaXN0LG1hbmFnZUFwcHJhaXNlOmV4cG9ydEV4Y2VsLG1vZGVsQ3VzdG9taXphdGlvbjpyZW1vdmVNb2RlbEN1c3RvbWl6YXRpb24sVGhpcmRQb3J0VW51c3VhbE1hbmFnZW1lbnQ6cmV0cnlMaXN0LFRoaXJkUG9ydE1hbmFnZW1lbnQ6cmVtb3ZlVGhpcmRQYXJ0SW50ZXJmYWNlLG1vZGVsQ3VzdG9taXphdGlvbjptb2RlbEN1c3RvbWl6YXRpb25JbXBvdCxpbXByb3ZlVHJhY3Q6c2F2ZSxwcm9jZXNzRGVmaW5pdGlvbjpkZWxldGUsemVyb0R5bmFtaWM6ZXhwb3J0RXhjZWwsc3RhbmRhcmQ6Y3JlYXRlS1RlYW1zLHJvbGU6cmVtb3ZlLHRvemVybzpyZW1vdmUsbW9kZWw6ZGVsTWVudSxyb2xlOmxpc3QsdHlwZVNwZWN0cnVtOmltcG9ydEV4Y2VsLGZsaWdodDpzYXZlLE1lbWJlckFyY2hpdmVzOmltcG9ydEV4Y2VsLFNjaGVkdWxlclRhc2tNYW5hZ2VtZW50OnNjaGVkdWxlclRhc2tEZWFkQWN0aXZlLGJ1bGxldGluOnJlbW92ZSxxdWFsaXR5OnRvemVybyxlbmdpbmU6c2F2ZSxUZW1wbGF0ZTpyZW1vdmUsYW5hbHlzaXNSZXBvcnQ6cmVtb3ZlLHByb2R1Y3RUZWFtOnNhdmUscmlza01hbmFnZXI6bGlzdCxGdW5QbGFuTWFya01hbmFnZW1lbnQ6Y3JlYXRlUGxhbkxvZ28sdXNlcjp1bmxvY2ssc3lzdGVtQXNzZXNzOnVwZGF0ZSxGdW5UZWFtTWFuYWdlbWVudDpzdGFydFByb2plY3RUZWFtU2V0dGluZ3MsY29tcG9uZW50cy1iYXNlLGJ1bGxldGluOnNhdmUscmV2ZW51ZVllYXJCdWRnZXQubGlzdCxiYXNlRGF0YTpkZWxldGVDbGFzc2lmeSxiYXNlRGF0YTpkZWxldGVSZXMsYmFzZURhdGE6Y3JlYXRlRGljLHByb2R1Y3RTeXN0ZW1TdGFuZGFyZDp1cGRhdGUsbXlFeHBlcmllbmNlQmFzZTpkZWxNZW51LHByb2R1Y3RGaWxlOnJlbW92ZSxUZW1wbGF0ZTpleHBvcnRFeGNlbCx6ZXJvRHluYW1pYzppbXBvcnRFeGNlbCxvdXRwdXRGbG93OnJlbW92ZUZsb3cscHJvZHVjdFN5c3RlbVN0YW5kYXJkOnNhdmUscmV2ZW51ZUZ1bGxCdWRnZXQ6YmFjayxjb21wb25lbnRzLWZvcm0sUnVsZU1hbmFnZTppbXBvcnRFeGNlbCxmaWxlTWFuYWdlOnJlbW92ZSxGdW5UZWFtTWFuYWdlbWVudDpzdG9wUHJvamVjdFRlYW1TZXR0aW5ncyxtYW5hZ2VBcHByYWlzZTpjb21wbGV0ZSxEb2N1bWVudE1hbmFnZW1lbnQ6ZGVsZXRlLHF1YWxpdHk6c2F2ZSxGdW5QbGFuTWFya01hbmFnZW1lbnQ6dXBkYXRlUGxhbkxvZ28sZmlsZU1hbmFnZTpzYXZlLFNjaWVudGlmaWM6ZXhwb3J0RXhjZWwsbWVtb3JhYmlsaWE6ZXhwb3J0RXhjZWwsbWVldGluZ01hbmFnZXI6c2F2ZSxUZW1wbGF0ZTppbXBvcnRFeGNlbCxhbmFseXNpc1JlcG9ydDpzYXZlLFF1YWxpdHlTdXBlcnZpc2lvbjppbXBvcnRFeGNlbCxsb2c6bGlzdDphdWRpdEFkbWluLGJhc2VEYXRhOmNyZWF0ZVJlcyxpbXByb3ZlVHJhY3Q6ZXhwb3J0RXhjZWwsRnVuUGxhbk1hcmtNYW5hZ2VtZW50Omxpc3QsZGF0YXNvdXJjZS1kYXRhdmlldyxtYW5hZ2VBcHByYWlzZTpiYWNrLEFjdGl2aXR5OnNhdmUsZXhwb3N1cmU6dXBkYXRlLHByb2R1Y3RPcmdhbml6YXRpb246dXBkYXRlLGxvZzpsaXN0OnNhZmVBZG1pbix1c2VyOnNhZmVTYXZlLGNhc2U6cmVtb3ZlLHF1YWxpdHk6ZXhwb3J0RXhjZWwscmVzb3VyY2VNYW5hZ2VyOmxpc3QsUHJvamVjdDppbXBvcnRFeGNlbCxwcm9jZXNzRGVmaW5pdGlvbjpzYXZlLFRoaXJkUG9ydFVudXN1YWxNYW5hZ2VtZW50OmRvT25lUmV0cnksVGhlc2lzOnNhdmUscHJvZHVjdFN5c3RlbVN0YW5kYXJkOnJlbGVhc2UsQ3VzdG9tZXJPcGluaW9uOmltcG9ydEV4Y2VsLHJldmVudWVGdWxsQnVkZ2V0Lmxpc3Qscmlza1N0b3JlOmxpc3Qsd2hvbGVEZXNjcmliZTppbmZvLGVuZ2luZTpyZW1vdmUsZWFybHlXYXJuaW5nOnVwZGF0ZUVhcmx5V2FybmluZyxteVRhc2s6bGlzdCxzdGF0aXN0aWNhbDpleHBvcnRFeGNlbCx3aG9sZURlc2NyaWJlOnJlbGVhc2VNZW51LERldmljZTpzYXZlLFNjaWVudGlmaWM6aW1wb3J0RXhjZWwscmlza0Jhc2U6aW5mbyx3aG9sZURlc2NyaWJlOnBlcm1pc3Npb25TZXR0aW5nLGJhc2VEYXRhOmRlbGV0ZURpYyxTY2hlZHVsZXJUYXNrTWFuYWdlbWVudDpzY2hlZHVsZXJUYXNrTW9kaWZ5LEN1c3RvbWVyT3BpbmlvbjpleHBvcnRFeGNlbCxvdXRwdXRGbG93OmluZGV4Rmxvdyx1c2VyOnJlbW92ZVVzZXIsU2NoZWR1bGVyVGFza01hbmFnZW1lbnQ6bGlzdCxzeXN0ZW1Bc3Nlc3M6c2F2ZSxtZWV0aW5nTWFuYWdlcjpyZW1vdmUscHJvY2Vzc0RlZmluaXRpb246ZXhwb3J0LGJhc2VEYXRhOmVkaXRDbGFzc2lmeSxNZW1iZXJBcmNoaXZlczpzYXZlLEZ1blRlYW1NYW5hZ2VtZW50OnVwZGF0ZVByb2plY3RUZWFtU2V0dGluZ3Msc3RhbmRhcmQ6ZGlzcG9zZUtUZWFtcyxBY3Rpdml0eTppbXBvcnRFeGNlbCxQcm9qZWN0OmV4cG9ydEV4Y2VsLFNjaGVkdWxlclRhc2tNYW5hZ2VtZW50OnNjaGVkdWxlclRhc2tDcmVhdGUsTWVtYmVyQXJjaGl2ZXM6ZXhwb3J0RXhjZWwsb3V0cHV0RmxvdzpjcmVhdGUsVW5jb3JyZWN0aW9uSXRlbXM6ZXhwb3J0RXhjZWwsU2NoZWR1bGVyVGFza01hbmFnZW1lbnQ6c2NoZWR1bGVyVGFza0ZvcmJpZGRlbixicERlcGFydG1lbnQ6bW92ZVVzZXIscHJvZHVjdFN5c3RlbVN0YW5kYXJkOnJlbW92ZSxyaXNrQmFzZTpjcmVhdGVSaXNrTWFuYWdlLGV4cG9zdXJlOnJlbW92ZSxjb21wb25lbnRzLWdyaWQsd2hvbGVEZXNjcmliZTpsaXN0LHRvemVybzpzYXZlLHplcm9EeW5hbWljOnJlbW92ZSx6ZXJvRHluYW1pYzpzYXZlLENoZWNrb3V0QXJjaGl2ZXM6ZXhwb3J0RXhjZWwsaW1wcm92ZVRyYWN0OnVwZGF0ZSx3aG9sZURlc2NyaWJlOnN1Ym1pdCxtb2RlbDphZGRNZW51LGV4cG9zdXJlOmdldCxxdWFsaXR5OnJlbW92ZSxiYXNlRGF0YTpjcmVhdGVGaWxlQ2xhc3NpZnksRnVuVGVhbU1hbmFnZW1lbnQ6cmVtb3ZlUHJvamVjdFRlYW1TZXR0aW5ncyxDaGVja291dEFyY2hpdmVzOnNhdmUsY2FzZTpleHBvcnRFeGNlbCxtZWV0aW5nTWFuYWdlcjp0b0RvTGlzdCxyaXNrQmFzZTpjcmVhdGVSaXNrQmFzZSxtYW5hZ2VBcHByYWlzZTpzYXZlLGJwRGVwYXJ0bWVudDpzYXZlLGJhc2VEYXRhOmVkaXRGaWxlQ2xhc3NpZnksU2NpZW50aWZpYzpzYXZlLERldmljZTppbXBvcnRFeGNlbCxleHBvc3VyZTpzYXZlLFRoZXNpczpyZW1vdmUsb3V0cHV0RmxvdzppbmRleCxNZW1iZXJBcmNoaXZlczpyZW1vdmUsRnVuVGVhbU1hbmFnZW1lbnQ6Y3JlYXRlUHJvamVjdFRlYW1TZXR0aW5ncyxpbXBvcnRhbnRSZWNlcHRpb246c2F2ZSxDaGVja291dEFyY2hpdmVzOnJlbW92ZSxwcm9kdWN0VGVhbTpyZW1vdmUsRXZhbHVhdGlvbjpyZW1vdmUsc3RhbmRhcmQ6cmVtb3ZlS1RlYW1zLHByb2Nlc3NEZWZpbml0aW9uOmRlcGxveSxmaWxlTWFuYWdlOmltcG9ydEV4Y2VsLHJvbGU6c2F2ZSx1c2VyOnNhdmUsVGhpcmRQb3J0TWFuYWdlbWVudDpjcmVhdGVUaGlyZFBhcnRJbnRlcmZhY2UiLCJleHAiOjE2MzE1MDEwMzF9.6ExHNssWoL2PfgEsgztD0hEzEsIO3bCFTljNFsvycUUDzJT53j6Orp-21ljjFUteHaNkp9m4T-uGwo1ogKYyNQ'} }).then(function (res) {
        params.onSuccess(res)
      })
    },
    handleSuccess (response, file, fileList) {
      console.log(response, file, fileList, 'handleSuccess---handleSuccess',file.response[0])
      let uploadFile = file.response.data.data[0]
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
})
