<template>
  <normal-layout>
    <template #west>
      <common-tree ref="tree"
                   :treeApi="treeApi"
                   @select="treeSelect"></common-tree>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :comp="comp"
                      :columns="columns"
                      :params="queryParam"
                      :api="tableApi"
                      :table-Refresh="tableRefresh"
                      :pagination="true">
          <template #name="{scope}">
            <span class="underline" @click="rowClick(scope.row)">{{ scope.row.name }}</span>
          </template>
        </common-table>
      </div>
    </template>
    <template #drawer-panel>
      <el-drawer :title="ganttIndexTitle"
                 :append-to-body="true"
                 size="100%"
                 :wrapperClosable="false"
                 :destroy-on-close="true"
                 @close="close"
                 :visible="drawerVisible">
        <gantt-Index :planId="planId" :planInfoId = "planInfoId" ></gantt-Index>
      </el-drawer>
    </template>
  </normal-layout>
</template>

<script>
  import Vue from 'vue'
  import { P8Table as CommonTable } from '~/index'
  import { P8NormalLayout as NormalLayout } from '~/index'
  import { P8Tree as CommonTree } from '~/index'
  import { Drawer } from '~/index'
  import GanttIndex from './index'

  export default {
    name: 'projectInfoList',
    components: {
      CommonTable,
      NormalLayout,
      CommonTree,
      GanttIndex,
      'el-drawer': Drawer
    },
    props: {
      businessId: {
        type: String,
        default: ''
      },
      planInfoId: {
        type: String,
        default: ''
      },
      columns: {
        type: Array,
        default: function () {
          return [
            {
              title: '序号',
              type: 'index',
              minWidth: 55,
              align: 'center'
            },
            {
              title: '项目编号',
              dataIndex: 'pjCode',
              width: 120,
              align: 'center'
            },
            {
              title: '计划名称',
              dataIndex: 'name',
              minWidth: 300,
              align: 'left',
              // drillable: true,
              scopedSlots: { customRender: 'custom' }
            },
            {
              title: '计划开始时间',
              dataIndex: 'planBeginDate',
              width: 120,
              align: 'center'
            },
            {
              title: '计划结束时间',
              dataIndex: 'planEndDate',
              width: 120,
              align: 'center'
            },
            {
              title: '状态',
              dataIndex: 'planStatus',
              width: 80,
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
              labelText: '计划名称', // 控件显示的文本
              fieldName: 'planName',
              placeholder: '请输入计划名称'
            }
          ]
        }
      }
    },
    data () {
      return {
        comp: this,
        treeApi: 'courtyardPlanManager.courtyardProjectTreeView',
        tableApi: 'courtyardPlanManager.notConectcourtyardPlanList',
        ganttIndexTitle: '关联院计划',
        visibleImportExcel: false,
        wholeDescribeId: '',
        buttonConfig: { icon: 'edit' },
        drawerVisible: false,
        queryParam: {},
        layersParams: {},
        planId: ''
      }
    },
    watch: {
    },
    mounted () {
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
      treeSelect (e) {
        if (e.leaf) {
          console.log(e, '点击数据查看')
          this.queryParam.wholeDescribeId = e.id
          this.queryParam.type = e.type
          this.wholeDescribeId = e.id
          this.$refs.table.searchData()
        }
      },
      deletePlan (record) {
        let that = this
        that.$confirm(`是否要删除该条计划以及计划下面的所有任务？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api['courtyardPlanManager.deletePlan']({ planId: record.id })
                  .then(function (res) {
                    that.$refs.table.queryList()
                    that.$refs.tree.initTreeData()
                    that.$message({
                      message: '删除成功',
                      type: 'success'
                    })
                  })
                  .catch(function (error) {
                    console.log(error)
                  })
        }).catch(() => console.log('Oops errors!'))
      },
      importExcel () {
        this.visibleImportExcel = true
      },
      closeCallBack () {
        this.$emit('close-modal')
      },
      importExcelSuccessClosed () {
        this.visibleImportExcel = false
        this.$refs.table.queryList()
        this.$refs.tree.initTreeData()
      },
      rowClick (item) {
        this.planId = item.id
        this.drawerVisible = true
      },
      search (param) {
        console.log(param, 'param000')
        let newParams = { ...this.queryParam, ...param }
        this.queryParam = newParams
        console.log(newParams, 'newParams0000')
        let _this = this
        Vue.nextTick(function () {
          _this.$refs.table.queryList()
        })
      },
      reSet () {
        let this_ = this
        Object.keys(this.queryParam).forEach(key => {
          return (this_.queryParam[key] = null)
        })
        this.queryParam.layersParams = Object.assign({}, this.layersParams)
        Vue.nextTick(function () {
          this_.$refs.table.searchData()
        })
      },
      close () {
        this.drawerVisible = false
        this.$emit('close')
      }
    }
  }
</script>
