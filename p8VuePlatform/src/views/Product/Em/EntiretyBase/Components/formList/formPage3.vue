<template>
  <div>
    <form-page
              :formParam="formParam"
              :modifyOrView="modifyOrView"
              :plan-info-id="planInfoId"
              :config-id="configId"
              :emData="emData"></form-page>
  </div>
</template>

<script>
import formPage from './formTemplate2'
export default {
  name: 'formPage3',
  props: {
    thirdMenuParam: {
      // 给三级菜单所传的参数
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    formPage
  },
  data () {
    return {
      planInfoId: '',
      configId: '',
      modifyOrView: '',
      emData: {},
      // 表三
      formParam: [
        {
          fieldName: 'field', // 所属领域
          required: true
        },
        {
          fieldName: 'kprojectClassifyId', // 项目类型
          required: true
        },
        {
          fieldName: 'name', // 项目名称
          required: true
        },
        {
          fieldName: 'modelInformationCode', // 型号代号
          required: true
        },
        {
          fieldName: 'source', // 项目来源
          required: true
        },
        {
          fieldName: 'secretGrade', // 项目密级
          required: true
        },
        {
          fieldName: 'projectType', // 项目类别
          required: true
        },
        {
          fieldName: 'techDirection', // 工程技术方向
          required: true
        },
        {
          fieldName: 'majorDirection', // 是否符合专业技术发展指南
          required: true
        },
        {
          fieldName: 'guideDirection', // 对应指南方向
          required: true
        },
        {
          fieldName: 'isMajorProjects', // 是否重大项目
          required: true
        },
        {
          fieldName: 'beginTime', // 预计开始时间
          required: true
        },
        {
          fieldName: 'endTime', // 预计完成时间
          required: true
        },
        {
          fieldName: 'mainDept', // 主承部门
          required: true
        },
        {
          fieldName: 'mainLeadUser', // 主管所领导
          required: true
        },
        {
          fieldName: 'sysDept', // 客户名称
          required: false
        },
        {
          fieldName: 'backdrop', // 需求背景
          required: true
        },
        {
          fieldName: 'manageDept', // 管理部门
          required: true
        },
        {
          fieldName: 'researchObjective', // 研究目标
          required: true
        },
        {
          fieldName: 'achievement', // 成果形式
          required: true
        },
        {
          fieldName: 'expectResult', // 预期效果
          required: true
        },
        {
          fieldName: 'applicationDirection', // 应用方向
          required: true
        },
        {
          fieldName: 'fundsSource', // 经费来源
          required: true
        },
        {
          fieldName: 'appropriationBudget', // 国拨金额预估
          required: true
        },
        {
          fieldName: 'localBudaget', // 地配金额预估
          required: true
        },
        {
          fieldName: 'raiseBudget', // 自筹金额预估
          required: true
        },
        {
          fieldName: 'totalBudget', // 总概算预估
          required: true
        }
      ]
    }
  },
  created () {
    this.planInfoId = this.thirdMenuParam.planInfoId
    this.configId = this.thirdMenuParam.configId
    this.emData = this.thirdMenuParam.emData
    this.modifyOrView = this.thirdMenuParam.modifyOrView
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped>
</style>
