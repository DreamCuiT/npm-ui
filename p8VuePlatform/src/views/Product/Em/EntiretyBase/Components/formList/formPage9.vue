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
import formPage from './formTemplate1'
export default {
  name: 'formPage9',
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
          fieldName: 'manageDept', // 管理部门
          required: true
        },
        {
          fieldName: 'leadDeptIds', // 参研部门
          hidden: true
        },
        {
          fieldName: 'dutyUser', // 项目负责人
          hidden: true
        },
        {
          fieldName: 'mainLeadUser', // 主管所领导
          required: true
        },
        {
          fieldName: 'backdrop', // 项目概述
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
        },
        {
          fieldName: 'projectOffer', // 项目报价(方案竞标必填)
          hidden: true
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
