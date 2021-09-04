<template>
  <div class="files-view-wrap">
    <template v-if="filesLayout==='row'">
      <ul class="files-type--row">
        <li v-for="item in uploadFiles" :key="item.id" class="files-item--row">
          <el-link @click="downloadfileHandle(item)"><i class="el-icon-document"></i>&nbsp;{{item.fileName}}</el-link>
          <span class="files-confidentialite--row" v-if="item.confidentialite">密级: <span v-text="confidentialiteLabel(item)"></span></span>
          <span class="files-confidentialite--row" v-if="showTypeSelect && item.type">附件类型: <span v-text="getFileTypeLabel(item)"></span></span>
        </li>
      </ul>
    </template>
    <template v-if="filesLayout==='card'">
      <ul class="files-type--card">
        <li v-for="item in renderFiles" :key="item.id" class="files-item--card" :class="fileTypeToStyle(item)" @click="downloadfileHandle(item)">
          <el-link :underline="false" @click="downloadfileHandle(item)">{{item.fileName}}({{confidentialiteLabel(item)}})</el-link>
          <span class="files-confidentialite--row" v-if="showTypeSelect && item.type">附件类型: <span v-text="getFileTypeLabel(item)"></span></span>
          <span class="icon-download" :class="fileTypeToStyle(item)"><i class="el-icon-download"></i></span>
        </li>
      </ul>
    </template>
  </div>
</template>
<script>
import { Link } from 'element-ui'
// import { getConfidentialiteLabel, downloadFile } from '../../upload/src/Components/Function'
import upLoad from '~/mixins/upload'
export default {
  name: 'P8FileView',
  componentName: 'P8FileView',
  mixins:[upLoad],
  components: {
    'el-link': Link
  },
  props: {
    uploadFiles: {
      type: Array,
      default: () => []
    },
    fileDownloadKey: { // 文件下载所需字段重新绑定: 根据传递值, 在文件下载时 获取到对应的文件信息
      type: Object,
      default: () => {
        return {
          id: 'id',
          fileName: 'fileName',
          confValueKey: 'confidentialite'
        }
      }
    },
    filesLayout: {
      type: String,
      default: 'card'
    }
  },
  computed: {
    showTypeSelect () {
      return this.$attrs.showTypeSelect
    },
    renderFiles () {
      let confidentialiteList = this.$store.state.user.confidentialiteList
      if ((this.uploadFiles && this.uploadFiles.length) && (confidentialiteList && confidentialiteList.length)) {
        return this.uploadFiles.map(item => {
          let filter = confidentialiteList.filter(conItem => conItem.value === item.confidentialite)
          item.confidentialiteLabel = filter.length ? filter[0].label : ''
          return item
        })
      }
      return this.uploadFiles
    }
  },
  data () {
    return {
      fileType: {
        'doc': 'blue',
        'dock': 'blue',
        'docx': 'blue',
        'pdf': 'orange',
        'xlsx': 'green',
        'xls': 'green'
      }
    }
  },
  methods: {
    fileTypeToStyle (item) {
      let fileTypeStr = item.fileName.substring(item.fileName.lastIndexOf('.') + 1)
      let className = this.fileType[fileTypeStr]
      return className || 'blue'
    },
    downloadfileHandle (item) {
      let bingKeyObj = this.fileDownloadKey
      this.downloadFile(item, this, { fileIdKey: bingKeyObj.id, fileNameKey: bingKeyObj.fileName, confValueKey: bingKeyObj.confValueKey })
    },
    confidentialiteLabel (file) {
      return this.getConfidentialiteLabel(file, 'confidentialite')
    },
    FileTypeLabel (file) {
      return this.getFileTypeLabel(file, 'type')
    }
  }
}
</script>
