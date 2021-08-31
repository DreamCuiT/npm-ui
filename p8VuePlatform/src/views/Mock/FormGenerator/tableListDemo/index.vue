<template>
  <div>
    <div class="parentTable">
      <custom-table
        code="deptList"
        @selection-change="selectChange"
        :customHeight="350"
        :headerVisible="false"
      ></custom-table>
    </div>
    <div class="parentTable">
      <custom-table
        code="userList"
        :reportParam="childReportParam"
        :customHeight="350"
        :headerVisible="true"
        @view="view"
      >
      <template #westSlot>
        tree
      </template>
      <template #CUSTOM>
        kjdkjkdfj
      </template>
      </custom-table>
    </div>
    <common-drawer
      :visible="viewVisible"
      title="查看页面"
      size="50%"
      @close="close"
    >
      <template #drawer>
        <view-render :code="code" :record="record"></view-render>
      </template>
    </common-drawer>
  </div>
</template>
<script>
import CustomTable from '@/views/Framework/ComponentsMananger/Grid/Components/tableRender'
import { P8Drawer as CommonDrawer } from '~/index'
import ViewRender from '@/views/Framework/ComponentsMananger/Grid/Components/viewRender'
export default {
  name: 'TableListDemo',
  components: {
    'custom-table': CustomTable,
    CommonDrawer,
    ViewRender
  },
  data () {
    return {
      childReportParam: {},
      viewVisible: false,
      code: '',
      record: {}
    }
  },
  methods: {
    selectChange (val) {
      this.childReportParam = {
        DEPARTMENT_ID: val.length ? val[0].ID : ''
      }
    },
    view (row, btn, code) {
      this.code = code
      this.record = row
      this.viewVisible = true
    },
    close () {
      this.viewVisible = false
    }
  }
}
</script>
