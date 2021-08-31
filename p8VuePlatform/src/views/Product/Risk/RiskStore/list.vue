<template>
  <list-layout>
    <template #north>
      <common-button :comp="comp"></common-button>
      <search-form-list ref="search"
                        :dataSource='searchData'
                        @search='search'
                        @re-set='reSet'></search-form-list>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :fiex="200"
                      :columns="columns"
                      :table-Refresh="tableRefresh"
                      :params="queryParam"
                      :api="tableApi"
                      :comp="comp"
                      :pagination=true>
        </common-table>
      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="createMenu"
                     size="40%"
                     :visible='createMenu'
                     :title="drawerTitle"
                     @close="createClose">
        <template #drawer>
          <create-risk-base @save-success="saveCallback"
                            :riskBaseId="riskBaseId"></create-risk-base>
        </template>
      </common-drawer>
      <common-drawer v-if="viewRiskBase"
                     size="40%"
                     :visible='viewRiskBase'
                     :title="drawerTitle"
                     @close="createClose">
        <template #drawer>
          <view-risk-base @save-success="saveCallback"
                          :existDefaultBtn="false"
                          :riskBaseId="riskBaseId"></view-risk-base>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>
<script>
import Vue from 'vue'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import CreateRiskBase from './Components/createRiskBase'
import ViewRiskBase from './Components/viewRiskBase'

const columns = [
  {
    title: '序号',
    type: 'index',
    width: 55,
    align: 'center'
  },
  {
    title: '风险内容描述',
    dataIndex: 'riskDesc',
    minWidth: 300,
    align: 'left'
  },
  {
    title: '项目类型',
    dataIndex: 'classifyId',
    width: 120,
    align: 'center'
  },
  {
    title: '风险范围',
    dataIndex: 'suit',
    width: 200,
    align: 'center'
  },
  {
    title: '风险类型',
    dataIndex: 'riskTypeDisplay',
    width: 120,
    align: 'center'
  },
  {
    title: '影响KPI',
    dataIndex: 'kpiEffrct',
    width: 120,
    align: 'center'
  },
  {
    title: '风险应对措施',
    dataIndex: 'riskMeasure',
    minWidth: 200,
    align: 'left'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 120,
    align: 'center'
  }
]
export default {
  name: 'riskBaseList',
  components: {
    SearchFormList,
    CommonButton,
    CreateRiskBase,
    CommonTable,
    CommonDrawer,
    ViewRiskBase,
    ListLayout
  },
  data () {
    return {
      comp: this,
      menuStateObj: [],
      thirdMenuParam: {},
      thirdMenuTitle: '',
      defaultMenu: {},
      queryParam: {},
      createMenu: false,
      viewRiskBase: false,
      drawerTitle: '',
      riskBaseId: '',
      tableApi: 'riskManager.storeListDate',
      columns: columns,
      searchData: [
        {
          type: 'text',
          labelText: '风险描述',
          fieldName: 'riskDesc',
          placeholder: '请输入风险描述',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'text',
          labelText: '风险类型',
          fieldName: 'riskType',
          placeholder: '请输入风险类型',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        }
      ]
    }
  },
  computed: {

  },
  methods: {
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    search (param) {
      let newParams = { ...param }
      this.queryParam = newParams
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    createClose () {
      this.createMenu = false
      this.viewRiskBase = false
    },
    saveCallback (res) {
      this.createMenu = false
      this.$refs.table.searchData()
    },
    createRiskBase (record) {
      this.riskBaseId = record.id
      this.drawerTitle = '新建风险库'
      this.createMenu = true
    },
    updateRiskBaseMenu (record) {
      this.riskBaseId = record.id
      this.drawerTitle = '修改风险库'
      this.createMenu = true
    },
    viewRiskBaseMenu (record) {
      this.riskBaseId = record.id
      this.drawerTitle = '查看风险库'
      this.viewRiskBase = true
    },
    deleteRiskBaseMenu (record) {
      let that = this
      this.riskBaseId = record.id
      this.$api['riskManager.deleteById']({ id: this.riskBaseId }).then(function (res) {
        that.$refs.table.searchData()
        that.showMessage(that, '删除成功！', 'success')
      }).catch(function (error) {
        console.log('error' + error)
      })
    }
  }

}
</script>
