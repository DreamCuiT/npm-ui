import CustomUpload from '../../CustomUpload'
export default {
  props: {
    formModel: {
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
    }
  },
  watch: {

  },
  computed: {
  },
  data () {
    return {
    }
  },
  methods: {
    handleUpload (uploadFile) {
      this.formModel['uploadFiles'].push(uploadFile)
    },
    handleUploadFileRemove (file) {
      let removeIndex = this.formModel['uploadFiles'].findIndex((fileItem) => fileItem.filePath === file.filePath)
      this.formModel['uploadFiles'].splice(removeIndex, 1)
    }
  },
  render (h) {
    const { item, formModel } = this
    switch (item.__config__.tag) {
      case 'el-input':
        return (
          <el-input v-model={formModel[item.__vModel__]}
                    type={item.type}
                    disabled={item.disabled}
                    placeholder={item.placeholder}
                    readonly={item.readonly}
                    style={item.style}
                    clearable={item.clearable}
                    maxlength={item.maxlength}
                    prefix-icon={item['prefix-icon']}
                    suffix-icon={item['suffix-icon']}
                    show-word-limit={item['show-word-limit']}></el-input>
        )
      case 'el-input-number':
        return (
          <el-input-number v-model={formModel[item.__vModel__]}
                            disabled={item.disabled}
                            placeholder={item.placeholder}
                            style={item.style}
                            min={item.min}
                            max={item.max}
                            step={item.step}
                            step-strictly={item['step-strictly']}
                            precision={item.precision}
                            controls-position={item['controls-position']}></el-input-number>
        )
      case 'el-select':
        return (
          <el-select v-model={formModel[item.__vModel__]}
                      disabled={item.disabled}
                      placeholder={item.placeholder}
                      style={item.style}
                      clearable={item.clearable}
                      filterable={item.filterable}
                      multiple={item.multiple}>
                      {
                        item.__slot__.options.map(option => {
                          return (
                            <el-option label={option.label} value={option.value}></el-option>
                          )
                        })
                      }
          </el-select>
        )
      case 'el-radio-group':
        return (
          <el-radio-group v-model={formModel[item.__vModel__]}
                          disabled={item.disabled}
                          style={item.style}
                          size={item.size}>
                          {
                            item.__slot__.options.map(option => {
                              return (
                                <el-radio label={option.label} value={option.value}></el-radio>
                              )
                            })
                          }
          </el-radio-group>
        )
      case 'el-checkbox-group':
        return (
          <el-checkbox-group v-model={formModel[item.__vModel__]}
                              disabled={item.disabled}
                              style={item.style}
                              size={item.size}
                              min={item.min}
                              max={item.max}>
                              {
                                item.__slot__.options.map(option => {
                                  return (
                                    <el-checkbox label={option.label} value={option.value}></el-checkbox>
                                  )
                                })
                              }
          </el-checkbox-group>
        )
      case 'el-switch':
        return (
          <el-switch v-model={formModel[item.__vModel__]}
                      disabled={item.disabled}
                      active-text={item['active-text']}
                      inactive-text={item['inactive-text']}
                      style={item.style}
                      active-color={item['active-color']}
                      inactive-color={item['inactive-color']}
                      active-value={item['active-value']}
                      inactive-value={item['inactive-value']}></el-switch>
        )
      case 'el-time-picker':
        return (
          <el-time-picker v-model={formModel[item.__vModel__]}
                          disabled={item.disabled}
                          placeholder={item.placeholder}
                          clearable={item.clearable}
                          style={item.style}
                          picker-options={item['picker-options']}
                          format={item.format}
                          value-format={item['value-format']}
                          is-range={item['is-range']}
                          range-separator={item['range-separator']}
                          start-placeholder={item['start-placeholder']}
                          end-placeholder={item['end-placeholder']}></el-time-picker>
        )
      case 'el-date-picker':
        return (
          <el-date-picker v-model={formModel[item.__vModel__]}
                          disabled={item.disabled}
                          placeholder={item.placeholder}
                          clearable={item.clearable}
                          style={item.style}
                          type={item.type} format={item.format}
                          value-format={item['value-format']}
                          range-separator={item['range-separator']}
                          start-placeholder={item['start-placeholder']}
                          end-placeholder={item['end-placeholder']}
                          readonly={item.readonly}></el-date-picker>
        )
      case 'eject-select':
        return (
          <eject-select v-model={formModel[item.__vModel__]} config={item} formModel={formModel}></eject-select>
        )
      case 'tree-select':
        return (
          <tree-select v-model={formModel[item.__vModel__]} config={item}></tree-select>
        )
      case 'p8-upload':
        return (
          <CustomUpload uploadFiles={formModel['uploadFiles']}
                        config={item}
                        onUpload={this.handleUpload}
                        onRemove={this.handleUploadFileRemove}></CustomUpload>
        )
    }
  }
}
