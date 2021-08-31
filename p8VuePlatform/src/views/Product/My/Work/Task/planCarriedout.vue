<template>
  <left-center-right-layout :percentRight="100"
                            v-if="isRouterShow">
    <template #left>
      <div class="task-info-con">
        <task-info-view></task-info-view>
      </div>
    </template>
    <template #center>
      <div class="task-operating-con">
        <div class="task-manage-table">
          <task-manage-view></task-manage-view>
        </div>
        <div class="task-tabs-con">
          <task-tabs-view></task-tabs-view>
        </div>
      </div>
    </template>
    <!-- <template #right>
      <div class="task-info-related-con">
        <task-relation-view></task-relation-view>
      </div>
    </template> -->
  </left-center-right-layout>
</template>
<script>
import LeftCenterRightLayout from './Components/layout/LeftCenterRight'
import TaskTabsView from './Components/taskOperating/TaskTabs'
import TaskInfoView from './Components/taskInfo'
import TaskManageView from './Components/taskManage/index'
export default {
  name: 'planExecute',
  provide () { // 使用 provide对深层组件进行数据信息传递 例:taskOperating/Progress.vue中 inject搭配computed接收数据
    return {
      getPlanInfo: () => this.thirdMenuParamTemp
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
  watch: {
    thirdMenuParam: {
      handler (val) {
        // console.log(val, 'thirdMenuParam-----计划执行')
      },
      immediate: true,
      deep: true
    },
    $route (val, oldVal) {
      console.log('route')
      this.reload()
    }
  },
  data () {
    return {
      isRouterShow: true,
      thirdMenuParamTemp: this.thirdMenuParam
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    async reload () {
      this.isRouterShow = false
      await this.getTaskInfo()
    },
    async getTaskInfo () {
      let _this = this
      await this.$api['taskManager.taskInfo']({ taskId: _this.thirdMenuParam.taskId }).then(res => {
        _this.thirdMenuParamTemp = {
          ..._this.thirdMenuParam,
          ...res,
          progress: Number((res.progress * 100).toFixed(0)),
          taskId: res.id,
          planInfoId: res.planInfoId,
          wholeDescribeId: res.wholeDescribeId,
          planInfoStatus: res.executeState,
          createPage: 'decompose'
        }
        _this.isRouterShow = true
      })
    }
  },
  components: {
    LeftCenterRightLayout,
    TaskTabsView,
    TaskInfoView,
    TaskManageView
  }
}
</script>
<style lang="scss">
div.task-info-con {
  height: 100%;
  background-color: #ffffff;
}
div.task-operating-con {
  height: 100%;
  div.task-manage-table {
    width: 100%;
    height: 40%;
    background-color: #ffffff;
  }
  div.task-tabs-con {
    height: 60%;
  }
}
div.task-info-related-con {
  height: 100%;
  background-color: #ffffff;
}
</style>
