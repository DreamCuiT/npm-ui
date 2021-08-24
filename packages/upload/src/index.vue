<template>
  <div class="common-upload">
    <el-upload :action="uploadUrl()"
               size="mini"
               name='thefile'
               :class="{'el-upload--drag': uploadConfig.drag}"
               with-credentials
               :headers="headers"
               :file-list="renderFiles"
               :show-file-list="showList"
               :list-type="listType"
               :before-upload="beforeUpload"
               :before-remove="beforeRemove"
               :on-success="handleSuccess"
               :on-remove="handleRemove"
               :on-preview="handlePreview"
               :on-exceed="handleExceed"
               v-bind="uploadConfig">
      <template v-if="uploadConfig.drag">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </template>
      <template v-else-if="uploadSlot">
        <slot name="upload"></slot>
      </template>
      <template v-else-if="listType === 'picture-card'">
        <i class="el-icon-plus"></i>
        <el-dialog :visible.sync="dialogImageVisible"
                   :append-to-body="true">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
      </template>
      <el-button v-else
                 type="primary"
                 size="mini"
                 icon="el-icon-upload2">上传附件</el-button>
    </el-upload>
    <file-list v-if="!showList && !customList"
               :files="files"
               v-bind="uploadConfig"
               @remove="handleRemoveSecret"></file-list>
  </div>
</template>

<script>
import { Upload, Button, Dialog } from 'element-ui'
// import { uploadUrl, downloadFile } from './Components/Function'
import upLoad from '~/mixins/upload'
import FileList from './Components/fileList'
export default {
  name: 'P8Upload',
  componentName: 'P8Upload',
  mixins: [upLoad],
  components: {
    FileList,
    'el-upload': Upload,
    'el-button': Button,
    'el-dialog': Dialog
  },
  props: {
    files: { // 附件列表
      type: Array,
      default: () => []
    },
    listType: { // 附件列表展示类型: custom(自定义) / secret(带密级) / [text / picture / picture-card](elementUI提供)
      type: String,
      default: 'secret'
    },
    uploadSlot: { // 附件上传插槽, (可自定义上传按钮)
      type: Boolean,
      default: false
    },
    uploadConfig: { // 附件el-upload提提供的属性
      type: Object,
      default: () => {
        return {
          drag: false // 是否启用拖拽上传
        }
      }
    }
  },
  computed: {
    renderFiles () {
      /**
       * renderFiles: 用于el-upload自身的文件列表
       */
      if (this.showList) {
        return this.files.map(item => {
          item.name = item.fileName
          item.url = item.filePath
          return item
        })
      }
      return this.files
    }
  },
  data () {
    return {
      customList: false,
      showList: true,
      uploadListType: 'text',
      dialogImageVisible: false,
      dialogImageUrl: '',
      // uploadUrl: this.uploadUrl(),
      headers: { 'Authorization': this.$store.getters.token }

    }
  },
  mounted () {
    this.initListType()
  },
  methods: {
    initListType () {
      /**
       * 上传文件列表类型处理
       *    custom: 表示自定义列表(即不需要密级列表和element提供的列表)
       *    secret: 表示带密级, 手动处理 自定义
       *    text / picture / picture-card elementUI提供
       */
      if (this.listType === 'custom') {
        this.showList = false
        this.customList = true
        return
      }
      const otherType = ['secret']
      this.showList = otherType.indexOf(this.listType) === -1
      this.uploadListType = otherType.indexOf(this.listType) === -1 ? this.listType : 'text'
    },
    beforeUpload (file) {
      const MAX = 1024 * 1024 * 500 // 最大默认限制500M,
      let currFileSize = file.size
      if (currFileSize > MAX) {
        this.$message({
          type: 'error',
          message: `文件超过最大限制500M, 请重新上传`
        })
        return false
      }
      return true
    },
    beforeRemove (file) {
      /**
       * element-ui: 提供的删除之前的方法:
       *    file.status === 'success': 说明文件已经上传
       */
      if (file && file.status === 'success') {
        return true
      }
    },
    handleExceed (files, fileList) {
      /**
       * 文件超出个数限制时的钩子
       */
      let alreadyUploadFiles = this.files
      let limit = this.uploadConfig && this.uploadConfig.limit ? this.uploadConfig.limit : 0
      if (limit <= alreadyUploadFiles.length + files.length) {
        this.$message({
          type: 'error',
          message: `超过上传最大数量${limit}`
        })
        return false
      }
    },
    handleSuccess (response, file, fileList) {
      console.log(file, 'handleSuccess')
      if (file.response.data) {
        let uploadFile = file.response.data[0]
        if (uploadFile) {
          if (this.showList) {
            uploadFile.name = uploadFile.fileName
            uploadFile.url = uploadFile.filePath
          }
          this.$set(uploadFile, 'confidentialite', '') // 这里$set将密级字段放入文件对象中, 避免接口返回的文件信息无密级字段时, 密级选择回填不刷新的问题
          if (this.uploadConfig && this.uploadConfig.multiple) {
            let timer = setTimeout(() => {
              this.$emit('upload', uploadFile)
              clearTimeout(timer)
            }, 1000)
          } else {
            this.$emit('upload', uploadFile)
          }
        }
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
    handlePreview (file) {
      /**
       * element-ui 自带的文件被点击钩子
       */
      if (this.listType === 'picture-card') {
        this.dialogImageUrl = file.url
        this.dialogImageVisible = true
        return
      }

      let downloadFileItem = this.files.filter(item => item.filePath === file.url)
      if (downloadFileItem && downloadFileItem.length) {
        this.downloadFile(downloadFileItem[0], this)
      }
    },
    handleRemoveSecret (file) {
      /**
       * 带密级时, 文件列表删除某一行
       */
      this.$emit('remove', file)
    },
    commonUploadFile (uploadFile, uploadFiles) {
      /**
       * commonUploadFile: 提供一个公共上传文件并返回新数据的方法
       *    uploadFile: 调用上传接口返回的文件信息, 此时需将该文件 push 到对应的数组中
       *    uploadFiles: 即对应的数组
       *    return: push后的新数组
       */
      let uploadFileArrs = uploadFiles || []
      uploadFileArrs.push(uploadFile)
      return uploadFileArrs
    },
    commonRemoveFile (removeFile, removeFiles) {
      /**
       * commonRemoveFile: 提供一个公共删除文件并返回新数据的方法
       *    removeFile: 需要删除的文件信息, 此时需将该文件从 对应的数组中剔除
       *    removeFiles: 即对应的数组
       *    return: 剔除后的新数组
       */
      let removeFileArrs = removeFiles
      let removeIndex = removeFileArrs.findIndex((fileItem) => fileItem.filePath === removeFile.filePath)
      if (removeIndex > -1) {
        removeFileArrs.splice(removeIndex, 1)
      }
      return removeFileArrs
    }
  }
}
</script>
