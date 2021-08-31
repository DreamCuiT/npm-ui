/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-irregular-whitespace */
<template>
  <list-layout :headerVisible="false">
    <template #north style="height: 150px">
      <ul >
        <li v-for="item in selectedRows"
            :key= "item.id" class="showChosePlan">
          <el-tag>{{item.taskName}}</el-tag>
        </li>
      </ul>
    </template>
    <template #center>
      <common-tree
        :tree-api="treeApi"
        @select="onSelect"
        :nodeSlot="true"
        :data="treeData"
        :append-to-body="true"
      >
        <template #tree="{ node }">
          <div>
            <el-popover placement="right" trigger="hover" style="float:left;width:16px;height:16px;margin-right:5px;">
              <div>
                <div @click="() => createExperience(node)">
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
            <span>{{ node.label }}</span>
          </div>
        </template>
      </common-tree>
    </template>
    <template #drawer-panel>
      <common-drawer
        v-if="visibleExperienceEditDrawer"
        :drawerConfig="drawerConfig"
        :title="drawerTitle"
        :visible="visibleExperienceEditDrawer"
        @close="onEditUserClose"
        :size="drawerSize"
      >
        <template #drawer>
          <experience-classify-edit
            @saveSuccess="saveCallback"
            :id="id"
            :parentId="parentId"
          ></experience-classify-edit>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>

<style lang='scss' scoped>
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
  width: 16px;
  height: 20px;
  display: inline-block;
  margin: 2px 0;
}
.normal-west {
  width: 600px;
}
.showChosePlan{
  float: left;
}
</style>
<script>
// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { Button, Popover, Tag } from '~/index'
import ExperienceClassifyEdit from './edit'
// eslint-disable-next-line no-unused-vars
const columns = [
  {
    title: '序号',
    type: 'index',
    width: '50',
    align: 'center'
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    align: 'left'
  },
  {
    title: '工期',
    dataIndex: 'duration',
    align: 'center'
  },
  {
    title: '是否里程碑',
    dataIndex: 'isMilestone',
    width: '300',
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
  name: 'UserList',
  components: {
    ListLayout,
    CommonTree,
    // eslint-disable-next-line vue/no-unused-components
    CommonButton,
    // eslint-disable-next-line vue/no-unused-components
    CommonTable,
    CommonDrawer,
    // eslint-disable-next-line vue/no-unused-components
    SearchFormList,
    'el-button': Button,
    'el-popover': Popover,
    'el-tag': Tag,
    'experience-classify-edit': ExperienceClassifyEdit

  },
  props: {
    selectExperienceIds: {
      type: Array,
      default: null
    },
    selectedRows: {
      type: Array,
      default: null
    },
    normalLayout: {
      type: Object,
      default: function () {
        return {
          west: {
            xs: 8, sm: 7, md: 6, lg: 5, xl: 4
          },
          center: {
            xs: 16, sm: 17, md: 18, lg: 19, xl: 20
          }
        }
      }
    },
    titleHeight: {
      type: String,
      default: '100px'
    }
  },
  data () {
    return {
      drawerSize: '50%',
      drawerTitle: '',
      visibleExperienceEditDrawer: false,
      treeApi: 'myExperience.experienceClassifyTreeList',
      queryParam: {},
      treeParams: {},
      advanced: false,
      tableHeight: 0,
      id: '',
      parentId: '',
      myClassifyId: '',
      tableConfig: {
        // bordered: true,
        // size:'middle'
      },
      drawerConfig: {
        'modal': false
      },
      buttonConfig: {
        icon: 'edit'
      },
      comp: this,
      treeData: []
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
    confirmExperiece () {
      // eslint-disable-next-line no-unused-vars
      let experienceNum = this.selectExperienceIds.length
      let classifyId = this.myClassifyId
      let projectTaskIds = this.selectExperienceIds
      let that = this
      // console.log(classifyId,'-------我的类型');
      // eslint-disable-next-line eqeqeq
      if (classifyId == '') {
        this.$alert('请选择经验分类', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        // console.log(classifyId,'---------我的类型')
        this.$confirm(`是否将选中节点保存至当前分类的经验库？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api['myExperience.saveExperienceInfo']({ classifyId: classifyId, projectTaskIds: projectTaskIds }).then(res => {
            if (!res) {
              that.showMessage('经验库保存失败', 'error')
            }
            that.showMessage('经验库保存成功', 'success')
            this.$emit('saveSuccess', true)
          })
        }).catch(() => console.log('Oops errors!'))
      }
    },
    createExperience (node) {
      // console.log(this.selectExperienceIds,'-------我的值')
      //  console.log(node.data.id,'-------我的标识值');
      this.id = ''
      this.parentId = node.data.id
      // console.log(this.id,'-------我的标识值');
      this.visibleExperienceEditDrawer = true
      this.drawerTitle = '创建我的经验类型'
    },
    updateExperience (node) {
      this.visibleExperienceEditDrawer = true
      this.drawerTitle = '修改我的经验类型'
      this.id = node.data.id
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
            this.treeData = res
          })
          // that.$refs.table.refresh
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
      console.log(node, '选择节点展示！')
      if (node.id !== '0') {
        this.myClassifyId = node.id
      } else {
        this.$alert('根节点不可选择，请选择子节点', '提示', {
          confirmButtonText: '确定'
        })
      }
      // console.log( this.myClassifyId,'---------我选中的树节点');
      // this.queryParam.id = node.id
      // this.$refs.table.searchData()
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    onEditUserClose () {
      this.visibleExperienceEditDrawer = false
    },
    saveCallback () {
      console.log('修改页面关闭时的回调方法')
      this.onEditUserClose()
      this.$api[this.treeApi]().then(res => {
        // console.log(res, 'tree--api')
        this.treeData = res
      })
    },
    search (param) {
      // let newParams = { ...param,
      //   ...(this.queryParam.departmentId ? {
      //     departmentId: this.queryParam.departmentId
      //   } : {})
      // }
      // this.queryParam = newParams
      // let that = this
      // Vue.nextTick(function () {

      // })
    },
    iconClick (record) {
      console.log(record, 'record')
    }
  }
}

</script>
