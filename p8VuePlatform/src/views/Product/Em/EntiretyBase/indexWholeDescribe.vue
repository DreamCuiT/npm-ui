<template>
  <div>
<!--
    <form-render :dataViewId="thirdMenuParam.id" :record="{desformCode:thirdMenuParam.codeForm} " :propParam = "thirdMenuParam" @save-success = "callback"> </form-render>
-->
    <research-module v-if="visibleResearchShowDrawer"
                     :visible="visibleResearchShowDrawer"
                     :curr-entity-id="currEntityId"
                     :plan-info-id="planInfoId"
                     :config-id="configId"
                     @close-modal="handleCancel"
                     :emData="emData"></research-module>
    <integration-module v-if="visibleIntegrationShowDrawer"
                        :visible="visibleIntegrationShowDrawer"
                        :curr-entity-id="currEntityId"
                        :plan-info-id="planInfoId"
                        :config-id="configId"
                        @close-modal="handleCancel"
                        :emData="emData"></integration-module>
    <tech-innovation-module v-if="visibleinnovationShow"
                            :visible="visibleinnovationShow"
                            :curr-entity-id="currEntityId"
                            :plan-info-id="planInfoId"
                            :config-id="configId"
                            @close-modal="handleCancel"
                            :emData="emData"></tech-innovation-module>
    <research-module-view v-if="visibleResearchViewDrawer"
                          :visible="visibleResearchViewDrawer"
                          appliedRange="approveView"
                         :curr-entity-id="currEntityId">

    </research-module-view>
    <integration-module-view v-if="visibleIntegrationViewDrawer"
                             :visible="visibleIntegrationViewDrawer"
                             appliedRange="approveView"
                             :curr-entity-id="currEntityId">

    </integration-module-view>
    <tech-innovation-module-view v-if="visibleTechInnovationViewDrawer"
                                 :visible="visibleTechInnovationViewDrawer"
                                 appliedRange="approveView"
                                 :curr-entity-id="currEntityId">

    </tech-innovation-module-view>
  </div>
</template>

<script>
import ResearchModule from './Components/formList/researchModule'
import IntegrationModule from './Components/formList/MCIntegrationModule'
import techInnovationModule from './Components/formList/techInnovationModule'
import ResearchModuleView from './Components/formList/researchModuleView'
import IntegrationModuleView from './Components/formList/MCIntegrationModuleView'
import techInnovationModuleView from './Components/formList/techInnovationModuleView'
export default {
  name: 'indexWholeDescribe',
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
    // FormRender,
    ResearchModule,
    ResearchModuleView,
    IntegrationModule,
    IntegrationModuleView,
    techInnovationModule,
    techInnovationModuleView
  },
  data () {
    return {
      visibleResearchShowDrawer: false,
      visibleIntegrationShowDrawer: false,
      visibleinnovationShow: false,
      visibleResearchViewDrawer: false,
      visibleIntegrationViewDrawer: false,
      visibleTechInnovationViewDrawer: false,
      currEntityId: null,
      planInfoId: '',
      configId: '',
      emData: ''
    }
  },
  mounted () {
    this.currEntityId = this.thirdMenuParam.currEntityId
    this.initJumpPage()
  },
  methods: {
      // saveCallback () {
      //     this.visibleResearchShowDrawer = false
      //     this.$emit('saveSuccess', null)
      // },
      handleCancel () {
          this.visibleResearchShowDrawer = false
          this.$emit('saveSuccess')
          this.$emit('closeVisible')
          this.$bus.$emit('CLOSEDRAWER')
      },
    initJumpPage () {
      if (this.thirdMenuParam.researchShow) {
        this.visibleResearchShowDrawer = true
      }
      if (this.thirdMenuParam.integrationShow) {
        this.visibleIntegrationShowDrawer = true
      }
      if (this.thirdMenuParam.innovationShow) {
        this.visibleinnovationShow = true
      }
      if (this.thirdMenuParam.researchModuleView) {
            this.visibleResearchViewDrawer = true
      }
      if (this.thirdMenuParam.MCIntegrationModuleView) {
            this.visibleIntegrationViewDrawer = true
      }
      if (this.thirdMenuParam.techInnovationModuleView) {
            this.visibleTechInnovationViewDrawer = true
      }
      this.planInfoId = this.thirdMenuParam.id
      this.configId = this.thirdMenuParam.config
      this.emData = this.thirdMenuParam.emData
    },
    callback (data) {
      if (data !== '') {
        this.$api['ProjectApply.startProcess']({ entityId: data, classifyId: this.thirdMenuParam.classifyId, filedId: this.thirdMenuParam.filedId }).then(function (res) {
          if (res) {
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
