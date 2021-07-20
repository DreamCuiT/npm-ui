<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import { deepClone } from '~/utils/common'
import { IEVersion } from '~/utils/common'
import render from '../../components/render/render.js'
import MasterSlaveTable from '../../components/render/MasterSlaveTable'
import FormContainer from '../../components/render/FormContainer'
import CustomUpload from '../../components/render/CustomUpload'
import EjectSelect from '../../components/render/EjectSelect'
import TreeSelect from '../../components/render/TreeSelect'
import CustomView from '../../components/render/CustomView'
Vue.use(ElementUI, { size: 'small' })
if (IEVersion() === 11) {
  import('../../styles/ie.scss')
}

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
    const listeners = buildListeners.call(this, scheme)

    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    return (
      <el-col span={config.span} class={scheme.hidden ? 'formDesignHiddenTrue' : ''}>
        <el-form-item label-width={labelWidth} prop={scheme.__vModel__}
          label={config.showLabel ? config.label : ''}>
          {renderColFormItem.call(this, h, scheme, config, listeners, pageData)}
        </el-form-item>
      </el-col>
    )
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
          <master-slave-table config={scheme} onSave={this.childTableData} formModel={this[this.formConf.formModel]} formRules={this[this.formConf.formRules]}>
          </master-slave-table>
        </el-row>
      </el-col>
    )
  },
  // 表单容器
  formGenerateContainer (h, scheme, pageData) {
    const { formConf } = this
    return (
      <el-col span={scheme.span}>
        <el-row gutter={scheme.gutter}>
          <form-container config={scheme}
            formModel={this[formConf.formModel]}
            formRules={this[formConf.formRules]}></form-container>
        </el-row>
      </el-col>
    )
  }
}

function renderFrom (h, pageData) {
  const { formConfCopy } = this

  return (
    <el-row gutter={formConfCopy.gutter} class="formContainer" style={{ height: this.docHeight - 50 + 'px' }}>
      <el-form
        class="smartForm"
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={formConfCopy.disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        props={{ model: this[formConfCopy.formModel] }}
        rules={this[formConfCopy.formRules]}
      >
        {renderFormItem.call(this, h, formConfCopy.fields, pageData)}
        {formConfCopy.formBtns && formBtns.call(this, h)}
      </el-form>
    </el-row>
  )
}

function formBtns (h) {
  return <el-col class="flex-right" style="position:absolute;bottom:0px;right:0;height:50px;border-top:1px solid #e1e1e1;">
    <el-form-item size="small" style="margin-top:8px;margin-right:8px;">
      <el-button type="primary" onClick={this.submitForm}>提交</el-button>
      <el-button onClick={this.resetForm}>重置</el-button>
    </el-form-item>
  </el-col>
}

function renderFormItem (h, elementList, pageData) {
  return (
    <div class="formElement">
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

function setValue (event, config, scheme) {
  this.$set(config, 'defaultValue', event)
  this.$set(this[this.formConf.formModel], scheme.__vModel__, event)
}

function buildListeners (scheme) {
  const config = scheme.__config__
  const methods = this.formConf.__methods__ || {}
  const listeners = {}

  // 给__methods__中的方法绑定this和event
  Object.keys(methods).forEach(key => {
    listeners[key] = event => methods[key].call(this, event)
  })
  // 响应 render.js 中的 vModel $emit('input', val)
  listeners.input = event => setValue.call(this, event, config, scheme)

  return listeners
}

function renderColFormItem (h, scheme, config, listeners, pageData) {
  /**
  * renderColFormItem: 处理自定义组件和默认组件 key={config.renderKey}
  * onUpload={(file) => { this.handleUpload(file, scheme) }}
  */
  const customComponents = {
    'p8-upload': <CustomUpload config={scheme} uploadFiles={this.uploadFilesArr} onUpload={this.handleUpload} onRemove={this.handleUploadFileRemove}></CustomUpload>,
    'eject-select': <EjectSelect config={scheme} formModel={this[this.formConf.formModel]} onData={this.ejectData.bind(this, scheme)}></EjectSelect>,
    'tree-select': <TreeSelect config={scheme} formModel={this[this.formConf.formModel]}></TreeSelect>,
    'custom-view': <CustomView config={scheme} pageData={this.pageData}></CustomView>
  }
  let componentItem = customComponents[config.tag]
  if (!componentItem) {
    componentItem = (
      <render conf={scheme} pageData={pageData} {...{ on: listeners }} />
    )
  }
  return componentItem
}

export default {
  name: 'P8FormApplication',
  componentName: 'P8FormApplication',
  components: {
    render,
    MasterSlaveTable,
    FormContainer,
    CustomUpload,
    EjectSelect
  },
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
        const that = this
        if (Object.keys(val).length) {
          that.uploadFilesArr = this.modifyRes.primary.uploadFiles
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
        // this.initFormData(val.fields, this[this.formConf.formModel])
        // this.pageData = { ...this.pageData, ...this[this.formConf.formModel] }
        // 计算器功能，目前只支持加法运算
        this.pageData = { ...this.pageData, ...this.sysParams }
        this.formModel = this[this.formConf.formModel]
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
      [this.formConf.formModel]: {},
      [this.formConf.formRules]: {},
      childData: [],
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
    this.$set(this.pageData, '$PROPPARAM', this.sysParams['$PROPPARAM'] || '')
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
    resetForm () {
      this.formConfCopy = deepClone(this.formConf)
      this.$refs[this.formConf.formRef].resetFields()
    },
    submitForm () {
      // 变量保存
      let _this = this
      this.formConfCopy.fields.map(item => {
        if (item.__config__.variable !== undefined) {
          _this[_this.formConf.formModel][item.__config__.formFields] = item.__config__.defaultValue
        }
      })
      this.$refs[this.formConf.formRef].validate(valid => {
        if (!valid) return false

        // 触发sumit事件
        this.$emit('submit', this.getPrimaryData(), this.getChildData())
        return true
      })
    },
    // 获取子表数据
    getChildData () {
      let _this = this
      let childTableIdArr = []
      let returnChildTable = []
      if (this.childData.length) {
        this.childData.map(item => {
          if (childTableIdArr.indexOf(item.tableId) === -1) {
            childTableIdArr.push(item.tableId)
          }
        })
        let childTableObj = {}
        childTableIdArr.map(item => {
          let childTableArr = []
          _this.childData.map(i => {
            if (item === i.tableId) {
              childTableArr.push(i)
            }
          })
          childTableObj[item] = childTableArr
        })
        Object.keys(childTableObj).map(item => {
          returnChildTable.push(childTableObj[item].pop())
        })
      }
      return returnChildTable
    },
    // 获取主表数据
    getPrimaryData () {
      let _this = this
      let formModelClone = deepClone(this[this.formConf.formModel])
      let primaryTable = {}
      if (Object.keys(this.modifyRes).length && this.modifyRes.primary.table && Object.keys(this.modifyRes.primary.table).length) {
        Object.keys(this.modifyRes.primary.table).map(item => {
          if (['CREATE_BY', 'CREATE_TIME', 'UPDATE_BY', 'UPDATE_TIME'].indexOf(item) === -1) {
            primaryTable[item] = this.modifyRes.primary.table[item]
          }
        })
      }
      let removeChildKey = []
      this.formConfCopy.fields.map(item => {
        if (item.__config__.layout === 'masterSlaveTable') {
          removeChildKey.push(item.__config__.childrenTable)
        }
      })
      // 表单容器提交数据处理，容器内的值放入一个对象转成字符串存入容器关联的字段
      this.formConfCopy.fields.map(item => {
        if (item.__config__.layout === 'formGenerateContainer') {
          let contacts = {}
          item.__config__.children.forEach(i => {
            contacts[i.__config__.formFields] = formModelClone[i.__config__.formFields]
            removeChildKey.push(i.__config__.formFields)
          })
          formModelClone[item.__config__.formFields] = JSON.stringify(contacts)
        }
      })

      Object.keys(formModelClone).map(item => {
        _this.formConfCopy.fields.map(i => {
          if ((i.__config__.tag === 'el-checkbox-group' || (i.__config__.tag === 'el-select' && i.multiple)) && i.__config__.formFields === item) {
            if (formModelClone[item] instanceof Array) {
              formModelClone[item] = formModelClone[item].join(',')
            }
          }
        })
      })
      removeChildKey.map(item => {
        delete formModelClone[item]
      })

      let primaryData = Object.keys(this.modifyRes).length
        ? { data: { ...primaryTable, ...formModelClone }, uploadFiles: this.uploadFilesArr }
        : { data: formModelClone, uploadFiles: this.uploadFilesArr }
      return primaryData
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
    }
  },
  render (h) {
    return renderFrom.call(this, h, this.watchPageData)
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
.formElement {
  height: calc(100% - 50px);
  overflow-y: auto;
  padding: 10px;
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
</style>
