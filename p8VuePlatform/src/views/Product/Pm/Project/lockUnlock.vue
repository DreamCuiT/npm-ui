<template>
  <div>
    <el-dialog title='加锁/解锁'
               :visible='visible'
               @close='handleCancel'
               width='600px'
               :close-on-click-modal='false'
               :close-on-press-escape='false'>
      <lock-unlock-form :plan-info-array='planInfoArray'
                        :content='content'
                        @close-lock-unlock='handleCancel'></lock-unlock-form>
      <span slot='footer' class='dialog-footer'>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { Dialog } from '~/index'
import LockUnlockForm from './lockUnlockForm'

export default {
  name: 'LockUnlock',
  props: ['visible', 'planInfoArray', 'content'],
  components: {
    'el-dialog': Dialog,
    LockUnlockForm
  },
  mounted: function () {
  },
  data () {
    return {
      confirmLoading: false,
      loading: false,
      bodyStyle: { paddingTop: 0, paddingLeft: 0, paddingRight: 0 }
    }
  },
  methods: {
    handleCancel (e) {
      this.$emit('close-lock-unlock', {})
    }
  }
}
</script>
