<template>
  <div style="height: 100%"
       v-loading="loading">
    <parser v-if="
        newOrModify && newOrModify === 'new' && Object.keys(formConf).length
      "
            :form-conf="formConf"
            :sysParams="sysParams"
            @setPageData="setPageData"
            @validate="validate"
            @submit="save" />
    <parser v-else-if="
        newOrModify && newOrModify === 'modify' && Object.keys(formConf).length
      "
            :form-conf="formConf"
            :sysParams="sysParams"
            :modify-res="modifyRes"
            @setPageData="setPageData"
            @validate="validate"
            @submit="save" />
  </div>
</template>

<script>
import { Notification } from 'element-ui'
import Parser from 'packages/formGenerator/components/parser'
import { selectTransform, selectGenerateTree } from '~/utils/common'

export default {
  name: 'FormDataEdit',
  components: {
    Parser
  },
  props: {
    record: { // 表单obj, 在表单设计器/数据查看等中使用id
      type: Object,
      default: function (){
        return {}
      }
    },
    dataViewId: { // 数据查看列表行记录的id
      type: String,
      default: ''
    },
    propParam: {
      type: Object,
      default: function (){
        return {}
      }
    }
  },
  data: function (){
    return {
      loading: false,
      saveApi: 'formGenerator.formListSave',
      formConf: {},
      drawingList: {},
      newOrModify: '', // 判断是新建页面还是修改页面
      modifyRes: {}, // 修改页面获取的数据
      sysParams: Object.assign({}, this.getPropParam()), // 系统级参数
      dynamicDataObj: {}, // 前置数据作为后置数据检索条件--动态数据集合
      dynamicParamObj: {}, // 动态参数集合
      pageData: Object.assign({}, this.sysParams),
      confidentialiteList: this.$store.state.user.confidentialiteList,
      confidentialiteIdArr: [], // 密级id集合
      fieldConfidentialiteId: {
        title: '人员',
        arr: []
      }, // 校验密级赋值集合
      logDetailBefore: '' // 保存修改页面密级的初始值
    }
  },
  async mounted () {
    let _this = this
    this.confidentialiteList.map(item => {
      _this.confidentialiteIdArr.push(item.value)
    })
    this.fieldConfidentialiteId.arr = this.confidentialiteIdArr
    let data = await this.$api['formGenerator.designerDetails']({ desformCode: this.record.desformCode, desFormId: this.record.id })
    let drawingListData = data.designJson
    this.formConf = JSON.parse(drawingListData)
    if (this.formConf.fields.length) {
      let needHandleTags = ['tree-select', 'el-select', 'el-radio-group', 'el-checkbox-group']
      this.formConf.fields.map(async item => {
        _this.changeSelectOption(item, needHandleTags)
        if (item.__config__.children && item.__config__.children.length) {
          item.__config__.children.map(async childItem => {
            _this.changeSelectOption(childItem, needHandleTags)
          })
        }
        _this.buildWatchCascadeParams(item)
      })
    }

    if (this.dataId) {
      console.log(this.dataId, 'dataId')
      let params = {
        desFormId: this.record.id,
        desformCode: this.record.desformCode,
        dataId: this.dataId
      }
      let res = await this.$api['formGenerator.formCallDataDetails'](params)
      console.log(res, 'res')
      this.modifyRes = res

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
      console.log(this.modifyRes, 'modifyRes')
      this.logDetailBefore = this.modifyRes.primary.table.SECRET_LEVEL
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
      console.log(to, from, 'to', 'from')
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
    pageData: {
      handler (val, oldVal) {
        let _this = this
        if (Object.keys(this.dynamicParamObj).length) {
          Object.keys(this.dynamicParamObj).map(item => {
            let dynamicParamObjPath = _this.dynamicParamObj[item].path.split('.')
            _this.dynamicDataObj[_this.dynamicParamObj[item].dynamicCompId][dynamicParamObjPath[0]][dynamicParamObjPath[1]] = val[item]
          })
          this.formConf.fields.map(async item => {
            _this.watchChangeSelectOption(item)

            if (item.__config__.children && item.__config__.children.length) {
              item.__config__.children.map(async childItem => {
                _this.watchChangeSelectOption(childItem)
              })
            }
          })
        }
      },
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
    validate (data, childData, pageSecretsArr) {
      let uploadArr = []
      this.formConf.fields.map(item => {
        if (item.__config__.layout === 'masterSlaveTable') {
          let children = item.__config__.children
          if (children.length) {
            children.map(childItem => {
              let fieldType = childItem.__config__.fieldType
              if (childData.length) {
                childData.map(childDataItem => {
                  if (childDataItem.data.length) {
                    childDataItem.data.map(cItem => {
                      if (cItem.uploadFiles.length) {
                        cItem.uploadFiles.map(cUpload => {
                          if (cUpload.type === fieldType) {
                            uploadArr.push({
                              name: childItem.__config__.label,
                              id: cUpload.confidentialite
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        } else {
          if (item.__config__.tag === 'p8-upload') {
            let fieldType = item.__config__.fieldType
            if (data.uploadFiles.length) {
              data.uploadFiles.map(i => {
                if (i.type === fieldType) {
                  uploadArr.push({
                    name: item.__config__.label,
                    id: i.confidentialite
                  })
                }
              })
            }
          }
        }
      })
      this.fieldConfidentialiteId = {
        arr: this.confidentialiteIdArr,
        title: ''
      }
      this.$emit('validate', data, childData)
      this.validateSecret(data, uploadArr, pageSecretsArr).then((res) => {
        if (res) {
          this.save(data, childData)
        }
      }).catch(function (e) {
        console.log(e, '密级校验失败！')
      })
    },
    save (data, childData) {
      this.loading = true
      let that = this
      let secretLevelAfter = data.data['SECRET_LEVEL']
      let secretLevelAfterLabel = ''
      let secretLevelBeforeLabel = ''
      this.confidentialiteList.map(item => {
        if (item.value === secretLevelAfter) secretLevelAfterLabel = item.label
        if (that.logDetailBefore && item.value === that.logDetailBefore) secretLevelBeforeLabel = item.label
      })
      let logDetail = {
        logType: 1,
        data: [
          {
            column: '密级',
            before: secretLevelBeforeLabel,
            after: secretLevelAfterLabel
          }
        ]
      }

      let params = {
        desFormId: this.record.id,
        desformCode: this.record.desformCode,
        dataId: this.dataId,
        logDetail: logDetail,
        primary: { table: data.data, uploadFiles: data.uploadFiles },
        children: childData
      }

      this.$api['formGenerator.formCallSave'](params).then(function (res) {
        if (res) {
          that.loading = false
          that.$message({
            type: 'success',
            message: '保存成功!'
          })
          that.$emit('save-success')
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 校验密级
    validateSecret (data, uploadArr, pageSecretsArr) {
      let secretLevel = data.data['SECRET_LEVEL']
      let arr = [
        [{
          name: '表单',
          id: secretLevel
        }]
      ]
      if (pageSecretsArr && pageSecretsArr.length > 0) {
        arr.push(pageSecretsArr)
      }
      if (uploadArr.length) {
        arr.push(uploadArr)
      }
      return new Promise((resolve, reject) => {
        let validate = true
        for (let i = 0; i < arr.length; i++) {
          if (!this.checkSercet(arr[i])) {
            validate = false
            break
          }
        }
        if (!validate) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    },
    checkSercet (arr) {
      let maxConfidentialiteId = {
        title: '',
        arr: []
      }
      let minConfidentialiteId = {
        title: arr[0].name,
        arr: this.confidentialiteIdArr.slice(this.confidentialiteIdArr.indexOf(arr[0].id))
      }
      let tempArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id) {
          let index = this.confidentialiteIdArr.indexOf(arr[i].id)
          tempArr = this.confidentialiteIdArr.slice(index)
          if (maxConfidentialiteId.arr.length < tempArr.length) {
            maxConfidentialiteId.arr = tempArr
            maxConfidentialiteId.title = arr[i].name
          }

          if (minConfidentialiteId.arr.length > tempArr.length) {
            minConfidentialiteId.arr = tempArr
            minConfidentialiteId.title = arr[i].name
          }
        }
      }
      console.log(maxConfidentialiteId.arr.length, 'maxConfidentialiteId.arr.length')
      if (maxConfidentialiteId.arr.length <= this.fieldConfidentialiteId.arr.length) {
        if (maxConfidentialiteId.arr.length > 0) {
          this.fieldConfidentialiteId = minConfidentialiteId
        }

        return true
      } else {
        Notification.error({
          title: '提示',
          message: maxConfidentialiteId.title + '的密级超出了' + this.fieldConfidentialiteId.title + '的密级，请重新选择！'
        })
        return false
      }
    }
  }
}
</script>
