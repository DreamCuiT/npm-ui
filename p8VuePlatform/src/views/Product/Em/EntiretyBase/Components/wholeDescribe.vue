<template>
  <div>
    <form-list ref="form"
               @rendered="rendered"
               @saved="saved"
               :is-custom-validate="isCustomValidate"
               @custom-validate="customValidate"
               @changeTaskBookId="changeTaskBookId"
               :dataSource="dataSource"
               :api="saveApi"
               :form="modify"
               :other-param="otherParam">
      <template #modelCode>
        <el-input v-model='modify["modelCode"]'
                  placeholder="请选择型号"
                  @click.native="visible=true"
                  readonly>
          <el-button slot="append"
                     icon="el-icon-link"
                     @click.native="visible=true"></el-button>
          <!-- <el-icon v-if="!selectedRows.length" slot="suffix" type="link" @click="showModal" :style="{ fontSize: '16px', color: '#08c' }"></el-icon>
                    <el-icon v-else slot="suffix" type="close-circle" @click="deleteModel" :style="{ fontSize: '16px', color: '#08c' }"></el-icon> -->
        </el-input>
      </template>
      <template #other>
        <ul class="userList">
          <li v-for="item in selectedRows"
              :key="item.modelCode">
            <el-tag>型号名称：{{item.modelName}}</el-tag>
            <el-tag>型号简称：{{item.abbreviation}}</el-tag>
            <el-tag>所属领域：{{item.classify}}</el-tag>
          </li>
        </ul>
      </template>
<!--      <template v-if="copyProjectButtonVisible"-->
<!--                #btn>-->
<!--        <el-button @click="copyProject">复制项目</el-button>-->
<!--      </template>-->
      <template #mainLeadUser>
        <el-input v-model='modify["mainLeadUser"]'
                  readonly
                  autosize
                  placeholder="请选择主管所领导">
          <i v-if='selectedRows1'
             class='el-icon-link'
             slot='suffix'
             type='link'
             @click='openTable'
             :style='{ fontSize: "16px", color: "#08c" }'></i>
        </el-input>
        <select-user v-if="visible1"
                     :visible="visible1"
                     :selected-row='selectedRows1'
                     @close-dialog="closeModal1"></select-user>
      </template>
      <template #beginTime>
        <el-col>
          <el-form-item>
            <el-date-picker v-model="modify['beginTime']"
                            type="date"
                            placeholder="开始时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                            :picker-options="startPickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </template>
      <template #endTime>
        <el-col>
          <el-form-item>
            <el-date-picker v-model="modify['endTime']"
                            type="date"
                            placeholder="结束时间"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                            :picker-options="endPickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </template>
    </form-list>
    <select-model v-if="visible"
                  :visible="visible"
                  @close-modal="closeModal"
                  :disabled-row="disabledRow"></select-model>
    <copy-project-index v-if="copyProjectIndexVisible"
                        @close-copy-project="closeCopyProject"
                        :visible="copyProjectIndexVisible"
                        :disabled-row="disabledRow"></copy-project-index>
  </div>
</template>

<script>
import SelectModel from '@/views/Product/Em/EntiretyBase/Components/SelectModel'
import { P8SelectUser as SelectUser } from '~/index'
import copyProjectIndex from '@/views/Product/Em/EntiretyBase/Components/copyIndex'
import { P8Form as FormList } from '~/index'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import { Button, Tag, Input, Col, FormItem, DatePicker } from '~/index'
export default {
  name: 'wholeDescribe',
  components: {
    copyProjectIndex,
    FormList,
    SelectModel,
    SelectUser,
    // eslint-disable-next-line vue/no-unused-components
    'el-button': Button,
    'el-tag': Tag,
    'el-col': Col,
    // eslint-disable-next-line vue/no-unused-components
    'el-form-item': FormItem,
    'el-input': Input,
    'el-date-picker': DatePicker
  },
  props: {
    currEntityId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      saveApi: 'ProjectApply.wholeDescribeSave',
      projectRoles: [],
      startPickerOptions: {
        disabledDate: (time) => {
          let timeSpace = moment(time).format('YYYY-MM-DD') > this.modify['endTime']
          return timeSpace
        }
      },
      endPickerOptions: {
        disabledDate: (time) => {
          let timeSpace = moment(time).format('YYYY-MM-DD') < this.modify['beginTime']
          return timeSpace
        }
      },
      deptIds: [],
      selectedRows: [],
      selectedRows1: [],
      selectedRowKeys: [],
      classifyDisabledTree: [],
      visible: false,
      visible1: false,
      isCustomValidate: true,
      copyProjectIndexVisible: false,
      copyProjectButtonVisible: true,
      otherParam: {},
      modify: {
        modelCode: '',
        mainLeadUser: '',
        mainLeadUserId: '',
        entityId: '',
        classifyCode: ''
      },
      disabledRow: [],
      dataSource: [],
      sourceTaskBookId: '',
      sourceCopyData: {}
    }
  },
  created: function () {
    let that = this
    that.$api['ProjectApply.projectClassifyTree']({ dataType: '' }).then(res => {
      if (res) {
        res.forEach(node => {
          if (node.id === '0' || node.pId === '0') {
            that.classifyDisabledTree.push(node.id)
          }
        })
      }
    })

    let dataSourceTemp = [
      {
        type: 'blank',
        labelText: '型号代号',
        slotName: 'modelCode',
        fieldName: 'modelCode',
        colLayout: 'doubleCol',
        rules: [{ required: true, message: '该项为必填项' }]
      },
      {
        type: 'blank',
        labelText: '型号信息:',
        slotName: 'other',
        colLayout: 'doubleCol'
      },
      {
        type: 'text', // 控件类型
        labelText: '项目名称', // 控件显示的文本
        fieldName: 'name',
        placeholder: '请输入项目名称', // 默认控件的空值文本
        colLayout: 'doubleCol',
        rules: [
          {
            required: true,
            message: '必填'
          }
        ]
      },
      {
        type: 'hidden',
        labelText: '项目编号',
        fieldName: 'pjCode',
        colLayout: 'doubleCol'
      },
      {
        type: 'select',
        labelText: '项目来源',
        fieldName: 'source',
        colLayout: 'doubleCol',
        optionUrl: {
          api: 'thirdPartInterface.getDic',
          params: { dicType: 'USERNAME' }
        },
        options: [],
        rules: [{ required: true, message: '必须选择项目来源' }]
      },
      {
        type: 'treeSelect',
        labelText: '项目类型', /// treeSelect选中但输入框无值
        fieldName: 'kprojectClassifyId',
        colLayout: 'doubleCol',
        defaultExpandAll: true,
        defaultValue: [],
        disabledValues: this.classifyDisabledTree,
        placeholder: '请选择项目类型',
        optionUrl: {
          api: 'ProjectApply.projectClassifyTree',
          params: {},
          // label: 'name',
          value: 'id'
        },
        rules: [
          {
            required: true,
            message: '必须选择项目类型'
          }
        ],
        treeData: []
      },
      // {
      //   type: 'select',
      //   labelText: '项目分级',
      //   optionUrl: {
      //     api: 'thirdPartInterface.getDic',
      //     params: { dicType: 'PROJECT_ORDER' }
      //   },
      //   options: [],
      //   fieldName: 'projectOrder',
      //   colLayout: 'doubleCol',
      //   rules: [
      //     {
      //       required: true,
      //       message: '必须选择项目分级'
      //     }
      //   ]
      // },
      // {
      //   type: 'treeSelect',
      //   labelText: '默认流程',
      //   fieldName: 'activityInfoId',
      //   placeholder: '选择默认流程',
      //   defaultValue: null,
      //   defaultExpandAll: true,
      //   colLayout: 'doubleCol',
      //   optionUrl: {
      //     api: 'ProjectApply.getFlowTreeData',
      //     params: {}
      //   },
      //   treeData: []
      // },
      {
        type: 'select',
        labelText: '项目密级',
        fieldName: 'secretGrade',
        colLayout: 'doubleCol',
        optionUrl: {
          api: 'thirdPartInterface.getDic',
          params: { dicType: 'SECRET_LEVEL' }
        },
        options: [],
        rules: [{ required: true, message: '必须选择项目密级' }]
      },
      {
        type: 'select',
        labelText: '经费来源',
        fieldName: 'fundsSource',
        colLayout: 'doubleCol',
        optionUrl: {
          api: 'thirdPartInterface.getDic',
          params: { dicType: 'FUNDS_SOURCE' }
        },
        options: [],
        rules: [{ required: true, message: '必须选择经费来源' }]
      },
      {
        type: 'blank',
        labelText: '开始时间',
        fieldName: 'beginTime',
        slotName: 'beginTime',
        colLayout: 'doubleCol',
        rules: [{ required: true, message: '该项为必填项' }]
      },
      {
        type: 'blank',
        labelText: '完成时间',
        fieldName: 'endTime',
        slotName: 'endTime',
        colLayout: 'doubleCol',
        rules: [{ required: true, message: '该项为必填项' }]
      },
      // {
      //   type: 'treeSelect',
      //   labelText: '管理部门',
      //   fieldName: 'departmentId',
      //   colLayout: 'doubleCol',
      //   defaultValue: [],
      //   disabledValues: ['1'],
      //   defaultExpandedKeys: ['1'],
      //   placeholder: '请选择管理部门',
      //   optionUrl: {
      //     api: 'ProjectApply.deptTree',
      //     params: {}
      //   },
      //   rules: [
      //     {
      //       required: true,
      //       message: '必须选择管理部门'
      //     }
      //   ],
      //   treeData: []
      // },
      {
        type: 'treeSelect',
        labelText: '主承部门',
        fieldName: 'mainDept',
        colLayout: 'doubleCol',
        disabledValues: ['1'],
        defaultExpandedKeys: ['1'],
        defaultValue: [],
        placeholder: '请选择主承部门',
        optionUrl: {
          api: 'ProjectApply.deptTree',
          params: {}
        },
        rules: [
          {
            required: true,
            message: '必须选择主承部门'
          }
        ],
        treeData: []
      },
      // {
      //     type: 'blank',
      //     labelText: '主管所领导',
      //     fieldName: 'mainLeadUser',
      //     slotName: 'mainLeadUser',
      //     colLayout: 'doubleCol',
      //     rules: [{ required: true, message: '主管所领导' }]
      // },
      {
        type: 'datetime', // 控件类型
        labelText: '申请时间', // 控件显示的文本
        placeholder: '请选择申请时间',
        colLayout: 'doubleCol',
        fieldName: 'createTime',
        fieldConfig: {
          'value-format': 'yyyy-MM-dd'
        },
        rules: [{ required: true, message: '必须选择申请时间' }]
      },

        {
          type: 'text',
          labelText: '项目概算(万元)',
          fieldName: 'estimateBudget',
          colLayout: 'doubleCol'
        },
      {
          type: 'text',
          labelText: '自筹金额(万元)',
          fieldName: 'raiseBudget',
          colLayout: 'doubleCol'
      },
        {
          type: 'text',
          labelText: '拨款金额(万元)',
          fieldName: 'appropriationBudget',
          colLayout: 'doubleCol'
        },
      {
        type: 'textarea',
        labelText: '项目概述简述',
        fieldName: 'backdrop',
        colLayout: 'singleCol',
        rules: [{ required: true, message: '必须填写项目概述简述' }]
      },
      // {
      //   type: 'textarea',
      //   labelText: '项目目标',
      //   fieldName: 'projectTarget',
      //   colLayout: 'singleCol',
      //   rules: [{ required: true, message: '必须填写项项目目标' }]
      // },
      {
        type: 'textarea',
        labelText: '特别关注事项',
        fieldName: 'particular',
        colLayout: 'singleCol'
      }
    ]
    this.dataSource = dataSourceTemp
  },
  mounted: function () {
    let that = this
    this.$nextTick(function () {
      if (that.currEntityId) {
        that.copyProjectButtonVisible = false
      } else {
        that.copyProjectButtonVisible = true
      }
    })
  },
  methods: {
    customValidate (saveParams) {
      let beginTime = saveParams.beginTime
      let endTime = saveParams.endTime
      let modelCode = saveParams.modelCode
      if (endTime && beginTime) {
        saveParams.beginTime = beginTime
        saveParams.endTime = endTime
        saveParams.field = this.modify.classifyCode
        if (modelCode && modelCode !== '') {
          this.$refs.form.submitForm(saveParams, this.saveApi)
        } else {
          this.$message({
            message: '请选择型号信息！',
            type: 'error'
          })
        }
      } else {
        console.log('save error ')
      }
    },
    rendered () {
      if (this.currEntityId && this.currEntityId !== '') {
        this.getProjectData(this.currEntityId, 'update')
      }
    },
    openTable () {
      this.visible1 = true
    },
    getProjectData (currEntityId, dataType) {
      let that = this
      if (dataType === 'update') {
        that.$api['ProjectApply.wholeDescribeData']({ entityId: currEntityId, dataType: dataType }).then(res => {
          console.log(res, '查看信息44455444！')
          that.fillData(that, res, dataType)
        })
      } else if (dataType === 'copy') {
        that.fillData(that, this.sourceCopyData, dataType)
      }
    },
    fillData (that, data, dataType) {
      data.leadDepts = Object.assign([], data.leadDeptIds)
      that.modify = data
      if (dataType === 'update') {
        that.modify.entityId = data.id
      } else if (dataType === 'copy') {
        that.modify.entityId = ''
        that.modify.name = that.modify.name + '【复制】'
      }
      // that.modify.beginEndTime = [moment(data.beginTime, 'YYYY-MM-DD'), moment(data.endTime, 'YYYY-MM-DD')]
      // that.modify.realBeginEndTime = [moment(data.realBeginTime, 'YYYY-MM-DD'), moment(data.realEndTime, 'YYYY-MM-DD')]
      that.modify.beginEndTime = [data.beginTime, data.endTime]
      that.modify.realBeginEndTime = [data.realBeginTime, data.realEndTime]
      that.selectedRows = []
      that.selectedRows.push({
        id: data.modelInformationId,
        modelCode: data.modelCode,
        modelName: data.modelName,
        abbreviation: data.abbreviation,
        classify: data.classify
      })
      that.modify.modelCode = data.modelCode
      that.modify.pjCode = data.newPjCode
      that.modify.modelInformationId = data.modelInformationId
      that.modify.leadDeptIds = []
      data.leadDepts.map(function (item) {
        that.modify.leadDeptIds.push(item.departmentId)
      })
      that.modify = Object.assign({}, that.modify)
    },
    saved (res) {
      if (!this.modify.entityId && res.id) {
        this.modify.entityId = res.id
      }
      if (res && res.id) {
        this.$bus.$emit('setProjectEntityId', res.id)
      }
    },
    handleChange (info) {
      console.log(info, 'info')
    },
    showModal () {
      this.visible = true
    },
    closeModal (selectedRow) {
      this.visible = false
      if (selectedRow) {
        this.selectedRows[0] = selectedRow
        this.disabledRow = this.selectedRows[0].id
        if (this.selectedRows.length) {
          this.modify.modelCode = this.selectedRows[0].modelCode
          this.modify.modelInformationId = this.selectedRows[0].id
          this.modify.classify = this.selectedRows[0].classify
          this.modify.classifyCode = this.selectedRows[0].customItem1
        }
      }
    },
    closeModal1 (selectedRow1) {
      this.visible1 = false
      this.selectedRow1 = selectedRow1
      if (this.selectedRow1) {
        let that = this
        that.modify.mainLeadUser = this.selectedRow1[0].realName
        that.modify.mainLeadUserId = this.selectedRow1[0].id
      }
    },
    deleteModel () {
      this.disabledRow = []
      this.selectedRows = []
      this.$refs.form.setFields({ modelCode: '' })
    },
    copyProject () {
      this.copyProjectIndexVisible = true
    },
    closeCopyProject (sourceTaskBookId, sourceCopyData) {
      this.copyProjectIndexVisible = false
      if (sourceCopyData) {
        this.sourceTaskBookId = sourceTaskBookId
        this.sourceCopyData = sourceCopyData
        this.getProjectData(null, 'copy')
      }
    },
    changeTaskBookId: function (val) {
      this.sourceTaskBookId = val
    }
  }
}
</script>

<style scoped>
</style>
