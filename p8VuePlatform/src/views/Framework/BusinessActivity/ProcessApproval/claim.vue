<template>
    <div class="container">
        <div class="approveTitle">
            <el-row>
                <el-col :span="20" class="flex-left">
                    {{selectedApproval.processName}}{{selectedApproval.startTime}}
                </el-col>
                <el-col :span="4" class="flex-right">
                    <el-button type="primary" @click="handleSubmit">认领</el-button>
                </el-col>
            </el-row>

        </div>
        <div class="approveContent">
          <common-tabs class="custom-tabs" type="border-card" :activeTabs="activeTabs" :tabsData="tabs">
            <template #approval>
              <component :selectedApproval="selectedApproval" v-if="formComp != null && formComp != ''" :is="componentLoader"/>
            </template>
            <template #bpmn>
              <bpm-view v-if="selectedApproval.processDefId != ''"
                          :processObj="{
                            processDefinitionId:selectedApproval.processDefId,
                            processInstanceId:selectedApproval.processInstId
                          }"
                >
              </bpm-view>
            </template>
            <template #history>
              <ProcessHistoryList v-if="processInstId" :processInstId="processInstId" :businessKey="businessKey" :tableFlex="tableFlex"></ProcessHistoryList>
            </template>
          </common-tabs>
        </div>
    </div>
</template>

<script>
import { P8Form as FormList } from '~/index'
import { P8ProcessApproval as BpmView } from '~/index'
import { Row, Col, Button } from '~/index'
import { P8TreeSelect as TreeSelect } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import ProcessHistoryList from './processHistoryList'
import { P8Tabs as CommonTabs } from '~/index'
export default {
  name: 'claim',
  components: {
    TreeSelect,
    FormList,
    BpmView,
    'el-row': Row,
    'el-col': Col,
    'el-button': Button,
    CommonDialog,
    ProcessHistoryList,
    CommonTabs
  },
  props: {
    selectedApproval: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      businessId: '',
      formComp: '',
      processInstId: '',
      businessKey: '',

      tableFlex: 330,
      tabs: [
        {
          label: '审批内容',
          name: 'approval'
        },
        {
          label: '流程跟踪视图',
          name: 'bpmn'
        },
        {
          label: '审批历史',
          name: 'history'
        }
      ],
      activeTabs: 'approval'
    }
  },
  computed: {
    componentLoader () {
      let comp = this.formComp
      return () => import('@/views/' + comp)
    }
  },
  watch: {
    selectedApproval: {
      deep: true,
      handler: function (newV, oldV) {
        this.formComp = ''
        this.processInstId = newV.processInstId
        this.businessKey = newV.businessKey
        this.loadFormKey()
      }
    }
  },
  mounted () {
    this.processInstId = this.selectedApproval.processInstId
    this.businessKey = this.selectedApproval.businessKey
    this.loadFormKey()
  },
  methods: {
    handleSubmit (e) {
      let this_ = this
      let setApproveUser = { approveUserSet: [{ taskId: this.selectedApproval.processTaskId, userId: [ 'currentUserId' ] }] }

      this.$confirm(`认领后可在‘待审批’中进行审批操作，其它人则无法再认领。`, '提示', {
        confirmButtonText: '确定认领',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api['PersonalProcessApproval.setApproveUser'](setApproveUser).then(res => {
          this_.$emit('approved', this_.selectedApproval.processTaskId)
        })
      }).catch(() => {})
    },
    loadFormKey () {
      let this_ = this
      this.$api['PersonalProcessApproval.getApproveContentViewUrl']({ taskId: this.selectedApproval.processTaskId }).then(res => {
        let { url } = res
        if (url) {
          this_.formComp = url
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    $titleHeight: 50px;
    $paddingLeft: 10px;
    .container {
        height: 100%;

        .approveTitle {
            padding-left: $paddingLeft;
            height: $titleHeight;
            line-height: $titleHeight;
            border-bottom: 1px solid #EEEEF0;
        }

        .approveContent {
            height: calc(100% - #{$titleHeight} - 2px);
            overflow: auto;

            .contentTitle {
                border-bottom: 1px solid #EFEFEF;
                padding-left: $paddingLeft;
                height: 40px;
                width: 100%;
                background: #F5F7FA;
                line-height: 40px;
                font-size: 14px;
                box-sizing: border-box;
            }

            .contentBody {
                height: 500px;
            }

            .bpmnDiagram {
                height: 500px;
            }
        }
    }
    .custom-tabs.el-tabs--top {
      height: calc(100% - 93px) !important;
      border-top: 1px solid #DCDFE6;
      box-sizing: border-box;
      /deep/ .el-tabs__content {
        padding: 0;
      }
      /deep/ .el-tabs__nav-wrap {
        margin-bottom: 0;
      }
      /deep/ .el-tabs__nav.is-top {
        background: #F5F7FA;
      }
    }
</style>
