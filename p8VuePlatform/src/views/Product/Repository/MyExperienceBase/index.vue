<template>
  <normal-layout>
    <template #north>
      <el-button type="primary" round @click="createNewExperience"
        >新建</el-button
      >
      <!-- <search-form-list ref="search" :dataSource="searchData" @search="search"  @re-set="reSet" ></search-form-list>
         -->
    </template>
    <template #west>
      <common-tree
        ref="treeTable"
        :tree-api="treeApi"
        @select="onSelect"
        :data="treeData"
        :nodeSlot="true"
      >
        <template #tree="{ node }">
          <div>
            <span>{{ node.label }}</span>
            <el-popover placement="right" trigger="hover">
              <div>
                <div  @click="() => createExperience(node)">
                  <el-button type="text" size="mini" class="same-level">
                    新建经验分类
                  </el-button>
                </div>
                <div v-if="node.label !== '我的经验分类'" @click="() => updateExperience(node)">
                  <el-button type="text" size="mini" class="project-modify">
                    修改
                  </el-button>
                </div>
                <div v-if="node.label !== '我的经验分类'" @click="() => deleteExperience(node)">
                  <el-button type="text" size="mini" class="project-delete">
                    删除
                  </el-button>
                </div>
              </div>
              <div slot="reference" class="row-config"></div>
            </el-popover>
          </div>
        </template>
      </common-tree>
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
          :pagination="true"
          @icon-click="iconClick"
        >
        </common-table>
      </div>
    </template>

    <template #drawer-panel>
      <common-drawer
        v-if="visibleExperienceEditDrawer"
        :title="drawerTitle"
        :visible="visibleExperienceEditDrawer"
        @close="onEditUserClose"
        :size="drawerSize"
      >
        <template #drawer>
          <experience-edit
            @saveSuccess="saveCallback"
            :id="id"
            :parentId="parentId"
          ></experience-edit>
        </template>
      </common-drawer>
      <common-drawer
        v-if="visibleExperienceNewCreateDrawer"
        :title="drawerTitle"
        :visible="visibleExperienceNewCreateDrawer"
        @close="onCreateUserClose"
        :size="drawerSize"
      >
        <template #drawer>
          <experience-create
            @saveSuccess="saveCreateCallback"
            :classifyId="myClassifyId"
          ></experience-create>
        </template>
      </common-drawer>
    </template>
  </normal-layout>
</template>

<style scoped>
.project-modify {
  background: url(./image/project-modify.png) no-repeat;
  background-position-y: center;
  padding-left: 20px;
}
.same-level {
  background: url(./image/same-level.png) no-repeat;
  background-position-y: center;
  padding-left: 20px;
}
.project-delete {
  background: url(./image/project-del.png) no-repeat;
  background-position-y: center;
  padding-left: 20px;
}
.row-config {
  background: url(./image/row-config.png) no-repeat;
  position: absolute;
  width: 50px;
  height: 20px;
  display: inline-block;
  margin: 1px 5px;
}
</style>
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
import Edit from './edit'
import NewCreate from './create'

const columns = [
  {
    title: '序号',
    type: 'index',
    width: '60',
    align: 'center'
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    align: 'left'
  },
  {
    title: '工期',
    dataIndex: 'durations',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '150',
    scopedSlots: {
      customRender: 'operation'
    },
    align: 'center'
  }
]
export default {
  name: 'ExperienceInfoList',
  components: {
    NormalLayout,
    CommonTree,
    // eslint-disable-next-line vue/no-unused-components
    CommonButton,
    CommonTable,
    CommonDrawer,
    // eslint-disable-next-line vue/no-unused-components
    SearchFormList,
    'el-button': Button,
    'el-popover': Popover,
    'experience-edit': Edit,
    'experience-create': NewCreate

  },
  data () {
    return {
      drawerSize: '70%',
      drawerTitle: '',
      visibleExperienceEditDrawer: false,
      visibleExperienceNewCreateDrawer: false,
      treeApi: 'myExperience.experienceClassifyTreeList',
      treeData: [],
      queryParam: { classifyId: '' },
      treeParams: {},
      tableApi: 'myExperience.myBaseExperienceList',
      advanced: false,
      columns: columns,
      tableHeight: 0,
      id: '',
      parentId: '',
      myClassifyId: '',
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
      },
      buttonConfig: {
        icon: 'edit'
      },
      comp: this
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
  methods: {
    createNewExperience () {
      let classifyId = this.queryParam.classifyId
      // eslint-disable-next-line eqeqeq
      if (classifyId == '') {
        this.$alert('请先选择经验分类', '提示', {
          confirmButtonText: '确定'
          // callback: action => {
          //   this.$message({
          //     type: 'info',
          //     message: `action: ${ action }`
          //   });
          // }
        })
      } else {
        this.visibleExperienceNewCreateDrawer = true
        this.drawerTitle = '已参与的项目'
        this.myClassifyId = this.queryParam.classifyId
      }
      // let classifyId=this.queryParam.classifyId
      // console.log(classifyId,'--------我的类型标识')
    },
    createExperience (node) {
      // console.log(this.selectExperienceIds,'-------我的值')
      //  console.log(node.data.id,'-------我的标识值');
      this.id = ''
      this.parentId = node.data.id
      // console.log(this.id,'-------我的标识值');
      this.visibleExperienceEditDrawer = true
      this.drawerTitle = '创建我的经验类型'
      this.drawerSize = '50%'
    },
    updateExperience (node) {
      this.visibleExperienceEditDrawer = true
      this.drawerTitle = '修改我的经验类型'
      this.id = node.data.id
      this.drawerSize = '50%'
      this.parentId = ''
    },
    deleteExperience (node) {
      let that = this
      that.$confirm(`是否要删除该条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['myExperience.removeExperienceClassify']({ id: node.data.id }).then(res => {
          if (!res) {
            that.showMessage('删除失败', 'error')
            return false
          }
          that.showMessage('删除成功', 'success')
          this.$api[this.treeApi]().then(res => {
            // console.log(res, 'tree--api')
            this.treeData = res
          })
        })
      }).catch(() => console.log('Oops errors!'))
    },
    showMessage (message, type) {
      this.$message({
        message: message,
        type: type
      })
    },
    onSelect (node) {
      // console.log(node);
      this.myClassifyId = node.id
      // this.queryParam.classifyId=node.id

      // this.$api['myExperience.myBaseExperienceList']({ classifyId: node.id })
      this.queryParam.classifyId = node.id
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
    onCreateUserClose () {
      this.visibleExperienceNewCreateDrawer = false
    },
    onEditUserClose () {
      this.visibleExperienceEditDrawer = false
      this.drawerSize = '70%'
    },
    saveCreateCallback () {
      console.log('修改页面关闭时的回调方法')
      this.$refs.table.searchData()
      this.onCreateUserClose()
    },
    saveCallback (res) {
      // eslint-disable-next-line no-unused-vars
      let that = this
      // console.log(res,'res')
      // console.log(that.$refs.treeTable.treeData[0],'that.$refs.treeTable')
      // that.$refs.treeTable.treeData[0].children.push(res)
      this.onEditUserClose()
      this.$api[this.treeApi]().then(res => {
        // console.log(res, 'tree--api')
        this.treeData = res
      })
    },
    delMenu (record) {
      let that = this
      this.$confirm(`是否确定要删除该经验？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$api['myExperience.removeExperienceInfo']({
          classifyId: record.id
        }).then(res => {
          // console.log(res)
          that.$refs.table.searchData()
          // if (res.data && res.data.result === 'success') {
          // that.$refs.table.refresh()
          // } else {
          // }
        })
      }).catch((e) => { console.log(e) })
    },

    iconClick (record) {
      console.log(record, 'record')
    }
  }
}

</script>
