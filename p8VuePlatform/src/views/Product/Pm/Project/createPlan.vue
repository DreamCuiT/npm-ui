<template>
  <div>
    <form-list ref='form'
               @rendered='rendered'
               @saved='saved'
               :form='formData'
               :dataSource='dataSource'
               :is-custom-validate='isCustomValidate'
               @custom-validate='customValidate'
               :api='saveApi'
               :other-param='otherParam'>
      <template #name>
        <el-input v-model='formData["name"]'
                  readonly
                  autosize
                  placeholder="请选择项目"
                  v-on:click.native="showModal()">
          <i v-if='selectedRow'
             class='el-icon-link'
             slot='suffix'
             type='link'
             :style='{cursor: "pointer", fontSize: "16px", color: "#08c" }'></i>
        </el-input>
      </template>
      <template #dutyGroupName>
        <el-input v-model='formData["dutyGroupName"]'
                  readonly
                  autosize
                  placeholder="请选择责任令组"
                  v-on:click.native="showDutyGroup()">
          <i v-if='selectedRow'
             class='el-icon-link'
             slot='suffix'
             type='link'
             :style='{cursor: "pointer", fontSize: "16px", color: "#08c" }'></i>
        </el-input>
      </template>
      <template #beginTime>
        <el-col>
          <el-form-item>
            <el-date-picker v-model="formData['beginTime']"
                            type="date"
                            placeholder="开始时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                            @change="startProgressDateChange"
                            :picker-options="startPickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </template>
      <template #endTime>
        <el-col>
          <el-form-item>
            <el-date-picker v-model="formData['endTime']"
                            type="date"
                            placeholder="结束时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                            @change="endProgressDateChange"
                            :picker-options="endPickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </template>
      <template #forecastBeginTime>
        <el-col>
          <el-form-item>
            <el-date-picker v-model="formData['forecastBeginTime']"
                            type="date"
                            placeholder="预计开始时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                            :picker-options="forecastStartPickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </template>
      <template #forecastEndTime>
        <el-col>
          <el-form-item>
            <el-date-picker v-model="formData['forecastEndTime']"
                            type="date"
                            placeholder="预计结束时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                            :picker-options="forecastEndPickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </template>
    </form-list>
    <select-project v-if='selectProjectVisible'
                    :selected-row='selectedRow'
                    :createPlanInfo='createPlanInfo'
                    :visible='selectProjectVisible'
                    @close-modal='closeModal'></select-project>
    <select-duty-group v-if='selectDutyGroup'
                    :selected-row='selectedRows1'
                    :visible='selectDutyGroup'
                    @close-dialog='closeModal1'></select-duty-group>
  </div>
</template>
<script>
import { Col, FormItem, Input, DatePicker } from '~/index'
import { P8Form as FormList } from '~/index'
import SelectProject from './selectProject'
import SelectDutyGroup from './dutyGroupList'
import moment from 'moment'
export default {
  name: 'CreatePlan',
  components: {
    FormList,
    // eslint-disable-next-line vue/no-unused-components
    'el-col': Col,
    // eslint-disable-next-line vue/no-unused-components
    'el-form-item': FormItem,
    'el-input': Input,
    'el-date-picker': DatePicker,
    SelectDutyGroup,
    SelectProject
  },
  props: {
    planInfoId: String
  },
  data () {
    return {
      saveApi: 'planInfoManager.save',
      selectProjectVisible: false,
      selectDutyGroup: false,
      labelWidth: 'auto',
      createPlanInfo: 'createPlanInfo',
      startPickerOptions: {
        disabledDate: (time) => {
          let timeSpace = moment(time).format('YYYY-MM-DD') > this.formData['minPlanBeginDate'] || moment(time).format('YYYY-MM-DD') > this.formData['endTime']
          return timeSpace
        }
      },
      endPickerOptions: {
        disabledDate: (time) => {
          let timeSpace = moment(time).format('YYYY-MM-DD') < this.formData['maxPlanEndDate'] || moment(time).format('YYYY-MM-DD') < this.formData['beginTime']
          return timeSpace
        }
      },
      forecastStartPickerOptions: {
        disabledDate: (time) => {
          let timeSpace = moment(time).format('YYYY-MM-DD') > this.formData['forecastEndTime']
          return timeSpace
        }
      },
      forecastEndPickerOptions: {
        disabledDate: (time) => {
          let timeSpace = moment(time).format('YYYY-MM-DD') < this.formData['forecastBeginTime']
          return timeSpace
        }
      },
      isCustomValidate: true,
      selectedRow: {},
      selectedRows1: [],
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
          labelText: '计划名称',
          fieldName: 'planName',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '请填写计划名称' }]
        },
        // {
        //   type: 'blank',
        //   labelText: '责任令组',
        //   slotName: 'dutyGroupName',
        //   fieldName: 'dutyGroupName',
        //   colLayout: 'singleCol',
        //   rules: [{ required: true, message: '该项为必填项' }]
        // },
        {
          type: 'number',
          labelText: '排序号',
          fieldName: 'indexNo',
          colLayout: 'singleCol'
        },
        {
          type: 'blank',
          labelText: '计划开始时间',
          fieldName: 'beginTime',
          slotName: 'beginTime',
          colLayout: 'doubleCol',
          rules: [{ required: true, message: '该项为必填项' }]
        },
        {
          type: 'blank',
          labelText: '计划完成时间',
          fieldName: 'endTime',
          slotName: 'endTime',
          colLayout: 'doubleCol',
          rules: [{ required: true, message: '该项为必填项' }]
        },
        {
          type: 'blank',
          labelText: '预计开始时间',
          fieldName: 'forecastBeginTime',
          slotName: 'forecastBeginTime',
          colLayout: 'doubleCol',
          rules: [{ required: true, message: '该项为必填项' }]
        },
        {
          type: 'blank',
          labelText: '预计完成时间',
          fieldName: 'forecastEndTime',
          slotName: 'forecastEndTime',
          colLayout: 'doubleCol',
          rules: [{ required: true, message: '该项为必填项' }]
        }
      ],
      modify: {},
      otherParam: {},
      formData: {
        dutyGroup: '',
        dutyGroupName: ''
      }
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
            that.formData.beginTime = res.planBeginDate
            that.formData.endTime = res.planEndDate
            that.formData.minPlanBeginDate = res.minPlanBeginDate
            that.formData.maxPlanEndDate = res.maxPlanEndDate
            that.formData.dutyGroup = res.dutyGroup
            that.formData.dutyGroupName = res.dutyGroupName
            if (res.forecastBeginDate && res.forecastEndDate) {
              that.formData.forecastBeginTime = res.forecastBeginDate
              that.formData.forecastEndTime = res.forecastEndDate
            }// 注意针对数组类型校验，如果已经赋值了，判断是否为空时候不能将null插入
            that.otherParam = { wholeDescribeId: that.selectedRow.id, planInfoId: that.planInfoId }
            that.formData = Object.assign({}, that.formData)
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    startProgressDateChange (date) {
      let that = this
      if (date) {
        that.formData.forecastBeginTime = date
        that.formData = Object.assign({}, that.formData)
      }
    },
    endProgressDateChange (date) {
      let that = this
      if (date) {
        that.formData.forecastEndTime = date
        that.formData = Object.assign({}, that.formData)
      }
    },
    showModal () {
      if (this.formData.minPlanBeginDate) {
        this.$message(
          {
            message: '计划编辑视图已经创建任务，不能修改项目！',
            type: 'warning'
          }
        )
      } else {
        this.selectProjectVisible = true
      }
    },
    showDutyGroup () {
      this.selectDutyGroup = true
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
            that.formData.beginTime = res.pBeginTime
            that.formData.endTime = res.pEndTime
            that.formData.forecastBeginTime = res.pBeginTime
            that.formData.forecastEndTime = res.pEndTime
            that.otherParam = { wholeDescribeId: that.selectedRow.id, planInfoId: that.planInfoId }
            that.formData = Object.assign({}, that.formData)
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    closeModal1 (selectedRow) {
      this.selectDutyGroup = false
      let that = this
      if (selectedRow) {
        this.selectedRows1[0] = selectedRow
        this.disabledRow = this.selectedRows1[0].id
        if (this.selectedRows1.length) {
          that.formData.dutyGroup = this.selectedRows1[0].id
          that.formData.dutyGroupName = this.selectedRows1[0].name
        }
      }
    },
    customValidate (saveParams) {
      let beginTime = saveParams.beginTime
      let endTime = saveParams.endTime
      let forecastBeginTime = saveParams.forecastBeginTime
      let forecastEndTime = saveParams.forecastEndTime
      if (beginTime && endTime && forecastBeginTime && forecastEndTime) {
        saveParams.planBeginDate = new Date(beginTime)
        saveParams.planEndDate = new Date(endTime)
        saveParams.forecastBeginDate = new Date(forecastBeginTime)
        saveParams.forecastEndDate = new Date(forecastEndTime)
        this.$refs.form.submitForm(saveParams, this.saveApi)
      } else {
        console.log('save error ')
      }
    },
    clickEvent () {
    },
    saved (res) {
      if (res && Object.keys(res).length) {
        this.$emit('save-success', res)
      }
    }
  }
}
</script>
