<template>
  <div :style="{ 'height': dialogMaxHeight }" >
   <erp-list v-if="erpView" :planTypeParam="planTypeParam">
   </erp-list>
  </div>
</template>
<script>
import ErpList from '@/views/Product/Pm/Plan/Components/erpList'
const mh = document.documentElement.clientHeight
export default {
  name: 'PdmFile',
  props: {
    formCompProp: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
        dialogMaxHeight: mh + 'px',
        erpView: false,
        planTypeParam: {}
    }
  },
  components: {
    ErpList
  },
  created () {
    let that = this
    this.$api['courtyardTask.getTaskData']({ ...this.formCompProp }).then(res => {
      if (res) {
        that.planTypeParam = { ...that.formCompProp, ...res }
        console.log(this.that, 'formCompPropformCompPropformCompProp')
        that.erpView = true
      } else {
        that.erpView = false
      }
    })
  }
}

</script>
<style lang="scss" scoped>
</style>
