<template>
  <normal-layout :headerVisible="false">
    <template #west>
      <div style="text-align: center">
        <span>已参与的项目</span>
      </div>
    </template>
    <template #center>
        <div class="common-table">
          <div :class="{'small-table': true}" :style="{height: flexHeight }">
            <el-table ref="table"
              height="100%"
              stripe
              :data="tableData"
              row-key="id"
              @select="tableSelect"
              @select-all="tableSelect">
              <el-table-column
                type="selection"
                width="50"
                align="center">
              </el-table-column>
              <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center">
              </el-table-column>
              <el-table-column
                prop="name"
                label="角色名称"
                align="center">
              </el-table-column>
            </el-table>
          </div>
        </div>
    </template>
  </normal-layout>
</template>
<script>
import { P8NormalLayout as NormalLayout } from '~/index'
import { Table, TableColumn } from '~/index'
export default {
  name: 'ExperienceTeam',
  data () {
    return {
      flexHeight: '350px',
      tableApi: '',
      tableData: []
    }
  },
  mounted () {
    this.getRoleList()
  },
  methods: {
    getRoleList () {
      let id = this.$attrs.id
      this.$api['projectTeam.myRoleList']({ wholeDescribeId: id }).then(res => {
        this.tableData = res
      })
    },
    tableSelect (selection) {
      // console.log('--selection--', selection)
      this.$emit('experience-table-select', selection)
    }
  },
  components: {
    NormalLayout,
    'el-table': Table,
    'el-table-column': TableColumn
  }
}
</script>
