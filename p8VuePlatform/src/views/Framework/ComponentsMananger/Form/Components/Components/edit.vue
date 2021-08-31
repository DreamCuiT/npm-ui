<template>
  <div>
    <parser
      v-if="
        newOrModify && newOrModify === 'new' && Object.keys(formConf).length
      "
      :form-conf="formConf"
      :sysParams="sysParams"
      @setPageData="setPageData"
      @submit="save"
    />
    <parser
      v-else-if="
        newOrModify && newOrModify === 'modify' && Object.keys(formConf).length
      "
      :form-conf="formConf"
      :sysParams="sysParams"
      :modify-res="modifyRes"
      @setPageData="setPageData"
      @submit="save"
    />
  </div>
</template>

<script>
// import { getDrawingList } from '@/formGenerator/utils/db'
import { P8FormParser as Parser } from '~/index'
import { selectTransform, selectGenerateTree } from '@/utils/common'
export default {
  name: 'FormDataEdit',
  components: {
    Parser
  },
  props: {
    record: { // 表单obj, 在表单设计器/数据查看等中使用id
      type: Object,
      default: () => {
        return {}
      }
    },
    dataViewId: { // 数据查看列表行记录的id
      type: String,
      default: ''
    },
    propParam: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      saveApi: 'formGenerator.formListSave',
      formConf: {},
      drawingList: {},
      newOrModify: '', // 判断是新建页面还是修改页面
      modifyRes: {}, // 修改页面获取的数据
      sysParams: Object.assign({}, this.getPropParam()), // 系统级参数
      dynamicDataObj: {}, // 前置数据作为后置数据检索条件--动态数据集合
      dynamicParamObj: {}, // 动态参数集合
      pageData: Object.assign({}, this.sysParams)
    }
  },
  async mounted () {
    // let drawingListData = await getDrawingList({ desformCode: this.record.desformCode })
    let res = await this.$api['formGenerator.designerDetails']({ desformCode: this.record.desformCode })
    let drawingListData = res.designJson
    this.formConf = JSON.parse(drawingListData)
    let _this = this
    if (this.formConf.fields.length) {
      let needHandleTags = ['tree-select', 'el-select', 'el-radio-group', 'el-checkbox-group']
      let needComputedTags = ['el-input']
      // 异步获取下拉\单选\多选等数据
      this.formConf.fields.map(async item => {
        // 主表
        _this.changeSelectOption(item, needHandleTags)
        // 单行文本--计算器
        _this.setComputedItem(item, needComputedTags)
        if (item.__config__.children && item.__config__.children.length) {
          // 子表
          item.__config__.children.map(async childItem => {
            _this.changeSelectOption(childItem, needHandleTags)
          })
        }
        _this.buildWatchCascadeParams(item)
      })
    }

    if (this.dataId) {
      let params = {
        desformCode: this.record.desformCode,
        dataId: this.dataId
      }
      let res = await this.$api['formGenerator.formCallDataDetails'](params)
      this.modifyRes = res

      // 修改页面给子表数据赋值
      this.formConf.fields.map(item => {
        if (item.__config__.layout === 'masterSlaveTable') {
          if (res.children.length) {
            res.children.map(child => {
              if (child.tableId === item.__config__.childrenTable) {
                item.__config__.defaultValue = child.data.length && child.data[0] ? child.data.map(i => {
                  if (i) {
                    let modifyData = { uploadFiles: i.uploadFiles || [] }
                    if (Object.keys(i.table).length) {
                      Object.keys(i.table).map(item => {
                        if (['CREATE_BY', 'CREATE_TIME', 'UPDATE_BY', 'UPDATE_TIME'].indexOf(item) === -1) {
                          modifyData[item] = i.table[item]
                        }
                      })
                      return modifyData
                    }
                  }
                  return {}
                }) : []
              }
            })
          }
        } else {
          item.__config__.defaultValue = res.primary.table ? (res.primary.table[item.__vModel__] ? res.primary.table[item.__vModel__] : '') : ''
        }
      })
      this.newOrModify = 'modify'
    } else {
      this.newOrModify = 'new'
    }
  },
  computed: {
    dataId () {
      return this.dataViewId
    }
  },
  watch: {
    '$route' (to, from) {
      if (to !== from) {
        this.sysParams = Object.assign({}, to.meta)
      }
    },
    formConf: {
      handler (val) {
        // console.log(val, 'edit---formConf--watch', this.sysParams, 'sysParams')
      },
      deep: true
    },
    propParam: {
      handler (val) {
        this.sysParams = Object.assign(this.sysParams, this.getPropParam())
        this.pageData = Object.assign(this.pageData, this.sysParams)
      },
      deep: true
    },
    pageData: {
      handler (val, oldVal) {
        let _this = this
        let needComputedTags = ['el-input']
        if (Object.keys(this.dynamicParamObj).length) {
          Object.keys(this.dynamicParamObj).map(item => {
            let dynamicParamObjPath = _this.dynamicParamObj[item].path.split('.')
            _this.dynamicDataObj[_this.dynamicParamObj[item].dynamicCompId][dynamicParamObjPath[0]][dynamicParamObjPath[1]] = val[item]
          })
          // 前置数据作为后置数据的检索条件--监听前置数据的变化
          this.formConf.fields.map(async item => {
            _this.watchChangeSelectOption(item)

            if (item.__config__.children && item.__config__.children.length) {
              item.__config__.children.map(async childItem => {
                _this.watchChangeSelectOption(childItem)
              })
            }
          })
        } else {
          this.formConf.fields.map(async item => {
            // 单行文本--计算器
            _this.setComputedItem(item, needComputedTags)
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getPropParam () {
      let newBuildPropParam = {}
      newBuildPropParam['$PROPPARAM'] = this.propParam
      return newBuildPropParam
    },
    setPageData (pageData) {
      this.pageData = pageData
    },
    // 重构下拉级联参数对象
    buildDynamicParamObj (item, label, value, path) {
      if (value.startsWith('$')) {
        this.dynamicParamObj[value.slice(1)] = {
          dynamicCompId: item.__config__.selectComp,
          path: path + '.' + label
        }
      }
    },
    // 构建 监听动态参数
    buildWatchCascadeParams (item) {
      let _this = this
      let customParam = {}
      let sqlParam = {}
      let reportParam = {}
      if (item.__config__.selectParam) {
        if (Object.keys(item.__config__.selectParam).length && item.__config__.selectParam.param.length) {
          item.__config__.selectParam.param.map(i => {
            _this.buildDynamicParamObj(i, [i.label], i['value'], 'param')
            customParam[i.label] = ''
          })
        }
        if (Object.keys(item.__config__.selectParam.sqlParam).length) {
          Object.keys(item.__config__.selectParam.sqlParam).map(i => {
            _this.buildDynamicParamObj(item, i, item.__config__.selectParam.sqlParam[i], 'sqlParam')
            sqlParam[i] = ''
          })
        }
        if (Object.keys(item.__config__.selectParam.reportParam).length) {
          Object.keys(item.__config__.selectParam.reportParam).map(i => {
            _this.buildDynamicParamObj(item, i, item.__config__.selectParam.reportParam[i], 'reportParam')
            reportParam[i] = ''
          })
        }
      }
      this.dynamicDataObj[item.__config__.selectComp] = {
        param: customParam,
        sqlParam: sqlParam,
        reportParam: reportParam
      }
    },
    async changeSelectOption (item, needHandleTags) {
      let _this = this
      let needHandleIndex = needHandleTags.indexOf(item.__config__.tag)
      if (needHandleIndex > -1) {
        if (item.__config__.dataType === 'dynamic') {
          let customParam = {}
          if (item.__config__.selectParam.param.length) {
            item.__config__.selectParam.param.map(i => {
              customParam[i.label] = i['value']
            })
          }
          let param = {
            id: item.__config__.selectComp,
            param: customParam,
            sqlParam: item.__config__.selectParam.sqlParam,
            reportParam: item.__config__.selectParam.reportParam
          }
          let res = await _this.$api['formGenerator.getSelectionData'](param)
          let options = []
          if (res) {
            if (res.config) {
              options = needHandleIndex === 0 ? selectGenerateTree(res.data, res.config) : selectTransform(res.data, res.config)
            } else {
              // 解析数据字典数据
              options = res.data.map(item => {
                return {
                  label: item.cmeaning,
                  value: item.id
                }
              })
            }
          }
          item.__slot__.options = options
        }
      }
    },
    async watchChangeSelectOption (item) {
      if (item.__config__.dataType === 'dynamic') {
        let param = {
          id: item.__config__.selectComp,
          param: this.dynamicDataObj[item.__config__.selectComp].param,
          sqlParam: this.dynamicDataObj[item.__config__.selectComp].sqlParam,
          reportParam: this.dynamicDataObj[item.__config__.selectComp].reportParam
        }
        let res = await this.$api['formGenerator.getSelectionData'](param)
        let options = []
        if (res.config) {
          options = selectTransform(res.data, res.config)
        } else {
          options = res.data
        }
        item.__slot__.options = options
      }
    },
    // 计算器功能，目前只支持加法运算
    setComputedItem (item, needComputedTags) {
      let _this = this
      let needComputedIndex = needComputedTags.indexOf(item.__config__.tag)
      if (needComputedIndex > -1) {
        let variable = item.__config__.variable
        if (variable && variable.indexOf('+') !== -1) {
          if (variable.indexOf('$COMPUTED') !== -1) {
            let fieldsArr = variable.split('+')
            let computedResult = 0
            fieldsArr.map(fieldsItem => {
              const paramArr = fieldsItem.trim().split('.')
              if (_this.pageData[paramArr[1]]) {
                computedResult += _this.pageData[paramArr[1]]
              }
            })
            item.__config__.defaultValue = computedResult
          } else if (variable.indexOf('$LABEL') !== -1) { // 计算器支持资金label合计显示，803独有功能
            let fieldsArr = variable.split('+')
            let labelFieldsArr = []
            fieldsArr.map(fieldsItem => {
              const paramArr = fieldsItem.trim().split('.')
              labelFieldsArr.push(paramArr[1])
            })
            item.__config__.defaultValue = ''
            this.formConf.fields.map(formItem => {
              if (labelFieldsArr.indexOf(formItem.__config__.formFields) !== -1 && _this.pageData[formItem.__config__.formFields] > 0) {
                item.__config__.defaultValue += (formItem.__config__.label + '+')
              }
            })
            item.__config__.defaultValue = item.__config__.defaultValue.slice(0, item.__config__.defaultValue.length - 1)
          }
        }
      }
    },
    save (data, childData) {
      let params = {
        desformCode: this.record.desformCode,
        dataId: this.dataId,
        primary: { table: data.data, uploadFiles: data.uploadFiles },
        children: childData
      }

      let that = this
      this.$api['formGenerator.formCallSave'](params).then(function (res) {
        if (res) {
          that.$message({
            type: 'success',
            message: '保存成功!'
          })
          that.$emit('save-success', res)
        }
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>
