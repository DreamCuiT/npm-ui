<template>
  <div>
    <form-list ref="form"
               @rendered="rendered"
               :dataSource="dataSource"
               :is-view="true"
               :existDefaultBtn="false"
               :form="modify">
    </form-list>
    <template v-if="dataList.length > 0">

      <!-- /// commonTable 中不支持直接传data 待组件满足 -->
      <common-table ref="table"
                    :table-config="tableConfig"
                    :columns="columns"
                    :params="queryParam"
                    :customHeight="flexHeight"
                    api=""
                    :noApiTableData="dataList"
                    :table-Refresh="tableRefresh"
                    :pagination="true"
                    @click="iconClick">
      </common-table>

    </template>
  </div>

</template>
<script>
import { P8Form as FormList } from '~/index'
import { P8Table as CommonTable } from '~/index'
const mh = document.documentElement.clientHeight - 200
const columns = [
  {
    title: '序号',
    type: 'index',
    align: 'center',
    width: '50'
  }, {
    title: '团队角色名称',
    dataIndex: 'roleName',
    align: 'center'
  }, {
    title: '系统角色名称',
    dataIndex: 'sysRoleName',
    align: 'center'
  }
]
export default {
  name: 'Details',
  components: {
    FormList,
    CommonTable
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      flexHeight: mh,
      advanced: false,
      columns: columns,
      queryParam: {},
      modify: {
        detailList: []
      },
      dataList: [],
      dataSource: [
        {
          type: 'view',
          labelText: '项目类型',
          fieldName: 'kprojectClassifyName',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '团队名称',
          fieldName: 'name',
          colLayout: 'singleCol'
        },
        {
          type: 'view',
          labelText: '团队描述',
          fieldName: 'describe',
          colLayout: 'singleCol'
        }

      ],
      tableConfig: {
        // bordered: true,
        // size:'middle'
      }
    }
  },
  mounted () {
  },
  methods: {
    rendered () {
      if (this.id && this.id !== '') {
        this.getProjectTeamSettingData(this.id)
      }
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    iconClick (record) {
      console.log(record, 'record')
    },
    getProjectTeamSettingData (id) {
      let that = this
      that.$api['projectTeamSetting.detail']({ id: id }).then(function (res) {
        let data = res.team
        that.dataList = res.detailList
        console.log(that.dataList, 'dataListdataListdataList')
        that.modify = Object.assign(data, {})
        that.$refs.form.setViewFields(that.modify)
        console.log(that.modify, 'that.modify')
      }).catch(function (error) {
        console.log(error)
      })
    }
  }

}

</script>
