<template>
  <div>
    <form-list
      ref="form"
      @rendered="rendered"
      @saved="()=>{}"
      :dataSource="dataSource"
      :form="record"
      api=""
      :existDefaultBtn="false"
    ></form-list>
  </div>
</template>

<script>
import { P8Form as FormList } from '~/index'
export default {
  name: 'schedulerTaskView',
  components: {
    FormList
  },
  props: {
    record: {
      type: Object
    }
  },
  data () {
    return {
      dataSource: [
        {
          type: 'view',
          labelText: '名称',
          fieldName: 'name',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '类型',
          fieldName: 'type',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: 'classPath',
          fieldName: 'classPath',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: 'method',
          fieldName: 'method',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '参数',
          fieldName: 'params',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '时机',
          fieldName: 'timing',
          formatter (row, column, cellValue, index) {
            let v = ''
            switch (cellValue) {
              case 'immediately':v = '立即执行'
                break
              case 'polling':v = '定时轮询'
                break
            }
            return v
          }
        },
        {
          type: 'view',
          labelText: '定时策略',
          fieldName: 'cron',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '描述',
          fieldName: 'description',
          colLayout: 'singleCol'
        }
      ]
    }
  },
  methods: {
    rendered () {
      this.$refs.form.setViewFields(this.record)
    }
  }
}
</script>

<style scoped>
</style>
