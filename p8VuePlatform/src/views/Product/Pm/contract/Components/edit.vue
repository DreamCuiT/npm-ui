<template>
  <div>
    <form-list ref='form'
               @rendered='rendered'
               @saved='saved'
               :form='modify'
               :dataSource='dataSource'
               :api='saveApi'>
      <template #paNodeRequire>
        <el-button class="add-btn"
                   @click="addLine">添加合同节点信息</el-button>
        <el-table :data="modify.paNodeRequireList"
                  style="width: 100%">
          <el-table-column type="index"
                           label="序号"
                           align="center"></el-table-column>
          <el-table-column prop="nodeName"
                           label="节点名称"
                           align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.nodeName"
                        placeholder="节点名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="payMoney"
                           label="节点金额（万元）"
                           align="center">
            <template slot-scope="scope">

              <el-input v-model="scope.row.payMoney"
                        placeholder="节点金额（万元）"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="forecastLimit"
                           label="节点估额（万元）"
                           align="center">
            <template slot-scope="scope">

              <el-input v-model="scope.row.forecastLimit"
                        placeholder="节点估额（万元）"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="endTime"
                           label="结束时间"
                           align="center">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.endTime"
                              type="date"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              placeholder="结束时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="danger"
                         v-if="!scope.row.editing"
                         icon="el-icon-delete"
                         @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #name>
        <el-input v-model='modify["name"]'
                  v-on:click.native="showModal"
                  readonly
                  autosize
                  placeholder="请选择项目">
          <i v-if='selectedRow'
             class='el-icon-link'
             slot='suffix'
             type='link'
             :style='{ fontSize: "16px", color: "#08c" }'></i>
        </el-input>
      </template>
    </form-list>
    <select-project v-if='selectProjectVisible'
                    :selected-row='selectedRow'
                    :visible='selectProjectVisible'
                    @close-modal='closeModal'></select-project>
  </div>
</template>
<script>
import SelectModel from '@/views/Product/Em/EntiretyBase/Components/SelectModel'
import { P8Form as FormList } from '~/index'
// eslint-disable-next-line standard/object-curly-even-spacing
import { Button, Table, TableColumn, DatePicker, Input } from '~/index'
import SelectProject from './selectProject'

export default {
  name: 'CreateContract',
  components: {
    FormList,
    SelectProject,
    'el-button': Button,
    // eslint-disable-next-line vue/no-unused-components
    SelectModel,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-date-picker': DatePicker,
    'el-input': Input
  },
  props: {
    currContractId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      saveApi: 'contractManager.save',
      selectProjectVisible: false,
      labelWidth: 'auto',
      isCustomValidate: true,
      selectedRow: {},
      visible: false,
      dataSource: [
        {
          type: 'blank',
          labelText: '项目名称',
          slotName: 'name',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '请选择项目' }]
        },
        {
          type: 'text',
          labelText: '合同编号',
          fieldName: 'contractNum',
          colLayout: 'doubleCol',
          rules: [{ required: true, message: '请填写合同编号' }]
        },
        {
          type: 'text',
          labelText: '合同名称',
          fieldName: 'contractName',
          colLayout: 'doubleCol',
          rules: [{ required: true, message: '请填写合同名称' }]
        },
        {
          type: 'number',
          labelText: '合同总金额（万元）',
          fieldName: 'allMoney',
          colLayout: 'doubleCol',
          min: 0
        },
        {
          type: 'text',
          labelText: '合同甲方',
          fieldName: 'firstParty',
          colLayout: 'doubleCol',
          rules: [{ required: true, message: '请填写合同甲方' }]
        },
        {
          type: 'datetime',
          labelText: '签订时间',
          fieldName: 'concludeTime',
          colLayout: 'doubleCol',
          rules: [{ required: true, message: '必须选择日期' }],
          fieldConfig: {
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          type: 'select',
          labelText: '合同签订单位',
          fieldName: 'departmentId',
          colLayout: 'doubleCol',
          optionUrl: {
            api: 'ProjectApply.deptTree',
            params: {}
          },
          rules: [{ required: true, message: '请选择合同签订单位' }]
        },
        {
          type: 'select',
          labelText: '合同密级',
          fieldName: 'security',
          colLayout: 'doubleCol',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'SECRET_LEVEL' }
          }
        },
        {
          type: 'datetime',
          labelText: '合同完成时间',
          fieldName: 'finishedDate',
          colLayout: 'doubleCol',
          rules: [{ required: true, message: '必须选择日期' }],
          fieldConfig: {
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          type: 'select',
          labelText: '合同币种',
          fieldName: 'coinType',
          colLayout: 'doubleCol'
        },
        {
          type: 'text',
          labelText: '汇率',
          fieldName: 'parities',
          colLayout: 'doubleCol'
        },
        {
          type: 'number',
          labelText: '合同预估金额',
          fieldName: 'forecastLimit',
          colLayout: 'doubleCol',
          min: 0
        },
        {
          type: 'blank',
          labelText: '',
          slotName: 'paNodeRequire',
          colLayout: 'singleCol'
        }

      ],
      modify: {
        paNodeRequireList: [{
          endTime: '',
          payMoney: '',
          nodeName: '',
          forecastLimit: ''
        }]
      }
    }
  },
  methods: {
    rendered () {
      if (this.currContractId && this.currContractId !== '') {
        console.log(this.currContractId)
        this.getProjectData(this.currContractId, 'update')
      }
    },
    getProjectData: function (currContractId, dataType) {
      let that = this
      if (dataType === 'update') {
        that.$api['contractManager.getContract']({ id: currContractId, dataType: dataType }).then(res => {
          console.log(res)
          let data = res.contract
          data.paNodeRequireList = res.paNodeRequire
          data.name = res.name
          that.modify = Object.assign(data, {})
        })
      }
    },
    saved (res) {
      console.log(res)
      this.$emit('save-success', res)
    },
    addLine () { // 添加行数
      var newValue = {
        payMoney: '',
        // eslint-disable-next-line no-dupe-keys
        nodeName: '',
        forecastLimit: ''
      }
      // 添加新的行数
      this.modify.paNodeRequireList.push(newValue)
    },
    handleDelete (index) { // 删除行数
      this.modify.paNodeRequireList.splice(index, 1)
    },
    // 项目选择
    showModal: function () {
      this.selectProjectVisible = true
    },
    closeModal (selectedRow) {
      this.selectProjectVisible = false
      this.selectedRow = selectedRow
      if (this.selectedRow) {
        let that = this
        that.$set(that.modify, 'name', selectedRow.name)
        that.modify.wholeDescribeId = selectedRow.id
      }
      this.dataSource[0].name = selectedRow.name
    }

  }
}
</script>
<style scoped>
.add-btn {
  margin: 10px;
}

.pm40 {
  padding-bottom: 40px;
}
.add-btn {
  margin: 10px;
}
.pm40 {
  padding-bottom: 40px;
}
</style>
