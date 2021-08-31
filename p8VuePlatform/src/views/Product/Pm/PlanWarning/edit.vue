<template>
  <list-layout>
    <template #north
              style="height: 71px">
      <div class="centerHead">
        <el-button type="primary"
                   v-on:click="save()">保存</el-button>
      </div>
    </template>
    <template #center>
      <div class="tableDiv">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="noticePer">是否消息通知责任人</el-checkbox>
          <el-checkbox label="noticeSupPer">是否消息通知上级责任人</el-checkbox>
        </el-checkbox-group>
        <el-table :data="tableData"
                  :height="flexHeight"
                  highlight-current-row
                  row-key="id"
                  v-bind="tableConfig"
                  :default-expand-all="true"
                  @cell-click="cellClick"
                  @rendered="rendered">
          <el-table-column v-for="(item, index) in columns"
                           :key="index"
                           :prop="item.prop"
                           :align='center'
                           :type="item.type"
                           :label="item.label"
                           :width="item.width">
            <template slot-scope="scope">

              <div v-if="item.prop=='warningProgress'"
                   class=" warningProgressDiv">
                <el-input-number v-model="scope.row[item.prop]"
                                 @blur="removeClass"
                                 :step="1"
                                 :min="0">
                </el-input-number>
              </div>
              <div v-if="item.prop == 'warningDay'"
                   class="warningDayDiv">
                <el-input-number @blur="removeClass"
                                 :step="1"
                                 :min="0"
                                 v-model="scope.row[item.prop]">
                </el-input-number>
              </div>

              <template v-if="item.prop == 'warningDay'">
                <template v-if="scope.row[item.prop] == null">
                  <span>提前&nbsp;0&nbsp;天</span>
                </template>
                <template v-else>
                  <span>提前 &nbsp;{{ scope.row[item.prop] }}&nbsp; 天</span>
                </template>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </list-layout>
</template>
<style scoped>
#centerHead {
  height: 71px;
}
.tableDiv .warningProgressDiv {
  display: none;
}
.current-cell .warningProgressDiv {
  display: block;
}
.current-cell .warningProgressDiv + span {
  display: none;
}
.tableDiv .warningDayDiv {
  display: none;
}
.current-cell .warningDayDiv {
  display: block;
}
.current-cell .warningDayDiv + span {
  display: none;
}
</style>

<script>
import Vue from 'vue'
import { P8ListLayout as ListLayout } from '~/index'
import { Table, TableColumn, InputNumber, Button, CheckboxGroup, Checkbox } from '~/index'
// import Axios from 'axios'

const mh = document.documentElement.clientHeight - 160
export default {
  name: 'CollectionBudgetManager',
  components: {
    ListLayout,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-input-number': InputNumber,
    'el-button': Button,
    'el-checkbox-group': CheckboxGroup,
    'el-checkbox': Checkbox
  },
  props: {
    record: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      tableApi: 'planWarning.setWarningPointList',
      flexHeight: mh,
      content: null,
      center: 'center',
      queryParam: {},
      columns: [],
      tableData: [],
      isListLoading: false, // 列表加载
      comp: this,
      planStatus: {},
      searchData: [],
      tableConfig: {

      },
      checkList: []
    }
  },
  created () {
    this.initColumns()
  },
  mounted () {
    this.queryList()
  },
  methods: {

    rendered () {
      // 所有表单元素渲染后调用rendered
      if (this.record.id) {
        console.log(this.record.id)
      }
    },

    cellClick (row, column, cell, event) {
      for (let i = 0; i < document.getElementsByClassName('current-cell').length; i++) {
        document.getElementsByClassName('current-cell')[i].classList.remove('current-cell')
      }
      cell.classList.add('current-cell')
    },

    removeClass () {
      document.getElementsByClassName('current-cell')[0].classList.remove('current-cell')
    },

    initColumns: function () {
      let that = this
      const columns = [
        {
          label: '监控属性',
          prop: 'label',

          align: 'center'
        },
        {
          label: '预警天数',
          prop: 'warningDay',
          align: 'center'
        },
        {
          label: '预警进度',
          prop: 'warningProgress',
          align: 'center',
          nameEdit: true

        }
      ]
      that.columns = columns
    },
    setItemKey (item) {
      item.key = item.id
      let that = this
      if (item.children && item.children.length > 0) {
        item.children.map(function (subItem, idx) {
          that.setItemKey(subItem)
        })
      }
    },
    queryList () {
      const that = this
      this.isListLoading = true
      this.tableRefresh(new Promise((resolve, reject) => {
        if (that.tableApi) {
          let planInfoId = that.record.planInfoId
          that.$api[that.tableApi]({ 'planInfoId': planInfoId }, this.record).then(function (res) {
            that.isListLoading = false
            res.forEach(function (item, idx) {
              that.setItemKey(item)
            })
            that.tableData = res
            if (res[0].noticePer != null) {
              that.checkList.push('noticePer')
            }
            if (res[0].noticeSupPer != null) {
              that.checkList.push('noticeSupPer')
            }
            resolve()// 调用列表接口成功后的回调方法
          }).catch(function (error) {
            reject(error) // 调用列表接口失败后的回调方法
          })
        }
      }))
    },
    save () {
      let that = this
      let req = {
        isSendCurrent: '',
        isSendUp: '',
        taskWarningList: []
      }
      let data = that.tableData
      for (let i = 0; i < data.length; i++) {
        let warningName = data[i].label
        let warningDay = data[i].warningDay
        let warningProgress = data[i].warningProgress
        let domainClassify = that.record.id
        let planInfoId = that.record.planInfoId
        let taskWarning = {
          id: '',
          planInfoId: planInfoId,
          domainClassify: domainClassify,
          warningName: warningName,
          warningDay: warningDay,
          warningProgress: warningProgress,
          isSendCurrent: '',
          isSendUp: ''
        }
        req.taskWarningList.push(taskWarning)
      }
      for (let i in that.checkList) {
        if (that.checkList[i] === 'noticePer') {
          req.isSendCurrent = 1
        } else if (that.checkList[i] === 'noticeSupPer') {
          req.isSendUp = 1
        }
      }

      that.$api['earlyWarning.saveEarlyWarning'](req).then(res => {
        if (res === 'true') {
          that.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },

    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = null })
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    }
  }
}
</script>
