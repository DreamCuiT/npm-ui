<template>
    <div>
        <form-list ref="form"
        @rendered="rendered"
        @saved="saved"
        :is-custom-validate="isCustomValidate"
        @custom-validate = "customValidate"
        @changeTaskBookId="changeTaskBookId"
        :dataSource="dataSource"
        :api="saveApi"
        :form="modify"
        :other-param="otherParam">
            <template #enter-num>
                <el-input v-model="modify.modelCode" @click.native="visible=true">
                    <!-- <el-icon v-if="!selectedRows.length" slot="suffix" type="link" @click="showModal" :style="{ fontSize: '16px', color: '#08c' }"></el-icon>
                    <el-icon v-else slot="suffix" type="close-circle" @click="deleteModel" :style="{ fontSize: '16px', color: '#08c' }"></el-icon> -->
                </el-input>
            </template>
            <template #other>
                <ul class="userList">
                    <li v-for="item in selectedRows" :key="item.modelCode">
                        <el-tag>型号名称：{{item.modelName}}</el-tag>
                        <el-tag>型号代号：{{item.modelCode}}</el-tag>
                        <el-tag>所属领域：{{item.classifyDisplay}}</el-tag>
                    </li>
                </ul>
            </template>
            <template v-if="copyProjectButtonVisible" #btn>
                <el-button @click="copyProject">复制项目</el-button>
            </template>
        </form-list>
        <select-model v-if="visible" :visible="visible" @close-modal="closeModal" :disabled-row="disabledRow"></select-model>
        <copy-project-index v-if="copyProjectIndexVisible" @close-copy-project="closeCopyProject" :visible="copyProjectIndexVisible" :disabled-row="disabledRow"></copy-project-index>
    </div>
</template>

<script>
import SelectModel from '@/views/Product/Em/EntiretyBase/Components/SelectModel'
import copyProjectIndex from '@/views/Product/Em/EntiretyBase/Components/copyIndex'
import { P8Form as FormList } from '~/index'
import { Button, Tag, Input } from '~/index'
export default {
  name: 'wholeDescribe',
  components: {
    // selectModel,
    copyProjectIndex,
    FormList,
    SelectModel,
    'el-button': Button,
    'el-tag': Tag,
    'el-input': Input
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
      deptIds: [],
      selectedRows: [],
      selectedRowKeys: [],
      visible: false,
      isCustomValidate: true,
      copyProjectIndexVisible: false,
      copyProjectButtonVisible: true,
      otherParam: {},
      modify: {
        modelCode: '',
        entityId: ''
      },
      disabledRow: [],
      dataSource: [
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
          type: 'text',
          labelText: '内部流水代码',
          fieldName: 'projectCode',
          colLayout: 'doubleCol',
          fieldConfig: {
            disabled: true
          }
        },
        {
          type: 'text',
          labelText: '项目代码',
          fieldName: 'pjCode',
          colLayout: 'doubleCol'
        },
        {
          type: 'number',
          labelText: '排序号',
          fieldName: 'indexNo',
          colLayout: 'doubleCol'
        },
        {
          type: 'blank',
          labelText: '所属型号',
          slotName: 'enter-num',
          colLayout: 'doubleCol'
        },
        {
          type: 'blank',
          labelText: '型号相关信息',
          slotName: 'other',
          colLayout: 'doubleCol'
        },
        {
          type: 'treeSelect',
          labelText: '项目类型', /// treeSelect选中但输入框无值
          fieldName: 'kprojectClassifyId',
          colLayout: 'doubleCol',
          defaultValue: [],
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
        {
          type: 'treeSelect',
          labelText: '选择流程',
          fieldName: 'activityInfoId',
          placeholder: '选择流程',
          defaultValue: [],
          colLayout: 'doubleCol',
          optionUrl: {
            api: 'ProjectApply.getFlowTreeData',
            params: {}
          },
          treeData: []
        },
        {
          type: 'select',
          labelText: '信息涉密密级',
          fieldName: 'secretGrade',
          colLayout: 'doubleCol',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'SECRET_LEVEL' }
          },
          options: [],
          rules: [{ required: true, message: '必须选择信息涉密密级' }]
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
          type: 'select',
          labelText: '任务来源',
          fieldName: 'source',
          colLayout: 'doubleCol',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'USERNAME' }
          },
          options: [],
          rules: [{ required: true, message: '必须选择任务来源' }]
        },
        {
          type: 'datetimeRange',
          labelText: '计划起始时间',
          fieldName: 'beginEndTime',
          colLayout: 'doubleCol',
          placeholder: ['计划开始日期', '计划完成日期'],
          rules: [{ required: true, message: '必须选择日期' }],
          fieldConfig: {
            style: 'width: 100%',
            'value-format': 'yyyy-MM-dd'
          }
        },
        {
          type: 'datetimeRange',
          labelText: '实际起-始(预计)时间',
          fieldName: 'realBeginEndTime',
          colLayout: 'doubleCol',
          placeholder: ['时机开始日期', '实际完成(预计)日期'],
          rules: [{ required: true, message: '必须选择日期' }],
          fieldConfig: {
            style: 'width: 100%',
            'value-format': 'yyyy-MM-dd'
          }
        },
        {
          type: 'treeSelect',
          labelText: '责任部门',
          fieldName: 'departmentId',
          colLayout: 'doubleCol',
          defaultValue: [],
          placeholder: '请选择责任部门',
          optionUrl: {
            api: 'ProjectApply.deptTree',
            params: {}
          },
          rules: [
            {
              required: true,
              message: '必须选择管理部门'
            }
          ],
          treeData: []
        },
        {
          type: 'treeSelect',
          labelText: '项目参与部门',
          fieldName: 'leadDeptIds',
          colLayout: 'singleCol',
          multiple: true,
          defaultValue: [],
          optionUrl: {
            api: 'ProjectApply.deptTree',
            params: {}
          },
          treeData: []
        },
        {
          type: 'textarea',
          labelText: '项目概述简述',
          fieldName: 'backdrop',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '必须填写项目概述简述' }]
        },
        {
          type: 'textarea',
          labelText: '项目目标',
          fieldName: 'projectTarget',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '必须填写项项目目标' }]
        },
        {
          type: 'textarea',
          labelText: '特别关注事项',
          fieldName: 'particular',
          colLayout: 'singleCol'
        }
      ],
      sourceTaskBookId: '',
      sourceCopyData: {}
    }
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
      let beginEndTime = saveParams.beginEndTime
      let realBeginEndTime = saveParams.realBeginEndTime
      if (beginEndTime.length === 2 && realBeginEndTime.length === 2) {
        saveParams.beginTime = beginEndTime[0]
        saveParams.endTime = beginEndTime[1]
        saveParams.realBeginTime = realBeginEndTime[0]
        saveParams.realEndTime = realBeginEndTime[1]
        this.$refs.form.submitForm(saveParams, this.saveApi)
      } else {
        console.log('save error ')
      }
    },
    rendered () {
      if (this.currEntityId && this.currEntityId !== '') {
        this.getProjectData(this.currEntityId, 'update')
      }
    },
    getProjectData (currEntityId, dataType) {
      let that = this
      if (dataType === 'update') {
        that.$api['ProjectApply.wholeDescribeData']({ entityId: currEntityId, dataType: dataType }).then(res => {
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
        classifyDisplay: data.modelClassifyDisplay
      })
      that.modify.modelCode = data.modelCode
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
      this.$emit('save-success', res)
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
          /// this.otherParam = { 'modelCode': this.selectedRows[0].id }
        }
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
