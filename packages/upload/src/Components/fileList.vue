<template>
  <ul class="upload__secret-file-list">
    <li v-for="(file, index) in files"
        :key="index"
        class="upload__secret-file-item">
      <el-row>
        <el-col :span="15"
                class="col-file-name">
          <i class="el-icon-document"></i>
          <span @click.stop="fileDownload(file)">{{ file.fileName }}</span>
        </el-col>
        <el-col :span="3"
                class="file-conf">
          <el-select v-if="!file.id"
                     size="mini"
                     allow-clear
                     placeholder="请选择密级"
                     :value="file.confidentialite"
                     @change="(val) => {selectChange(val, file)}">
            <el-option v-for="confidentialite in confidentialiteFileOption"
                       :key="confidentialite.value"
                       :label="confidentialite.label"
                       :value="confidentialite.value">
            </el-option>
          </el-select>
          <div v-else>
            <span v-text="handleConfidentialite(file)"></span>
          </div>
        </el-col>
        <el-col :span="3"
                v-if="showTypeSelect">
          <el-select v-if="!file.id"
                     size="mini"
                     allow-clear
                     placeholder="请选择附件类型"
                     :value="file.type"
                     @change="(val) => {selectChangeType(val, file)}">
            <el-option v-for="item in typeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div v-else
               class="file-conf">
            <span v-text="handleTypeOptions(file)"></span>
          </div>
        </el-col>
        <el-col :span="3"
                class="col-file-delete"
                style="text-align: center">
          <i class="el-icon-close"
             style="cursor:pointer;"
             @click.stop="removeSecret(file, index)"></i>
        </el-col>
      </el-row>
    </li>
  </ul>
</template>

<script>
import { Row, Col, Select, Option } from 'element-ui'
// import { downloadFile, getConfidentialiteLabel } from './Function'
import upLoad from '~/mixins/upload'
export default {
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-select': Select,
    'el-option': Option
  },
  mixins: [upLoad],
  props: {
    files: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    showTypeSelect () {
      return this.$attrs.showTypeSelect
    },
    typeOptions () {
      return this.$store.state.user.customFileTypeList || []
    },
    confidentialiteFileOption () {
      return this.$store.state.user.confidentialiteList || []
    }
  },
  data () {
    return {
    }
  },
  methods: {
    selectChange (value, file) {
      // file.confidentialite = value
      this.$set(file, 'confidentialite', value)
    },
    selectChangeType (value, file) {
      // file.confidentialite = value
      this.$set(file, 'type', value)
    },
    fileDownload (file) {
      this.downloadFile(file, this)
    },
    removeSecret (file, fileIndex) {
      this.$emit('remove', file, fileIndex)
    },
    handleConfidentialite (file) {
      return `密级: ${this.getConfidentialiteLabel(file)}`
    },
    handleTypeOptions (file) {
      let filter = this.typeOptions.find(item => item.value === file['type'])
      if (filter) {
        return `附件类型: ${filter.label}`
      } else {
        return `附件类型: 暂无数据`
      }
    }
  }
}
</script>
