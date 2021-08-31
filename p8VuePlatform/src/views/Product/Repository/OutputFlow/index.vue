<template>
  <normal-layout>
    <template #north>
      <common-button :comp="comp"></common-button>
      <search-form-list ref="search"
                        :dataSource="searchData"
                        @search="search"
                        @re-set="reSet"></search-form-list>
    </template>
    <template #west>
      <common-tree :tree-api="treeApi"
                   @select="onSelect"
                   :tree-config="treeConfig"
                   :tree-Param="treeParam"></common-tree>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :fiex="200"
                      :columns="columns"
                      :tableRefresh="tableRefresh"
                      :params="queryParam"
                      :api="tableApi"
                      :comp="comp"
                      :pagination=true>
        </common-table>
      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleFlowEditDrawer"
                     :title="drawerTitle"
                     :visible="visibleFlowEditDrawer"
                     @close="onEditFlowClose">
        <template #drawer>
          <flow-edit @saveSuccess="saveCallback"
                     :activity-info-id="activityInfoId"></flow-edit>
        </template>
      </common-drawer>
      <common-drawer v-if="visibleFlowIndexDrawer"
                     size="100%"
                     :title="drawerTitle"
                     :visible="visibleFlowIndexDrawer"
                     @close="onFlowIndexClose">
        <template #drawer>
          <flow-manager @saveSuccess="onFlowIndexClose"
                        :activity-info-id="activityInfoId"
                        :teamId="kteamId"
                        ref="flowManager"></flow-manager>
        </template>
      </common-drawer>
    </template>
  </normal-layout>
</template>

<style>
.ant-drawer-body {
  height: calc(100% - 55px);
}
.table-page-search-wrapper .ant-form-inline .ant-form-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 24px;
  margin-right: 0;
}
.table-page-search-wrapper
  .ant-form-inline
  .ant-form-item
  .ant-form-item-control-wrapper {
  -webkit-box-flex: 1;
  -ms-flex: 1 1;
  flex: 1 1;
  display: inline-block;
  vertical-align: middle;
}
</style>
<script>
import Vue from 'vue'
import Edit from './edit'
import FlowManager from './flowIndex'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8NormalLayout as NormalLayout } from '~/index'

const columns = [
  {
    title: '序号',
    type: 'index',
    width: 55,
    align: 'center'
  },
  {
    title: '流程名称',
    dataIndex: 'name',
    minWidth: 350,
    align: 'left'
  },
  {
    title: '项目类别',
    dataIndex: 'categoryDisp',
    width: 180,
    align: 'center'
  },
  {
    title: '项目类型',
    dataIndex: 'activityClassifyIdDisp',
    width: 180,
    align: 'center'
  },
  {
    title: '排序号',
    dataIndex: 'indexNo',
    width: 90,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 200,
    align: 'center'
  }
]

export default {
  name: 'FlowIndex',
  components: {
    'flow-edit': Edit,
    FlowManager,
    NormalLayout,
    CommonTable,
    CommonButton,
    SearchFormList,
    CommonDrawer,
    CommonTree
  },
  data () {
    return {
      drawerTitle: '',
      comp: this,
      visibleFlowEditDrawer: false,
      visibleFlowIndexDrawer: false,
      treeParam: {
        dataRange: 'select-all'
      },
      queryParam: {},
      treeApi: 'ProjectApply.projectClassifyTree',
      tableApi: 'OutputFlow.indexList',
      advanced: false,
      columns: columns,
      tableHeight: 0,
      activityInfoId: '',
      kteamId: '',
      searchData: [
        {
          type: 'text',
          labelText: '流程名称',
          fieldName: 'name',
          placeholder: '请输入流程名称',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        }
      ],
      tableConfig: {
        // bordered: true,
        // size:'middle'
      },
      buttonConfig: {
        icon: 'edit'
      },
      treeConfig: {
        // showLine: true,
        // checkable: true
      }
    }
  },
  mounted () {

  },
  computed: {

  },
  methods: {
    onSelect (obj) {
      // console.log(obj)
      this.queryParam.activityClassifyId = obj.id
      this.$refs.table.searchData()
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    createFlow () {
      this.activityInfoId = ''
      this.drawerTitle = '新建流程'
      this.visibleFlowEditDrawer = true
    },
    updateFlow (record) {
      this.activityInfoId = record.id
      this.drawerTitle = '修改流程'
      this.visibleFlowEditDrawer = true
    },
    onEditFlowClose () {
      this.visibleFlowEditDrawer = false
    },

    saveCallback () {
      this.$refs.table.searchData()
      this.onEditFlowClose()
    },
    indexFlow (record) {
      this.activityInfoId = record.id
      this.kteamId = record.kteamId
      this.drawerTitle = record.name
      this.visibleFlowIndexDrawer = true
    },
    onFlowIndexClose () {
      this.visibleFlowIndexDrawer = false
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    removeFlow (record) {
      let that = this
      this.$confirm(`是否要删除该条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['OutputFlow.indexRemove']({ id: record.id }).then(res => {
          if (!res) {
            this.showMessage(that, '删除失败', 'error')
            return false
          }
          this.showMessage(that, '删除成功', 'success')
          that.$refs.table.searchData()
        })
      }).catch(() => console.log('Oops errors!'))
    },
    copyFlow (record) {
      let that = this
      this.$confirm(`是否确定要复制该流程数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['OutputFlow.copyKActivityInfo']({ activityInfoId: record.id }).then(res => {
          if (!res) {
            this.showMessage(that, '复制流程失败', 'error')
            return false
          }
          this.showMessage(that, '复制流程成功', 'success')
          that.$refs.table.searchData()
        })
      }).catch(() => console.log('Oops errors!'))
    },
    search (param) {
      let newParams = { ...param, ...(this.queryParam.activityClassifyId ? { activityClassifyId: this.queryParam.activityClassifyId } : {}) }
      this.queryParam = newParams
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reSet () {
      let flClassifyId
      if (this.queryParam.activityClassifyId) {
        flClassifyId = this.queryParam.activityClassifyId
      }
      let that = this
      console.log(that.queryParam, 'that.queryParam1')
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
      console.log(that.queryParam, 'that.queryParam2')
      if (flClassifyId) {
        this.queryParam.activityClassifyId = flClassifyId
      }
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    iconClick (record) {
      console.log(record, 'record')
    }
  }
}

</script>
