<template>
    <div>
      <normal-resolve-index
      v-if="visibleRormal"
      :thirdMenuParam="thirdMenuParam" >
      </normal-resolve-index>

        <overall-planning-resolve-index
         v-if="visibleOverall"
        :thirdMenuParam="thirdMenuParam">
      </overall-planning-resolve-index>
    </div>
</template>

<script>
import NormalResolveIndex from './index'
import OverallPlanningResolveIndex from './resolveIndex'
export default {
  name: 'researchPlanIndex',
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
    NormalResolveIndex,
    OverallPlanningResolveIndex
  },
  data () {
    return {
      visibleRormal: false,
      visibleOverall: false,
      jumpPage: ''
    }
  },
  mounted () {
    this.jumpPage = this.thirdMenuParam.currentPage
    if (this.jumpPage === 'normal') {
      this.visibleRormal = true
    } else {
      this.visibleRormal = false
    }
    if (this.jumpPage === 'overallPlanning') {
      this.visibleOverall = true
    } else {
      this.visibleOverall = false
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
