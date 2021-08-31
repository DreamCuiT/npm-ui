<template>
  <div>
    <component ref="wholeContent"
              :thirdMenuParam="thirdMenuParam"
              v-if="formComp != null && formComp != ''"
              :is="componentLoader"
              v-bind="formCompProp" />
  </div>
</template>

<script>

export default {
  name: 'indexWholeDescribeEntry',
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

  },
  computed: {
    componentLoader () {
      let comp = this.formComp
      return () => import('@/views/' + comp)
    }
  },
  data () {
    return {
      formComp: '',
      formCompProp: {},
      configId: '',
      emData: ''
    }
  },
  mounted () {
    this.formComp = this.thirdMenuParam.emData.configName
  },
  methods: {

  }
}
</script>

<style scoped>
</style>
