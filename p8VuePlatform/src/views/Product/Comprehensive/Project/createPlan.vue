<template>
  <div>
    <form-list
      ref='form'
      @rendered='rendered'
      @saved='saved'
      :form='formData'
      :dataSource='dataSource'
      :is-custom-validate='isCustomValidate'
      @custom-validate='customValidate'
      :api='saveApi'
      :other-param='otherParam'
    >
      <template #name>
        <el-input v-model='formData["name"]' readonly autosize placeholder="请选择项目">
          <i
            v-if='selectedRow'
            class='el-icon-link'
            slot='suffix'
            type='link'
            @click='showModal'
            :style='{ fontSize: "16px", color: "#08c" }'
          ></i>
        </el-input>
      </template>
    </form-list>
    <select-project v-if='selectProjectVisible' :selected-row='selectedRow' :visible='selectProjectVisible' @close-modal='closeModal'></select-project>
  </div>
</template>
<script>
import { Input } from '~/index'
import { P8Form as FormList } from '~/index'
import SelectProject from './selectProject'
export default {
  name: 'CreatePlan',
  components: {
    FormList,
    'el-input': Input,
    SelectProject
  },
  props: {
    planInfoId: String
  },
  data () {
    return {
      saveApi: 'planInfoManager.save',
      selectProjectVisible: false,
      labelWidth: 'auto',
      isCustomValidate: true,
      selectedRow: {},
      dataSource: [
        {
          type: 'blank',
          labelText: '项目',
          slotName: 'name',
          fieldName: 'name',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '该项为必填项' }]
        },
        {
          type: 'text',
          labelText: '计划编号',
          fieldName: 'planCode',
          colLayout: 'singleCol',
          fieldConfig: {
            readOnly: true
          }
        },
        {
          type: 'text',
          labelText: '计划名称',
          fieldName: 'planName',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '请填写计划名称' }]
        },
        {
          type: 'number',
          labelText: '排序号',
          fieldName: 'indexNo',
          colLayout: 'singleCol'
        },
         {
          type: 'datetimeRange',
          labelText: '计划起始时间',
          fieldName: 'beginEndTime',
          colLayout: 'singleCol',
          placeholder: ['计划开始日期', '计划完成日期'],
          rules: [{ required: true, message: '必须选择日期' }],
          fieldConfig: {
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          type: 'datetimeRange',
          labelText: '预计起始时间',
          fieldName: 'forecastTime',
          colLayout: 'singleCol',
          placeholder: ['预计开始日期', '预计完成日期'],
          rules: [{ required: true, message: '必须选择日期2' }],
          fieldConfig: {
            valueFormat: 'yyyy-MM-dd'
          }
        }
      ],
      modify: {},
      otherParam: {},
      formData: {}
    }
  },
  methods: {
    rendered () {
      let that = this
      if (that.planInfoId) {
        this.$api['planInfoManager.getPlanInfo']({ planInfoId: that.planInfoId }).then(function (res) {
          if (res) {
            that.formData.name = res.name
            that.formData.planCode = res.planCode
            that.formData.planName = res.planName
            that.formData.indexNo = res.indexNo
            that.formData.beginEndTime = [res.planBeginDate, res.planEndDate]
            if (res.forecastBeginDate && res.forecastEndDate) {
              that.formData.forecastTime = [res.forecastBeginDate, res.forecastEndDate]
            }// 注意针对数组类型校验，如果已经赋值了，判断是否为空时候不能将null插入
            that.otherParam = { wholeDescribeId: that.selectedRow.id, planInfoId: that.planInfoId }
            that.formData = Object.assign({}, that.formData)
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    showModal () {
      this.selectProjectVisible = true
    },
    closeModal (selectedRow) {
      this.selectProjectVisible = false
      this.selectedRow = selectedRow
      if (this.selectedRow) {
        let that = this
        this.$api['planInfoManager.getWholeDescribeById']({ wholeDescribeId: that.selectedRow.id }).then(function (res) {
          if (res) {
            that.formData.name = res.name
            that.formData.planCode = res.planCode
            that.formData.planName = res.name + '的计划'
            that.formData.indexNo = res.indexNo
            that.formData.beginEndTime = [res.pBeginTime, res.pEndTime]
            if (res.FBeginTime && res.FEndTime) {
              that.formData.forecastTime = [res.FBeginTime, res.FEndTime]
            }
            that.otherParam = { wholeDescribeId: that.selectedRow.id }
            that.formData = Object.assign({}, that.formData)
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    customValidate (saveParams) {
      let beginEndTime = saveParams.beginEndTime
      let forecastTime = saveParams.forecastTime
      if (beginEndTime.length === 2 && forecastTime.length === 2) {
        saveParams.planBeginDate = new Date(beginEndTime[0])
        saveParams.planEndDate = new Date(beginEndTime[1])
        saveParams.forecastBeginDate = new Date(forecastTime[0])
        saveParams.forecastEndDate = new Date(forecastTime[1])
        this.$refs.form.submitForm(saveParams, this.saveApi)
      } else {
        console.log('save error ')
      }
    },
    clickEvent () {
      console.log('click')
    },
    saved (res) {
      if (res && res === 'true') {
        this.$emit('save-success', res)
      }
    }
  }
}
</script>
