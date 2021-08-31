<template>
  <el-popover
    placement="top-start"
    width="200"
    trigger="hover">
    <!-- <template #content> -->
      <div class="popover-content-con">
        <div class="title"><span>空闲时段</span></div>
        <ul class="times">
          <li v-for="(item,index) in row.idleDaysList" :key="index">
            <span>{{item.startDate}} 至 {{item.endDate}}</span>
          </li>
        </ul>
      </div>
    <!-- </template> -->
    <div class="idle-con" slot="reference" :style="{'background-color': bgColor}">
      <span>{{row.utilization}}%</span>
    </div>
  </el-popover>
</template>
<script>
import { Popover } from '~/index'
import moment from 'moment'
export default {
  name: 'IdleDays',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      bgColor: ''
    }
  },
  mounted () {
    // #caf982 -- 浅绿 #f8d081 -- 浅黄; #d9001b -- 深红
    this.row.idleDaysList.forEach(item => {
      item.startDate = moment(item.startDate).format('YYYY-MM-DD')
      item.endDate = moment(item.endDate).format('YYYY-MM-DD')
    })
    this.bgColorHandle()
  },
  methods: {
    bgColorHandle () {
      let utilization = parseInt(this.row.utilization || '10%')
      if (utilization >= 0 && utilization <= 30) {
        this.bgColor = '#d9001b'
      } else if (utilization > 30 && utilization <= 70) {
        this.bgColor = '#f8d081'
      } else {
        this.bgColor = '#caf982'
      }
      // console.log('--radio--', this.bgColor)
    }
  },
  components: {
    'el-popover': Popover
  }
}
</script>
<style lang="scss">
  .idle-con {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    // background-color: #caf982;
  }
  .popover-content-con {
    width: 200px;
    max-height: 300px;
    overflow-y: auto;
    .title {
      line-height: 30px;
      border-bottom: 1px solid #cccccc;
      padding-left: 10px;
    }
    ul.times {
      padding: 0 10px;
      li {
        height: 30px;
        line-height: 30px;
        color: #999;
      }
    }
  }
</style>
