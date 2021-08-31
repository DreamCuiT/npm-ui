<template>
  <list-layout>
    <template #north>
    </template>
    <template #center>
      <common-button :comp="comp"></common-button>
      <div id="table-contain">
        <common-table
            ref="table"
            height="auto"
            :comp="comp"
            :table-config="tableConfig"
            :columns="columns"
            :api="tableApi"
            :table-Refresh="tableRefresh"
            :pagination="true"
            @row-click="openMeetingManager"
        ></common-table>
      </div>
    </template>
    <template #drawer-panel>
          <!--   查看抽屉   -->
          <common-drawer
              v-if="visibleEditDrawer"
              :title="drawerTitle"
              :visible="visibleEditDrawer"
              @close="onEditClose"
              size="50%"
          >
            <template #drawer>
              <meeting :id="id"></meeting>
            </template>
          </common-drawer>
          <!--   新建抽屉   -->
          <common-drawer v-if="visibleCreateMeetingDrawer" :title="drawerTitle"
                         :visible="visibleCreateMeetingDrawer"
                         size="70%"
                         @close="onCreateMeetingClose">
            <template #drawer>
              <create-meeting @saveSuccess="saveCallback"></create-meeting>
            </template>
          </common-drawer>
    </template>
  </list-layout>
</template>
<script>
import Meeting from './meeting'
import CreateMeeting from './createMeeting'
import { P8Table as CommonTable } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Button as CommonButton } from '~/index'

const columns = [
  {
    title: '序号',
    type: 'index',
    width: 45,
    align: 'center'
  },
  {
    title: '会议名称',
    width: '110px',
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: '主持人',
    dataIndex: 'compere',
    width: '200px',
    align: 'center'
  },
  {
    title: '会议时间',
    width: '110px',
    align: 'center',
    dataIndex: 'meetingTime'
  },
  {
    title: '会议密级',
    dataIndex: 'security',
    minWidth: 400,
    align: 'left'
  },
  {
    title: '会议内容',
    width: '100px',
    align: 'center',
    dataIndex: 'content'
  },
  {
    title: '会议类型',
    width: '100px',
    align: 'center',
    dataIndex: 'meetingType'
  }
]
export default {
  name: 'meetingList',
  components: {
    Meeting,
    CreateMeeting,
    CommonTable,
    CommonDrawer,
    ListLayout,
    CommonButton
  },
  data () {
    return {
      comp: this,
      drawerTitle: '',
      visibleEditDrawer: false,
      visibleCreateMeetingDrawer: false,
      tableApi: 'meetingManager.meetingList',
      columns: columns,
      tableConfig: {
        defaultExpandAllRows: true
      }
    }
  },
  mounted () {

  },
  methods: {
    createMeetingManager () {
      console.log('新建会议')
      this.drawerTitle = '新建会议'
      this.visibleCreateMeetingDrawer = true
    },
    openMeetingManager (id) {
      this.id = id.id
      console.log(this.id, '==================id')
      this.drawerTitle = '会议详情'
      this.visibleEditDrawer = true
    },
    onEditClose () {
      this.visibleEditDrawer = false
    },
    onCreateMeetingClose () {
      this.visibleCreateMeetingDrawer = false
      this.$refs.table.searchData()
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
    saveCallback () {
      this.$refs.table.searchData()
      this.onCreateMeetingClose()
    }
  }
}
</script>
<style scoped>
</style>
