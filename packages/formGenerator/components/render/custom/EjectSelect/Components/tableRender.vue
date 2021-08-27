<template>
  <normal-layout class="grid-table-render"
                 :headerVisible="headerVisible"
                 :normalLayout="normalLayout">
    <template #north>
      <common-button :comp="comp"
                     :selectRecords="selectRecords"
                     :customButtonData="buttonData"></common-button>
      <search-form-list ref="search"
                        v-if="searchData.length"
                        :dataSource="searchData"
                        @search="search"
                        @re-set="reSet"></search-form-list>
    </template>
    <template #west>
      <slot name="westSlot"></slot>
    </template>
    <template #center>
      <common-table ref="table"
                    :comp="comp"
                    v-if="columns.length"
                    :columns="columns"
                    :params="tableParam"
                    :flex="160"
                    :customHeight="customHeight"
                    api="formGenerator.tableApply"
                    :tableRefresh="tableRefresh"
                    :customButtonData="buttonData"
                    :customButtonConfig="buttonConfig"
                    @selection-change="handleSelectionChange"
                    @row-click="rowClick"
                    @column-fiter="columnFiter">
        <template :slot="item"
                  v-for="item in customColumn"
                  slot-scope='{scope}'>
          <slot :name="item"
                :scope="scope"></slot>
        </template>
      </common-table>
    </template>
    <template #drawer-panel>
      <common-drawer title="表单页面"
                     :visible="formVisible"
                     size="50%"
                     :drawerConfig="drawerConfig"
                     @close="formClose">
        <template #drawer>
          <form-render :dataViewId="dataViewId"
                       :record="{desformCode:codeForm}"></form-render>
        </template>
      </common-drawer>
      <common-drawer title="查看页面"
                     :visible="viewVisible"
                     size="50%"
                     :drawerConfig="drawerConfig"
                     @close="viewClose">
        <template #drawer>
          <view-render :code="code"
                       :record="viewRecord"></view-render>
        </template>
      </common-drawer>
      <common-drawer title="查看流程图"
                     :visible="customVisible"
                     size="50%"
                     :drawerConfig="drawerConfig"
                     @close="customClose">
        <template #drawer>
          <component :is="componentLoader"
                     :row="scopeRow"></component>
        </template>
      </common-drawer>
    </template>
  </normal-layout>
</template>

<script>
import NormalLayout from 'packages/normalLayout'
import CommonTable from 'packages/table'
import SearchFormList from 'packages/search'
import CommonButton from 'packages/button'
import CommonDrawer from 'packages/drawer'
import FormRender from './editRender.vue'
import ViewRender from './viewRender.vue'

export default {
  name: 'FunctionTest666',
  components: {
    NormalLayout,
    CommonTable,
    SearchFormList,
    CommonButton,
    CommonDrawer,
    FormRender,
    ViewRender
  },
  props: {
    code: { // 报表code
      type: String,
      default: ''
    },
    codeForm: { // 表单code
      type: String,
      default: ''
    },
    reportParam: { // 给报表所传参数
      type: Object,
      default: function () {
        return {}
      }
    },
    customHeight: { // 报表自定义高度
      type: Number,
      defalut: 0
    },
    headerVisible: { // 是否隐藏头部
      type: Boolean,
      default: true
    },
    showWestTree: { // 是否采用上左右结构
      type: Boolean,
      default: false
    },
    westTreeParam: { // 左边树所传参数
      type: Object,
      default: function () {
        return {}
      }
    },
    operationColumnCustomWidth: {
      type: Number,
      defalut: 105
    }
  },
  data: function () {
    return {
      comp: this,
      selectRecords: [],
      searchData: [],
      columns: [],
      tableParam: {}, // 应用报表参数，包括三部分
      defaultReportParam: {}, // 增删行报表参数
      sqlParam: {}, // 报表sql参数
      buttonData: [], // 报表按钮集合
      buttonConfig: [], // 重新构建的报表按钮禁用规则
      selectType: 0, // 是否展示复选框，0是不显示复选框，1是单选，2是复选
      tableInfo: {},

      formVisible: false, // 新建抽屉visible
      dataViewId: '', // 修改页面id
      drawerConfig: {
        modal: false
      },
      viewVisible: false, // 查看抽屉visible
      viewRecord: {}, // 修改查看列表行记录
      customColumn: [], // 自定义列fieldName集合
      normalLayout: {
        west: {
          xs: 8, sm: 7, md: 6, lg: 5, xl: 4
        },
        center: {
          xs: 16, sm: 17, md: 18, lg: 19, xl: 20
        }
      },
      customVisible: false, // 自定义抽屉visible
      componentPath: '', // 操作按钮弹出框 component 路径
      scopeRow: '' // 表格行记录
    }
  },
  created: function (){
    if (!this.showWestTree) {
      this.normalLayout = {
        west: {
          xs: 0, sm: 0, md: 0, lg: 0, xl: 0
        },
        center: {
          xs: 24, sm: 24, md: 24, lg: 24, xl: 24
        }
      }
    }
  },
  mounted: function (){
    this.getTableInfo(this.code)
  },
  computed: {
    componentLoader () {
      return () => import(`@/${this.componentPath}.vue`)
    }
  },
  watch: {
    reportParam: {
      handler (val, oldVal) {
        console.log(val, 'reporParams')
        this.rebuildParam(val)
      },
      deep: true
    },
    code (val, oldVal) {
      this.getTableInfo(val)
    },
    westTreeParam (val, oldVal) {
      this.tableParam.param = Object.assign({},val)
    }
  },
  methods: {
    getTableInfo (code) {
      let _this = this
      this.$api['formGenerator.tableGetInfo']({ reportCode: this.code }).then(res => {
        _this.tableInfo = res
        let columnData = []
        // 报表列信息
        if (res.reportItems.length) {
          res.reportItems.map(item => {
            if (item.isListShow) {
              if (item.isSearch) {
                if (_this.tableInfo.searchPos === 1) { // 查询放置表头
                  columnData.push(
                    {
                      title: item.fieldTxt,
                      dataIndex: item.fieldName,
                      width: item.fieldWidth,
                      sortable: item.isOrder ? item.isOrder : false,
                      filterable: true,
                      filter: {
                        inputVal: '',
                        visible: false
                      }
                    }
                  )
                } else { // 查询放置按钮区域
                  columnData.push(
                    {
                      title: item.fieldTxt,
                      dataIndex: item.fieldName,
                      width: item.fieldWidth,
                      sortable: item.isOrder ? item.isOrder : false
                    }
                  )
                  _this.searchData.push(
                    {
                      type: 'text', // 控件类型
                      labelText: item.fieldTxt, // 控件显示的文本
                      fieldName: item.fieldName
                    }
                  )
                }
              } else if (item.isCustomColumn) {
                columnData.push(
                  {
                    title: item.fieldTxt,
                    dataIndex: item.fieldName,
                    width: item.fieldWidth,
                    sortable: item.isOrder ? item.isOrder : false,
                    scopedSlots: { customRender: 'custom' }
                  }
                )
                _this.customColumn.push(item.fieldName)
              } else {
                columnData.push(
                  {
                    align: item.fieldName !== 'NAME' ? 'center' : 'left',
                    headerAlign: 'center',
                    title: item.fieldTxt,
                    dataIndex: item.fieldName,
                    width: item.fieldWidth,
                    sortable: item.isOrder ? item.isOrder : false
                  }
                )
              }
            }
          })
          // 报表按钮参数
          if (res.reportResources.length) {
            _this.buttonData = res.reportResources
            _this.buttonData.map(btn => {
              if (btn.permission) {
                let permission = JSON.parse(btn.permission.replace(/\s*/g, ''))
                
                _this.buttonConfig.push(Object.assign({ id: btn.id },permission))
              }
              // 当前页面的父页面调用行按钮与header按钮方法
              if (!_this[btn.eventHandle]) {
                _this[btn.eventHandle] = function (row, button) {
                  _this.$emit(btn.eventHandle, row, button, _this.code)
                }
              }
            })

            columnData.push(
              {
                title: '操作',
                dataIndex: 'operation',
                width: this.operationColumnCustomWidth,
                minWidth: 120,
                scopedSlots: { customRender: 'operation' }
              }
            )
          }
          if (_this.tableInfo.selectType) {
            columnData.unshift(
              {
                type: 'selection',
                width: 40,
                align: 'center'
              }
            )
            if (_this.tableInfo.selectType === 1) {
              _this.selectType = 'single'
            } else {
              _this.selectType = 'multip'
            }
          }
          _this.columns = columnData
        }
        // 报表参数
        if (res.reportParams.length) {
          res.reportParams.map(item => {
            _this.defaultReportParam[item.paramName] = item.paramValue
          })
        }

        // SQL参数
        if (res.reportSqlParams.length) {
          res.reportSqlParams.map(item => {
            _this.sqlParam[item.paramName] = item.paramValue
          })
        }
        _this.rebuildParam(_this.reportParam)
      })
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    search (param) {
      this.tableParam.param = param
    },
    reSet () {
      // this.tableParam.param = {}
      // this.$refs.table.searchData()
    },
    rebuildParam (val) {
      let reportParam = {}
      let defaultReportParamArr = Object.keys(this.defaultReportParam)
      let sqlParamArr = Object.keys(this.sqlParam)
      let valArr = Object.keys(val)
      if (valArr.length) {
        valArr.map(item => {
          if ((defaultReportParamArr.indexOf(item) !== -1) || (sqlParamArr.indexOf(item) !== -1)) {
            reportParam[item] = val[item]
          }
        })
      }
      this.tableParam = {
        reportId: this.tableInfo.id,
        param: {},
        reportParam: Object.assign(this.sqlParam,this.defaultReportParam,reportParam)
      }
    },
    handleSelectionChange (val) {
      if (this.selectType === 'single') {
        if (val.length >= 2) {
          // 删除索引为0的
          // console.log(val.splice(0,val.length-1),'被删除的')
          let arrays = val.splice(0, val.length - 1)
          arrays.forEach(row => {
            this.$refs.table.$refs.table.toggleRowSelection(row) // 除了当前点击的，其他的全部取消选中
          })
        }
      }
      this.$emit('selection-change', val)
    },
    rowClick (val) {
      if (this.tableInfo.enableClick) {
        this.$emit('row-click', val)
      }
    },
    columnFiter (val) {
      this.tableParam.param = Object.assign({},val)
    },
    // 新建表单
    createForm () {
      this.dataViewId = ''
      this.formVisible = true
    },
    // 表单新建/修改关闭抽屉
    formClose () {
      this.formVisible = false
    },
    // 修改表单
    modifyForm (row, btn) {
      // this.dataViewId = '369a9db802e34cfeb601'
      this.dataViewId = row.ID
      this.formVisible = true
    },
    // 删除表单
    deleteForm (row, btn) {
      let _this = this
      this.$confirm(`是否要删除该记录？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$api[btn.remark]({ ID: row.id }).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        }).catch(() => { })
      }).catch(() => { })
    },
    // 查看表单
    viewForm (row, btn) {
      this.viewRecord = row
      this.viewVisible = true
    },
    // 查看抽屉关闭
    viewClose () {
      this.viewVisible = false
    },
    // 自定义抽屉
    openComponent (row, btn) {
      this.scopeRow = row
      this.componentPath = btn.component
      this.customVisible = true
    },
    // 关闭自定义抽屉
    customClose () {
      this.customVisible = false
    },
    // 动态api
    dynamicAPI (row, btn) {
      this.$api[btn.remark]({ ID: row.id }).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '操作失败!'
          })
        }
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss">
#list-layout.grid-table-render {
  #list-main {
    padding: 10px;
    margin: 0;
  }
}
</style>
