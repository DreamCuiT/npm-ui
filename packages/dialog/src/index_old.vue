<template>
  <el-dialog
    :title="title"
    :width="width"
    :visible="visible"
    destroy-on-close
    :close-on-click-modal="false"
    @close="close"
    v-bind="dialogConfig"
    :style="{'--height':renderDialogHeight+'px'}">
    <slot name="dialog"></slot>
    <span slot="footer" class="dialog-footer" v-if="showHandleBtn">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Dialog, Button } from 'element-ui'
export default {
  name: 'CommonDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '30%'
    },
    showHandleBtn: {
      type: Boolean,
      default: true
    },
    dialogConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dialogHeight: {
      type: Number,
      default: 200
    }
  },
  components: {
    'el-dialog': Dialog,
    'el-button': Button
  },
  data () {
    const mh = document.documentElement.clientHeight - 300
    return {
      dialogMaxHeight: mh + 'px'
    }
  },
  computed: {
    renderDialogHeight () {
      return this.dialogHeight > this.dialogMaxHeight ? this.dialogMaxHeight : this.dialogHeight
    }
  },
  methods: {
    handleCancel () {
      this.$emit('handle-cancel')
    },
    handleOk (e) {
      this.$emit('handle-ok')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scope>
  .el-dialog__body{
    height:var(--height);
    overflow-y:auto;
    overflow-x:hidden;
  }
</style>
