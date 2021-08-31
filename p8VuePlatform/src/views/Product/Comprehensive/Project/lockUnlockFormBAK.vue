<template>
  <div>
    <form-list
       ref="form"
       @rendered="rendered"
       @saved="saved"
       :dataSource="dataSource"
       :api="saveApi"
       :other-param="otherParam"
       :form="formData"
       :is-custom-validate="isCustomValidate"
       @custom-validate="customValidate">
      <template #taskEdit>
        <el-radio-group
            v-model="formData['taskEdit']"
        >
          <el-radio-button
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
          >{{item.label}}</el-radio-button>
        </el-radio-group>
        <br><span style="font-size: 12px;color: red;">任务编辑加锁后，标识自动加锁且不可解锁，任务编辑解锁后，标识加解锁限制取消。标识加锁后，编辑视图对应标识不可添加、取消，添加标识任务的名称、责任人、标识管理时间不可修改。</span>
        <hr>
      </template>
    </form-list>
  </div>
</template>

<script>
import { P8Form as FormList } from '~/index'
import { RadioGroup, RadioButton } from '~/index'
export default {
  name: 'lockUnlockForm',
  props: ['planInfoArray', 'content'],
  components: {
    FormList,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton
  },
  data () {
    return {
      saveApi: 'planInfoManager.saveLockUnlockForm',
      otherParam: {},
      dataSource: [],
      viewData: ['111'], // 防止form表单保存按钮
      planInfoLockUnlockStatus: [],
      isCustomValidate: true,
      formData: {},
      monitorPoints: {},
      monitorPointLockUnlockStatus: {},
      options: [
        {
          label: '解锁',
          value: '0'
        },
        {
          label: '加锁',
          value: '1'
        }
      ]
    }
  },
  mounted: function () {
    let that = this
    that.otherParam.planInfoArray = that.planInfoArray
    that.$api['planInfoManager.loadLockUnlockFormData']({ planInfoArray: that.planInfoArray }).then(res => {
      if (res && res.length) {
        that.monitorPoints = res
        res.forEach(function (item, idx) {
          let dataSourceItem
          if (item.value === 'taskEdit') {
            dataSourceItem = {
              type: 'blank',
              labelText: item.label,
              fieldName: item.value,
              slotName: 'taskEdit',
              colLayout: 'singleCol'
            }
          } else {
            dataSourceItem = {
              type: 'radioButton',
              labelText: item.label,
              fieldName: item.value,
              options: that.options,
              colLayout: 'doubleCol'
            }
          }
          that.dataSource.push(dataSourceItem)
        })
        that.dataSource.push({
          type: 'textarea',
          labelText: '解锁/锁定原因',
          fieldName: 'content',
          placeholder: '请输入解锁/锁定原因',
          defaultValue: that.content,
          fieldConfig: {
            rows: '4'
          },
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        })
      }
    }).catch(function (error) {
      console.log(error, 'error')
    })
  },
  methods: {
    customValidate (saveParams) {
      if (this.planInfoArray && this.planInfoArray.length > 0) {
        let formData = saveParams
        let that = this
        that.monitorPoints.forEach(function (item, idx) {
          if (saveParams[item.value]) {
            that.monitorPointLockUnlockStatus[item.value] = saveParams[item.value]
          }
        })
        if (JSON.stringify(that.monitorPointLockUnlockStatus) !== '{}') {
          formData.monitorPointLockUnlockStatus = that.monitorPointLockUnlockStatus
          this.$refs.form.submitForm(formData, this.saveApi)
        } else {
          this.$message(
            {
              message: '请选择需要加解锁的任务！',
              type: 'error'
            }
          )
        }
      } else {
        this.$message(
          {
            message: '请选择需要加解锁的计划！',
            type: 'error'
          }
        )
      }
    },
    rendered () {
    },
    saved (res) {
      this.$emit('save-success', res)
      this.$emit('close-lock-unlock', res)
    }
  }
}
</script>
