<template>
    <div style="height: 100%;">
        <plan-view :plan-info-id='id'></plan-view>
        <el-button type="primary" size="mini" @click="approveViewDetail">{{'查看计划详情'}}</el-button>
        <ApproveViewDetail v-if="isApproveViewDetailView"
                           :isView="isApproveViewDetailView"
                           :planInfoId="planInfoId"
                           :ganttData="ganttData"
                           :snapshootView="snapshootView"
                           @close="closeApproveViewDetail"
        ></ApproveViewDetail>
    </div>
</template>
<style lang="scss">
    .couerDivClass{
        height: calc(100% - 2px)!important;
        padding-top:1px;
        box-sizing: border-box;
        overflow:scroll;
        overflow-x:hidden;
        overflow-y:hidden;
        z-index:2!important;
    }
    .top {
        position: relative;
        margin-bottom:8px;
        background:$base-white-color;
        border:1px solid $base-line-color;
        border-radius: 6px;
        overflow:hidden;
    }
    .bottom {
        height:calc(100% - 250px);
        position: relative;
        border:1px solid $base-line-color;
        border-radius:6px;
        box-shadow:5px 5px 13px $base-bg-shadow;
        background:$base-white-color;
        overflow:hidden;
    }
</style>
<script>
import { Button } from '~/index'
import ApproveViewDetail from './approveViewDetail'
import PlanView from '@/views/Product/Pm/Project/planInfoView.vue'
export default {
  name: 'planGanttViewIndex',
  components: {
    'el-button': Button,
    ApproveViewDetail,
    PlanView
  },
  props: {
    planInfoId: {
      type: String,
      default: null
    },
    ganttData: {
      type: Object,
      default: null
    },
    snapshootView: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      id: undefined,
      existDefaultBtn: false,
      existCustomBtn: true,
      realGanttData: {},
      isApproveViewDetailView: false
    }
  },
  watch: {},
  methods: {
    approveViewDetail () {
      this.isApproveViewDetailView = true
    },
    closeApproveViewDetail () {
      this.isApproveViewDetailView = false
    }
  },
  mounted () {
    if (this.snapshootView && this.snapshootView.snapshoot && Object.keys(this.snapshootView.snapshoot).length > 0) {
      this.realGanttData = this.snapshootView.snapshoot
    }
    if (this.ganttData && Object.keys(this.ganttData).length > 0) {
      this.realGanttData = this.ganttData
    }
    if (!this.planInfoId) {
      this.id = this.realGanttData.tasks[0].planInfoId
    } else {
      this.id = this.planInfoId
    }
  }
}
</script>
