<template>
  <list-layout class="custom-list-layout">
    <template #north>
      <div style="float: right;">
        <el-button style="font-size: 16px; padding: 6px" type="primary" size="mini" @click="zoom('large')" icon="el-icon-zoom-in"></el-button>
        <el-button style="font-size: 16px; padding: 6px" type="primary" size="mini" @click="zoom('small')" icon="el-icon-zoom-out"></el-button>
        <el-button style="font-size: 16px; padding: 6px" type="primary" size="mini" @click="zoom('reset')" icon="el-icon-refresh-left"></el-button>
      </div>
    </template>
    <template #center>
      <div class="bpmn-view-con">
        <div id="bpmn-view-canvas" class="bpmn-view-canvas" ref="bpmn-view-canvas"></div>
        <ul class="bpmn-tip-left">
          <!-- <li v-for="item in BpmnObject.bpmnIcons" :key="item.icon">
            <span> <i :class="item.icon"></i>&nbsp;{{item.text}} </span>
          </li> -->
        </ul>
        <ul class="bpmn-tip-right">
          <li v-for="item in BpmnObject.customStyle" :key="item.color">
            <span> <i class="p8 icon-center-layout" :style="{background: item.color, color: item.color, borderRadius: '4px'}"></i>&nbsp;{{item.desc}} </span>
          </li>
        </ul>
      </div>
    </template>
  </list-layout>
</template>
<script>
import ListLayout from 'packages/listLayout'
import { Button } from 'element-ui'
import BpmnModeler from 'bpmn-js/lib/NavigatedViewer' // NavigatedViewer Modeler  Viewer
import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg'
import BpmnObject from '../components/bpmJS'
export default {
  name: 'P8ProcessApproval', // 流程审批view
  componentName: 'P8ProcessApproval',
  components: {
    ListLayout,
    'el-button': Button
  },
  props: { // 方式一、方式二根据实际情况选其一传参
    businessObj: { // 方式一需要的参数对象
      type: Object,
      default () {
        return {
          businessId: '', // 方式一：这里赋值-->业务Id
          processDefinitionKey: ''// 方式一：这里赋值-->流程定义Key
        }
      }
    },
    processObj: { // 方式二需要的参数对象
      type: Object,
      default () {
        return {
          processDefinitionId: '', // 方式二：这里赋值-->流程定义Id
          processInstanceId: ''// 方式二：这里赋值-->流程定义实例Id
        }
      }
    }
  },
  data () {
    return {
      BpmnObject,
      processApprovalApi: 'PersonalProcessApproval.getProcessDefinitionByBusinessId', // 获取流程审批XMLApi
      approvalApi: 'PersonalProcessApproval.approvalInfos', // 获取审批信息Api
      approvalUsersApi: 'PersonalProcessApproval.getApproveUsers', // 获取流程实例的预先审批人
      bpmnModeler: null,
      overlays: null,
      overlaysInfo: [], // 已经执行过的节点
      approvalInfo: [], // 已经执行过的节点中的 userTask节点
      currentActivityList: [], // 当前节点
      approveUsersInfo: null, // 预先审批人数据
      canvasScale: 1
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.bpmnModeler && this.bpmnModeler instanceof BpmnModeler) {
        this.bpmnModeler.destroy()
      }
      this.bpmnModeler = new BpmnModeler({
        container: '#bpmn-view-canvas',
        bpmnRenderer: {
          defaultStrokeColor: '#606266'
        }
      })
      this.getApprovalXML()
    },
    getApprovalXML () {
      const _this = this
      let param = {
        ..._this.businessObj,
        ..._this.processObj
      }
      _this.$api[_this.processApprovalApi](param).then(res => {
        let xml = res.data
        _this.createNewDiagram(xml)
      }).catch(function (err) {
        console.log(`getApprovalXML: error-${err}`)
      })
    },
    async getApproveUsers () {
      const _this = this
      let param = {
        ..._this.businessObj,
        processInstId: _this.processObj.processInstanceId
      }
      let res = await _this.$api[_this.approvalUsersApi](param)
      if (res && res.result) {
        _this.approveUsersInfo = res.data
      } else {
        console.log(`getApproveUsers: ${res.errorMsg}`)
      }
    },
    async getApprovalInfo () {
      const _this = this
      let param = {
        ..._this.businessObj,
        ..._this.processObj
      }
      let res = await _this.$api[_this.approvalApi](param)
      this.$emit('getIsWarnApprove', res.isWarnApprove)
      if (res && res.approvalInfo && res.approvalInfo.length) {
        _this.approvalInfoHandle(res)
      }
    },
    /**
     * @function 审批信息接口返回的数据筛选方法
     *
     * @description
     *    1. 先过滤掉 userTask类型且审批结果(yesOrNo)为false的数据
     *       此时需根据当前的 taskId 先在 approvalInfo 中过滤出taskId相同的数据, 判断有没有审批结果(yesOrNo)有值的, 有则不需要过滤当前taskId节点的前一个节点(不含线Flow)
     *    2. 获取 approvalInfo 中剩余的 userTask类型的数据 / 并过滤掉 与 beforeSourceIds中相匹配的数据(以taskId判断)
     */
    approvalInfoHandle (res) {
      let { approvalInfo, currentActivityList } = res
      const currentActivityListTaskIds = currentActivityList.map(current => {
        return current.taskDefKey
      })
      let beforeSourceIds = []
      let userTaskList = []
      let approvalInfoTemp = []
      approvalInfo.forEach((approval, approvalIndex) => {
        if (currentActivityListTaskIds.indexOf(approval.taskId) > -1) {
          if (!approval.yesOrNo) {
            approvalInfoTemp.push(approval)
          }
        } else {
          if (!approval.yesOrNo && approval.actType === 'userTask') {
            let alikeApprovalByTaskId = approvalInfo.filter(aitem => aitem.taskId === approval.taskId)
            let isDeleteBeforeSource = true
            alikeApprovalByTaskId.forEach(alikeApp => {
              if (alikeApp.yesOrNo) {
                isDeleteBeforeSource = false
              }
            })
            if (isDeleteBeforeSource) {
              beforeSourceIds = beforeSourceIds.concat(this.getUserTaskBeforeSource(approval.taskId))
            }
          } else {
            approvalInfoTemp.push(approval)
          }
        }
      })
      let approvalInfoTemp2 = []
      approvalInfoTemp.forEach((approval, approvalIndex) => {
        if (approval.actType === 'userTask') {
          userTaskList.push(approval)
          // 去除 approveUsersInfo (预先审批人) 数据中 重复id的数据
          if (this.approveUsersInfo && this.approveUsersInfo[approval.taskId]) {
            delete this.approveUsersInfo[approval.taskId]
          }
        }
        if (beforeSourceIds.length) {
          beforeSourceIds.forEach(beforeId => {
            if (approval.taskId !== beforeId) {
              approvalInfoTemp2.push(approval)
            }
          })
        } else {
          approvalInfoTemp2.push(approval)
        }
      })
      this.approvalInfo = userTaskList
      this.overlaysInfo = approvalInfoTemp2
      this.currentActivityList = currentActivityList || []
    },
    /**
     * @function 获取userTask节点的前一个节点
     * @return array
     * @param elementId: taskId
     */
    getUserTaskBeforeSource (elementId) {
      let canvas = this.bpmnModeler.get('canvas')
      const childElement = canvas ? canvas._rootElement.children : []
      let sourceIds = []
      if (childElement.length) {
        const eleSource = childElement.filter(ele => ele.id === elementId)
        if (eleSource.length) {
          eleSource[0].incoming.forEach(incoming => {
            if (incoming.type === 'bpmn:SequenceFlow') {
              sourceIds.push(incoming.source.id)
            }
          })
        }
      }
      return sourceIds
    },
    async getApproveDataInit () {
      await this.getApproveUsers()
      await this.getApprovalInfo()
      await this.success()
    },
    async createNewDiagram (xml) {
      let this_ = this
      this.bpmnModeler.importXML(xml, (err) => {
        if (err) {

        } else {
          this_.getApproveDataInit()
        }
      })
    },
    async success () {
      this.getOverlays()
      // this.handleElementStyle()
      this.changeEleStyle()
      this.customBpmnListener()
      this.customFlowArrow()
    },
    getOverlays () {
      this.overlays = this.bpmnModeler.get('overlays') // 审批信息悬浮面板控制
    },
    handleElementStyle () {
      if (this.overlaysInfo.length === 0) {
        return false
      }
      const elements = this.bpmnModeler._definitions.rootElements // 获取面板全部元素
      if (!elements.length) {
        return
      }
      const processElement = elements.filter(item => item.$type === 'bpmn:Process')
      if (!processElement.length) {
        return
      }
      const _this = this
      for (let i = 0; i < processElement[0].flowElements.length; i++) {
        for (let j = 0; j < this.overlaysInfo.length; j++) {
          let iItem = processElement[0].flowElements[i]
          let jItem = this.overlaysInfo[j]
          if (iItem.id === jItem.taskId && iItem.$type === 'bpmn:UserTask') {
            _this.overlaysMask(iItem.id, jItem.status)
          }
        }
      }
    },
    customBpmnListener () { // 原生JS监听-审批信息展示与隐藏
      const _this = this
      const djsOverlays = document.querySelectorAll('.djs-overlays')
      for (let i = 0; i < djsOverlays.length; i++) {
        djsOverlays[i].addEventListener('mouseenter', _this.mouseenterListener)
        djsOverlays[i].addEventListener('mouseleave', _this.mouseleaveListener)
      }
    },
    mouseenterListener (e) {
      const shapeId = e.target.getAttribute('data-container-id')
      this.showApprovalPane(shapeId)
      this.showApprovalUserPane(shapeId)
    },
    mouseleaveListener (e) {
      const shapeId = e.target.getAttribute('data-container-id')
      if (this.approvalInfo && this.approvalInfo.length) {
        this.hideApprovalPane(shapeId)
      }
      if (this.approveUsersInfo) {
        this.hideApprovalPane(shapeId)
      }
    },
    showApprovalPane (elementId) { // 展示审批信息
      const _this = this
      if (_this.approvalInfo && _this.approvalInfo.length) {
        let filterApproval = _this.approvalInfo.filter(item => item.taskId === elementId)
        let renderApproval = []
        if (filterApproval.length) {
          filterApproval = filterApproval.map(item => {
            item.approvalTimeMillisecond = new Date(item.approvalTime).getTime()
            return item
          })
          let filterApprovalTemp = filterApproval.filter(item => item.userName === filterApproval[0].userName)
          if (filterApprovalTemp.length === filterApproval.length) {
            // 说明不是会签节点
            let maxTime = Math.max.apply(Math, filterApproval.map((item, index) => {
                return item.approvalTimeMillisecond
            }))
            renderApproval = filterApproval.filter(item => item.approvalTimeMillisecond === maxTime)
          } else {
            renderApproval = filterApproval
          }
        }
        if (renderApproval && renderApproval.length) {
          const overlaysDomBegin = '<div class="diagram-note">'
          const overlaysDomEnd = '</div>'
          let overlaysDomBody = ''
          renderApproval.forEach(approval => {
            overlaysDomBody += `
              <div style="padding: 4px 6px;">
                <span style="display: ${approval.userName ? 'inline-block' : 'none'}">
                  <span>审批人: </span>
                  <span>${approval.userName};</span>
                </span>
                <span style="display: ${approval.opinion ? 'inline-block' : 'none'}">
                  <span>审批意见: </span>
                  <span>${approval.opinion};</span>
                </span>
                <span style="display: ${approval.conclusion ? 'inline-block' : 'none'}">
                  <span>审批结论: </span>
                  <span>${approval.yesOrNo};</span>
                </span>
              </div>
            `
          })
          _this.overlays.add(elementId, 'note', {
            position: {
              bottom: -10,
              right: 100
            },
            html: `${overlaysDomBegin}${overlaysDomBody}${overlaysDomEnd}`
          })
        }
      }
    },
    hideApprovalPane (elementId) { // 隐藏审批信息, 并重新添加蒙版
      const _this = this
      _this.overlays.remove({ element: elementId })
      _this.overlaysMask(elementId)
    },
    showApprovalUserPane (elementId) {
      if (this.approveUsersInfo) {
        let approvalUser = this.approveUsersInfo[elementId]
        if (approvalUser) {
          let approvalUserType = Object.prototype.toString.call(approvalUser)
          let approvalUserNames = ''
          if (approvalUserType === '[object Object]') {
            approvalUserNames = approvalUser.name
          } else if (approvalUserType === '[object Array]') {
            approvalUserNames = approvalUser.map(user => {
              return user.name
            }).join(';')
          }
          let overlaysDom = `
            <div class="diagram-note">
              <div style="padding: 4px 6px;">
                <span style="display: inline-block">
                  <span>预先审批人: </span>
                  <span>${approvalUserNames}</span>
                </span>
              </div>
            </div>
          `
          this.overlays.add(elementId, 'note', {
            position: {
              bottom: -10,
              right: 100
            },
            html: overlaysDom
          })
        }
      }
    },
    overlaysMask (shapeId) { // 审批信息节点蒙版[根据状态填充背景]
      const elementRegistry = this.bpmnModeler.get('elementRegistry') // 根据id获取对应元素
      let element = elementRegistry.get(shapeId)
      let maskDom = `
        <div style="width: ${element.width}px;
          height: ${element.height}px;
          background: transparent;
          border-radius: 10px;
          cursor: pointer"></div>
      `
      this.overlays.add(element.id, 'note', {
        position: {
          top: 0,
          left: 0
        },
        html: maskDom
      })
    },
    zoom (type) {
      let _this = this
      switch (type) {
        case 'large':
          _this.canvasScale += 0.2
          break
        case 'small':
          _this.canvasScale -= 0.2
          break
        case 'reset':
          _this.canvasScale = 1
          break
      }
      this.bpmnModeler.get('canvas').zoom(_this.canvasScale)
    },
    changeEleStyle () {
      let canvas = this.bpmnModeler.get('canvas')
      const childElement = canvas ? canvas._rootElement.children : []
      if (!childElement.length) {
        return false
      }
      // bpmn:UserTask
      // eslint-disable-next-line
      const userTask_ele = childElement.filter(ele => ele.type === 'bpmn:UserTask')
      if (userTask_ele.length) {
        userTask_ele.map(ele => {
          this.overlaysMask(ele.id)
        })
      }
      // bpmn:EndEvent
      // eslint-disable-next-line
      const end_ele = childElement.filter(ele => ele.type === 'bpmn:EndEvent')
      if (end_ele.length) {
        end_ele.map(ele => {
          canvas.addMarker(ele.id, 'custom-end')
        })
      }

      this.approvalEleStyleHandle(canvas, childElement)
      this.flowEleStyleHandle(canvas, childElement)
    },
    approvalEleStyleHandle (canvas, childElement) {
      if (this.overlaysInfo && this.overlaysInfo.length) {
        // 元素节点id集合 - 对应接口的taskId
        const childElementIds = childElement.map(ele => {
          return ele.id
        })
        this.overlaysInfo.forEach(info => {
          if (childElementIds.indexOf(info.taskId) > -1) {
            const currentActivityIds = this.currentActivityList.map(info => {
              return info.taskDefKey
            })
            if (currentActivityIds.indexOf(info.taskId) > -1) {
              // 通过taskId, 给相对应的元素的添加高亮class类名,再通过css填充高亮色
              canvas.addMarker(info.taskId, `custom-${info.actType}-current`)
            } else {
              // if ((info.actType === 'userTask' && info.yesOrNo) || (info.actType !== 'userTask' && !info.yesOrNo)) {
                canvas.addMarker(info.taskId, `custom-${info.actType}`)
              // }
            }
          }
        })
      }
    },
    /**
     * @function flowStyle: 设置已走过线条的色值
     */
    flowEleStyleHandle (canvas, childElement) {
      /**
       * childElementFlows: 获取元素节点中 线的集合
       * flowSourceIds: 根据线集合, 获取线的源头节点的id集合
       * flowTargetIds: 根据线集合, 获取线的目标节点的id集合
       */
      const childElementFlows = childElement.filter(ele => ele.type === 'bpmn:SequenceFlow')
      const flowSourceIds = childElementFlows.map(flow => {
        return flow.source.id
      })
      const flowTargetIds = childElementFlows.map(flow => {
        return flow.target.id
      })
      const overlaysInfoTaskIds = this.overlaysInfo.map(item => {
        return item.taskId
      })
      const currentActivityIds = this.currentActivityList.map(info => {
        return info.taskDefKey
      })
      flowSourceIds.forEach(sourceId => {
        if (overlaysInfoTaskIds.indexOf(sourceId) > -1) {
          if (currentActivityIds.indexOf(sourceId) > -1) {
            flowTargetIds.forEach((targetId, targetIndex) => {
              if (currentActivityIds.indexOf(targetId) > -1) {
                canvas.addMarker(childElementFlows[targetIndex].id, `custom-flow-current`)
              } else if (overlaysInfoTaskIds.indexOf(targetId) > -1) {
                canvas.addMarker(childElementFlows[targetIndex].id, `custom-flow-end`)
              }
            })
          } else {
            flowTargetIds.forEach((targetId, targetIndex) => {
              if (overlaysInfoTaskIds.indexOf(targetId) > -1) {
                canvas.addMarker(childElementFlows[targetIndex].id, `custom-flow-end`)
              }
            })
          }
        }
      })
    },
    customFlowArrow () {
      this.BpmnObject.customStyle.forEach(i => {
        const marker = svgCreate('marker')
        svgAttr(marker, {
          id: `custom-flow-${i.id}-arrow`,
          viewBox: '0 0 20 20',
          refX: '11',
          refY: '10',
          markerWidth: '10',
          markerHeight: '10',
          orient: 'auto'
        })
        const path = svgCreate('path')
        svgAttr(path, {
          d: 'M 1 5 L 11 10 L 1 15 Z',
          style: ` stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; fill: ${i.color}; stroke: ${i.color} `
        })
        const defs = document.querySelector('defs')
        svgAppend(marker, path)
        svgAppend(defs, marker)
      })
    }
  },
  watch: {
    businessObj: {
      deep: true,
      handler: function (newV, oldV) {
        this.init()
      }
    },
    processObj: {
      deep: true,
      handler: function (newV, oldV) {
        this.init()
      }
    }
  }
}
</script>
<style lang="scss">
  @import '../components/custom.style.scss';
  .bpmn-view-con {
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    .bpmn-view-canvas{
      float: left;
      width: 100%;
      height: 90%;
    }
    .bpmn-tip-left, .bpmn-tip-right {
      position: absolute;
      top: 0;
      padding: 10px;
      li {
        padding: 4px 0;
        span {
          display: flex;
        }
      }
    }
    .bpmn-tip-left {
      left: 0;
    }
    .bpmn-tip-right {
      right: 0;
    }
  }
  .diagram-note {
    width: 300px;
    min-height: 40px;
    border-radius: 6px;
    background-color: rgba(6, 161, 252, 0.2);
    box-sizing: border-box;
    .diagram-note-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 4px 0;
      line-height: 30px;
      border-bottom: 1px solid #fafafa;
      &.title {
        font-size: 14px;
      }
      span:nth-child(1) {
        width: 25%;
        padding: 0 4px;
        text-align: right;
      }
      span:nth-child(2) {
        width: 75%;
        padding: 0 4px;
      }
    }
  }
</style>
