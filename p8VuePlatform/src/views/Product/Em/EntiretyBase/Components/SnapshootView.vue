<template>
    <wholeDescribeView v-if="isWholeDescribeView" :snapshoot="snapshoot"></wholeDescribeView>
</template>

<script>
import wholeDescribeView from './wholeDescribeView'
export default {
  name: 'BpmnSnapshoot',
  components: {
    wholeDescribeView
  },
  props: {
    selectedApproval: {
      type: Object,
      default: () => { }
    },
    snapshootView: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      snapshoot: undefined,
      isWholeDescribeView: false
    }
  },
  mounted () {
    this.getSnapshoot()
  },
  methods: {
    rendered () {
    },
    getSnapshoot () {
      let this_ = this
      let params = {}
      if (this_.snapshootView.snapshootType === 'task') {
        params.taskId = this_.selectedApproval.processTaskId
      } else {
        params.processInstanceId = this_.selectedApproval.processInstId
      }
      this_.snapshoot = this_.snapshootView.snapshoot
      this_.isWholeDescribeView = true
    }
  },
  watch: {
    selectedApproval: function (val, oldVal) {

    }
  }
}
</script>

<style scoped>

</style>
