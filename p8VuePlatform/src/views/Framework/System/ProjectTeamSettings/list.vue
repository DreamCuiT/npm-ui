<template>
  <list-layout>
    <template #north>
      <common-button :comp="comp"
                     :button-config="buttonConfig"
                     :specialRoteName="roteName"></common-button>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table ref="table"
                      :comp="comp"
                      :table-config="tableConfig"
                      :columns="columns"
                      :tree="treeParams"
                      :params="queryParam"
                      :api="tableApi"
                      :table-Refresh="tableRefresh"
                      :pagination="true"
                      @icon-click="iconClick"
                      :specialRoteName="roteName"></common-table>
      </div>
    </template>
    <template #drawer-panel>
      <common-drawer v-if="visibleProjectTeamSettingsEditDrawer"
                     :title="drawerTitle"
                     :visible="visibleProjectTeamSettingsEditDrawer"
                     @close="onEditProjectTeamSettingsClose">
        <template #drawer>
          <project-team-settings-edit @save-success="saveCallback"
                                      :id="id"
                                      :name="name"></project-team-settings-edit>
        </template>
      </common-drawer>
      <common-drawer v-if="visibleProjectTeamSettingsDetailsDrawer"
                     :title="drawerTitle"
                     :visible="visibleProjectTeamSettingsDetailsDrawer"
                     @close="onDetailsProjectTeamSettingsClose">
        <template #drawer>
          <project-team-settings-details @save-Success="onDetailsProjectTeamSettingsClose"
                                         :id="id"></project-team-settings-details>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>
<script>
import ProjectTeamSettingsEdit from '@/views/Framework/System/ProjectTeamSettings/edit'
import ProjectTeamSettingsDetails from '@/views/Framework/System/ProjectTeamSettings/details'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
const columns = [
  {
    title: '序号',
    type: 'index',
    align: 'center',
    width: '50'
  },
  {
    title: '团队名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '团队描述',
    dataIndex: 'describe',
    align: 'center'
  },
  {
    title: '项目类型',
    dataIndex: 'kprojectClassifyName',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    formatter: function (row) {
      if (row.status === '0') {
        return '已停用'
      } else if (row.status === '1') {
        return '已启用'
      }
    },
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center'
  }
]
export default {
  name: 'ProjectTeamSettingsList',
  components: {
    ProjectTeamSettingsEdit,
    ProjectTeamSettingsDetails,
    CommonTable,
    CommonDrawer,
    ListLayout,
    CommonButton
  },
  props: {
    roteName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      comp: this,
      drawerTitle: '',
      visibleProjectTeamSettingsEditDrawer: false,
      visibleProjectTeamSettingsDetailsDrawer: false,
      queryParam: {},
      treeParams: {},
      tableApi: 'projectTeamSetting.listData',
      advanced: false,
      columns: columns,
      id: '',
      name: '',
      scroll: {},
      tableConfig: {
        // bordered: true,
        // size:'middle'
        defaultExpandAllRows: true
      },
      searchData: [],
      buttonConfig: {
        icon: 'edit'
      }
    }
  },
  mounted () {
    console.log(this.roteName, 'roteName')
  },
  // computed: {
  //   isDisable () {
  //     return function (record, button) {
  //       let result = false
  //       let disabledMsg = ''
  //       let status = record.status
  //       let useCount = record.useCount
  //       if (button.id === '0901020103') { // 启用或已使用 不可删除
  //         if (status === '1' ||
  //                 useCount > 0) {
  //           disabledMsg = '状态已启用或者已被使用'
  //           result = true
  //         }
  //       }
  //       if (button.id === '0901020104') { // 启用 不可启用
  //         if (status === '1') {
  //           disabledMsg = '已经是启用状态'
  //           result = true
  //         }
  //       }
  //       if (button.id === '0901020105') { // 停用 不可停用
  //         if (status === '0') {
  //           disabledMsg = '已经是停用状态'
  //           result = true
  //         }
  //       }
  //       return { disabled: result, disabledMsg: disabledMsg }
  //     }
  //   }
  // },
  methods: {
    createProjectTeamSettings () {
      this.id = ''
      this.drawerTitle = '新建项目团队设置'
      this.visibleProjectTeamSettingsEditDrawer = true
    },

    updateProjectTeamSettings (record) {
      console.log(record.name)
      this.id = record.id
      this.name = record.name
      this.drawerTitle = '修改项目团队设置'
      this.visibleProjectTeamSettingsEditDrawer = true
    },
    detailsProjectTeamSettings (record) {
      this.id = record.id
      //  this.parentId = record.id;
      this.drawerTitle = '查看项目团队设置'
      this.visibleProjectTeamSettingsDetailsDrawer = true
    },
    removeProjectTeamSettings (record) {
      //  reject('删除项目团队失败！');
      let that = this
      if (record.name === '默认团队') {
        that.$message({ message: `默认团队不可删除`, type: 'error' })
      } else if (record.useCount > 0) {
        top.app.$confirm({
          title: '提示',
          content: '该设置已被使用，不可删除！'
        })
      } else {
        this.$confirm(`是否确定要删除该项目团队？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api['projectTeamSetting.remove']({ ids: [record.id] }).then(res => {
            that.$refs.table.searchData()
            that.$message({ message: `删除项目团队成功！`, type: 'success' })
          })
        }).catch(() => {
          that.$message({ message: `删除项目团队失败！`, type: 'error' })
        })
      }
    },
    startProjectTeamSettings (record) {
      let that = this
      this.$confirm(`是否确定要启用该项目团队？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['projectTeamSetting.useState']({ id: record.id, status: '1' }).then(res => {
          that.$refs.table.searchData()
          that.$message({ message: `启用项目团队成功！`, type: 'success' })
        })
      }).catch(() => {
        that.$message({ message: `启用项目团队失败！`, type: 'error' })
      })
    },
    stopProjectTeamSettings (record) {
      let that = this
      this.$confirm(`是否确定要停用该项目团队？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['projectTeamSetting.useState']({ id: record.id, status: '0' }).then(res => {
          that.$refs.table.searchData()
          that.$message({ message: `停用项目团队成功！`, type: 'success' })
        })
      }).catch(() => {
        that.$message({ message: `停用项目团队失败！`, type: 'error' })
      })
    },
    saveCallback () {
      console.log('修改页面关闭时的回调方法')
      this.$refs.table.searchData()
      this.onEditProjectTeamSettingsClose()
    },
    onEditProjectTeamSettingsClose () {
      this.visibleProjectTeamSettingsEditDrawer = false
    },
    onDetailsProjectTeamSettingsClose () {
      this.visibleProjectTeamSettingsDetailsDrawer = false
    },
    tableRefresh (param) {
      param
        .then(() => {
          console.log('异步成功后端做的操作')
        })
        .catch(() => {
          console.log('异步失败的操作')
        })
    },

    iconClick (record) {
      console.log(record, 'record')
    }
  }
}
</script>
<style scoped>
</style>
