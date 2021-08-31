<template>
    <div class="dash-list">
        <el-table v-loading="!tableData.length" height="100%" :data="tableData" stripe >
            <el-table-column prop="date" label="日期" width="180"
                             align="center"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"
                             align="center"></el-table-column>
            <el-table-column prop="address" label="地址"
                             align="center"></el-table-column>
        </el-table>
    </div>
</template>
<script>
import { Table, TableColumn } from '~/index'
import { tableData } from '@/mock/tableData'

export default {
  name: 'DashList',
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    setTimeout(() => {
      this.tableData = tableData
    }, 1000)
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn
  }
}
</script>
<style>
.dash-list{
    padding: 15px 0 0 0;
}
</style>
