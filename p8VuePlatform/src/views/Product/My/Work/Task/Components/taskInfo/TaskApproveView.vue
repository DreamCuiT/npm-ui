<template>
  <div class="ele-steps-wrap">
    <div class="ele-steps-content">
      <VuePerfectScrollbar ref="scrollarea"
                           class="scroll-area"
                           :settings="scrollSetting">
        <div v-for="(item,index) in steps"
             :key="item.id"
             :id="`stepsBody${index}`"
             :ref="item.id"
             class="content-list-wrap"
             :class="{'activeAni':item.id === selectStepsId}">
          <div class="content-list-cont">
            <div class="classify">
              <el-tag style="width:65px"
                      v-if="item.id === 'activityDesc'">任务描述</el-tag>
              <el-tag style="width:65px"
                      v-if="item.id === 'output'">输出</el-tag>
            </div>
            <div class="list-con">
              <template v-if="item.id === 'activityDesc'">
                <task-pane-view :dataSource="dataSource"
                                :api="taskApi"
                                :apiParams="taskApiParams"></task-pane-view>
              </template>
              <template v-if="item.id === 'output'">
                <template v-if="outputIoData && outputIoData.length">
                  <div class="content-header">
                    <span v-for="item in header"
                          :key="item.id"
                          :class="'header ' + item.id">{{item.name}}</span>
                  </div>
                  <div v-for="citem in outputIoData"
                       :key="citem.aorId"
                       class="list-con-item">
                    <div class="list-con-item__content request">
                      <el-tooltip placement="top"
                                  :content="citem.aorName">
                        <span>{{citem.aorName}}</span>
                      </el-tooltip>
                    </div>
                    <div class="list-con-item__content remark">{{citem.aorDetail}}</div>
                    <div class="list-con-item__content remark">{{citem.aorOutputTypeDisp}}</div>
                    <div class="list-con-item__content file"
                         @click="downloadOutputRequsetFile(citem)">
                      <i class="el-icon-link"
                         style="font-size: 14px"></i>
                      <span>{{citem.attFileName}}</span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="no-info">
                    <span>暂无信息</span>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>

import TaskPaneView from './TaskPane'
import { getTaskStatusInfo } from '../../commonBusinessJs'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { Tooltip, Tag } from '~/index'
export default {
  name: 'TaskView',
  props: {
    selectedApproval: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    TaskPaneView,
    VuePerfectScrollbar,
    'el-tag': Tag,
    'el-tooltip': Tooltip
  },
  provide () {
    return {
      getPlanInfo: () => this.planInfo
    }
  },
  data () {
    const header = [
        { name: '', id: 'classify' },
        { name: '提交物名称', id: 'request' },
        { name: '补充说明', id: 'remark' },
        { name: '输出类型', id: 'outType' },
        { name: '附件', id: 'file' }
      ]
    const steps = [
        { name: '任务描述', id: 'activityDesc' },
        { name: '输出', id: 'output' }
      ]
    return {
      header,
      scrollSetting: {
        suppressScrollY: false
      },
      steps,
      selectStepsId: steps[0].id,
      dataSource: [
        {
          type: 'view',
          labelText: '项目:',
          fieldName: 'planName', // taskName
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '任务名称:',
          fieldName: 'name', // taskName
          colLayout: 'doubleCol'
        },
        {
          type: 'blank',
          labelText: '进度:',
          slotName: 'status',
          colLayout: 'singleCol'
        },
        {
          type: 'blank',
          labelText: '状态:',
          slotName: 'managerStatusDisplay',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '工期:',
          fieldName: 'duration',
          colLayout: 'doubleCol'
        },
        {
          type: 'blank',
          labelText: '超期/剩余天数:',
          slotName: 'durationDay',
          colLayout: 'doubleCol'
        },
        {
          type: 'blank',
          labelText: '完成百分比:',
          slotName: 'progress',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '预测起始日期:',
          fieldName: 'forecastDate',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '计划起始日期:',
          fieldName: 'planDate',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '实际起始日期:',
          fieldName: 'realDate',
          colLayout: 'doubleCol'
        },
        {
          type: 'blank',
          labelText: '',
          slotName: 'dateline',
          colLayout: '',
          formItemConfig: {
            'label-width': '0px'
          }
        }
      ],
      outputIoData: null,
      taskApi: 'taskManager.taskInfo',
      taskApiParams: {},
      planInfo: {},
      outputApi: 'taskManager.getOutputIo'
    }
  },
  mounted () {
    this.getAllStatusOptions()
  },
  methods: {
    getAllStatusOptions () {
      let _this = this
      getTaskStatusInfo({ currentStatus: 'all' }).then(data => {
        _this.allStatus = data
        _this.taskApiParams.taskId = _this.selectedApproval.businessKey
        _this.planInfo = { allStatus: _this.allStatus, ..._this.taskApiParams }
        _this.$api[this.outputApi]({ taskId: _this.selectedApproval.businessKey }).then(res => {
          _this.outputIoData = res
        })
      })
    },
    downloadOutputRequsetFile (item) {
      if (item.attId) {
        this.$api['SystemSettings.getFileUrl']({ attachmentId: item.attId }, { responseType: 'blob' }).then(backJson => {
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(new Blob([backJson.data]))
          link.download = item.attFileName
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        }).finally(() => {
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  $borderBottomLine: 1px solid #efefef;
  $fixedWidth: 130px;
  $fixedHeaderHeight: 40px;
  $fixedListHeight: 40px;
  $blue-color: #1b8af9;
  .ele-steps-wrap {
    height: 100%;
    box-sizing: border-box;
    position: relative;
    // padding-left: 180px;
    .ele-steps-slider {
      box-sizing: border-box;
      position: absolute;
      left: 0;
      top: 0;
      width: 180px;
      height: 100%;
      // padding-top: $fixedHeaderHeight;
      .ele-steps-slider__ul {
        // padding-left: 40%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        li {
          position: relative;
          width: 40%;
          margin: 0 auto 10px 30px;
          height: 28px;
          line-height: 28px;
          background: #e3f2fd;
          cursor: pointer;
          text-align: center;
          &.active {
            background: #1565c0;
            color: #ffffff;
            &::after {
              border-color: transparent transparent transparent #1565c0;
            }
          }
          &::after {
            content: '';
            border-width: 14px;
            border-color: transparent transparent transparent #e3f2fd;
            border-style: solid;
            position: absolute;
            right: -58%;
            transform: translate(-50%, -50%);
            top: 50%;
          }
        }
      }
    }
    .ele-steps-content {
      height: 100%;
      overflow: hidden;
      .content-header {
        height: $fixedHeaderHeight;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        border-bottom: $borderBottomLine;
        font-weight: bolder;
        color: #909399;
        span.header {
          line-height: $fixedHeaderHeight;
          flex: 1.5;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          padding: 0 4px;
          box-sizing: border-box;
        }
        span.header.file {
          flex: 1;
        }
        span.header.classify,
        span.header.operation {
          flex: 0 0 $fixedWidth;
          text-align: center;
        }
      }
      .scroll-area {
        height: calc(100% - #{$fixedHeaderHeight});
        .content-list-wrap.activeAni {
          animation: activeAni 1s ease;
        }
        @keyframes activeAni {
          to {
            background-color: #e7f3ff;
          }
        }
        .content-list-cont {
          display: flex;
          box-sizing: border-box;
          div.classify,
          div.operation {
            position: relative;
            flex: 0 0 $fixedWidth;
            text-align: center;
            box-sizing: border-box;
            padding: 0 4px;
            border-bottom: $borderBottomLine;
          }
          div.classify span {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          div.operation .btn-con {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
          }
          div.list-con {
            width: calc(100% - #{$fixedWidth * 2});
            .list-con-item {
              display: flex;
              align-items: center;
              height: 40px;
              box-sizing: border-box;
              border-bottom: $borderBottomLine;
              div.list-con-item__content {
                flex: 1.5;
                box-sizing: border-box;
                padding: 0 4px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                &.file {
                  flex: 1;
                  cursor: pointer;
                }
              }
            }
          }
          div.no-info {
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #efefef;
            color: #909399;
          }
        }
      }
    }
  }
  /deep/ .manager-drawer .el-drawer__header {
    padding: 11px;
  }
</style>
