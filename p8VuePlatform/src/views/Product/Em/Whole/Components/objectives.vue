<template>
  <div class="projectTarget">
    <form-list ref="form"
               :dataSource="dataSource"
               :form="formData"
               :api="saveApi"
               @saved="saved"
               labelWidth="100px"
               :isCustomValidate="true"
               @custom-validate="customValidate"
               @rendered="rendered">
    </form-list>
    <common-tabs :tabsData="tabsData"
                 :height="height"
                 :activeTabs="activeTabs">
      <template #projectTarget>
        <editable-table :columns="columns"
                        :params="tableParams"
                        :addRow="true"
                        :api="tableConfigDetailsApi"
                        @save-param-data="saveTableData">
          <template #name="{scope, data}">
            <el-input v-model="scope.row.name"
                      @blur="saveTableData(data)"></el-input>
          </template>
        </editable-table>
      </template>
      <template #progressTarget>
        <editable-table :columns="paramColumns"
                        :addRow="true"
                        :params="paramParams"
                        :api="tableConfigDetailsApi"
                        @save-param-data="saveParamData">
          <template #name="{scope, data}">
            <el-input v-model="scope.row.name"
                      @blur="saveParamData(data)"></el-input>
          </template>
          <template #target="{scope, data}">
            <el-input v-model="scope.row.target"
                      @blur="saveParamData(data)"></el-input>
          </template>
          <template #beginTime="{scope, data}">
            <el-date-picker v-model="scope.row.beginTime"
                            type="date"
                            :value-format="valueFormat"
                            @change="saveParamData(data)"
                            placeholder="选择日期">
            </el-date-picker>
          </template>
          <template #endTime="{scope, data}">
            <el-date-picker v-model="scope.row.endTime"
                            type="date"
                            :value-format="valueFormat"
                            @change="saveParamData(data)"
                            placeholder="选择日期">
            </el-date-picker>
          </template>
        </editable-table>
      </template>
      <template #yearTarget>
        <editable-table :columns="buttonColumns"
                        :addRow="true"
                        :params="buttonParams"
                        :api="tableConfigDetailsApi"
                        @save-param-data="saveButtonData">
          <template #year="{scope, data}">
            <el-input v-model="scope.row.year"
                      @blur="saveButtonData(data)"></el-input>
          </template>
          <template #name="{scope, data}">
            <el-input v-model="scope.row.name"
                      @blur="saveButtonData(data)"></el-input>
          </template>
          <template #realName="{scope, data}">
            <el-input v-model="scope.row.realName"
                      @blur="saveButtonData(data)"
                      v-on:click.native="showModal3(scope, data)"
                      placeholder="请选择责任人"
                      readonly>
              <i v-if='selectedRow3'
                 class='el-icon-link'
                 slot='suffix'
                 type='link'
                 :style='{cursor: "pointer","margin-top":"8px",fontSize: "16px", color: "#08c" }'></i>
            </el-input>
            <select-user v-if="visible4"
                         :visible="visible4"
                         :selected-row='selectedRow3'
                         @close-dialog="closeModal3"></select-user>
          </template>
          <template #targetType="{scope, data}">
            <el-input v-model="scope.row.targetType"
                      @blur="saveButtonData(data)"></el-input>
          </template>
        </editable-table>
      </template>
      <template #insuranceTarget>
        <editable-table :columns="binsuranceColumns"
                        :addRow="true"
                        :params="insuranceParams"
                        :api="tableConfigDetailsApi"
                        @save-param-data="insuranceData">
          <template #year="{scope, data}">
            <el-input v-model="scope.row.year"
                      @blur="insuranceData(data)"></el-input>
          </template>
          <template #name="{scope, data}">
            <el-input v-model="scope.row.name"
                      @blur="insuranceData(data)"></el-input>
          </template>
          <template #realName="{scope, data}">
            <el-input v-model="scope.row.realName"
                      @blur="insuranceData(data)"
                      v-on:click.native="showModal3(scope, data)"
                      placeholder="请选择责任人"
                      readonly>
              <i v-if='selectedRow3'
                 class='el-icon-link'
                 slot='suffix'
                 type='link'
                 :style='{ cursor: "pointer","margin-top":"8px",fontSize: "16px", color: "#08c" }'></i>
            </el-input>
            <select-user v-if="visible4"
                         :visible="visible4"
                         :selected-row='selectedRow3'
                         :selectType="selectType"
                         @close-dialog="closeModal3"></select-user>
          </template>
        </editable-table>
      </template>
      <template #deliveryTarget>
        <editable-table :columns="deliveryColumns"
                        :addRow="true"
                        :params="deliveryParams"
                        :api="tableConfigDetailsApi"
                        @save-param-data="deliveryData">
          <template #productNo="{scope, data}">
            <el-input v-model="scope.row.productNo"
                      @blur="deliveryData(data)"></el-input>
          </template>
          <template #productName="{scope, data}">
            <el-input v-model="scope.row.productName"
                      @blur="deliveryData(data)"></el-input>
          </template>
          <template #payDate="{scope, data}">
            <el-date-picker v-model="scope.row.payDate"
                            type="date"
                            :value-format="valueFormat"
                            @change="saveParamData(data)"
                            placeholder="选择日期">
            </el-date-picker>
          </template>
          <template #payNum="{scope, data}">
            <el-input v-model="scope.row.payNum"
                      @blur="deliveryData(data)"></el-input>
          </template>
          <template #stage="{scope, data}">
            <el-input v-model="scope.row.stage"
                      @blur="deliveryData(data)"></el-input>
          </template>
          <template #batch="{scope, data}">
            <el-input v-model="scope.row.batch"
                      @blur="deliveryData(data)"></el-input>
          </template>
        </editable-table>
      </template>
      <template #challengeTarget>
        <editable-table :columns="challengeColumns"
                        :addRow="true"
                        :params="challengeParams"
                        :api="tableConfigDetailsApi"
                        @save-param-data="challengeData">
          <template #year="{scope, data}">
            <el-input v-model="scope.row.year"
                      @blur="challengeData(data)"></el-input>
          </template>
          <template #name="{scope, data}">
            <el-input v-model="scope.row.name"
                      @blur="challengeData(data)"></el-input>
          </template>
        </editable-table>
      </template>
    </common-tabs>
  </div>
</template>

<script>
import { Input, DatePicker } from '~/index'
import { P8Form as FormList } from '~/index'
import { P8Tabs as CommonTabs } from '~/index'
import { P8EditTable as EditableTable } from '~/index'
import { P8SelectUser as SelectUser } from '~/index'
export default {
  name: 'TableEdit',
  components: {
    FormList,
    CommonTabs,
    EditableTable,
    SelectUser,
    'el-input': Input,
    'el-date-picker': DatePicker
  },
  props: {
    record: {
      type: Object,
      default: () => { }
    },
    currEntityId: {
      type: String,
      default: ''
    }
  },
  data () {
    const height = document.documentElement.clientHeight - 142
    return {
      saveApi: 'ProjectTarget.saveProjectTarget',
      dataSource: [
      ],
      selectedRow3: {},
      visible4: false,
      selectType: '1',
      formData: {
        type: ''
      },
      sqlIdOption: [],
      height: height + 'px',
      valueFormat: 'yyyy-MM-dd',
      tabsData: [
        // {
        //   label: '项目总体目标',
        //   name: 'projectTarget',
        //   icon: 'icon-multi-project-manage'
        // },
        // // {
        // //   label: '进度目标',
        // //   name: 'progressTarget',
        // //   icon: 'icon-business-execution'
        // // },
        // {
        //   label: '项目年度目标',
        //   name: 'yearTarget',
        //   icon: 'icon-process-template'
        // },
        // // {
        // //   label: '产保目标',
        // //   name: 'insuranceTarget',
        // //   icon: 'icon-process-template'
        // // },
        // {
        //   label: '项目交付目标',
        //   name: 'deliveryTarget',
        //   icon: 'icon-process-template'
        // }
        // ,
        // {
        //   label: '挑战目标',
        //   name: 'challengeTarget',
        //   icon: 'icon-process-template'
        // }

      ],

      columns: [
        {
          title: '序号',
          type: 'index',
          minWidth: 45,
          align: 'center'
        },
        {
          title: '目标名称',
          dataIndex: 'name',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' },
          align: 'center'
        }

      ],
      paramColumns: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '目标名称',
          dataIndex: 'name',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '阶段',
          dataIndex: 'target',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '开始时间',
          dataIndex: 'beginTime',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        }, {
          title: '完成时间',
          dataIndex: 'endTime',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        }

      ],
      buttonColumns: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '年度',
          dataIndex: 'year',
          minWidth: 120,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '目标名称',
          dataIndex: 'name',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '责任人',
          dataIndex: 'realName',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '目标类型',
          dataIndex: 'targetType',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        }
      ],
      binsuranceColumns: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '年度',
          dataIndex: 'year',
          minWidth: 120,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '目标名称',
          dataIndex: 'name',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '责任人',
          dataIndex: 'realName',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        }

      ],
      deliveryColumns: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '产品代号',
          dataIndex: 'productNo',
          minWidth: 120,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '交付日期',
          dataIndex: 'payDate',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '交付数量',
          dataIndex: 'payNum',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '阶段',
          dataIndex: 'stage',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '批次',
          dataIndex: 'batch',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        }
      ],
      challengeColumns: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '年度',
          dataIndex: 'year',
          minWidth: 120,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '目标名称',
          dataIndex: 'name',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        }
      ],
      tableParams: { wholeDescribeId: this.currEntityId, type: '1' },
      paramParams: { wholeDescribeId: this.currEntityId, type: '2' },
      buttonParams: { wholeDescribeId: this.currEntityId, type: '3' },
      insuranceParams: { wholeDescribeId: this.currEntityId, type: '4' },
      deliveryParams: { wholeDescribeId: this.currEntityId, type: '5' },
      challengeParams: { wholeDescribeId: this.currEntityId, type: '6' },
      activeTabs: 'yearTarget',
      reportParams: {
        wholeDescribeId: this.currEntityId
      },
      tableConfigDetailsApi: 'ProjectTarget.getList', // 报表配置列表的api，可切换
      oldSqlId: ''
    }
  },
  mounted () {
    this.initListData()
  },
  methods: {
    initListData () {
      let _this = this
      _this.$api['ProjectApply.functionMenuList']({ type: 'BUTTON', productId: this.currEntityId, parentid: 'YLB02' }).then(function (res) {
        _this.tabsData = res
      })
    },
    rendered () {
      // 所有表单元素渲染后调用rendered
      if (this.record.id) {
        this.getFormData()
      }
    },
    getFormData () {
      this.modifyTableData(this.formData.id)
    },
    saved (res) {
      console.log('修改页面关闭时的回调方法')
      this.$emit('saveSuccess', res)
    },
    saveTableData (data) {
      this.formData.type = '1'
      this.reportParams['projectTargetVos'] = data
    },
    saveParamData (data) {
      this.formData.type = '2'
      this.reportParams['projectTargetVos'] = data
    },
    saveButtonData (data) {
      this.formData.type = '3'
      this.reportParams['projectTargetVos'] = data
    },
    insuranceData (data) {
      this.formData.type = '4'
      this.reportParams['projectTargetVos'] = data
    },
    deliveryData (data) {
      this.formData.type = '5'
      this.reportParams['projectTargetVos'] = data
    },
    challengeData (data) {
      this.formData.type = '6'
      this.reportParams['projectTargetVos'] = data
    },
    customValidate (saveParams) {
      let params = { ...saveParams, ...this.reportParams }
      this.$refs.form.submitForm(params, this.saveApi)
    },
    showModal3 (scope, data) {
      this.visible4 = true
      this.editTableIndex = scope.$index
      this.editTableData = data
    },
    closeModal3 (selectedRow3) {
      this.visible4 = false
      this.selectedRow3 = selectedRow3
      if (this.selectedRow3 && this.selectedRow3.length) {
        this.editTableData[this.editTableIndex].realName = this.selectedRow3[0].realName
        this.editTableData[this.editTableIndex].userId = this.selectedRow3[0].id
        this.sqlParams['projectTargetVos'] = this.editTableData
      }
    }
  }
}
</script>

<style lang="scss">
.projectTarget{
  height:calc(100% - 50px);
  .formList.el-form {
    height:0!important;
    > .el-row{
      padding:0;
      &.formBtn{
        padding:10px;
      }
    }
  }
}
</style>
