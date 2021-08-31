<template>
    <div style="height: 100%;">
        <common-dialog title="查看计划详情"
                       :visible="isView"
                       :showHandleBtn="false"
                       :dialogConfig="dialogConfig"
                       @handle-cancel="handleCancel"
                       @handle-ok="handleOk"
                       width="80%"
                       @close="handleCancel"
                       :dialogHeight="700">
            <template #dialog>
                <div style="height: 100%;">
                    <PlanGanttView
                    :planInfoId="planInfoId"
                    :ganttData="ganttData"
                    :snapshootView="snapshootView"
                    ></PlanGanttView>
                </div>
            </template>
        </common-dialog>
    </div>
</template>
<script>
import { P8Dialog as CommonDialog } from '~/index'
import PlanGanttView from './planGanttView'

export default {
  name: 'ApproveViewDetail',
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
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CommonDialog,
    PlanGanttView
  },
  data () {
    return {
      dialogConfig: {
        modal: false
      }
    }
  },
  watch: {},
  mounted () {

  },
  methods: {
    handleCancel () {
      this.$emit('close')
    },
    handleOk () {
      this.handleCancel()
    }
  }
}
</script>
