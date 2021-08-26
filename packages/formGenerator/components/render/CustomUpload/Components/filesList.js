import { Row, Col, Select, Option } from 'element-ui'
let filesListComps = {
  secret (h) {
    /**
     * 1. filesList循环展示
     */
    return (
      <ul class='p8-upload__secret-file-list'>
        {
          this.filesList.map((file, fileIndex) => {
            return (
              <li class='p8-upload__secret-file-item'>
                <el-row>
                  <el-col span={15} class='col-secret-file'>
                    <i class='el-icon-document'></i>
                    <span onClick={() => { this.fileDownload(file) }}>{file.fileName}</span>
                  </el-col>
                  <el-col span={6}>
                    <el-form-item prop="uploadFiles" rules={this.uploadDefaultRules(filesList)}
                    >
                      <el-select allow-clear placeholder={'请选择密级'} value={file.confidentialite} onChange={(val) => { this.selectChange(val, file) }}>
                        {
                          this.confidentialiteFileOption.map((confidentialite, confidentialiteIndex) => {
                            return (
                              <el-option
                                key={confidentialite.value}
                                label={confidentialite.label}
                                value={confidentialite.value}>
                              </el-option>
                            )
                          })
                        }
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col span={3}>
                    <i class={'el-icon-close'} onClick={() => { this.removeSecret(file, fileIndex) }}></i>
                  </el-col>
                </el-row>
              </li>
            )
          })
        }
      </ul>
    )
  }
}
export default {
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-select': Select,
    'el-option': Option
  },
  props: {
    listType: {
      type: String
    },
    filesList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    filesList (val) {
    }
  },
  data () {
    return {
      confidentialiteFileOption: this.$store.state.user.confidentialiteList
    }
  },
  methods: {
    removeSecret (file, fileIndex) {
      this.$emit('remove', file, fileIndex)
    },
    selectChange (value, file) {
      // file.confidentialite = value
      this.$set(file, 'confidentialite', value)
    },
    fileDownload (file) {
      console.log(file, '-fileDownload-----fileDownload')
      if (!file.id) {
        this.$message({
          type: 'error',
          message: '文件Id不存在'
        })
        return
      }
      this.$api['SystemSettings.getFileUrl']({ attachmentId: file.id }, { responseType: 'blob' }).then(backJson => {
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(new Blob([backJson.data]))
        link.download = file.fileName
        document.body.appendChild(link)

        link.click()
        window.URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      }).finally(() => {
        // this.search.exportLoading = false
      })
    },
    uploadDefaultRules (fileList) {
      return [
        {
          validator: (rule, value) => {
            return new Promise((resolve, reject) => {
              if (fileList && fileList.length) {
                let temp = 0
                fileList.forEach(file => {
                  if (!file.confidentialite) {
                    temp += 1
                  }
                })
                if (temp) {
                  let rejectMsg = '请选择文件对应密级'
                  reject(rejectMsg)
                } else {
                  resolve()
                }
              } else {
                resolve()
              }
            })
          }
        }
      ]
    }
  },
  render (h) {
    let filesListComp = filesListComps[this.listType]
    return (
      filesListComp && filesListComp.call(this, h)
    )
  }
}
