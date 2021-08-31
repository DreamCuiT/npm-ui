<template>
  <normal-layout style="background: #fff">
    <template #north>
      <search-form-list
        ref="search"
        :dataSource="searchData"
        @search="search"
        @re-set="reSet"
      ></search-form-list>
    </template>
    <template #west>
      <common-tree
        treeApi="Examine.TreeData"
        @select="onSelect"
        :defaultExpandAll="defaultExpandAll"
        :defaultExpandedKeys="defaultExpandedKeys"
        :treeConfig="treeConfig"
      ></common-tree>
    </template>
    <template #center>
      <common-table
        ref="table"
        :comp="comp"
        :columns="columns"
        :params="queryParam"
        :api="userManager"
        :table-Refresh="tableRefresh"
        @select="recordSelected"
        :pagination="true"
      >
      </common-table>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="计划标识">
        </el-table-column>
        <el-table-column prop="name" label="是否考核">
        </el-table-column>
        <el-table-column prop="name" label="考核得分">
          <el-input ></el-input>
        </el-table-column>
      </el-table>
    </template>
  </normal-layout>
</template>

<script>
import Vue from 'vue'
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8Tree as CommonTree } from '~/index'
// import { P8Button as CommonButton } from '~/index'
import { P8Table as CommonTable } from '~/index'
// import { P8Drawer as CommonDrawer } from '~/index'
export default {
  data () {
    return {
      comp: this,
      tableData:[],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: '50',
          align: 'center'
        },
        {
          title: '计划标识',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '是否考核',
          dataIndex: 'realName',
          align: 'center'
        },
        {
          title: '考核得分',
          dataIndex: 'departmentName',
          width: '300',
          align: 'center'
        }
      ],
      searchData: [
        {
          type: 'text', // 控件类型
          labelText: '用户名称', // 控件显示的文本
          fieldName: 'userName',
          placeholder: '请输入用户名或姓名', // 默认控件的空值文本
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'checkbox', // 控件类型
          labelText: '已锁定', // 控件显示的文本
          fieldName: 'lockStatus',
          defaultValue: false
        }
      ],
      queryParam: {
        type: '单位级别'
      },
      defaultExpandAll: false,
      defaultExpandedKeys: ['1'],
      userManager: 'Examine.updateUnitLevel',
      treeConfig: {
        'expand-on-click-node': false,
        'check-on-click-node': true
      }
    }
  },
  components: {
    NormalLayout,
    SearchFormList,
    CommonTree,
    CommonTable
  },
  methods: {
    search (param) {
      let newParams = {
        ...param,
        ...(this.queryParam.departmentId ? {
          departmentId: this.queryParam.departmentId
        } : {})
      }
      this.queryParam = newParams
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reSet () {
      let departmentId
      if (this.queryParam.departmentId) {
        departmentId = this.queryParam.departmentId
      }
      let that = this
      Object.keys(that.queryParam).forEach(key => {
        that.queryParam[key] = ''
      })
      if (departmentId) {
        this.queryParam.departmentId = departmentId
      }
      Vue.nextTick(
        function () {
          that.$refs.table.searchData()
        })
    },
    onSelect (node) {
      if (node.label === '单位级别') {
        this.columns = [
          {
            title: '计划标识',
            dataIndex: 'name',
            align: 'center'
          },
          {
            title: '是否考核',
            dataIndex: 'realName',
            align: 'center'
          },
          {
            title: '考核得分',
            dataIndex: 'departmentName',
            width: '300',
            align: 'center'
          }
        ]
      } else if (node.label === '星级级别') {
        this.columns = [
          {
            title: '序号',
            type: 'index',
            width: '50',
            align: 'center'
          },
          {
            title: '考核星级',
            dataIndex: 'name',
            align: 'center'
          },
          {
            title: '考核的分',
            dataIndex: 'realName',
            align: 'center'
          }
        ]
      } else if (node.label === '周期级别') {
        this.columns = [
          {
            title: '序号',
            type: 'index',
            width: '50',
            align: 'center'
          },
          {
            title: '时间规则',
            dataIndex: 'name',
            align: 'center'
          },
          {
            title: '起止天数',
            dataIndex: 'realName',
            align: 'center'
          },
          {
            title: '结束天数',
            dataIndex: 'realName',
            align: 'center'
          },
          {
            title: '系数',
            dataIndex: 'realName',
            align: 'center'
          }
        ]
      }
      // console.log(node)
      this.queryParam.type = node.label
      this.queryData()
      this.$refs.table.searchData()
    },
    recordSelected (record) {
      console.log(record)
      this.selectedRecord = record
    },
    queryData (params) {   //发送请求更新table数据
      let this_ = this
      console.log(this.params)
      this.queryParam = { ...this.queryParam, ...params }
      console.log(params)
      console.log(this.queryParam)
      this.$api[this_.userManager](this.queryParam).then(res => {
        this_.dataList = res.record
        console.log(res)
      })
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    }
  }
}
</script>

<style scoped>
</style>
