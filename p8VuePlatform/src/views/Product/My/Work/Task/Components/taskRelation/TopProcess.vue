<template>
  <div class="process-wrap">
    <div class="process-tabs">
      <el-radio-group size="mini" v-model="radioActive">
        <el-radio-button v-for="item in tabs" :key="item.name" border :disabled="item.disabled" :label="item.label"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="process-content">
      <div id="processCanvasDiv">
        <!-- <span>{{content}}</span> -->
      </div>
    </div>
  </div>
</template>
<script>
import go from 'p8-gojs'
import { DoubleTreeLayout } from '../../gojsLayout/DoubleTreeLayout'
import { gm, GraohicsMode } from '@/assets/commonJS/outputFlow/graphicsMode' // , GraohicsMode
import { RadioGroup, RadioButton } from '~/index'
export default {
  name: 'Process',
  inject: ['getPlanInfo'],
  components: {
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton
  },
  data () {
    return {
      tabs: [
        {
          label: '流程图'
        },
        {
          label: '树状图'
        },
        {
          label: '更多流程',
          disabled: true
        }
      ],
      radioActive: '流程图',
      processData: []
    }
  },
  watch: {
    radioActive (v) {
      // this.content = v
    }
  },
  mounted () {
    this.getProcessData()
  },
  methods: {
    getProcessData () {
      const _this = this
      const taskId = this.getPlanInfo().taskId
      const api = 'taskManager.getGojsData' // getGojsData
      this.$api[api]({ taskId }).then(res => {
        // console.log('getGojsData', res)
        // _this.processData = res
        let nodes = res.nodes
        let nodeRoot = nodes.filter(item => !item.parent)
        let topNode = null
        let bottomNode = null
        nodes.forEach((item, index) => {
          if (item.parent === nodeRoot[0].taskId) {
            if (item.dir === 'top') {
              topNode = item
            } else if (item.dir === 'bottom') {
              bottomNode = item
            }
          }
        })
        if (!topNode && !bottomNode) {
          _this.processData = nodeRoot
        } else if (topNode && bottomNode) {
          _this.processData = [topNode, nodeRoot[0], bottomNode]
        } else {
          if (!topNode) {
            _this.processData = [nodeRoot[0], bottomNode]
          }
          if (!bottomNode) {
            _this.processData = [topNode, nodeRoot[0]]
          }
        }
        this.$bus.$emit('selectProcess', nodeRoot[0])
        _this.init()
      })
    },
    init () {
      const _this = this
      let myDiagram = gm(go.Diagram, 'processCanvasDiv', {
        maxSelectionCount: 1, // 每次只能操作一个node
        validCycle: go.Diagram.CycleDestinationTree,
        isReadOnly: true, // 是否禁用编辑
        // layout: GraohicsMode.defaultLayout(direction),
        layout: gm(DoubleTreeLayout, {
          directionFunction: function (n) { return n.data && n.data.dir !== 'top' },
          vertical: true
        }),
        'ChangedSelection': _this.onSelectionChanged, // 选中事件
        'undoManager.isEnabled': false, // 撤销
        'commandHandler.canDeleteSelection': _this.beforeDelete
      })
      // （除backspace（键盘删除键）外）禁止所有键盘事件
      myDiagram.commandHandler.doKeyDown = GraohicsMode.closedKeyDown(myDiagram)
      // define all of the gradient brushes
      var graygrad = gm(go.Brush, 'Linear', { 0: '#F5F5F5', 1: '#F1F1F1' })
      myDiagram.nodeTemplate =
        gm(go.Node, 'Auto',
          {
            isShadowed: false // 阴影
          },
          gm(go.Shape, 'RoundedRectangle',
            { fill: graygrad, stroke: '#D8D8D8', width: 120, height: 50 } // default fill is gray
            // new go.Binding('fill', 'color')
          ),
          gm(go.Picture, {
            name: 'Picture',
            desiredSize: new go.Size(16, 16),
            alignment: new go.Spot(0, 0, 0, 0),
            opacity: 1.0
          },
          new go.Binding('source', 'planType', GraohicsMode.findPicture)
          ),
          // node属性定义
          gm(go.Panel, 'Table', {
            minSize: new go.Size(120, NaN),
            maxSize: new go.Size(90, NaN),
            margin: new go.Margin(5, 5, 0, 20),
            defaultAlignment: go.Spot.Left
          },
          gm(go.RowColumnDefinition, { row: 4, column: 2, width: 4 }),
          gm(go.TextBlock,
            { margin: 0, font: 'bold 11px Helvetica, bold Arial, sans-serif', alignment: go.Spot.Center },
            { row: 1, column: 0 },
            new go.Binding('text', 'name'))
          )
        )
      myDiagram.linkTemplate = gm(go.Link,
        { selectable: false, relinkableFrom: true, relinkableTo: true, toShortLength: 5 },
        gm(go.Shape, { stroke: '#0b12e2', strokeWidth: 2 }),
        gm(go.Shape, { toArrow: 'OpenTriangle', stroke: '#0b12e2', strokeWidth: 2 })
      )

      myDiagram.model = new go.TreeModel(this.processData)
    },
    onSelectionChanged (e) {
      let node = e.diagram.selection.first()
      if (node instanceof go.Node) {
        let data = node.data
        this.$bus.$emit('selectProcess', data)
      }
    }
  }
}
</script>
<style lang="scss">
$bule-color: #1890ff;
.process-wrap {
  height: 100%;
  padding: 6px 0;
  box-sizing: border-box;
  .process-tabs {
    height: 32px;
    box-sizing: border-box;
    padding: 0 8px;
  }
  .process-content {
    height: calc(100% - 32px);
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #efefef
  }
  #processCanvasDiv {
    width: 100%;
    height: 100%;
  }
}
</style>
