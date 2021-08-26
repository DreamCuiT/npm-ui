<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import { deepClone } from '~/utils/common'
import render from '../../components/render/render.js'
import customRender from '../../components/render/customRender.js'

import MasterSlaveTable from '../../components/render/MasterSlaveTable'
import CustomUpload from '../../components/render/CustomUpload'
import EjectSelect from '../../components/render/EjectSelect'
// import TreeSelect from '../../components/render/TreeSelect'
import CustomView from '../../components/render/CustomView'
import FormSecretLevel from '../../components/render/custom/FormSecretLevel'
import FommonFileView from 'packages/fileView'
import { treeFind } from 'operation-tree-node'
import moment from 'moment'

Vue.use(ElementUI, { size: 'small' })

const ruleTrigger = {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change'
}

const layouts = {
  colFormItem (h, scheme, pageData) {
    const config = scheme.__config__
    // const listeners = buildListeners.call(this, scheme)
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    if (config.tag === 'el-select' || config.tag === 'eject-select') {
      return (
        <select-view schemes={scheme} reportParam={this[this.formConf.formModel][scheme.__vModel__]} onData={this.ejectData.bind(this, scheme)}></select-view>
      )
    } else if (config.tag === 'custom-view') {
      return (
        <el-col span={config.span} class={scheme.hidden ? 'formDesignHiddenTrue' : ''}>
          <el-form-item label-width={labelWidth} prop={scheme.__vModel__}
            label={config.showLabel ? config.label : ''}>
            <CustomView config={scheme} pageData={pageData}></CustomView>
          </el-form-item>
        </el-col>)
    } else if (config.tag === 'tree-select') {
      return (<select-tree schemes={scheme} reportParam={this[this.formConf.formModel][scheme.__vModel__]}></select-tree>)
    } else if (config.tag === 'el-date-picker') {
      return (<el-col span={config.span} class={scheme.hidden ? 'formDesignHiddenTrue' : ''}>
        <el-form-item label-width={labelWidth} prop={scheme.__vModel__}
          label={config.showLabel ? config.label : ''}>
          {moment(this.modifyRes.primary.table[scheme.__vModel__]).format(scheme.format.toLocaleUpperCase())}
        </el-form-item>
      </el-col>)
    } else {
      return (
        <el-col span={config.span} class={scheme.hidden ? 'formDesignHiddenTrue' : ''}>
          <el-form-item label-width={labelWidth} prop={scheme.__vModel__}
            label={config.showLabel ? config.label : ''}>
            {this.modifyRes.primary.table[scheme.__vModel__]}
          </el-form-item>
        </el-col>
      )
    }
  },
  rowFormItem (h, scheme, pageData) {
    let child = renderChildren.apply(this, arguments)
    if (scheme.type === 'flex') {
      child = <el-row type={scheme.type} justify={scheme.justify} align={scheme.align}>
        {child}
      </el-row>
    }
    return (
      <el-col span={scheme.span}>
        <el-row gutter={scheme.gutter}>
          {child}
        </el-row>
      </el-col>
    )
  },
  // 主从表组件
  masterSlaveTable (h, scheme, pageData) {
    return (
      <el-col span={scheme.span}>
        <el-row gutter={scheme.gutter} class={scheme.__config__.displayMode === 'multiLine' ? 'masterSlaveTableHeight' : ''}>
          {
            scheme.__config__.displayMode === 'singleLine' ? this.singleLineMode(h, scheme) : this.multiLineMode(h, scheme)
          }
        </el-row>
      </el-col>
    )
  }
}

function renderFrom (h, pageData) {
  const { formConfCopy } = this

  return (
    <el-row gutter={formConfCopy.gutter} class="formContainer" style={{ height: this.docHeight - 55 + 'px' }}>
      <el-form
        class="smartForm"
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={formConfCopy.disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        props={{ model: this[formConfCopy.formModel] }}
      >
        {renderFormItem.call(this, h, formConfCopy.fields, pageData)}
      </el-form>
    </el-row>
  )
}

function renderFormItem (h, elementList, pageData) {
  return (
    <div class="formElementView">
        <el-col span={24} style="padding-left:10px;padding-top:10px;padding-right:10px;">
          <el-form-item  prop="SECRET_LEVEL" label="密级">
            {this.secretLevel.length && this.secretLevel[0].label}
          </el-form-item>
        </el-col>
      {
        elementList.map(scheme => {
          const config = scheme.__config__
          const layout = layouts[config.layout]
          if (layout) {
            return layout.call(this, h, scheme, pageData)
          }
          throw new Error(`没有与${config.layout}匹配的layout`)
        })
      }
    </div>
  )
}

function renderChildren (h, scheme) {
  const config = scheme.__config__
  if (!Array.isArray(config.children)) return null
  return renderFormItem.call(this, h, config.children)
}

export default {
  name: 'P8FormApplicationView',
  componentName: 'P8FormApplicationView',
  props: {
    formConf: {
      type: Object,
      required: true
    },
    modifyRes: {
      type: Object,
      default: () => {
        return {}
      }
    },
    sysParams: { // 系统级参数
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    modifyRes: {
      handler (val) {
        if (Object.keys(val).length) {
          this.uploadFilesArr = this.modifyRes.primary.uploadFiles
          this.secretLevel = this.$store.state.user.confidentialiteList.filter(i => { return i.value === this.modifyRes.primary.table.SECRET_LEVEL })
          this[this.formConf.formModel]['SECRET_LEVEL'] = this.modifyRes.primary.table.SECRET_LEVEL
        }
      },
      immediate: true,
      deep: true
    },
    formConf: {
      handler (val) {
        this.formConfCopy = val
        this.pageData = { ...this.pageData, ...this.sysParams }
        // this.initFormData(this.formConfCopy.fields, this[this.formConf.formModel])
        // this.buildRules(this.formConfCopy.fields, this[this.formConf.formRules])
        this.formModel = this[this.formConf.formModel]
      },
      deep: true
    },
    formConfCopy: {
      handler (val) {
        // console.log(this[this.formConf.formModel], 'formModel--watch', val)
        // this.initFormData(val.fields, this[this.formConf.formModel])
        // this.pageData = { ...this.pageData, ...this[this.formConf.formModel] }
        // this.$emit('setPageData', this.pageData)
      },
      deep: true
    },
    formModel: {
      handler (val) {
        this.pageData = { ...this.pageData, ...val }
        this.$emit('setPageData', this.pageData)
      },
      deep: true
    }
  },
  computed: {
    watchPageData () {
      return this.pageData
    }
  },
  data () {
    const data = {
      formConfCopy: deepClone(this.formConf),
      [this.formConf.formModel]: { SECRET_LEVEL: '' },
      [this.formConf.formRules]: {
        SECRET_LEVEL: [
          { required: true, message: '请输入密级', trigger: 'blur' }
        ]
      },
      childData: [],
      secretLevel: [], // 密级
      formModel: {},
      pageData: {}, // 页面级参数、数据
      uploadFilesArr: [], // 文件信息[当加载完成 modifyRes存在时, 将uploadFilesArr进行更新]
      docHeight: document.documentElement.clientHeight // 表单高度
    }
    this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel])
    this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules])
    return data
  },
  mounted () {
    // this.pageData['SYSTEM_PARAMS_SELECT'] = deepClone(this.$store.state.user.userInfo)
    this.$set(this.pageData, '$SYSTEM_PARAMS_SELECT', deepClone(this.$store.state.user.userInfo))
    this.$set(this.pageData, '$PROPPARAM', this.sysParams['$PROPPARAM'])
    this.$bus.$emit('getPageData', this.pageData)
  },
  methods: {
    initFormData (componentList, formData) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if ((config.tag === 'el-checkbox-group' || (config.tag === 'el-select' && cur.multiple)) && typeof (config.defaultValue) === 'string') {
          config.defaultValue = config.defaultValue.split(',')
        }
        if (!cur.__config__.selectChildTable && cur.__vModel__) formData[cur.__vModel__] = config.defaultValue
        if (cur.__config__.layout === 'masterSlaveTable') {
          formData[cur.__config__.childrenTable] = config.defaultValue
        }
        if (config.children) this.initFormData(config.children, formData)
      })
    },
    buildRules (componentList, rules, childTableId) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (Array.isArray(config.regList)) {
          if (config.required) {
            const required = { required: config.required, message: cur.placeholder }
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array'
              required.message = `请至少选择一个${config.label}`
            }
            required.message === undefined && (required.message = `${config.label}不能为空`)
            config.regList.push(required)
          }
          if (config.selectChildTable) {
            // 子表中的表单元素校验时增加子表id加以区分
            rules[cur.__vModel__ + '_' + childTableId] = config.regList.map(item => {
              // eslint-disable-next-line no-eval
              item.pattern && (item.pattern = eval(item.pattern))
              item.trigger = ruleTrigger && ruleTrigger[config.tag]
              return item
            })
          } else {
            rules[cur.__vModel__] = config.regList.map(item => {
              // eslint-disable-next-line no-eval
              item.pattern && (item.pattern = eval(item.pattern))
              item.trigger = ruleTrigger && ruleTrigger[config.tag]
              return item
            })
          }
        }
        if (config.children) {
          if (config.layout === 'masterSlaveTable') {
            this.buildRules(config.children, rules, config.childrenTable) // 传子表的id
          } else {
            this.buildRules(config.children, rules)
          }
        }
      })
    },
    handlerChangeSecret (val) {
      this.secretLevel = val
      this[this.formConf.formModel]['SECRET_LEVEL'] = val
    },
    childTableData (data) {
      let _this = this
      if (this.childData.length) {
        this.childData.map((item, index) => {
          if (item.tableId === data.tableId) {
            let index = _this.childData.indexOf(item)
            _this.childData.splice(index, 1)
            _this.childData.push(data)
          } else {
            _this.childData.push(data)
          }
        })
      } else {
        this.childData.push(data)
      }
    },
    handleUpload (uploadFile) {
      this.uploadFilesArr.push(uploadFile)
    },
    handleUploadFileRemove (file) {
      let removeIndex = this.uploadFilesArr.findIndex((fileItem) => fileItem.filePath === file.filePath)
      this.uploadFilesArr.splice(removeIndex, 1)
    },
    ejectData (config, data) {
      this.pageData['$' + config.__vModel__ + '_SELECT'] = data
      this.$bus.$emit('getPageData', this.pageData)
    },
    // 多行展示模式
    multiLineMode (h, scheme) {
      return (
        <div id="list-layout">
          <div id="list-main">
            <el-table ref="table" height="100%" data={this[this.formConf.formModel][scheme.__config__.childrenTable]}>
              {
                scheme.__config__.children.map((item, index) => {
                  if (item.__config__.tag === 'p8-upload') {
                    return (
                      <el-table-column key={index}
                        label={item.__config__.label}
                        prop={item.__vModel__}
                        type={item.type}
                        min-width={item.minWidth}
                        align={item.align}
                        scopedSlots={{
                          default: (scope) => {
                            if (item.__config__.tag === 'p8-upload') {
                              let rowUplaodFiles = this[this.formConf.formModel][scheme.__config__.childrenTable][scope.$index].uploadFiles
                              // this.$set(this[this.formConf.formModel][scheme.__config__.childrenTable][scope.$index], 'uploadFiles', rowUplaodFiles)
                              return (
                                <common-file-view uploadFiles={rowUplaodFiles || []} filesLayout={'row'} filesDownloadKey={{ id: 'id', fileName: 'fileName' }}></common-file-view>
                              )
                            }
                          }
                        }}
                        class-name={item.hidden ? 'formDesignHiddenTrue' : ''}>
                      </el-table-column>
                    )
                  } else {
                    return (
                      <el-table-column key={index} label={item.__config__.label} prop={item.__vModel__} type={item.type}
                        min-width={item.minWidth} align={item.align} class-name={item.hidden ? 'formDesignHiddenTrue' : ''}>
                      </el-table-column>
                    )
                  }
                })
              }
            </el-table>
          </div>
        </div>
      )
    },
    // 单行展示模式
    singleLineMode (h, scheme) {
      return (
        <div>
          {
            this[this.formConf.formModel][scheme.__config__.childrenTable].map((i, idx) => {
              return (
                <el-row>
                  {
                    scheme.__config__.children.map((item, index) => {
                      if (item.__config__.tag === 'p8-upload') {
                        let rowUplaodFiles = i.uploadFiles ? i.uploadFiles : []
                        this.$set(i, 'uploadFiles', rowUplaodFiles)
                      }
                      let labelWidth = item.__config__.labelWidth ? `${item.__config__.labelWidth}px` : null
                      if (item.__config__.tag === 'el-select' || item.__config__.tag === 'eject-select') {
                        return (<select-view schemes={item} reportParam={i[item.__vModel__]} onData={this.ejectData.bind(this, scheme)}></select-view>)
                      } else if (item.__config__.tag === 'tree-select') {
                        return (<select-tree schemes={item} reportParam={i[item.__vModel__]}></select-tree>)
                      } else if (item.__config__.tag === 'custom-view') {
                        return (<el-col class={item.hidden ? 'formDesignHiddenTrue' : ''} span={item.__config__.span}>
                          <el-form-item label-width={labelWidth} label={item.__config__.showLabel ? item.__config__.label : ''}
                          >
                            {
                              <CustomView config={item} pageData={this.pageData} onData={this.ejectData.bind(this, scheme)}></CustomView>
                            }
                          </el-form-item>
                        </el-col>)
                      } else {
                        return (<el-col class={item.hidden ? 'formDesignHiddenTrue' : ''} span={item.__config__.span}>
                          <el-form-item label-width={labelWidth} label={item.__config__.showLabel ? item.__config__.label : ''}
                          >
                            {
                              i[item.__vModel__]
                            }
                          </el-form-item>
                        </el-col>)
                      }
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
    return renderFrom.call(this, h, this.watchPageData)
  },
  components: {
    render,
    MasterSlaveTable,
    CustomUpload,
    EjectSelect,
    FormSecretLevel,
    'common-file-view': FommonFileView,
    'select-view': {
      props: ['schemes', 'reportParam'],
      created () {
        let scheme = this.schemes
        // 自定义数据来源
        if (!scheme.__config__.selectComp) {
          scheme.__slot__.options.forEach(i => {
            if (i.value === this.reportParam) {
              this.text = i.label
            }
          })
          return
        }
        //  动态数据来源
        let param = {
          id: scheme.__config__.selectComp,
          param: {},
          sqlParam: {},
          reportParam: {}
        }
        scheme.__config__.backfillParam && (param.reportParam[scheme.__config__.backfillParam.value] = this.reportParam)
        this.$api['formGenerator.getSelectionData'](param).then(res => {
          if (scheme.__config__.backfillParam) { // 弹出框组件 回填label 回填value
            this.$emit('data', res.data[0])
            this.text = res.data && res.data.length && res.data[0][scheme.__config__.backfillParam.label]
          } else { // 配置select数据来源
            this.$emit('data', res.data)
            res.data && res.data.length && res.data.forEach(i => {
              if (i.id === this.reportParam) {
                this.text = i.cmeaning
              }
            })
          }
        })
      },
      data () {
        return {
          text: ''
        }
      },
      render (h) {
        const scheme = this.schemes
        const config = this.schemes.__config__
        // const listeners = buildListeners.call(this, scheme)

        let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
        if (config.showLabel === false) labelWidth = '0'
        return (
          <el-col span={config.span} class={scheme.hidden ? 'formDesignHiddenTrue' : ''}>
            <el-form-item label-width={labelWidth} prop={scheme.__vModel__}
              label={config.showLabel ? config.label : ''}>
              {
                this.text
              }
            </el-form-item>
          </el-col>
        )
      }
    },
    'select-tree': {
      props: ['schemes', 'reportParam'],
      created () {
        let scheme = this.schemes
        const selectedNode = treeFind(
          JSON.parse(JSON.stringify(scheme.__slot__.options)),
          (node) => this.checkSelected(node['value']),
          {
            value: 'value',
            label: 'label',
            children: 'children'
          }
        )
        if (selectedNode) {
          this.text = selectedNode['label']
        }
      },
      data () {
        return {
          text: ''
        }
      },
      methods: {
        checkSelected (value) {
          if (this.schemes.multiple) {
            return this.reportParam.includes(value)
          } else {
            return this.reportParam === value
          }
        }
      },
      render (h) {
        const scheme = this.schemes
        const config = this.schemes.__config__
        // const listeners = buildListeners.call(this, scheme)

        let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
        if (config.showLabel === false) labelWidth = '0'
        return (
          <el-col span={config.span} class={scheme.hidden ? 'formDesignHiddenTrue' : ''}>
            <el-form-item label-width={labelWidth} prop={scheme.__vModel__}
              label={config.showLabel ? config.label : ''}>
              {
                this.text
              }
            </el-form-item>
          </el-col>
        )
      }
    }
  }
}
</script>
<style lang="scss">
.formContainer {
  margin: 0 !important;
}
.smartForm {
  height: 100%;
}
.formElementView {
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 10px;
  padding-top: 0;
  box-sizing: border-box;
}
.p8-upload {
  .el-upload {
    min-height: 32px;
  }
  .p8-upload__secret-file-item {
    padding: 4px 5px;
    &:hover {
      background-color: #e6f1f9;
    }
    .col-secret-file {
      span {
        cursor: pointer;
        color: #606266;
        font-size: 14px;
        padding-left: 6px;
      }
    }
  }
}
.masterSlaveTableHeight {
  height: 400px;
}
.formBtnStyle {
  position: fixed;
  width: 100%;
  height: 50px;
  right: 100px;
  top: 8px;
  z-index: 2;
  text-align: right;
  box-sizing: border-box;
}
.el-form-item--small .el-form-item__label {
  color: #606266;
  font-size: 13px;
  font-weight: bold;
}
.el-form-item--small .el-form-item__content {
  font-size: 13px;
  color: #888888;
}
</style>
