<template>
    <common-dialog
                :title="title"
                :visible="visible"
                  destroy-on-close
                @close="handleCancel"
                 width="500px"
                 dialogHeight="240"
                 :showHandleBtn="false"
                 :dialogConfig="dialogConfig"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
        >
     <template #dialog>
              <form-list ref="form" @rendered="rendered" :form="formData"
                        @saved="saved" :dataSource="dataSource" :api="saveApi">
              </form-list>
      </template>
    </common-dialog>
</template>

<style scoped>

</style>

<script>

import { P8Form as FormList } from '~/index'
import api from '@/plugins/api'
import { P8Dialog as CommonDialog } from '~/index'

let teamId = ''

let dataSource = [
  {
    type: 'text',
    labelText: '团队名称',
    fieldName: 'name',
    placeholder: '请输入团队名称',
    colLayout: 'singleCol',
    rules: [
      {
        required: true,
        message: '必填'
      },
      {
        validator: (rule, value, callback) => {
          api['baseData.kTeamsRepeatedCheck']({ name: value, id: teamId }).then(res => {
            if (res === 'reject') {
              callback(new Error('该团队名称已被使用，请重新输入！'))
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
    type: 'number',
    labelText: '排序号',
    fieldName: 'indexNo',
    placeholder: '请输入排序号',
    colLayout: 'singleCol',
    rules: [
      {
        required: true,
        message: '必填'
      }
    ]
  },
  {
    type: 'textarea',
    labelText: '团队描述',
    fieldName: 'describes',
    placeholder: '请输入团队描述',
    colLayout: 'singleCol'
  }
]

export default {
  name: 'KteamsEdit',
  components: {
    FormList,
    CommonDialog },
  props: {
    record: {
      type: Object
    },
    visible: {
      type: Boolean
    },
    title: {
      type: String
    },
    teamId: {
      type: String
    },
      dateNumber: {
          type: Number,
          default: 0
      }
  },
  data () {
    return {
      confirmLoading: false,
      saveApi: 'baseData.kTeamsSave',
      dataSource: [],
      formData: {},
      dialogConfig: {
        modal: true,
        appendToBody: true,
        modalAppendToBody: true
      }
    }
  },
  created () {
    this.formTrigger()
  },
  methods: {
    formTrigger () {
      teamId = this.teamId
      this.dataSource = Object.assign([], dataSource)
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    rendered () {
      if (this.teamId && this.teamId !== '') {
        this.getKTeamsDetail(this.teamId)
      } else {
          this.formData.indexNo = this.dateNumber
      }
    },
    getKTeamsDetail (teamId) {
      let that = this
      this.$api['baseData.kTeamsDetail']({ id: teamId }).then(function (res) {
        let data = res
        that.formData.id = data.id
        that.formData.name = data.name
        that.formData.indexNo = data.indexNo
        that.formData.describes = data.describes
        that.formData = Object.assign({}, that.formData)
      }).catch(function (error) {
        console.log(error)
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
