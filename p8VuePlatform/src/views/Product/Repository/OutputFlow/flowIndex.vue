<template>
    <div style="height:100%">
        <el-tabs v-model="defaultActiveKey" type="card" class="flowTopTabs" @tab-click="triggerChange">
            <el-tab-pane label="默认模式" name="first">
                <normal-layout :headerVisible="false" :normalLayout="normalLayout">
                    <template #west>
                        <activityTree ref = "activityTree"
                                      class="left-container"
                                      :activity-info-id="activityInfoId"
                                      v-if="triggerVal"
                                      @taskSelected = "selectTask"
                                      @importExcel = "importTask"
                                      @remove-task="removeTask"
                        >
                        </activityTree>
                    </template>
                    <template #center>
                        <el-tabs v-model="describeKey" type="card" ref="tab" class="flowTabs" style="height: 100%;" @tab-click="onSelect" v-if="triggerVal">
                            <el-tab-pane name="describeKey">
                                <span slot="label">
                                    <div style="display: flex; align-items: center"><i class="p8 icon-task-details"></i><span style="margin-left: 4px">活动描述</span></div>
                                </span>
                                <describe-edit @saveSuccess="saveCallback" :activityInfoId="activityId" :teamId="teamId" :rootId="activityInfoId"
                                               :colLayoutClassify="colLayoutClassify"
                                               v-if="'describeKey' == activeKey && activityId"
                                ></describe-edit>
                            </el-tab-pane>
                            <el-tab-pane name="inputKey">
                                <span slot="label">
                                    <div style="display: flex; align-items: center"><i class="el-icon-sort-down"></i><span style="margin-left: 4px">输入</span></div>
                                </span>
                                <input-edit @saveSuccess="saveCallback" :activityInfoId="activityId" v-if="'inputKey' == activeKey && activityId"></input-edit>
                            </el-tab-pane>
                            <el-tab-pane name="outputKey">
                                <span slot="label">
                                    <div style="display: flex; align-items: center"><i class="p8 icon-output"></i><span style="margin-left: 4px">输出</span></div>
                                </span>
                                <output-edit @saveSuccess="saveCallback" :activityInfoId="activityId" v-if="'outputKey' == activeKey && activityId"></output-edit>
                            </el-tab-pane>
                            <el-tab-pane name="specialKey">
                                <span slot="label">
                                    <div style="display: flex; align-items: center"><i class="p8 icon-special-instructions"></i><span style="margin-left: 4px">特别说明</span></div>
                                </span>
                                <special-edit @saveSuccess="saveCallback" :activityInfoId="activityId" v-if="'specialKey' == activeKey && activityId"></special-edit>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </normal-layout>
            </el-tab-pane>
            <el-tab-pane  type="card" label="图形模式" name="second">
                <graphics-mode :activity-info-id="activityInfoId" :teamId="teamId" v-if="!triggerVal"></graphics-mode>
            </el-tab-pane>
        </el-tabs>

        <div>
            <common-drawer v-if="excelDrawer" :title="excelTitle" :drawerConfig="drawerConfig" :visible="excelDrawer" @close="onExcelClose">
                <template #drawer>
                    <import-excel @saveSuccess="importExcelClosed" :task-id="selectTaskId" :output-request="excelImportData"></import-excel>
                </template>
            </common-drawer>
        </div>
    </div>
</template>

<style lang="scss" scope>
    .table-page-search-wrapper .ant-form-inline .ant-form-item {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        margin-bottom: 24px;
        margin-right: 0;
    }
    .table-page-search-wrapper .ant-form-inline .ant-form-item .ant-form-item-control-wrapper {
        -webkit-box-flex: 1;
        -ms-flex: 1 1;
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
    }
    .left-container {
        overflow: hidden;
        position: relative;
        height: 100%;
    }
    .flowTopTabs{
        height:100%;
        >.el-tabs__header.is-top {
            height: 42px;
        }
        >.el-tabs__content{
            height:calc(100% - 43px);
            >.el-tab-pane{
                height:100%;
            }
        }
    }

    .flowTabs{
        >.el-tabs__header.is-top {
            height: 42px;
        }
        .el-tabs__content{
            height:calc(100% - 43px);
        }
        .el-tab-pane{
            height:100%;

            >div{
                height:100%;
            }
        }
    }
</style>
<script>
import { Tabs, TabPane } from '~/index'
import { P8NormalLayout as NormalLayout } from '~/index'
import ActivityTree from './activityTree'
import ImportExcel from './Components/importExcel'
import GraphicsMode from './graphicsMode.vue'
import { P8Drawer as CommonDrawer } from '~/index'
import DescribeEdit from './Components/describeEdit'
import InputEdit from './Components/inputEdit'
import SpecialEdit from './Components/specialEdit'
import OutputEdit from './Components/outputEdit'
export default {
  name: 'FlowManager',
  components: {
    NormalLayout,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'graphics-mode': GraphicsMode,
    ActivityTree,
    DescribeEdit,
    ImportExcel,
    InputEdit,
    SpecialEdit,
    CommonDrawer,
    OutputEdit
  },
  props: {
    activityInfoId: {
      type: String,
      default: ''
    },
    teamId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      excelTitle: '产出流程Excel导入',
      activeKey: 'describeKey',
      describeKey: 'describeKey',
      specialKey: 'specialKey',
      outputKey: 'outputKey',
      inputKey: 'inputKey',
      defaultActiveKey: 'first',
      colLayoutClassify: 'doubleCol',
      triggerVal: true,
      excelDrawer: false,
      activityId: '',
      loadTaskUrl: '',
      selectTaskId: '',
      tasks: {
        data: []
      },
      messages: [],
      excelImportData: [
        {
          attId: '2',
          attFilePath: 'Excel产出流程导入模板.xlsx',
          attFileName: 'Excel产出流程导入模板',
          descriptionStr: '按照大纲级别，将文档中的任务导入为选中任务的下级任务。'
        }
      ],
      normalLayout: {
        west: {
          xs: 9, sm: 8, md: 7, lg: 8, xl: 10
        },
        center: {
          xs: 15, sm: 16, md: 17, lg: 16, xl: 14
        }
      },
      drawerConfig: { /// z-index
        destroyOnClose: true,
        modal: false,
        appendToBody: true,
        wrapperClosable: true
      }
    }
  },
  mounted () {
          // alert(22)

    // if (!this.activityId) {
    //   this.$message({
    //     type: 'error',
    //     message: '请选择活动节点'
    //   })
    // }
  },
  computed: {

  },
  methods: {
    destructorDp () {
      // this.$refs.activityTree.destructorDp()
    },
    triggerChange () {
      if (this.defaultActiveKey === 'first') {
        this.triggerVal = true
      } else {
        this.triggerVal = false
      }
    },
    // // tabs页选中
    // change (activeKey) {
    //   this.activeKey = activeKey
    // },
    // tabs页切换
    onSelect (tab, event) {
      this.activeKey = tab.name
      if (!this.activityId) {
        this.$message({
          type: 'error',
          message: '请选择活动节点'
        })
      }
      // this.$refs.tab.refresh()
    },
    updateActivity (record) {

    },
    saveCallback (res) {
      if (res) {
        this.$refs.activityTree.updateTaskName(res)
      }
    },
    removeActivity (record) {
      let that = this
      that.$confirm({
        title: '确认',
        content: '是否确定要删除该活动？',
        onOk () {
          //   return new Promise((resolve, reject) => {
          //     removeUserAPI({ entityId: record.id }).then(res => {
          //       console.log(res.data)
          //       if (res.data && res.data.result == 'success') {
          //         that.$refs.tab.refresh()
          //         resolve()
          //       } else {
          //         reject('删除活动错误！')
          //       }
          //     })
          //   }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {}
      })
    },
    selectTask (activityId) {
      this.activityId = activityId
      // 刷新页面
      if (this.activeKey && this.activeKey === 'describeKey') {
        this.activeKey = ''
        this.$nextTick(() => (this.activeKey = 'describeKey'))
      }
    },
    importTask (activityId) {
      this.selectTaskId = activityId
      this.excelDrawer = true
    },
    removeTask () {
      this.activityId = ''
    },
    addMessage (message) {
      this.messages.unshift(message)
      if (this.messages.length > 40) {
        this.messages.pop()
      }
    },
    logTaskUpdate (id, mode, task) {
      let text = (task && task.text ? ` (${task.text})` : '')
      let message = `Task ${mode}: ${id} ${text}`
      this.addMessage(message)
    },
    logLinkUpdate (id, mode, link) {
      let message = `Link ${mode}: ${id}`
      if (link) {
        message += ` ( source: ${link.source}, target: ${link.target} )`
      }
      this.addMessage(message)
    },
    onExcelClose () {
      this.excelDrawer = false
    },
    importExcelClosed () {
      this.excelDrawer = false
      console.log('收到保存回调！！！')
      this.$refs.activityTree.initGantt(this.activityInfoId)
    }
  }
}

</script>
