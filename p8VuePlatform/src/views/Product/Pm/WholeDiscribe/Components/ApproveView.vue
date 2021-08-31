<template>
<wholeDescribeView :currEntityId = "selectedApproval.businessKey"></wholeDescribeView>
</template>

<script>
import wholeDescribeView from './wholeDescribeView'
export default {
  name: 'ApproveView',
  components: {
    wholeDescribeView
  },
  props: {
    selectedApproval: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      businessId: this.selectedApproval.businessKey
    }
  },
  mounted () {

  }
}
</script>

<style scoped>

</style>
