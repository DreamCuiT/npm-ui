<template>
  <div>
    <form-page
              :modifyOrView="modifyOrView"
              :plan-info-id="planInfoId"
              :config-id="configId"
              :emData="emData"></form-page>
  </div>
</template>

<script>
import formPage from './formTemplate4'
export default {
  name: 'formPage4',
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
      emData: {}
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
