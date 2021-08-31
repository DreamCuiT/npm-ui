<template>
  <list-layout>
    <template #north>
      <common-button :comp="comp"
                     :button-config="buttonConfig"></common-button>
      <search-form-list ref="search"
                        :dataSource="searchData"
                        @search="search"
                        @re-set="reSet"></search-form-list>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :comp="comp"
                      :columns="columns"
                      :params="queryParam"
                      :api="tableApi"
                      @row-click="tempRowClick"
                      :table-Refresh="tableRefresh"
                      :pagination="true">
          <template #yearStatus="{ scope }">
            <div>
              <template v-if="scope.row.yearStatus&&scope.row.yearStatus==='7709'">
                <el-tooltip effect="light"
                            content="变更中"
                            placement="right">
                  <i class="icon-filled-circle p8"
                     style="cursor: pointer;color:red">
                  </i>
                </el-tooltip>
              </template>
              <template v-if="scope.row.yearStatus&&scope.row.yearStatus==='7706'">
                <el-tooltip class="item"
                            effect="light"
                            content="审批中"
                            placement="right">
                  <span class="base-custom-icon-style approve">审</span>
                </el-tooltip>
              </template>
            </div>
          </template>
        </common-table>
      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleDrawer"
                     :visible="visibleDrawer"
                     placement="left"
                     size="100%"
                     @close="onEditProjectClose">
        <template #drawer>
          <menu-layout :third-menu-param="thirdMenuParam"
                       :default-menu="defaultMenu"></menu-layout>
        </template>
      </common-drawer>
      <edit v-if="yearConfigDialog"
            :visible="yearConfigDialog"
            :otherParam="queryParam"
            @close-modal="yearConfigClose"
            @save-success="yearConfigCallback"></edit>
      <go-examine v-if="visibleExamineDialog"
                  :visible="visibleExamineDialog"
                  :otherParam="queryParam"
                  @close-dialog="goExamineClose"></go-examine>
    </template>
  </list-layout>
</template>
<style lang="scss">
.base-custom-icon-style {
  color: $base-white-color;
  padding: 0 2px;
  font-size: 12px;
  border-radius: 10px;
  margin-left: -7px;
  cursor: pointer;
  &.approve {
    background-color: $base-red-color;
  }
  &.leaf {
    background-color: $base-green-color;
  }
}
</style>
<script>
import Vue from 'vue'
import Edit from './Components/edit'
import goExamine from './Components/goExamine'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8MenuLayout as MenuLayout } from '~/index'
import { Tooltip } from '~/index'
export default {
  name: 'RevenueYearBudget',
  components: {
    'el-tooltip': Tooltip,
    Edit,
    goExamine,
    CommonTable,
    CommonButton,
    CommonDrawer,
    ListLayout,
    SearchFormList,
    MenuLayout // 缺少三级菜单MenuLayout组件
  },
  props: {
    columns: {
      type: Array,
      default: function () {
        return [
          {
            title: '',
            dataIndex: 'yearStatus',
            width: 45,
            align: 'center',
            scopedSlots: { customRender: 'custom' }
          },
          {
            title: '序号',
            type: 'index',
            width: 55,
            align: 'center'
          },
          {
            title: '型号代号',
            dataIndex: 'modelCode',
            width: 120,
            align: 'center'
          },
          {
            title: '项目编号',
            dataIndex: 'pjCode',
            width: 140,
            align: 'center'
          },
          {
            title: '项目名称',
            dataIndex: 'name',
            minWidth: 300,
            align: 'left'
          },
          {
            title: '项目类型',
            dataIndex: 'classifyName',
            width: 150,
            align: 'center'
          },
          {
            title: '收款预算金额',
            dataIndex: 'yearRevenueComeMoney',
            width: 120,
            align: 'center'
          },
          {
            title: '支出预算金额',
            dataIndex: 'yearRevenuePayMoney',
            width: 120,
            align: 'center'
          },
          {
            title: '最新年度',
            dataIndex: 'yearLast',
            width: 120,
            align: 'center'
          },
          {
            title: '状态',
            dataIndex: 'yearRevenueStatusLast',
            width: 120,
            align: 'center'
          },
          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            width: 120,
            align: 'center'
          }
        ]
      }
    },
    searchData: {
      type: Array,
      default: function () {
        return [

          {
            type: 'text', // 控件类型
            labelText: '项目名称', // 控件显示的文本
            fieldName: 'productName',
            placeholder: '请输入项目名称'
          },
          {
            type: 'text', // 控件类型
            labelText: '项目编号', // 控件显示的文本
            fieldName: 'projectCode',
            placeholder: '请输入项目编号', // 默认控件的空值文本
            fieldEvent: {
              click: 'clickEvent(this)'
            }
          },
          // {
          //   type: 'select',
          //   defaultValue: [],
          //   optionUrl: {
          //     api: 'thirdPartInterface.getDic',
          //     params: { dicType: 'PROJECT_ORDER' }
          //   },
          //   options: [],
          //   labelText: '项目分级', // 控件显示的文本
          //   fieldName: 'projectOrderId',
          //   placeholder: '选择项目分级',
          //   fieldConfig: {
          //     multiple: true
          //   }
          // },

          {
            type: 'treeSelect',
            defaultValue: [],
            labelText: '项目类型',
            fieldName: 'projectClassifyId',
            placeholder: '选择项目类型',
            defaultExpandAll: true,
            multiple: true,
            optionUrl: {
              api: 'ProjectApply.projectClassifyTree',
              params: {},
              // label: 'name',
              value: 'id'
            },
            treeData: []
          },
          {
            type: 'select',
            defaultValue: [],
            labelText: '所属型号',
            fieldName: 'modelCode',
            placeholder: '选择所属型号',
            optionUrl: {
              api: 'ProjectApply.getModelListData',
              label: 'modelCode',
              value: 'id',
              params: {}
            },
            treeData: [],
            fieldConfig: {
              multiple: true
            }
          }
          // ,
          // {
          //   type: 'treeSelect',
          //   multiple: true,
          //   labelText: '管理部门',
          //   fieldName: 'deptId',
          //   defaultValue: [],
          //   defaultExpandedKeys: ['1'],
          //   placeholder: '选择管理部门',
          //   optionUrl: {
          //     api: 'ProjectApply.deptTree',
          //     params: {}
          //   },
          //   treeData: []
          // }
        ]
      }
    }
  },
  data () {
    return {
      tableApi: 'RevenueYearBudget.list',
      comp: this,
      currentRouterPath: '',
      thirdMenuParam: {},
      revenueInfoId: '',
      wholeDescribeId: '',
      revenueYearInfoId: '',
      visibleDrawer: false,
      yearConfigDialog: false,
      visibleExamineDialog: false,
      queryParam: {},
      buttonConfig: {
        icon: 'edit'
      },
      defaultMenu: {}
    }
  },
  mounted () {
    this.currentRouterPath = this.$route.path
  },
  computed: {

  },
  methods: {
    tableRefresh (param) {
      param
        .then(() => {
          console.log('异步成功后端做的操作')
        })
        .catch(() => {
          console.log('异步失败的操作')
        })
    },
    tempRowClick (record, column, event) {
      this.revenueInfoId = record.revenueInfoId
      this.wholeDescribeId = record.wholeDescribeId
      this.thirdMenuParam.revenueInfoId = record.revenueInfoId
      this.thirdMenuParam.wholeDescribeId = record.wholeDescribeId
      if (column.property !== 'operation') {
        this.visibleDrawer = true
      }
    },
    withdraw (record) {
      let that = this
      this.$confirm(`确定撤回？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['ProjectApply.withdraw']({
          businessId: record.id,
          status: record.status
        }).then(function (res) {
          if (res.errorMsg) {
            that.$message({
              message: res.errorMsg,
              type: 'error'
            })
          } else {
            that.$message({
              message: '操作成功',
              type: 'success'
            })
          }
          that.$refs.table.queryList()
        }).catch(function (error) {
          console.log(error)
        })
      }).catch(() => { })
    },
    releaseMenu (record) {
      let that = this
      this.$confirm(`是否确定要发布该项目？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['ProjectApply.complete']({
          processDefinitionKey: 'project-release',
          id: record.id,
          status: record.status
        }).then(function (res) {
          if (res.errorMsg) {
            that.$message({
              message: res.errorMsg,
              type: 'error'
            })
          } else {
            that.$refs.table.queryList()
            that.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      }).catch(() => { })
    },
    onEditProjectClose () {
      this.$router.push({ path: this.currentRouterPath })
      this.visibleDrawer = false
      this.$refs.table.searchData()
    },
    goExamine (item) {
      let that = this
      let status = item.yearStatus
      let yearRevenueId = item.yearRevenueIdLast
      that.$api['RevenueYearBudget.findRevenueYearInfoIdByNew']({ revenueYearInfoId: item.yearRevenueIdLast }).then((res) => {
        if (res && res.revenueYearInfoId && res.revenueYearInfoId !== '') {
          yearRevenueId = res.revenueYearInfoId
        }
        if (status === '7706') {
          that.queryParam.revenueYearInfoId = yearRevenueId
          that.visibleExamineDialog = true
        } else {
          that.$message(
            {
              message: '此状态下不可操作',
              type: 'error'
            }
          )
        }
      })
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    allYearExamine () {
      this.visibleExamineDialog = true
    },
    allYearConfig () {
      this.yearConfigDialog = true
    },
    goExamineClose () {
      this.visibleExamineDialog = false
      this.$refs.table.searchData()
    },
    yearConfigClose () {
      this.yearConfigDialog = false
    },
    yearConfigCallback (res) {
      let that = this
      if (res && res.length > 0) {
        let resultMsg = ''

        let length = res.length

        let checkMsg = ''

        for (let i = 0; i < res.length; i++) {
          let name = res[i].name
          checkMsg = checkMsg + name + ','
        }

        checkMsg = checkMsg + '以上' + length + '条项目发起成功'

        resultMsg = resultMsg + checkMsg
        that.showMessage(that, resultMsg, 'success')
      } else if (res && res.length === 0) {
        that.showMessage(that, '共0个项目被发起。', 'success')
      }
      this.yearConfigDialog = false
      this.$refs.table.searchData()
    },
    search (param) {
      this.queryParam = param
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.queryList()
      })
    },
    reSet () {
      let this_ = this
      Object.keys(this.queryParam).forEach(key => {
        let temp = this_.searchData.filter(item => item.fieldName === key)
        this.queryParam[key] = temp[0].defaultValue
      })
      Vue.nextTick(function () {
        this_.$refs.table.searchData()
      })
    }
  }
}
</script>
