<template>
  <list-layout>
    <template #north>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
    <template #center>
      <div class="bpmn-edit-con">
        <div id="bpmn-edit-canvas" class="bpmn-edit-canvas" ref="bpmn-edit-canvas"></div>
        <div ref="propertiesPanel" class="properties-panel-parent" id="properties-panel"></div>
      </div>
    </template>
  </list-layout>
</template>
<script>
import ListLayout from 'packages/listLayout'
import { Button } from 'element-ui'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import customTranslate from '../components/customTranslate/customTranslate'
import { defaultXML } from '../components/defaultXML'
export default {
  name: 'P8Bpm',
  componentName: 'P8Bpm',
  props: {
    api: {
      type: String,
      default: ''
    },
    bpmId: {
      type: String || Number
    },
    bpmName: {
      type: String
    }
  },
  components: {
    ListLayout,
    'el-button': Button
  },
  data () {
    return {
      bpmnModeler: null,
      id: null,
      name: null
    }
  },
  mounted () {
    this.id = this.bpmId
    this.name = this.bpmName
    this.init()
  },
  methods: {
    getInfo () {
      let _this = this
      if (this.api) {
        this.$api[this.api]({ id: this.bpmId }).then(function (res) {
          console.log('---res---', res)
          let xml = res.data || defaultXML
          console.log('---xml---', xml)
          _this.createNewDiagram(xml)
        }).catch(function (err) {
          console.log('---err---', err)
        })
      } else {
        _this.createNewDiagram(defaultXML)
      }
    },
    init () {
      // 将汉化包包装成一个模块
      const customTranslateMolude = {
        translate: ['value', customTranslate]
      }
      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: '#bpmn-edit-canvas',
        // 添加控制板
        propertiesPanel: {
          parent: '#properties-panel'
        },
        additionalModules: [
          // 右边的属性栏
          propertiesProviderModule,
          propertiesPanelModule,
          // 汉化模块
          customTranslateMolude
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })
      this.getInfo()
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
      this.addBpmnListener()
    },
    /**
     * 监听 给图绑定事件，当图有发生改变就会触发这个事件
     */
    addBpmnListener () {
      const _this = this
      this.bpmnModeler.on('selection.changed', e => {
        const element = e.newSelection[0]
        console.log('----selection.changed----', element)
      })
      //  监听节点属性变化
      this.bpmnModeler.on('element.changed', (e) => {
        const { element } = e
        console.log('----element.changed----', element)
        var elementRegistry = _this.bpmnModeler.get('elementRegistry')
        var startEventElement = elementRegistry.get(element.id)
        var startEvent = startEventElement.businessObject
        console.log('---element.changed--name--', startEvent.name)
        _this.id = startEvent.id
        _this.name = startEvent.name
      })
    },
    saveDiagram (done) {
      this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        done(err, xml)
      })
    },
    /**
     * 保存按钮
     */
    save () {
      const _this = this
      this.bpmnModeler.saveXML({ format: true }).then(function (res, err) {
        if (err) {
          console.log('--按钮保存Err--', err)
        } else {
          // console.log('--按钮保存XML--', res)
          res.id = _this.id
          res.name = _this.name
          _this.$emit('save', res)
        }
      })
    }
  }
}
</script>
<style lang="scss">
  // 左边工具栏以及编辑节点的样式
  @import '~bpmn-js/dist/assets/diagram-js.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  // 右边工具栏样式
  @import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
  .bpmn-edit-con {
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    .bpmn-edit-canvas{
      float: left;
      width: 85%;
      height: 90%;
    }
    .properties-panel-parent {
      box-sizing: border-box;
      float: left;
      width:15%;
      height: 90%;
      border:1px solid #000;
      overflow-y: auto;
    }
  }
  * {
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background-color: hsla(220, 4%, 58%, 0.3);
      transition: background-color 0.3s;

      &:hover {
        background: #bbb;
      }
    }

    &::-webkit-scrollbar-track {
      background: #ededed;
    }
  }
</style>
