<template>
  <list-layout :headerVisible="headerVisible">
    <template #center>
      <common-tabs :tabsData="tabsData"
                   height="auto"
                   :activeTabs="activeTabs">
        <template #warningInformation>
          <warning-list v-model="record"
                        :record="record"></warning-list>
        </template>
        <template #warningSet>
          <warning-set v-model="record"
                       :record="record"></warning-set>
        </template>
      </common-tabs>
    </template>
  </list-layout>
</template>

<script>
import { P8ListLayout as ListLayout } from '~/index'
import { P8Tabs as CommonTabs } from '~/index'
import WarningSet from './edit'
import WarningList from './list'

export default {
  name: 'Index',
  props: {
    thirdMenuParam: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      activeTabs: 'warningInformation',
      record: this.thirdMenuParam,
      headerVisible: false,
      tabsData: [
        {
          label: '预警信息',
          name: 'warningInformation',
          value: 0
        },
        {
          label: '预警设置',
          name: 'warningSet'
        }
      ],
      formData: Object.assign({}, {
        confidentialiteList: []
      })
    }
  },
  mounted () {
    this.countTask()
  },
  methods: {
    countTask () {
      let that = this
      let planInfoId = that.record.planInfoId
      if (planInfoId) {
        that.$api['planWarning.countWarningTask']({ 'planInfoId': planInfoId }).then(function (res) {
          if (res) {
            that.tabsData[0].value = res
          }
        })
      }
    }
  },
  components: {
    ListLayout,
    CommonTabs,
    WarningSet,
    WarningList
  }
}
</script>
<style scoped>
</style>
