<template>
  <ul class="upload__secret-file-list">
    <li v-for="(file, index) in files" :key="index" class="upload__secret-file-item">
      <el-row>
        <el-col :span="15" class="col-file-name">
          <i class="el-icon-document"></i>
          <span @click.stop="fileDownload(file)">{{ file.fileName }}</span>
        </el-col>
        <el-col :span="6">
          <el-select
            v-if="!file.id"
            size="mini"
            allow-clear
            placeholder="请选择密级"
            :value="file.confidentialite"
            @change="(val) => {selectChange(val, file)}"
          >
            <el-option
              v-for="confidentialite in confidentialiteFileOption"
              :key="confidentialite.value"
              :label="confidentialite.label"
              :value="confidentialite.value"
            >
            </el-option>
          </el-select>
          <div v-else class="file-conf">
            <span v-text="handleConfidentialite(file)"></span>
          </div>
        </el-col>
        <el-col :span="3" class="col-file-delete" style="text-align: center">
          <i
            class="el-icon-close"
            @click.stop="removeSecret(file, index)"
          ></i>
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
  mixins:[upLoad],
  props: {
    files: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      confidentialiteFileOption: this.$store.state.user.confidentialiteList
    }
  },
  methods: {
    selectChange (value, file) {
      // file.confidentialite = value
      console.log(value, file, 'selectChange--selectChange')
      this.$set(file, 'confidentialite', value)
    },
    fileDownload (file) {
      this.downloadFile(file, this)
    },
    removeSecret (file, fileIndex) {
      this.$emit('remove', file, fileIndex)
    },
    handleConfidentialite (file) {
      return `密级: ${this.getConfidentialiteLabel(file)}`
    }
  }
}
</script>
