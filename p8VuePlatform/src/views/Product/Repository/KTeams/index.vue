<template>
  <list-layout>
    <template #north>
      <common-button :comp="comp"></common-button>
      <search-form-list ref="search"
                        :dataSource="searchData"
                        @search="search"
                        @re-set="reSet"></search-form-list>
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
                      :pagination=true
                      @requested-table-data="getTotalNum">
        </common-table>
        <kteams-edit v-if="visibleTeamEdit"
                     :visible="visibleTeamEdit"
                     :title="title"
                     @close-modal="closeModal"
                     @save-success="saveCallback"
                     :teamId="teamId"
                     :dateNumber="dateNumber">
        </kteams-edit>

      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleKTeamsDisposeDrawer"
                     :title="drawerTitle"
                     :visible="visibleKTeamsDisposeDrawer"
                     @close="onDisposeKTeamsClose">
        <template #drawer>
          <dispose-kteams @save-Success="saveCallback"
                          :teamsId="teamsId"></dispose-kteams>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>

<style scoped>
</style>
<script>
import Vue from 'vue'
import Edit from './edit'
import DisposeKteams from './disposeKteams'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Search as SearchFormList } from '~/index'

const columns = [
  {
    title: '序号',
    type: 'index',
    width: 55,
    align: 'center'
  },
  {
    title: '团队名称',
    dataIndex: 'name',
    minWidth: 350,
    align: 'center'
  },
  {
    title: '描述',
    dataIndex: 'describes',
    minWidth: 350,
    align: 'center'
  },
  {
    title: '排序',
    dataIndex: 'indexNo',
    minWidth: 120,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 180,
    align: 'center'
  }
]

export default {
  name: 'KTeamsList',
  components: {
    'kteams-edit': Edit,
    'dispose-kteams': DisposeKteams,
    ListLayout,
    CommonTable,
    CommonButton,
    CommonDrawer,
    SearchFormList
  },
  data () {
    return {
      drawerTitle: '',
      visibleTeamEdit: false,
      visibleKTeamsDisposeDrawer: false,
      queryParam: {},
      tableApi: 'baseData.kTeamsPage',
      columns: columns,
      tableHeight: 1,
      teamsId: '',
      comp: this,
      dateNumber: 0,
      dataLength: 0,
      searchData: [
        {
          type: 'text',
          labelText: '团队名称',
          fieldName: 'name',
          placeholder: '请输入团队名称',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'text',
          labelText: '描述',
          fieldName: 'describes',
          placeholder: '请输入描述',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        }
      ]
    }
  },
  mounted () {

  },
  computed: {},
  methods: {
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    createKTeams () {
      this.teamId = ''
      this.title = '新建团队信息'
      this.dateNumber = this.dataLength + 1
      this.visibleTeamEdit = true
    },
    updateKTeams (record) {
      this.teamId = record.id
      this.title = '修改团队信息'
      this.visibleTeamEdit = true
    },
    disposeKTeams (record) {
      this.teamsId = record.id
      console.log(record.id)
      this.drawerTitle = '项目团队设置'
      this.visibleKTeamsDisposeDrawer = true
    },
    removeKTeams (record) {
      let that = this
      console.log(top)
      console.log(top.app)
      if (record.userNum > 0) {
        that.$alert('该团队已被使用，不可删除！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      } else {
        that.$confirm(`是否要删除该条数据？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api['baseData.kTeamsDelete']({ id: record.id }).then(res => {
            that.$refs.table.searchData()
          })
        }).catch(() => console.log('Oops errors!'))
      }
    },
    closeModal () {
      this.visibleTeamEdit = false
      this.$refs.table.searchData()
    },
    saveCallback (res) {
      this.visibleTeamEdit = false
      this.$refs.table.searchData()
    },
    onDisposeKTeamsClose () {
      this.visibleKTeamsDisposeDrawer = false
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
      Object.keys(that.queryParam).forEach(key => {
        that.queryParam[key] = ''
      })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    getTotalNum (data) {
      let that = this
      console.log(that.$refs.table.page.total, '22233232')
      that.dataLength = that.$refs.table.page.total
    }
  }
}

</script>
