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
                    <impact-analysis :plan-info-id="planInfoId" :create-page="createPage" :read-only="readOnlyVisible" :change-id="approveContentView.changeId"></impact-analysis>
                </div>
            </template>
        </common-dialog>
    </div>
</template>
<script>
import ImpactAnalysis from './impactAnalysis'
import { P8Dialog as CommonDialog } from '~/index'
export default {
  name: 'submitChange',
  components: {
    ImpactAnalysis,
    CommonDialog
  },
  props: {
    isView: {
      type: Boolean,
      default: false
    },
    planInfoId: {
      type: String
    },
    createPage: {
      type: String
    },
    approveContentView: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dialogHeight: 400,
      readOnlyVisible: true,
      dialogConfig: {
        modal: false
      }
    }
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
<style lang="scss">

</style>
