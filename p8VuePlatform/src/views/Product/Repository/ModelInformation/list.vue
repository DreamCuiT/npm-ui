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
      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleModelEditDrawer"
                     size="50%"
                     :title="drawerTitle"
                     :visible="visibleModelEditDrawer"
                     @close="onEditModelClose">
        <template #drawer>
          <model-edit @saveSuccess="saveCallback"
                      :id="id"
                      :dateNumber="dateNumber"></model-edit>
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
    title: '型号代号',
    dataIndex: 'modelCode',
    minWidth: 250,
    align: 'center'
  },
  {
    title: '型号名称',
    dataIndex: 'modelName',
    width: 320,
    align: 'center'
  },
  {
    title: '型号简称',
    dataIndex: 'abbreviation',
    width: 200,
    align: 'center'
  },
  {
    title: '型号密级',
    dataIndex: 'security',
    width: 100,
    align: 'center'
  },
  {
    title: '所属领域',
    dataIndex: 'classify',
    width: 100,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 170,
    align: 'center'
  }
]

export default {
  name: 'ModelList',
  components: {
    'model-edit': Edit,
    ListLayout,
    CommonTable,
    CommonButton,
    SearchFormList,
    CommonDrawer
  },
  data () {
    return {
      drawerTitle: '',
      comp: this,
      visibleModelEditDrawer: false,
      queryParam: {},
      tableApi: 'modelInformation.getMIList',
      columns: columns,
      tableHeight: 1,
      id: '',
      dateNumber: 0,
      dataLength: 0,
      searchData: [
        {
          type: 'text',
          labelText: '型号代号',
          fieldName: 'modelCode',
          placeholder: '请输入型号代号',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'text',
          labelText: '型号名称',
          fieldName: 'modelName',
          placeholder: '请输入型号名称',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'text',
          labelText: '型号简称',
          fieldName: 'abbreviation',
          placeholder: '请输入型号简称',
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          labelText: '所属领域',
          type: 'select',
          fieldName: 'classify',
          placeholder: '请选择所属领域',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'OWNER_TYPE' },
            label: 'label',
            value: 'value'
          }
        }
      ]
    }
  },
  mounted () {

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
    addMenu () {
      this.id = ''
      this.drawerTitle = '新建型号信息'
      this.dateNumber = this.dataLength + 1
      this.visibleModelEditDrawer = true
    },
    modifyMenu (record) {
      this.id = record.id
      this.drawerTitle = '修改型号信息'
      this.visibleModelEditDrawer = true
    },
    onEditModelClose () {
      this.visibleModelEditDrawer = false
    },
    saveCallback () {
      this.$refs.table.searchData()
      this.onEditModelClose()
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    delMenu (record) {
      let that = this
      if (record.userNum > 0) {
        that.$alert('该型号已被使用，不可删除！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).catch(() => { })
      } else {
        that.$confirm(`是否要删除该条数据？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api['modelInformation.MLDelete']({ id: record.id }).then(res => {
            if (!res) {
              that.showMessage(that, '删除失败', 'error')
              return false
            }
            that.showMessage(that, '删除成功', 'success')
            that.$refs.table.searchData()
          })
        }).catch(() => console.log('Oops errors!'))
      }
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
    getTotalNum (data) {
      let that = this
      that.dataLength = that.$refs.table.page.total
    }
  }
}

</script>
