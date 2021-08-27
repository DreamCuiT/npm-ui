import Vue from 'vue'
import renderTags from './Components/renderTags'

export default Vue.component('MasterSlaveTable', {
  components: {
    renderTags
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formModel: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formRules: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      tableData: [],
      checkboxGroupKeyArr: [], // 单独处理复选框组，默认值为数组，防止length报错
      removeId: [] // 修改页面子表删除的行记录id
    }
  },
  mounted () {
    this.tableData = this.config.__config__.defaultValue
    // 当主从表为单行模式展示时默认执行一次增加行操作
    if (this.config.__config__.displayMode === 'singleLine' && this.formModel[this.config.__config__.childrenTable].length === 0) {
      this.add()
    }
  },
  watch: {
    config: {
      handler (val) {
        if (this.config.__config__.displayMode === 'singleLine' && this.formModel[this.config.__config__.childrenTable].length === 0) {
          this.add()
        }
      }
    },
    deep: true
  },
  methods: {
    add () {
      this.config.__config__.children.map(item => {
        if (item.__config__.tag === 'el-checkbox-group') {
          this.checkboxGroupKeyArr.push(item.__vModel__)
        }
      })
      if (this.checkboxGroupKeyArr.length) {
        let checkboxGroupObj = {}
        this.checkboxGroupKeyArr.map(item => {
          checkboxGroupObj[item] = []
        })
        this.formModel[this.config.__config__.childrenTable].push({ ...checkboxGroupObj })
      } else {
        this.formModel[this.config.__config__.childrenTable].push({})
      }
    },
    remove (scope) {
      if (scope.ID) {
        this.removeId.push(scope.ID)
      }
      let index = this.formModel[this.config.__config__.childrenTable].indexOf(scope)
      this.formModel[this.config.__config__.childrenTable].splice(index, 1)
      this.saveData()
    },
    saveData () {
      let childSaveData = {
        tableId: this.config.__config__.childrenTable,
        data: this.formModel[this.config.__config__.childrenTable].length ? this.formModel[this.config.__config__.childrenTable].map(item => {
          let uploadFiles = item.uploadFiles
          // delete item.uploadFiles
          let otherItem = {}
          Object.keys(item).map(i => {
            if (['uploadFiles'].indexOf(i) === -1) {
              otherItem[i] = item[i]
            }
          })
          return { table: otherItem, uploadFiles: uploadFiles || [] }
        }) : [],
        removeId: this.removeId
      }
      console.log(childSaveData, 'childSaveData')
      this.$emit('save', childSaveData)
    },
    // 多行展示模式
    multiLineMode (h) {
      let oprationScopedSlotsObj = {
        default: scope => {
          return (
            <i class="el-icon-delete" style="font-size:20px;line-height:24px;cursor:pointer;" onClick={this.remove.bind(this, this.formModel[this.config.__config__.childrenTable][scope.$index])}></i>
          )
        }
      }
      console.log('this.config------this.config', this.config, this.formModel)
      return (
        <div class="list-layout">
          <div class="list-header">
            <el-button type="primary" round onClick={this.add}>新建</el-button>
          </div>
          <div class="list-main">
            <el-table ref="table" height="100%" data={this.formModel[this.config.__config__.childrenTable]}>
              {
                this.config.__config__.children.map((item, index) => {
                  let scopedSlotsObj = {
                    default: (scope) => {
                      if (item.__config__.tag === 'p8-upload') {
                        let rowUplaodFiles = this.formModel[this.config.__config__.childrenTable][scope.$index].uploadFiles ? this.formModel[this.config.__config__.childrenTable][scope.$index].uploadFiles : []
                        this.$set(this.formModel[this.config.__config__.childrenTable][scope.$index], 'uploadFiles', rowUplaodFiles)
                      }
                      return (
                        <el-form-item prop={this.config.__config__.childrenTable + '.' + scope.$index + '.' + item.__vModel__}
                          rules={this.formRules[item.__vModel__ + '_' + this.config.__config__.childrenTable]} label-width={'0'}>
                          <render-tags rowData={this.formModel[this.config.__config__.childrenTable][scope.$index]} item={item} index={index}
                            onSave={this.saveData} tableData={this.formModel[this.config.__config__.childrenTable]}></render-tags>
                        </el-form-item>
                      )
                    }
                  }
                  return (
                    <el-table-column key={index} label={item.__config__.label} prop={item.__vModel__} type={item.type}
                      min-width={item.minWidth} align={item.align} scopedSlots={scopedSlotsObj} class-name={item.hidden ? 'formDesignHiddenTrue' : '' }>
                    </el-table-column>
                  )
                })
              }
              <el-table-column label='操作' width='60px' scopedSlots={oprationScopedSlotsObj}></el-table-column>
            </el-table>
          </div>
        </div>
      )
    },
    // 单行展示模式
    singleLineMode (h) {
      return (
        <div>
          {
            this.formModel[this.config.__config__.childrenTable].map((i, idx) => {
              return (
                <el-row>
                  {
                    this.config.__config__.children.map((item, index) => {
                      if (item.__config__.tag === 'p8-upload') {
                        let rowUplaodFiles = i.uploadFiles ? i.uploadFiles : []
                        this.$set(i, 'uploadFiles', rowUplaodFiles)
                      }
                      let labelWidth = item.__config__.labelWidth ? `${item.__config__.labelWidth}px` : null
                      return (
                        <el-col class={item.hidden ? 'formDesignHiddenTrue' : ''} span={item.__config__.span}>
                          <el-form-item label-width={labelWidth} label={item.__config__.showLabel ? item.__config__.label : ''} prop={this.config.__config__.childrenTable + '.' + idx + '.' + item.__vModel__}
                            rules={this.formRules[item.__vModel__ + '_' + this.config.__config__.childrenTable]}>
                            <render-tags rowData={i} item={item} index={index}
                              onSave={this.saveData} tableData={this.formModel[this.config.__config__.childrenTable]}></render-tags>
                          </el-form-item>
                        </el-col>
                      )
                    })
                  }
                </el-row>
              )
            })
          }
        </div>
      )
    }
  },
  render (h) {
    if (this.config.__config__.displayMode === 'singleLine') {
      return this.singleLineMode(h)
    } else {
      return this.multiLineMode(h)
    }
  }
})
