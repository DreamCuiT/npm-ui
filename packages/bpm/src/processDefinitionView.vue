<template>
  <list-layout>
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
      </div>
    </template>
  </list-layout>
</template>
<script>
import ListLayout from 'packages/listLayout'
import { Button } from 'element-ui'
import BpmnModeler from 'bpmn-js/lib/NavigatedViewer' // NavigatedViewer Viewer
export default {
  name: 'P8ProcessDefinition', // 流程定义view
  componentName: 'P8ProcessDefinition',
  components: {
    ListLayout,
    'el-button': Button
  },
  props: { // 方式一、方式二根据实际情况选其一传参
    processDefinitionKey: { // 方式一
      type: String
    },
    processDefinitionId: { // 方式二
      type: String
    }
  },
  data () {
    return {
      processDefinitionApi: 'PersonalProcessApproval.getProcessDefinitionByBusinessId', // 获取流程定义XMLApi
      bpmnModeler: null,
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
        container: '#bpmn-view-canvas'
      })
      this.getDefinitionXML()
    },
    getDefinitionXML () {
      const _this = this
      _this.$api[_this.processDefinitionApi]({
        processDefinitionKey: _this.processDefinitionKey,
        processDefinitionId: _this.processDefinitionId
      }).then(res => {
        let xml = res.data
        _this.createNewDiagram(xml)
      }).catch(function (err) {
        console.log('---getDefinitionXML-Err---', err)
      })
    },
    createNewDiagram (xml) {
      this.bpmnModeler.importXML(xml, (err) => {
        if (err) {

        } else {
          this.success()
        }
      })
    },
    success () {
      console.log('---createNewDiagram---success')
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
    }
  },
  watch: {
    processDefinitionKey: {
      handler: function (newV, oldV) {
        this.init()
      }
    },
    processDefinitionId: {
      handler: function (newV, oldV) {
        this.init()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .el-button i {
    font-size: 16px;
  }
  .bpmn-view-con {
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    .bpmn-view-canvas{
      float: left;
      width: 100%;
      height: 90%;
    }
  }
</style>
