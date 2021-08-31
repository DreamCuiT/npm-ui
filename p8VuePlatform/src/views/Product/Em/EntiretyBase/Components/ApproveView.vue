<template>
  <div>
    <index-whole v-if="visibleProjectcreate" :third-menu-param="thirdMenuParam"></index-whole>
  </div>
</template>

<script>
import indexWhole from '../indexWholeDescribeEntry'
export default {
  name: 'ApproveView',
  components: {
    indexWhole
  },
  props: {
    selectedApproval: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      businessId: this.selectedApproval.businessKey,
      visibleProjectcreate: false,
      thirdMenuParam: {
      }
    }
  },
  mounted () {
    this.rendered()
  },
  methods: {
    rendered () {
      let that = this
        if (that.businessId && that.businessId !== '') {
          that.$api['ProjectApply.getOne']({ wholeDescribeId: that.businessId }).then(function (res) {
            if (res) {
              that.thirdMenuParam.planInfoId = res.id
              that.thirdMenuParam.configId = res.configId
              that.thirdMenuParam.modifyOrView = 'view'
              that.thirdMenuParam.emData = {}
              that.thirdMenuParam.emData.configId = res.configId
              that.thirdMenuParam.emData.configName = res.configName
              that.thirdMenuParam.emData.filedId = res.filedId
              that.thirdMenuParam.emData.sourceId = res.sourceId
              that.thirdMenuParam.emData.classifyId = res.classifyId
              that.thirdMenuParam.emData.filedName = res.filedName
              that.thirdMenuParam.emData.sourceName = res.sourceName
              that.thirdMenuParam.emData.classifyName = res.classifyName
              that.visibleProjectcreate = true
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
