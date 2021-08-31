<template>
    <div>
        <form-list ref="form"
        @rendered="rendered"
        @saved="()=>{}"
        :dataSource="dataSource"
        :api="saveApi"
        :form="modify"
        :view="modify"
        :existDefaultBtn="false"
        :other-param="otherParam">
            <template #other>
                <ul class="userList">
                    <li v-for="item in selectedRows" :key="item.modelCode">
                        <el-tag>型号名称：{{item.modelName}}</el-tag>
                        <el-tag>型号代号：{{item.modelCode}}</el-tag>
                        <el-tag>所属领域：{{item.classifyDisplay}}</el-tag>
                    </li>
                </ul>
            </template>
        </form-list>
    </div>
</template>

<script>
import { Tag } from '~/index'
import { P8Form as FormList } from '~/index'
export default {
  name: 'wholeDescribeView',
  components: {
    'el-tag': Tag,
    FormList
  },
  props: {
    currEntityId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      projectRoles: [],
      deptIds: [],
      selectedRows: [],
      visible: false,
      copyProjectIndexVisible: false,
      otherParam: {},
      modify: {},
      saveApi: '',
      selectedRowKeys: [],
      selectedCopyRows: [],
      selectedCopyRowKeys: [],
      disabledRow: [],
      dataSource: [
        {
          type: 'view',
          labelText: '项目名称', // 控件显示的文本
          fieldName: 'name',
          placeholder: '请输入项目名称', // 默认控件的空值文本
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '内部流水代码',
          fieldName: 'projectCode',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '项目代码',
          fieldName: 'pjCode',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '所属型号',
          fieldName: 'modelCode',
          colLayout: 'doubleCol'
        },
        {
          type: 'hidden',
          labelText: '型号相关信息',
          slotName: 'other',
          colLayout: 'doubleCol'
        },
        {
            type: 'view',
            labelText: '型号名称',
            fieldName: 'modelName',
            colLayout: 'doubleCol'
        },
        {
            type: 'view',
            labelText: '型号简称',
            fieldName: 'abbreviation',
            colLayout: 'doubleCol'
        },
        {
            type: 'view',
            labelText: '所属领域',
            fieldName: 'classify',
            colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '项目类型',
          fieldName: 'kprojectClassifyname',
          colLayout: 'doubleCol'
        },
        // {
        //   type: 'view',
        //   labelText: '项目分级',
        //   fieldName: 'projectOrder',
        //   colLayout: 'doubleCol'
        // },
        {
          type: 'view',
          labelText: '选择流程',
          fieldName: 'activityInfoName',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '排序号',
          fieldName: 'indexNo'
        },
        {
          type: 'view',
          labelText: '信息涉密密级',
          fieldName: 'secretGrade',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '经费来源',
          fieldName: 'fundsSource',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '任务来源',
          fieldName: 'source',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '计划起始时间',
          fieldName: 'beginEndTime',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '实际起-始(预计)时间',
          fieldName: 'realBeginEndTime',
          colLayout: 'singleCol',
          placeholder: ['时机开始日期', '实际完成(预计)日期']
        },
        {
          type: 'view',
          labelText: '责任部门',
          fieldName: 'departmentName',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '项目参与部门',
          fieldName: 'leadDept',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '项目概述简述',
          fieldName: 'backdrop',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '项目目标',
          fieldName: 'projectTarget',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '特别关注事项',
          fieldName: 'particular',
          colLayout: 'singleCol'
        }
      ],
      dicData: []
    }
  },
  mounted () {

  },
  methods: {
    rendered () {
      let that = this
      that.$api['ProjectApply.getDicAPIByTypes']({ dicTypes: 'USERNAME,FUNDS_SOURCE,SECRET_LEVEL,CONTROL_SCOPE,PROJECT_ORDER' }).then(res => {
        that.dicData = res
        console.log(that.dicData, 'that.dicData')
        if (that.currEntityId && that.currEntityId !== '') {
          that.getProjectData(that.currEntityId)
        }
      })
    },
    getProjectData (currEntityId) {
      let that = this
      that.$api['ProjectApply.wholeDescribeData']({ entityId: currEntityId, dataType: 'update' }).then(res => {
        let data = res
        that.$emit('copy-data', Object.assign({}, res))
        that.modify = data
        that.modify.name = data.name
        that.modify.beginEndTime = data.beginTime + '   至   ' + data.endTime
        that.modify.realBeginEndTime = data.realBeginTime + '   至   ' + data.realEndTime
        that.selectedRows.push({
          id: data.modelInformationId,
          modelCode: data.modelCode,
          modelName: data.modelName,
          classifyDisplay: data.modelClassifyDisplay
        })
        that.modify.modelCode = data.modelCode
        that.modify.modelInformationId = data.modelInformationId
        that.modify.tempArray = []
        for (let item of data.leadDeptIds) {
          that.modify.tempArray.push(item.departmentName)
        }
        that.modify.leadDept = that.modify.tempArray.join(',')
        that.modify.source = this.dicLabel('USERNAME', that.modify.source)
        that.modify.fundsSource = this.dicLabel('FUNDS_SOURCE', that.modify.fundsSource)
        that.modify.secretGrade = this.dicLabel('SECRET_LEVEL', that.modify.secretGrade)
        that.modify.projectOrder = this.dicLabel('PROJECT_ORDER', that.modify.projectOrder)
        that.modify = Object.assign({}, that.modify)
        that.$refs.form.setViewFields(that.modify)
      })
    },
    dicLabel (type, val) {
      if (type && val) {
        if (this.dicData[type][val] && this.dicData[type][val].label) {
          return this.dicData[type][val].label
        }
        return undefined
      } else {
        return undefined
      }
    }
  },
  watch: {
    currEntityId: function (val, oldVal) {
      if (val !== oldVal) {
        this.getProjectData(this.currEntityId)
      }
    }
  }
}
</script>

<style scoped>

</style>
