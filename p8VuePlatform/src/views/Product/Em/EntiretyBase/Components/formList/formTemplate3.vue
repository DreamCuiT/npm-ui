<template>
  <div style="height:100%;">
    <form-list
      ref='form'
      :class="{emViewForm:modifyOrView === 'view', emModifyForm:modifyOrView === 'modify'}"
      style="height:100%;"
      @rendered='rendered'
      @saved='saved'
      :form='formData'
      labelWidth='150px'
      :dataSource='dataSource'
      :is-custom-validate='isCustomValidate'
      @custom-validate='customValidate'
      @form-data-change="formDataChange"
      :existDefaultBtn="false"
      :existCustomBtn='true'
      :api='saveApi'
      :other-param='otherParam'
    >
      <template #other>
        <ul class="userList">
          <el-tag>{{configEmData.sourceName}}->{{configEmData.filedName}}->{{configEmData.classifyName}}</el-tag>
        </ul>
      </template>
      <template #modelInformationCode>
        <el-input v-model='formData["modelInformationCode"]'
                  readonly
                  autosize
                  placeholder="请选择型号"
                  v-on:click.native="selectProjectVisible = true">
          <i v-if='!formData["modelInformationCode"]'
             class='el-icon-link'
             slot='suffix'
             @click='visibleDutyUser = true'
             :style='{ fontSize: "16px", color: "#08c", cursor: "pointer" }'></i>
          <i
             v-if="formData['modelInformationCode']"
             slot="suffix"
             class="el-icon-close"
             v-on:click.stop="formData['modelInformationCode'] = null"
             :style='{ fontSize: "16px", color: "#08c", cursor: "pointer" }'></i>
        </el-input>
      </template>
      <template #productCode>
        <el-input v-model='formData["productCode"]'
                  readonly
                  autosize
                  placeholder="请选择产品"
                  v-on:click.native="showProductModal()">
          <i
             class='el-icon-link'
             slot='suffix'
             :style='{ fontSize: "16px", color: "#08c", cursor: "pointer" }'></i>
        </el-input>
      </template>
      <template #dutyUser>
        <el-input v-model='formData["dutyUserName"]'
                  readonly
                  autosize
                  placeholder="请选择项目负责人"
                  v-on:click.native="visibleDutyUser = true">
          <i v-if='!formData["dutyUserName"]'
             class='el-icon-link'
             slot='suffix'
             @click='visibleDutyUser = true'
             :style='{ fontSize: "16px", color: "#08c", cursor: "pointer" }'></i>
          <i
             v-if="formData['dutyUserName']"
             slot="suffix"
             class="el-icon-close"
             v-on:click.stop="formData['dutyUserName'] = null"
             :style='{ fontSize: "16px", color: "#08c", cursor: "pointer" }'></i>
        </el-input>
      </template>
      <template #customBtn>
        <template v-if="modifyOrView === 'modify'">
          <el-button type="primary" size="mini" @click="fpHandle" :isPush="isPush">保存并发布</el-button>
          <el-button type="primary" size="mini" @click="submitHandle">保存</el-button>
        </template>
      </template>
    </form-list>

    <select-model v-if='selectProjectVisible'
                  :selected-row='selectedRows'
                  :filedId='filedId'
                  :visible='selectProjectVisible'
                  @close-dialog='closeModal'>
    </select-model>

    <!-- 预先设置审批人-->
    <selectApproveUserBeforehand v-if="isSelectApproveUserBeforehandView"
                  :isSelectApproveUserBeforehandView="isSelectApproveUserBeforehandView"
                  :selectUserBeforehandDataSource="selectUserBeforehandDataSource"
                  :selectUserBeforehandFormData="selectUserBeforehandFormData"
                  @close-modal="closeSelectApproveUserBeforehand"
                  @commit="commitSelectApproveUserBeforehand">
    </selectApproveUserBeforehand>

    <select-user v-if="visibleDutyUser"
                 :visible="visibleDutyUser"
                 :selected-row='selectedRows1'
                 selectType="1"
                 @close-dialog="closeModalSelectUser">
    </select-user>
    <select-product v-if="productVisible"
                    :visible="productVisible"
                    @close-modal="closeProductModal"></select-product>
  </div>
</template>

<script>
import { Tag } from '~/index'
import { P8Form as FormList } from '~/index'
import SelectModel from './components/moduleSelectList'
import SelectProduct from './selectProduct'
import { P8SelectUser as SelectUser } from '~/index'
import SelectApproveUserBeforehand from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUserBeforehand'
import { nextApproveUserBeforehand } from '@/assets/commonJS/BusinessActivity/nextApproveUserBeforehand'
export default {
  name: 'formTemplate3', // 表五-横向-新研产品
  components: {
    FormList,
    SelectModel,
    SelectProduct,
    SelectApproveUserBeforehand,
    SelectUser,
    'el-tag': Tag
  },
  props: {
    planInfoId: String,
    configId: String,
    dateNumber: {
      type: Number,
      default: 0
    },
    emData: {
      type: Object || String
    },
    modifyOrView: { // 判断是修改页面还是查看页面
      type: String,
      default: 'modify'
    }
  },
  data () {
    const tempModifyDataSource = [
      {
        type: 'hidden',
        labelText: 'entityId',
        fieldName: 'entityId',
        colLayout: 'doubleCol'
      },
      {
        type: 'hidden',
        labelText: 'configId',
        fieldName: 'configId',
        colLayout: 'doubleCol'
      },
      {
        type: 'blank',
        labelText: '业务来源/范围/类型:',
        slotName: 'other',
        colLayout: 'singleCol'
      },
      {
        type: 'text',
        labelText: '项目名称',
        fieldName: 'name',
        colLayout: 'singleCol',
        placeholder: '请输入项目名称',
        rules: [{ required: true, message: '请输入项目名称' }]
      },
      {
        type: 'select',
        labelText: '所属领域', // 只读
        fieldName: 'field',
        colLayout: 'doubleCol',
        rules: [{ required: true, message: '请选择所属领域' }],
        optionUrl: {
          api: 'thirdPartInterface.getFiledByConfigId',
          params: { sourceId: this.emData.sourceId }
        },
        placeholder: '请选择所属领域'
      },
      {
        type: 'select',
        labelText: '项目类型',
        fieldName: 'kprojectClassifyId',
        slotName: 'kprojectClassifyId',
        rules: [{ required: true, message: '请选择项目类型' }],
        options: [],
        optionUrl: {},
        colLayout: 'doubleCol',
        placeholder: '请选择项目类型'
      },
      {
        type: 'blank',
        labelText: '型号代号',
        slotName: 'modelInformationCode',
        fieldName: 'modelInformationCode',
        colLayout: 'doubleCol',
        placeholder: '请选择型号代号',
        rules: [{ required: true, message: '请选择型号代号' }]
      },
      {
        type: 'view',
        labelText: '型号名称', // 只读
        fieldName: 'modelInformationName',
        colLayout: 'doubleCol',
        fieldConfig: { readonly: true },
        rules: [{ required: true }]
      },
      {
        type: 'blank',
        labelText: '产品代号',
        slotName: 'productCode',
        fieldName: 'productCode',
        colLayout: 'doubleCol',
        placeholder: '请选择产品代号'
      },
      {
        type: 'view',
        labelText: '产品名称',
        fieldName: 'productName',
        colLayout: 'doubleCol'
      },
      {
        type: 'select',
        labelText: '项目来源',
        fieldName: 'source',
        optionUrl: {
          api: 'thirdPartInterface.getDic',
          params: { dicType: 'TASK_SOURCE' }
        },
        colLayout: 'doubleCol',
        placeholder: '请选择项目来源',
        rules: [{ required: true }]
      },
      {
        type: 'select',
        labelText: '项目密级',
        fieldName: 'secretGrade',
        optionUrl: {
          api: 'thirdPartInterface.getDic',
          params: { dicType: 'SECRET_LEVEL' }
        },
        colLayout: 'doubleCol',
        placeholder: '请选择项目密级',
        rules: [{ required: true }]
      },
      {
        type: 'datetime',
        labelText: '预计开始时间',
        fieldName: 'beginTime',
        colLayout: 'doubleCol',
        placeholder: '请选择开始时间',
        rules: [{ required: true }],
        fieldConfig: {
          valueFormat: 'yyyy-MM-dd'
        },
        pickerOptions: {
          disabledRelation: 'start',
          comparedFieldName: 'endTime'
        }
      },
      {
        type: 'datetime',
        labelText: '预计结束时间',
        fieldName: 'endTime',
        colLayout: 'doubleCol',
        placeholder: '请选择结束时间',
        rules: [{ required: true }],
        fieldConfig: {
          valueFormat: 'yyyy-MM-dd'
        },
        pickerOptions: {
          disabledRelation: 'end',
          comparedFieldName: 'beginTime'
        }
      },
      {
        type: 'treeSelect',
        labelText: '主承部门',
        fieldName: 'mainDept',
        clearable: true,
        disabledValues: ['1'],
        defaultExpandedKeys: ['1'],
        optionUrl: {
          api: 'ProjectApply.deptTree',
          params: {}
        },
        colLayout: 'doubleCol',
        rules: [{ required: true }]
      },
      {
        type: 'treeSelect', // 确认?
        labelText: '参研部门',
        fieldName: 'leadDeptIds',
        clearable: true,
        defaultValue: [],
        disabledValues: ['1'],
        defaultExpandedKeys: ['1'],
        optionUrl: {
          api: 'ProjectApply.deptTree',
          params: {}
        },
        multiple: true,
        colLayout: 'doubleCol'
      },
      {
            type: 'treeSelect',
            labelText: '管理部门',
            fieldName: 'manageDept',
            clearable: true,
            disabledValues: ['1'],
            defaultExpandedKeys: ['1'],
            optionUrl: {
              api: 'ProjectApply.deptTree',
              params: {}
            },
            colLayout: 'doubleCol'
      },
      // {
      //   type: 'treeSelect', // 确认?
      //   labelText: '项目负责人',
      //   fieldName: 'dutyUser',
      //   disabledValues: ['1'],
      //   defaultExpandedKeys: ['1'],
      //   optionUrl: {
      //     api: 'ProjectApply.deptTree',
      //     params: {}
      //   },
      //   colLayout: 'doubleCol',
      //   rules: [{ required: true, message: '请选择项目负责人' }]
      // },
      {
        type: 'blank',
        labelText: '项目负责人',
        slotName: 'dutyUser',
        fieldName: 'dutyUser',
        colLayout: 'doubleCol',
        placeholder: '请选择项目负责人'
      },
      {
        type: 'select',
        labelText: '主管所领导',
        slotName: 'mainLeadUser',
        fieldName: 'mainLeadUser',
        colLayout: 'doubleCol',
        placeholder: '请选择主管所领导',
        optionUrl: {
          api: 'userManager.userListByRoleId',
          label: 'realName',
          value: 'id',
          params: { roleId: 'SYS_ROLE033' }
        },
        rules: [{ required: true }]
      },
      {
        type: 'textarea',
        labelText: '市场分析',
        fieldName: 'marketAnalysis',
        colLayout: 'singleCol',
        placeholder: '市场/行业需求趋势分析、项目承揽必要性等',
        rules: [{ required: true }]
      },
      {
        type: 'textarea',
        labelText: '客户情况简介',
        fieldName: 'purpose',
        colLayout: 'singleCol',
        placeholder: '客户情况简介、客户重要性、客户需求(主要参数和技术指标)',
        rules: [{ required: true }]
      },
      {
        type: 'textarea',
        labelText: '竞争对手分析',
        fieldName: 'competitors',
        colLayout: 'singleCol',
        placeholder: '请输入竞争对手分析',
        rules: [{ required: true }]
      },
      {
        type: 'textarea',
        labelText: '所技术能力和生产能力预估',
        fieldName: 'capacity',
        colLayout: 'singleCol',
        placeholder: '请输入所技术能力和生产能力预估',
        rules: [{ required: true }]
      },
      {
        type: 'number',
        labelText: '成本预测(万元)',
        min: 0,
        trigger: 'blur',
        fieldName: 'costForecast',
        colLayout: 'doubleCol',
        placeholder: '请输入成本预测',
        rules: [{ required: true }]
      },
      {
        type: 'number', // 确认?
        labelText: '预计数量',
        min: 0,
        trigger: 'blur',
        fieldName: 'appropriationBudget',
        placeholder: '请输入预计数量',
        colLayout: 'doubleCol',
        rules: [{ required: true }],
        fieldConfig: {
          step: 1,
          'step-strictly': true
        }
      },
      {
        type: 'number',
        labelText: '单台预计售价(万元)',
        min: 0,
        trigger: 'blur',
        fieldName: 'singlePrice',
        placeholder: '请输入预计售价',
        colLayout: 'doubleCol',
        rules: [{ required: true }]
      }
    ]
    const tempViewDataSource = [
      {
        type: 'hidden',
        labelText: 'entityId',
        fieldName: 'entityId',
        colLayout: 'doubleCol'
      },
      {
        type: 'hidden',
        labelText: 'configId',
        fieldName: 'configId',
        colLayout: 'doubleCol'
      },
      {
        type: 'blank',
        labelText: '业务来源/范围/类型:',
        slotName: 'other',
        colLayout: 'singleCol'
      },
      {
        type: 'view',
        labelText: '项目名称',
        fieldName: 'name',
        colLayout: 'singleCol'
      },
      {
        type: 'view', // 确认?
        labelText: '所属领域',
        fieldName: 'fieldDictionaryDisplay',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '项目类型',
        fieldName: 'kprojectClassifyname',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '型号代号',
        fieldName: 'modelInformationCode',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '型号名称',
        fieldName: 'modelInformationName',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '产品代号',
        fieldName: 'productCode',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '产品名称',
        fieldName: 'productName',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '项目来源',
        fieldName: 'sourceDisplay',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '项目密级',
        fieldName: 'secretGradeDisplay',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '预计开始时间',
        fieldName: 'beginTime',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '预计结束时间',
        fieldName: 'endTime',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '主承部门',
        fieldName: 'mainDeptName',
        colLayout: 'doubleCol'
      },
      {
        type: 'view', // 确认?
        labelText: '参研部门',
        fieldName: 'leadDeptNames',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '管理部门',
        fieldName: 'manageDeptName',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '项目负责人',
        fieldName: 'dutyUserName',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '主管所领导',
        fieldName: 'mainLeadUserName',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '市场分析',
        fieldName: 'marketAnalysis',
        colLayout: 'singleCol'
      },
      {
        type: 'view',
        labelText: '客户情况简介',
        fieldName: 'purpose',
        colLayout: 'singleCol'
      },
      {
        type: 'view',
        labelText: '竞争对手分析',
        fieldName: 'competitors',
        colLayout: 'singleCol'
      },
      {
        type: 'view',
        labelText: '所技术能力和生产能力预估',
        fieldName: 'capacity',
        colLayout: 'singleCol'
      },
      {
        type: 'view',
        labelText: '成本预测(万元)',
        fieldName: 'costForecast',
        colLayout: 'singleCol'
      },
      {
        type: 'view', // 确认?
        labelText: '预计数量',
        fieldName: 'appropriationBudget',
        colLayout: 'doubleCol'
      },
      {
        type: 'view',
        labelText: '单台预计售价(万元)',
        fieldName: 'singlePrice',
        colLayout: 'doubleCol'
      }
    ]
    return {
      dataSource: [],
      tempModifyDataSource: tempModifyDataSource,
      tempViewDataSource: tempViewDataSource,
      isCustomValidate: true,
      productVisible: false,
      otherParam: {},
      saveApi: 'ProjectApply.wholeDescribeSave',
      formData: {
        entityId: '',
        configId: '',
        isPush: '',
        name: '',
        field: '',
        kprojectClassifyId: '',
        modelInformationName: '',
        productCode: '',
        productName: '',
        productInfoId: '',
        source: '',
        secretGrade: '',
        beginTime: '',
        endTime: '',
        mainDept: '',
        leadDeptIds: [],
        partDept: '',
        dutyUser: '',
        dutyUserName: '',
        mainLeadUser: '',
        marketAnalysis: '',
        purpose: '',
        competitors: '',
        capacity: '',
        costForecast: '',
        appropriationBudget: '',
        singlePrice: '',
        manageDept: ''
      },
      configEmData: {
        classifyName: '',
        filedName: '',
        sourceName: '',
        decisionForm: ''
      },
      selectProjectVisible: false,
      selectedRow: {},
      selectedRows: [],
      selectedRows1: [],
      filedId: '',
      relateObj: [],
      relateId: '',
      sid: '', // 领域id
      isPush: false,
      releaseMenuParams: {},
      isSelectApproveUserBeforehandView: false,
      selectUserBeforehandDataSource: [],
      selectUserBeforehandFormData: {},
      visibleDutyUser: false,
      fieldValue: ''
    }
  },
  mounted () {
    this.getRelateId()
    this.dataSource = this.modifyOrView === 'modify' ? this.tempModifyDataSource : this.tempViewDataSource
      this.formData.manageDept = '2f93d9937635383c1232766797902d2b'
  },
  watch: {
    emData: {
      handler (val, oldValue) {
        this.configEmData = {
          classifyName: '',
          filedName: '',
          sourceName: '',
          decisionForm: '',
          processDefinitionKey: ''
        }
        this.configEmData = val
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    closeModal (selectedRow) {
      this.selectProjectVisible = false
      if (selectedRow) {
        let that = this
        that.formData.modelInformationName = selectedRow.label
        that.formData.filedName = selectedRow.location
        that.formData.modelInformationCode = selectedRow.code
        that.formData.modelInformationId = selectedRow.id
        that.sid = selectedRow.sid// 领域id
        this.$api['ProjectApply.projectClassifyTreeById']({ filedId: this.filedId, sid: this.sid }).then(res => {
          if (res && res.length > 0) {
            that.$refs.form.renderDataSource.filter(item => item.fieldName === 'kprojectClassifyId')[0].options = res
          }
        })
      }
    },
    closeProductModal (row) {
      if (row && row.id) {
        this.formData.productInfoId = row.id
        this.formData.productCode = row.productCode
        this.formData.productName = row.mapName
      }
      this.productVisible = false
    },
    showProductModal () {
      this.productVisible = true
    },
    submitHandle (res) {
      this.isPush = false
      if (!this.formData.entityId && res.id) {
        this.formData.entityId = res.id
      }
      if (this.formData.modelInformationName === '') {
        this.$message({
          message: '请选择型号代号',
          type: 'warning'
        })
        return
      }
      this.$refs.form.handleSubmit(res)
    },
    fpHandle (res) {
      if (!this.formData.entityId && res.id) {
        this.formData.entityId = res.id
      }
      if (this.formData.modelInformationName === '') {
        this.$message({
          message: '请选择型号代号',
          type: 'warning'
        })
        return
      }
      this.formData.isPush = 'true'
      this.$refs.form.handleSubmit(res)// 异步
      this.isPush = true
    },
    rendered () {
      let that = this
      let date = new Date()
      let createDate = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString()
      if (that.planInfoId && this.planInfoId !== '') {
        this.$api['ProjectApply.getOne']({ wholeDescribeId: that.planInfoId }).then(function (res) {
          if (res) {
            that.formData = res
            that.formData.entityId = res.id
            that.formData.leadDeptIds = res.leadDeptIds ? res.leadDeptIds.split(',') : []

           if (that.modifyOrView === 'modify') {
                that.$api['ProjectApply.projectClassifyTreeById']({ filedId: that.filedId, sid: res.sid }).then(res2 => {
                    if (res2 && res2.length > 0) {
                        that.$refs.form.renderDataSource.filter(item => item.fieldName === 'kprojectClassifyId')[0].options = res2
                    }
                })
              }
          }
        }).catch(function (error) {
          console.log(error)
        })
      } else {
        that.formData.indexno = this.dateNumber
        that.formData.createTime = createDate
      }
      that.formData.configId = that.configId
    },
    saved (res) {
      if (!this.formData.entityId && res.id) {
        this.formData.entityId = res.id
      }
      if (res && res.id) {
        this.$bus.$emit('setProjectEntityId', res.id)
        this.$bus.$emit('setProjectEntityClose', this.isPush)
      }
      // let that = this
      // if (that.isPush) {
      //   if (that.formData.entityId) {
      //     that.$confirm(`是否提交决策形式确认？`, '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       that.releaseMenuParams = {
      //         processDefinitionKey: that.configEmData.processDefinitionKey,
      //         id: that.formData.entityId,
      //         status: that.formData.status
      //       }
      //       that.nextApproveUserBeforehand(that.configEmData.processDefinitionKey)
      //     }).catch(() => { })
      //   }
      // }
      this.$emit('save-success', res)
    },
    nextApproveUserBeforehand (processDefinationTwoKey) {
      let that = this
      nextApproveUserBeforehand.initDataSource(processDefinationTwoKey, that).then(res1 => {
        if (res1 === true) {
          that.isSelectApproveUserBeforehandView = true
        }
      })
    },
    customValidate (saveParams) {
      saveParams.customItem1 = this.formData.customItem1
      saveParams.fundsSource = this.formData.fundsSource
      this.$refs.form.submitForm(saveParams, this.saveApi)
    },
    formDataChange () {
      if (this.formData.field && this.formData.field !== this.fieldValue) {
        this.getKprojectClassifyOptions(this.formData.field)
      }
    },
    getRelateId () {
      this.$api['thirdPartInterface.getFiledByConfigId']({ sourceId: this.emData.sourceId }).then(res => {
        this.relateObj = res
      })
    },
    getKprojectClassifyOptions (fields) {
      let f = this.dataSource.filter(item => item.fieldName === 'kprojectClassifyId')
      let relate = this.relateObj.filter(item => item.value === this.formData.field)
      if (f.length && relate.length) {
        this.filedId = relate[0].relateId
        this.$api['thirdPartInterface.getClassifyByFiledId']({ filedId: fields, relateId: relate[0].relateId }).then(res => {
          f[0].options = res
        })
      }
    },
    closeModalSelectUser (selectedRow1) {
      this.visibleDutyUser = false
      this.selectedRow1 = selectedRow1
      if (this.selectedRow1) {
        let that = this
        that.formData.dutyUser = this.selectedRow1[0].id
        that.formData.dutyUserName = this.selectedRow1[0].realName
      }
    }
  }
}
</script>

<style lang="scss">
  .emViewForm{
    .el-form-item__label{
      font-weight:bold;
    }
    .el-form-item--small.el-form-item{
      margin-bottom:0;
    }
  }
  .emModifyForm{
    .view-item{
      &.el-form-item--small.el-form-item{
        margin-bottom:19px;
      }
    }
  }
</style>
