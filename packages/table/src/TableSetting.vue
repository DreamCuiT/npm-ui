<template>
  <p8-dialog title="表格设置"
    v-if="visible"
    :visible="visible"
    :width="dialogWidth"
    :dialogHeight="dialogHeight"
    :dialogConfig="dialogConfig"
    @handle-cancel="close"
    @handle-ok="save"
    @close="close">
      <template #dialog>
        <vue-perfect-scrollbar class="setting-wrap">
          <div class="columns">
            <div class="title">
              <span>列设置</span>
              <el-tooltip placement="right" content="勾选控制Table列显示隐藏; 拖拽控制Table列顺序">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
            <draggable
              class="list-group"
              tag="ul"
              v-model="initialColumns"
              v-bind="dragOptions"
              :move="checkDraggableMove"
              @start="drag = true"
              @end="drag = false"
              @change="draggableChangeHandle"
            >
                  <li class="list-group-item" v-for="(item,index) in initialColumns" :key="item.dataIndex || item.type">
                    <span class="icon-rank"><i class="el-icon-rank"></i></span>
                    <el-checkbox :disabled="item.type && item.type !== 'index'" :checked="item.isshow" @change="checkedHandle(index)">
                      <span v-if="item.type && item.type !== 'index' ">{{item.type}}</span>
                      <span v-else>{{item.title}}</span>
                    </el-checkbox>
                    <span class="fixed-select">
                      <el-radio-group size="mini" v-model="tableSettings[index].fixed" @change="radioChangeHandle(index, tableSettings[index].fixed)">
                        <el-radio-button label="left">左侧固定</el-radio-button>
                        <el-radio-button :label="false">滚动区域</el-radio-button>
                        <el-radio-button label="right">右侧固定</el-radio-button>
                      </el-radio-group>
                    </span>
                  </li>
            </draggable>
          </div>
        </vue-perfect-scrollbar>
      </template>
    </p8-dialog>
</template>
<script>
import P8Dialog from '../../dialog/index'
import draggable from 'vuedraggable'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { Tooltip, Checkbox, RadioButton, RadioGroup } from 'element-ui'
export default {
  name: 'TableSetting',
  components: {
    P8Dialog,
    draggable,
    VuePerfectScrollbar,
    'el-tooltip': Tooltip,
    'el-checkbox': Checkbox,
    'el-radio-button': RadioButton,
    'el-radio-group': RadioGroup
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  data () {
    return {
      dialogWidth: '300px',
      dialogHeight: 200,
      dialogConfig: {
        'append-to-body': true
      },
      drag: false,
      initialColumns: [],
      tableSettings: []
    }
  },
  watch: {
    columns: {
      handler (val) {
        const that = this
        if (val && val.length) {
          that.render()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    console.log('this.$route.path', this.$route.path)
    this.initDialogWH()
    // this.render()
  },
  methods: {
    initDialogWH () {
      const ch = document.documentElement.clientHeight
      const cw = document.documentElement.clientWidth
      this.dialogHeight = ch * 0.5
      this.dialogWidth = cw * 0.5 + 'px'
    },
    render () {
      this.tableSettings = []
      this.initialColumns = this.columns.map(item => {
        let tempObj = {
          isshow: item.isshow,
          fixed: item.fixed,
          dataIndex: item.dataIndex || null,
          type: item.type || null
        }
        this.tableSettings.push(tempObj)
        return item
      })
    },
    checkedHandle (index) { // 手动处理原因[未使用 v-model 绑定 checkbox' v-model绑定时,值改变会立即体现到Table上(但不想这样体现),]
      this.tableSettings[index].isshow = !this.tableSettings[index].isshow
    },
    checkDraggableMove (evt) {
      let currIndex = evt.draggedContext.index
      if (this.tableSettings[currIndex].fixed || (this.tableSettings[currIndex].type && this.tableSettings[currIndex].type !== 'index')) {
        return false
      }
      // if (this.tableSettings[currIndex].type && this.tableSettings[currIndex].type !== 'index') {
      //   return false
      // }
      return true
    },
    radioChangeHandle (index, fixedValue) {
      this.tableSettings.forEach((item, idx) => {
        if (fixedValue === 'left') {
          if (idx < index) {
            item.fixed = fixedValue
          }
        } else if (fixedValue === 'right') {
          if (idx > index) {
            item.fixed = fixedValue
          }
        }
      })
    },
    draggableChangeHandle (v) {
      // console.log('draggableChangeHandle', v)
      this.tableSettings = this.updateArray(this.tableSettings, v.moved.newIndex, v.moved.oldIndex)
    },
    updateArray (array, newIndex, oldIndex) {
      array.splice(newIndex, 0, array.splice(oldIndex, 1)[0])
      return array
    },
    close () {
      this.tableSettings.forEach((item, index) => {
        item.fixed = this.initialColumns[index].fixed
      })
      this.$emit('close')
    },
    save () {
      this.$emit('save-setting', this.initialColumns, this.tableSettings)
    }
  }
}
</script>
