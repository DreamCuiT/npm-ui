<template>
  <list-layout>
    <template #north>
      <common-button :comp="comp"></common-button>
      <!-- <el-button @click="createContract" type="primary">新建</el-button> -->
      <search-form-list ref="search"
                        :dataSource="dataSource"
                        @search="search"
                        @re-set="reset"></search-form-list>
    </template>
    <template #center>
      <common-table ref="table"
                    :comp="comp"
                    :columns="columns"
                    :params="queryParams"
                    :api="tableApi"
                    :tableRefresh="tableRefresh"
                    :pagination=true>
      </common-table>
    </template>
    <template #drawer-panel>
      <common-drawer v-if='visibleCreateContractDrawer'
                     :title='createContractTitle'
                     :visible='visibleCreateContractDrawer'
                     size='100%'
                     @close='onEditContractClose'>
        <template #drawer>
          <contract-edit @save-success='saveCallback'
                         :currContractId='currContractId'></contract-edit>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>

<script>
import Vue from 'vue'
import { P8ListLayout as ListLayout } from '~/index'
// import { P8MenuLayout as MenuLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import ContractEdit from './Components/edit'
// import TempMenu from './tempMenu'
// import TeamManager from './team'
// import { Button } from '~/index'
export default {
  name: '',
  data () {
    const dataSource = [
      {
        type: 'text', // 控件类型
        labelText: '合同名称', // 控件显示的文本
        fieldName: 'contractName',
        placeholder: '请输入合同名称'
      },
      {
        type: 'text', // 控件类型
        labelText: '合同编号', // 控件显示的文本
        fieldName: 'contractNum',
        placeholder: '请输入合同编号' // 默认控件的空值文本
      }
    ]
    const columns = [
      {
        title: '序号',
        type: 'index',
        width: 55,
        align: 'center'
      },
      {
        title: '合同编号',
        dataIndex: 'contractNum',
        width: 200,
        align: 'center'
      },
      {
        title: '合同名称',
        minWidth: 300,
        align: 'left',
        dataIndex: 'contractName'
      },
      {
        title: '合同金额',
        dataIndex: 'allMoney',
        width: 120,
        align: 'center'
      },
      {
        title: '合同甲方',
        dataIndex: 'firstParty',
        width: 200,
        align: 'center'
      },
      {
        title: '合同密级',
        width: 120,
        align: 'center',
        dataIndex: 'security'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 120,
        align: 'center',
        scopedSlots: { customRender: 'operation' }
      }
    ]
    return {
      comp: this,
      dataSource,
      columns,
      queryParams: {},
      tableApi: 'contractManager.contractListData',
      // record: {},
      visibleCreateContractDrawer: false,
      visibleContractViewDrawer: false,
      createContractTitle: '新建合同',
      currContractId: '',
      defaultMenu: {},
      thirdMenuParam: {}
    }
  },
  mounted () {

  },
  methods: {
    search (params) {
      this.queryParams = params
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reset () {
      let that = this
      Object.keys(that.queryParams).forEach(key => {
        return (that.queryParams[key] = null)
      })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    createContract () {
      this.visibleCreateContractDrawer = true
      this.currContractId = ''
      this.createContractTitle = '新建合同信息'
    },
    updateContract (record) {
      console.log(record)
      this.visibleCreateContractDrawer = true
      this.currContractId = record.id
      this.createContractTitle = '修改合同信息'
    },
    onEditContractClose () {
      this.visibleCreateContractDrawer = false
      this.$refs.table.searchData()
    },
    saveCallback () {
      console.log('修改页面关闭时的回调方法')
      this.$refs.table.searchData()
      this.onEditContractClose()
    },
    removeContract (record) {
      let that = this
      that.$confirm(`是否要删除该计划？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let type = 'success'
        let msg = '删除成功！'
        that.$api['contractManager.remove']({ id: record.id }).then(res => {
          if (res && res.data) {
            that.$message({
              message: res.data.resultMsg,
              type: 'warning'
            })
          } else {
            that.$refs.table.searchData()
          }
        }).catch(function (error) {
          type = 'error'
          msg = '删除失败！'
          console.log(error, 'error')
        })
        this.$message(
          {
            message: msg,
            type: type
          }
        )
      }).catch(() => { })
    }
  },
  components: {
    ListLayout,
    // MenuLayout,
    CommonTable,
    SearchFormList,
    CommonButton,
    CommonDrawer,
    'contract-edit': ContractEdit
    // TempMenu,
    // TeamManager
    // 'el-button': Button
  }
}
</script>
<style lang="scss" scoped>
i.el-icon-menu {
  color: #1890ff;
  font-size: 16px;
}
.three-menu {
  .menu-item {
    display: flex;
    align-items: center;
    padding: 5px;
    &:hover {
      background-color: #e6f7ff;
      cursor: pointer;
    }
    span {
      padding-left: 6px;
      font-size: 14px;
    }
  }
}
/deep/ .el-container .el-main > div > div {
  background: none;
}
/deep/ .custom-drawer {
  background-color: #fafbff;
}
</style>
