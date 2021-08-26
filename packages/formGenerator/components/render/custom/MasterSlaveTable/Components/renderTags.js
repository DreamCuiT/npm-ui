import CustomUpload from '../../CustomUpload'
export default {
  props: {
    scope: {
      type: Object,
      default: () => {
        return {}
      }
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: Number
    },
    tableData: {
      type: Array,
      default: () => []
    },
    rowData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    tableData: {
      handler (val) {
        this.saveData()
      },
      deep: true
    }
  },
  computed: {
    modifyScope () {
      return this.rowData['uploadFiles']
    }
  },
  data () {
    return {
      uploadFilesArr: []
    }
  },
  methods: {
    saveData () {
      this.$emit('save')
    },
    handleUpload (uploadFile) {
      this.rowData['uploadFiles'].push(uploadFile)
      this.saveData()
    },
    handleUploadFileRemove (file) {
      let removeIndex = this.rowData['uploadFiles'].findIndex((fileItem) => fileItem.filePath === file.filePath)
      this.rowData['uploadFiles'].splice(removeIndex, 1)
      this.saveData()
    }
  },
  render (h) {
    switch (this.item.__config__.tag) {
      case 'el-input':
        return (
          <el-input v-model={this.rowData[this.item.__vModel__]} type={this.item.type} disabled={this.item.disabled}
            placeholder={this.item.placeholder} readonly={this.item.readonly} style={this.item.style}
            clearable={this.item.clearable} maxlength={this.item.maxlength} prefix-icon={this.item['prefix-icon']}
            suffix-icon={this.item['suffix-icon']} show-word-limit={this.item['show-word-limit']}></el-input>
        )
      case 'el-input-number':
        return (
          <el-input-number v-model={this.rowData[this.item.__vModel__]} disabled={this.item.disabled}
            placeholder={this.item.placeholder} style={this.item.style} min={this.item.min} max={this.item.max}
            step={this.item.step} step-strictly={this.item['step-strictly']} precision={this.item.precision}
            controls-position={this.item['controls-position']}></el-input-number>
        )
      case 'el-select':
        return (
          <el-select v-model={this.rowData[this.item.__vModel__]} disabled={this.item.disabled}
            placeholder={this.item.placeholder} style={this.item.style} clearable={this.item.clearable}
            filterable={this.item.filterable} multiple={this.item.multiple}>
            {
              this.item.__slot__.options.map(option => {
                return (
                  <el-option label={option.label} value={option.value}></el-option>
                )
              })
            }
          </el-select>
        )
      case 'el-radio-group':
        return (
          <el-radio-group v-model={this.rowData[this.item.__vModel__]} disabled={this.item.disabled}
            style={this.item.style} size={this.item.size}>
            {
              this.item.__slot__.options.map(option => {
                return (
                  <el-radio label={option.label} value={option.value}></el-radio>
                )
              })
            }
          </el-radio-group>
        )
      case 'el-checkbox-group':
        return (
          <el-checkbox-group v-model={this.rowData[this.item.__vModel__]} disabled={this.item.disabled}
            style={this.item.style} size={this.item.size} min={this.item.min} max={this.item.max}>
            {
              this.item.__slot__.options.map(option => {
                return (
                  <el-checkbox label={option.label} value={option.value}></el-checkbox>
                )
              })
            }
          </el-checkbox-group>
        )
      case 'el-switch':
        return (
          <el-switch v-model={this.rowData[this.item.__vModel__]} disabled={this.item.disabled}
            active-text={this.item['active-text']} inactive-text={this.item['inactive-text']} style={this.item.style}
            active-color={this.item['active-color']} inactive-color={this.item['inactive-color']} active-value={this.item['active-value']}
            inactive-value={this.item['inactive-value']}></el-switch>
        )
      case 'el-time-picker':
        return (
          <el-time-picker v-model={this.rowData[this.item.__vModel__]} disabled={this.item.disabled}
            placeholder={this.item.placeholder} clearable={this.item.clearable} style={this.item.style}
            picker-options={this.item['picker-options']} format={this.item.format} value-format={this.item['value-format']}
            is-range={this.item['is-range']} range-separator={this.item['range-separator']} start-placeholder={this.item['start-placeholder']}
            end-placeholder={this.item['end-placeholder']}></el-time-picker>
        )
      case 'el-date-picker':
        return (
          <el-date-picker v-model={this.rowData[this.item.__vModel__]} disabled={this.item.disabled}
            placeholder={this.item.placeholder} clearable={this.item.clearable} style={this.item.style}
            type={this.item.type} format={this.item.format} value-format={this.item['value-format']}
            range-separator={this.item['range-separator']} start-placeholder={this.item['start-placeholder']}
            end-placeholder={this.item['end-placeholder']} readonly={this.item.readonly}></el-date-picker>
        )
      case 'eject-select':
        return (
          <eject-select v-model={this.rowData[this.item.__vModel__]} config={this.item} formModel={this.rowData}></eject-select>
        )
      case 'tree-select':
        return (
          <tree-select v-model={this.rowData[this.item.__vModel__]} config={this.item}></tree-select>
        )
      case 'p8-upload':
        return (
          <CustomUpload uploadFiles={this.modifyScope} config={this.item} onUpload={this.handleUpload} onRemove={this.handleUploadFileRemove}></CustomUpload>
        )
    }
  }
}
