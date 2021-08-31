<template>
    <div>
        <common-dialog
                :title="title"
                :visible="visible"
                @close="handleCancel"
                width="500px"
                :dialogHeight="240"
                :showHandleBtn="false"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
        >
          <template #dialog>
            <form-list ref="form"  :form="formData"
                        @saved="saved" :dataSource="dataSource" :api="saveApi">
              </form-list>
          </template>
        </common-dialog>
    </div>
</template>

<style scoped>

</style>

<script>

import { P8Form as FormList } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import api from '@/plugins/api'
let me = {}

export default {
  name: 'Edit',
  components: {
    FormList,
    CommonDialog
  },
  props: {
    record: {
      type: Object
    },
    visible: {
      type: Boolean
    },
    title: {
      type: String
    }
  },
  data () {
    return {
      confirmLoading: false,
      saveApi: 'ProcessDefinition.save',
      dataSource: [
        {
          type: 'text',
          labelText: '流程名称',
          fieldName: 'name',
          placeholder: '请输入流程名称',
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '必填'
            },
            {
              validator: (rule, value, callback) => {
                api['ProcessDefinition.repeatedCheck']({ name: value }).then(res => {
                  if (res.result) {
                    me.showMessage(me, '流程名称已被使用', 'error')
                    return
                  }
                  callback()
                }).catch(function (error) {
                  console.log(error)
                })
              },
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'text',
          labelText: '流程key',
          fieldName: 'key',
          placeholder: '请输入key',
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '必填'
            },
            {
              validator: (rule, value, callback) => {
                api['ProcessDefinition.repeatedCheck']({ key: value }).then(res => {
                  if (res.result) {
                    me.showMessage(me, 'key已被使用', 'error')
                    return
                  }
                  callback()
                }).catch(function (error) {
                  console.log(error)
                })
              },
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'textarea',
          labelText: '流程描述',
          fieldName: 'description',
          placeholder: '请输入流程描述',
          colLayout: 'singleCol'
        }
      ],
      formData: {}
    }
  },

  methods: {
    rendered () {
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    saved (res) {
      console.log('edit saved')
      this.$emit('save-success', res)
    },
    handleOk (e) {
      this.$emit('close-modal')
    },
    handleCancel (e) {
      this.$emit('close-modal')
    }
  }
}
</script>
<style lang="scss" scoped>
    .el-dialog__body {
        padding: 15px !important;
    }
</style>
