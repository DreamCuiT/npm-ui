<template>
  <div class="projectMilestone">
    <form-list ref="form"
               :dataSource="dataSource"
               :form="formData"
               :api="saveApi"
               @saved="saved"
               labelWidth="90px"
               @rendered="rendered"
               :existDefaultBtn="false"
               :isCustomValidate="true"
               @custom-validate="parseCheck">
    </form-list>
    <template>
        <editable-table :columns="paramColumns"
                        :renderHeight="renderHeight"
                        :params="params"
                        :api="tableConfigDetailsApi"
                        @save-param-data="saveParamData">
        </editable-table>
    </template>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/sql/sql'
import { P8Form as FormList } from '~/index'
import { P8EditTable as EditableTable } from '~/index'
export default {
  name: 'SqlEdit',
  components: {
    FormList,
    EditableTable
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
    const height = document.documentElement.clientHeight - 171
    return {
      renderHeight: height + 'px',
      valueFormat: 'yyyy-MM-dd',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'sql',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      },
      saveApi: 'Milestone.saveMilestone',
      tableConfigDetailsApi: 'Milestone.getByWholeId',
      visible4: false,
      selectType: '1',
      selectedRow3: {},
      dataSource: [

      ],
      formData: {
        wholeId: this.currEntityId
      },
      paramColumns: [
        {
          title: '序号',
          type: 'index',
          minWidth: 45,
          align: 'center'
        },
        {
          title: '完成内容',
          dataIndex: 'name',
          minWidth: 140,
          default: '',
          align: 'left'
        },
        {
          title: '责任人',
          dataIndex: 'realName',
          minWidth: 100,
          default: '',
          align: 'center'
        },
        {
          title: '完成时间',
          dataIndex: 'endTime',
          maxWidth: 100,
          default: '',
          align: 'center'
        },
        {
          title: '完成形式',
          dataIndex: 'finishType',
          width: 140,
          default: undefined,
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 140,
          default: undefined,
          align: 'left'
        }
      ],
      params: {},
      sqlParams: {}
    }
  },
  created () {
    this.params = { wholeId: this.currEntityId }
  },
  methods: {
    rendered () {
      // 所有表单元素渲染后调用rendered
      if (this.record.id) {
        this.getFormData()
      }
    },
    getFormData () {
      this.formData = Object.assign({}, this.record)
      this.changeSql(this.record.id)
    },
    saveParamData (data) {
      console.log(data, 'data--param')
      this.sqlParams['mileStoneRequests'] = data
    },
    saved (res) {
      console.log('修改页面关闭时的回调方法')
      this.$emit('saveSuccess', res)
    },
    parseCheck (saveParams) {
      let params = { ...saveParams, ...this.sqlParams }
      let _this = this
      _this.$refs.form.submitForm(params, _this.saveApi)
    },
    changeSql (val) {
      this.params = { wholeId: this.currEntityId }
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
        // eslint-disable-next-line no-unused-vars
        let that = this
        this.editTableData[this.editTableIndex].realName = this.selectedRow3[0].realName
        this.editTableData[this.editTableIndex].userId = this.selectedRow3[0].id
        this.sqlParams['mileStoneRequests'] = this.editTableData
      }
    }
  }
}
</script>
<style lang="scss">
.projectMilestone{
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
