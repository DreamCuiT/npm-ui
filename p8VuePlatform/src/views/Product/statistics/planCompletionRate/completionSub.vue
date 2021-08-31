

<template>
       <common-dialog :title="rulesTitle"
                                width="50%"
                                v-if="visibleRules"
                                :visible="visibleRules"
                                :dialogConfig="dialogConfig"
                                :showHandleBtn="showHandleBtn"
                                :dialogHeight="dialogHeight"
                                @close="onRulesPageClose"
                                @save-info="saveInfo">
           <form-list ref="form"
               :dataSource="dataSource"
               @rendered="rendered"
               :form="formData">
          </form-list>                 
        <template #dialog>
                      <editable-table :columns="columns" ref="myEditTable"
                                      :params="tableParams"
                                      :addRow="true"
                                      :api="tableConfigDetailsApi"
                                      >
                        <template #planBeginDate="{scope}">
                              <el-date-picker v-model="scope.row.planBeginDate"
                                              type="date"
                                              :value-format="valueFormat"
                                              placeholder="选择开始时间">
                              </el-date-picker>
                        </template>
                        <template #planEndDate="{scope}">
                        <el-date-picker v-model="scope.row.planEndDate"
                                        type="date"
                                        :value-format="valueFormat"
                                        placeholder="选择结束时间">
                        </el-date-picker>
                      </template>
                         <template #delayDay="{scope}">
                            <el-input v-model="scope.row.delayDay"
                                          oninput="value=value.replace(/[^\d]/g,'')"
                                          maxLength='9'
                                        placeholder="请填写延期天数"
                                      ></el-input>
                          </template>
                      </editable-table>
         </template>
       
  </common-dialog>
</template>

<script>
import { Input, DatePicker } from '~/index'
import { P8Form as FormList } from '~/index'
import { P8EditTable as EditableTable } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
export default {
  name: 'completionSub',
  components: {
    FormList,
    EditableTable,
    'el-input': Input,
    'el-date-picker': DatePicker,
      CommonDialog
  },
  props: {
     visibleRules: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    rulesTitle:{
      type:String,
      default:''
    }
    
  },
  data () {
    return {
            formData: {},
       dialogHeight: 400,
       showHandleBtn: true,
      dialogConfig: {
        'append-to-body': true
      },
       tableParams: {},
      saveApi: 'planCompletionRate.saveDelayRules',
      dataSource: [
      ],
      height: document.documentElement.clientHeight - 142 + 'px',
      valueFormat: 'yyyy-MM-dd',
      columns: [
        {
          title: '序号',
          type: 'index',
          minWidth: 45,
          align: 'center'
        },
        {
          title: '开始时间',
          dataIndex: 'planBeginDate',
          minWidth: 140,
          default: '',
             scopedSlots: { customRender: 'custom' }
        },
        {
          title: '完成时间',
          dataIndex: 'planEndDate',
          minWidth: 140,
          default: '',
             scopedSlots: { customRender: 'custom' }
        },
         {
          title: '延期天数',
          dataIndex: 'delayDay',
          minWidth: 140,
          default: '',
           scopedSlots: { customRender: 'custom' }
        }
       

      ],
      tableConfigDetailsApi: 'planCompletionRate.selectAllRuleList'// 报表配置列表的api，可切换
    }
  },
  mounted () {
    console.log(this.height, 'height')
  },
  methods: {
    saveInfo(){
          let datas=this.$refs.myEditTable.$data.tableData;
          // console.log(datas,'---------------我的数据sss')
          let that =this
          this.$api[this.saveApi]({ planStatisticRuleRequestList: datas }).then(function (res) {
            if(res=='true'){
                       that.showMessage('保存成功！', 'success')
            }else{
                       that.showMessage('保存失败！', 'error')
            }
          }).catch(err => {
                       that.showMessage('保存失败！', 'error')
            console.log(err)
          })
    },
    onRulesPageClose () {
      this.$emit('close')
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
      showMessage (message, type) {
      this.$message({
        message: message,
        type: type
      })
    }
  }
}
</script>

<style lang="scss">
</style>
