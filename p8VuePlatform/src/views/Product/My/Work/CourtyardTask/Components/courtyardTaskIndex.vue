<!--计划分解的页面 copy by ./index.vue。 修改了计划分解路由的路径 （/planResolve bp_resource表中配置）-->
<template>
  <div style="height: 100%;">
    <div class='couerDivClass' id='couerDiv'>
          <div class='top' :style="{height: '40px'}">
            <el-button
                 type="primary"
                 round
                 :style="{marginTop: '4px'}"
                 @click="submitCourtyardTask()">提交至院系统</el-button>
         </div>
      <div class='bottom'
           :class="{'expandBottom':true}">
        <courtyard-task-gantt :plan-info-id='planInfoId'
                    :wholeDescribeId='wholeDescribeId'
                    :plan-info-status='planInfoStatus'
                    :task-id='taskId'
                    :create-page='createPage'
                    @select-task='selectTask'
                    @show-detail="showDetail"
                    @save-success="detailDrawerClosed"
                    :task-status="taskStatus"></courtyard-task-gantt>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.couerDivClass {
  height: 100%!important;
  box-sizing: border-box;
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: hidden;
  z-index: 2000 !important;
}
#couerDiv {
  background: $base-bg-color;
}
.top {
  position: relative;
  // margin-bottom: 8px;
  background: $base-white-color;
  border-left: 1px solid $base-line-color;
  border-right: 1px solid $base-line-color;
  // border-radius: 6px;
  overflow: hidden;
}
.bottom {
  height: calc(100% - 74px);
  position: relative;
  border: 1px solid $base-line-color;
  // border-bottom-left-radius: 6px;
  // border-bottom-right-radius: 6px;
  box-shadow: 5px 5px 13px $base-bg-shadow;
  background: $base-white-color;
  overflow: hidden;
}
.bottom.expandBottom {
  height: calc(100% - 60px);
}
</style>

<script>
import { mapGetters } from 'vuex'
// 计划分解页面采用的新的gantt页面
import CourtyardTaskGantt from './courtyardTaskGantt'
import { Button } from '~/index'
export default {
  name: 'Plan',
  data () {
    return {
      defaultKey: '1',
      advanced: false,
      selectedTasks: [],
      selectTaskId: '',
      detailVisible: false,
      readOnly: false,
      detailTitle: '',
      drawerConfig: {
        modal: false
      },
      planInfoId: '',
      wholeDescribeId: '',
      planInfoStatus: '',
      taskId: null,
      ganttType: 'resolve',
      createPage: '',
      ganttName: 'courtyardTaskGantt',
      taskStatus: {},
      status: ''
    }
  },
  props: {
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    CourtyardTaskGantt,
    'el-button': Button
  },
  beforeMount () { },
  mounted () {
    console.log(this.thirdMenuParam, '计划分解页面传递参数')
    this.planInfoId = this.thirdMenuParam.planInfoId
    this.planInfoStatus = this.thirdMenuParam.planInfoStatus
    this.taskId = this.thirdMenuParam.taskId
    this.createPage = this.thirdMenuParam.createPage
    this.wholeDescribeId = this.thirdMenuParam.wholeDescribeId
  },
  computed: {
    ...mapGetters([
      'ganttButtonMode',
      'ganttRightButtons'
    ])
  },
  methods: {
    selectTask (selectDatas, ganttName) {
      this.selectedTasks = selectDatas
      this.ganttName = ganttName
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    tabBarExtraContent () {

    },
    showDetail (selectTask, ganttName) {
      this.detailVisible = true
      this.ganttName = ganttName
      this.selectTaskId = selectTask.id
      this.status = selectTask.status
      this.detailTitle = selectTask.name
    },
    detailDrawerClosed (res) {
      this.detailVisible = false
      this.selectTaskId = ''
      this.detailTitle = ''
    },
    submitCourtyardTask () {
      // let routeData = this.$router.resolve({
      //       path: 'signIn',
      //       query: {
      //         userAccount: 'wangwu',
      //         userPassword: '1',
      //         redirect: 'P1',
      //         taskId: '',
      //         taskName: 'P2',
      //         parentId: 'P2',
      //         planType: 'P2'
      //       }
      //     })

      // window.open('http://192.168.0.49:3001/' + routeData.href, '_blank')

      let that = this
      that.$confirm(`确认要提交至院系统吗?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$api['courtyardTask.submitCourtyardTask']({ planId: that.thirdMenuParam.planInfoId, dataType: 'feedbackMsg' }).then(res => {
               console.log(res, 'resresresresresresres')
               if (res && res.success) {
                  that.$message(
                      {
                        message: res.reponseBody,
                        type: 'success'
                      }
                  )
               } else {
                  that.$message(
                      {
                        message: res.reponseBody,
                        type: 'error'
                      }
                  )
               }
              })
      }).catch(() => { })
    }
  }
}
</script>
