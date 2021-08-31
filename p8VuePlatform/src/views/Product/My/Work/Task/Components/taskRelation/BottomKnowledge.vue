<template>
  <pane-view paneTitle="伴随知识">
    <template #paneTitle>
      <div></div>
    </template>
    <template #paneInfo>
      <el-table class="knowledge-table" :data="tableData" :height="tableH">
        <el-table-column
          prop="classify"
          label="知识分类"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="知识名称"
          align="center">
        </el-table-column>
      </el-table>
    </template>
  </pane-view>
</template>
<script>
import PaneView from '../layout/Pane'
import { Table, TableColumn } from '~/index'
export default {
  name: 'Knowledge',
  components: {
    PaneView,
    'el-table': Table,
    'el-table-column': TableColumn
  },
  data () {
    return {
      tableData: [
        {
          classify: '工具方法:',
          name: '工具方法1'
        },
        {
          classify: '企业标准库:',
          name: '企业标准库'
        },
        {
          classify: '个人经验库:',
          name: '个人经验库'
        },
        {
          classify: '工具方法:',
          name: '工具方法1'
        },
        {
          classify: '企业标准库:',
          name: '企业标准库'
        },
        {
          classify: '个人经验库:',
          name: '个人经验库'
        }
      ],
      tableH: ''
    }
  },
  mounted () {
    window.addEventListener('resize', this._initTableSize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._initTableSize)
  },
  methods: {
    _initTableSize () {
      const vm = this
      let timer = null
      // 这里增加一个延迟保证不会触发频次不会太高,减少开销
      if (timer) return
      timer = setTimeout(() => {
        const paneTitleH = 40
        const HeaderH = 50
        const MainPaddingTB = 10
        const mh = document.documentElement.clientHeight - (paneTitleH + HeaderH + MainPaddingTB)
        vm.tableH = mh * 0.3 - paneTitleH + 'px'
        timer = null
      }, 300)
    }
  }
}
</script>
<style lang="scss">
  .knowledge-table.el-table--small /deep/ th {
    background-color: #ffffff;
    color: #000;
  }
</style>
