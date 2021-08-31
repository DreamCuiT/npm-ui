<template>
  <normal-layout>
    <template #north>
      <el-button @click="saveMyExperience()">保存我的经验库</el-button>
    </template>
    <template #west>
      <common-tree
        :tree-api="treeApi"
        @select="onSelect"
        :tree-Param="treeParam"
      ></common-tree>
    </template>
    <template #center>
      <div id="table-contain">
        <common-table
          ref="table"
          :comp="comp"
          :table-config="tableConfig"
          :columns="columns"
          :tree="treeParams"
          :params="queryParam"
          :api="tableApi"
          :table-Refresh="tableRefresh"
          :pagination="false"
          :useTreeFormat="useTreeFormat"
          :useTreePId="useTreePId"
          @select="onTableSelect"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @icon-click="iconClick"
        >
        </common-table>
      </div>
    </template>
  </normal-layout>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { Button, Popover } from '~/index'
const columns = [
  {
    title: '',
    dataIndex: 'checkbox',
    type: 'selection',
    width: '60',
    align: 'center'
  },
  {
    title: '序号',
    type: 'index',
    width: '60',
    align: 'center'
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    align: 'left'
  },
  {
    title: '责任人',
    dataIndex: 'dutyUserName',
    align: 'center'
  },
  {
    title: '工期',
    dataIndex: 'duration',
    align: 'center'
  }
]
export default {
  name: 'ExperienceTaskList',
  components: {
    NormalLayout,
    CommonTree,
    // eslint-disable-next-line vue/no-unused-components
    CommonButton,
    CommonTable,
    // eslint-disable-next-line vue/no-unused-components
    CommonDrawer,
    // eslint-disable-next-line vue/no-unused-components
    SearchFormList,
    'el-button': Button,
    // eslint-disable-next-line vue/no-unused-components
    'el-popover': Popover
  },
  props: {
    classifyId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      drawerSize: '70%',
      visibleExperienceEditDrawer: false,
      treeApi: 'myExperience.myExperienceWholeList',
      queryParam: { id: '', classifyId: this.classifyId },
      treeParams: {},
      tableApi: 'myExperience.myExperienceWholeRightList',
      columns: columns,
      tableHeight: 0,
      treeParam: {

      },
      myClassifyId: '',
      useTreeFormat: true,
      useTreePId: 'parentId',
      multipleSelection: [],
      selectedRowKeys: [],
      searchData: [
        // {
        //   type: 'text', // 控件类型
        //   labelText: '用户名称', // 控件显示的文本
        //   fieldName: 'userName',
        //   placeholder: '请输入用户名或姓名', // 默认控件的空值文本
        //   fieldEvent: {
        //     'click': 'clickEvent(this)'
        //   }
        // },
        // {
        //   type: 'checkbox', // 控件类型
        //   labelText: '已锁定', // 控件显示的文本
        //   fieldName: 'lockStatus',
        //   defaultValue: false
        // }
      ],
      tableConfig: {
        // bordered: true,
        // size:'middle'
        defaultExpandAll: true,
        selectOnIndeterminate: false

      },
      buttonConfig: {
        icon: 'edit'
      },
      comp: this,
      rows: null
    }
  },
  mounted () {
    // this.renderHeight();
    // window.addEventListener('resize', () => {
    //     this.renderHeight();
    // })

  },
  computed: {

  },
  watch: {
    rows: function (newRow) {
      let checkRowLeng = newRow.length
      this.selectedRowKeys = []
      // console.log(newRow,'----------我的行')
      if (checkRowLeng > 0) {
        newRow.forEach(col => {
          this.selectedRowKeys.push(col.id)
          // console.log(this.selectedRowKeys,'-------我选中的标识')
          // that.selectedRowKeys.push()
        })
        this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
      } else {
        this.selectedRowKeys = []
      }
      //  console.log(this.selectedRowKeys,'-----------我选中key的选中的值')
    }
  },
  methods: {
    onTableSelect (select, row) {
      // eslint-disable-next-line no-unused-vars
      let childrens = row.children
      // console.log(childrens,'----------我的行');
      // this.$refs.table.toggleRowSelection(row,true);//点击选中
      this.rows = this.$refs.table.$refs.table.selection// 获取表格中所有选中的数据
      let checkrow = []
      checkrow.push(row)
      // eslint-disable-next-line eqeqeq
      if (row.isCheck == true) {
        // eslint-disable-next-line eqeqeq
        if (select == 1) {
          this.$refs.table.$refs.table.toggleRowSelection(row, false)
        }
        this.clearRow(checkrow)
      } else {
        // eslint-disable-next-line eqeqeq
        if (select == 1) {
          this.$refs.table.$refs.table.toggleRowSelection(row, true)
        }
        this.checkRow(checkrow)
      }
    },
    // 取消选中递归
    clearRow (data) {
      Array.from(data).forEach(row => {
        row.isCheck = false// 给这行数据设置一个选中字段为false
        this.$refs.table.$refs.table.toggleRowSelection(row, false)
        if (row.children) this.clearRow(row.children)// 有子集就递归  没子集了就不循环了
      })
    },
    // 选中递归
    checkRow (data) {
      Array.from(data).forEach(row => {
        // console.log(row.getKey(row.parentId),'--------我的行记录')
        row.isCheck = true// 选中是字段值为true
        this.$refs.table.$refs.table.toggleRowSelection(row, true)
        if (row.children) this.checkRow(row.children)
      })
    },
    rowClick () {

    },
    saveMyExperience () {
      let that = this
      let selectNums = that.selectedRowKeys.length
      //  console.log(that.selectedRowKeys,'-------我选中的标识');
      if (selectNums === 0) {
        this.$alert('请勾选要保存的任务', '提示', {
          confirmButtonText: '确定'
          // callback: action => {
          //   this.$message({
          //     type: 'info',
          //     message: `action: ${ action }`
          //   });
          // }
        })
      } else {
        this.$confirm(`是否将选中节点保存至当前分类的经验库？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api['myExperience.saveExperienceInfo']({ classifyId: this.classifyId, projectTaskIds: that.selectedRowKeys }).then(res => {
            // console.log(res, 'res------------------------res')
            if (!res) {
              that.showMessage('经验库保存失败', 'error')
            } else {
              that.showMessage('经验库保存成功', 'success')
              this.$emit('saveSuccess')
            }
          })
        }).catch(() => console.log('Oops errors!'))
      }
    },
    handleSelectionChange (val) {
      // this.selectedRowKeys = []
      // this.multipleSelection = val
      // console.log(val,'------------我选中的值');
      // val.map(item => {
      //   this.selectedRowKeys.push(item.id)
      // })
      // console.log(val,'-------我选中的行');
      // this.$refs.table.toggleRowSelection(this.myRow)
      // this.$refs.table.toggleRowSelection(val);
      // console.log(this.selectedRowKeys,'----------我选中的标识');
    },
    showMessage (message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    onSelect (node) {
      this.myClassifyId = node.id
      // this.queryParam.classifyId=node.id
      // this.$api['myExperience.myBaseExperienceList']({ classifyId: node.id })
      // console.log(node.id,'--------我的项目标识');
      this.queryParam.id = node.id
      this.$refs.table.searchData()

      // this.$refs.table.searchData()
    },
    //  searchData () { // 查询列表数据时调用列表数据接口
    //   this.refresh()
    // },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    iconClick (record) {
      console.log(record, 'record')
    }
  }
}

</script>
