<template>
  <div>
    <form-list
      ref='form'
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
            <el-tag>{{configEmData.filedName}}->{{configEmData.sourceName}}->{{configEmData.classifyName}}</el-tag>
        </ul>
      </template>
      <template #others>
        <ul class="userList">
          <el-tag v-if='configEmData.decisionForm==0'>审核制</el-tag>  <el-tag v-if='configEmData.decisionForm==1'>备案制</el-tag>
        </ul>
      </template>
      <template #customBtn>
        <el-button type="primary" size="mini" @click="fpHandle" :isPush="isPush">保存并发布</el-button>
        <el-button type="primary" size="mini" @click="submitHandle">保存</el-button>
      </template>
      <template #modelInformationCode>
        <el-input v-model='formData["modelInformationCode"]'
                  readonly
                  autosize
                  placeholder="请选择型号"
                  v-on:click.native="showModal()">
          <i v-if='selectedRow'
             class='el-icon-link'
             slot='suffix'
             type='link'
             :style='{cursor: "pointer", fontSize: "16px", color: "#08c" }'></i>
        </el-input>
      </template>

      <template #mainLeadUserName>
        <el-input v-model='formData["mainLeadUserName"]'
                  readonly
                  autosize
                  placeholder="请选择领域主管所领导"
                  v-on:click.native="openTable()">
          <i v-if='selectedRows1'
             class='el-icon-link'
             slot='suffix'
             type='link'
             @click='openTable'
             :style='{ fontSize: "16px", color: "#08c" }'></i>
        </el-input>
      </template>
    </form-list>
    <!-- 预先设置审批人-->
    <selectApproveUserBeforehand v-if="isSelectApproveUserBeforehandView"
                                 :isSelectApproveUserBeforehandView="isSelectApproveUserBeforehandView"
                                 :selectUserBeforehandDataSource="selectUserBeforehandDataSource"
                                 :selectUserBeforehandFormData="selectUserBeforehandFormData"
                                 @close-modal="closeSelectApproveUserBeforehand"
                                 @saveSuccess="saveSuccessCallBack"
                                 @commit="commitSelectApproveUserBeforehand"></selectApproveUserBeforehand>

    <select-model v-if='selectProjectVisible'
                  :selected-row='selectedRows'
                  :visible='selectProjectVisible'
                  :filedId='filedId'
                  @close-dialog='closeModal'></select-model>
    <select-user v-if="visible1"
                 :visible="visible1"
                 :selected-row='selectedRows1'
                 selectType="1"
                 @close-dialog="closeModal1"></select-user>
  </div>
</template>
<script>
import { P8Form as FormList } from '~/index'
import selectModel from './components/moduleSelectList'
import { P8SelectUser as SelectUser } from '~/index'
import SelectApproveUserBeforehand from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUserBeforehand'
import { Tag } from '~/index'
import { nextApproveUserBeforehand } from '@/assets/commonJS/BusinessActivity/nextApproveUserBeforehand'
export default {
  name: 'researchModule',
  components: {
    FormList,
    selectModel,
    SelectUser,
    SelectApproveUserBeforehand,
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
      type: Object
    }
  },
  data () {
    return {
      saveApi: 'ProjectApply.wholeDescribeSave',
      sid: '', // 领域id
      selectProjectVisible: false,
      filedId: this.emData ? this.emData.filedId : 'qw',
      labelWidth: 'auto',
      isCustomValidate: true,
      configEmData: {
          classifyName: '',
          filedName: '',
          sourceName: '',
          decisionForm: ''
      },
      isSelectApproveUserBeforehandView: false,
      selectUserBeforehandDataSource: [],
      selectUserBeforehandFormData: {},
      releaseMenuParams: {
      },
      isBeforehand: true, // 是否预先设置审批人模式
      isPush: false,
      sourceTemplate: {
        processInstanceEl: {
          type: 'text',
          labelText: '业务名称',
          fieldName: 'businessName',
          disabled: true,
          colLayout: 'singleCol',
          fieldConfig: {
            disabled: true
          }
        },
        approveNode: {
          type: 'select',
          labelText: '审批节点',
          fieldName: 'nextTaskNodeId',
          options: [],
          multiple: false,
          disabled: true,
          placeholder: '选择节点',
          colLayout: 'doubleCol',
          fieldConfig: {
            disabled: true
          }
        },
        approveNodeUsers: {
          type: 'treeSelect',
          labelText: '审批人',
          fieldName: '',
          multiple: false,
          placeholder: '选择节点审批人',
          colLayout: 'doubleCol',
          treeData: []
        }
      },
      selectedRow: {},
      selectedRows: [],
      selectedRows1: [],
      disabledValuesArray: [],
      dataSource: [],
      modify: {},
      otherParam: {},
      formData: {
        entityId: '',
        name: '',
        kprojectClassifyId: '',
        modelInformationName: '',
        filedName: '',
        classify: '',
        modelInformationId: '',
        pjCode: '',
        source: '',
        projectOrder: '',
        beginTime: '',
        endTime: '',
        secretGrade: '',
        SYSDEPT: '',
        // appropriationBudget: 0,
        // localBudaget: 0,
        // crossBudaget: 0,
        // raiseBudget: 0,
        fundsSource: '',
        customItem1: '',
        mainDept: '',
        mainLeadUser: '',
        createTime: '',
        configId: '',
        particular: '',
        modelClassify: ''

      },
      visible1: false
    }
  },
  created () {
    let that = this
    this.$api['ProjectApply.getDisabledValuesArray']().then(res => {
      if (res && res.length > 0) {
        that.disabledValuesArray = res
        let tempDataSource = that.initCloumn()
        that.dataSource = tempDataSource
      }
    })
  },
  mounted () {
    this.rendered()
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
        console.log(val, 'val===============')
        this.configEmData = val
         console.log(this.configEmData, 'configEmData')
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initCloumn () {
      let tempDataSource = [
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
          labelText: '业务范围/来源/类型:',
          slotName: 'other',
          colLayout: 'doubleCol'
        },
        {
          type: 'blank',
          labelText: '决策形式',
          slotName: 'others',
          colLayout: 'doubleCol'
        },
        {
            type: 'text',
            labelText: '所属领域', // 只读
            fieldName: 'filedName',
            colLayout: 'doubleCol',
            // placeholder: '请输入所属领域',
            fieldConfig: { readonly: true }
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
          type: 'text',
          labelText: '型号名称', // 只读
          fieldName: 'modelInformationName',
          colLayout: 'doubleCol',
          // placeholder: '请输入型号名称',
          fieldConfig: { readonly: true }
        },
        {
          type: 'text',
          labelText: '产品代号',
          fieldName: 'productCode',
          colLayout: 'doubleCol',
          placeholder: '请输入产品代号'
        },
        {
          type: 'text',
          labelText: '产品名称',
          fieldName: 'productName',
          colLayout: 'doubleCol',
          placeholder: '请输入产品名称'
        },
        {
          type: 'text',
          labelText: '项目名称',
          fieldName: 'name',
          colLayout: 'doubleCol',
          placeholder: '请输入项目名称',
          rules: [{ required: true, message: '请输入项目名称' }]
        },
        {
          type: 'select',
          labelText: '项目类型',
          fieldName: 'kprojectClassifyId',
          slotName: 'kprojectClassifyId',
          options: [],
          colLayout: 'doubleCol',
          placeholder: '请选择项目类型',
          rules: [{ required: true, message: '请选择项目类型' }]
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
          rules: [{ required: true, message: '请选择项目来源' }]
        },
        // {
        //   type: 'select',
        //   labelText: '项目分级',
        //   fieldName: 'projectOrder',
        //   optionUrl: {
        //     api: 'thirdPartInterface.getDic',
        //     params: { dicType: 'PROJECT_ORDER' }
        //   },
        //   colLayout: 'doubleCol',
        //   placeholder: '请选择项目分级',
        //   rules: [{ required: true, message: '请选择项目分级' }]
        // },
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
          rules: [{ required: true, message: '请选择项目密级' }]
        },
        {
          type: 'text',
          labelText: '客户名称',
          fieldName: 'sysDept',
          colLayout: 'doubleCol',
          placeholder: '请输入客户名称'
        },
        {
          type: 'number',
          labelText: '国拨金额(万元)',
          min: 0,
          trigger: 'blur',
          fieldConfig: {
            precision: 5
           },
          fieldName: 'appropriationBudget',
          placeholder: '请输入国拨金额',
          colLayout: 'doubleCol'
        },
        {
          type: 'number',
          labelText: '地配金额(万元)',
          min: 0,
          fieldConfig: {
             precision: 5
          },
          fieldName: 'localBudaget',
          placeholder: '请输入地配金额',
          colLayout: 'doubleCol'
        },
        {
          type: 'number',
          labelText: '横向合同来款(万元)',
          min: 0,
          fieldConfig: {
             precision: 5
          },
          fieldName: 'crossBudaget',
          placeholder: '请输入横向合同来款',
          colLayout: 'doubleCol'
        },
        {
          type: 'number',
          labelText: '自筹金额(万元)',
          min: 0,
          fieldConfig: {
             precision: 5
          },
          fieldName: 'raiseBudget',
          placeholder: '请输入自筹金额',
          colLayout: 'doubleCol'
        },
        {
          type: 'text',
          labelText: '经费来源',
          fieldName: 'fundsSource',
          colLayout: 'doubleCol'
        },
        {
          type: 'text',
          labelText: '概算总金额',
          fieldName: 'customItem1',
          fieldConfig: {
             precision: 5
          },
          colLayout: 'doubleCol'
        },
        {
          type: 'datetime',
          labelText: '开始时间',
          fieldName: 'beginTime',
          colLayout: 'doubleCol',
          placeholder: '请选择开始时间',
          rules: [{ required: true, message: '请选择开始时间' }],
          fieldConfig: {
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          type: 'datetime',
          labelText: '结束时间',
          fieldName: 'endTime',
          colLayout: 'doubleCol',
          placeholder: '请选择结束时间',
          rules: [{ required: true, message: '请选择结束时间' }],
          fieldConfig: {
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          type: 'treeSelect',
          labelText: '主承部门',
          fieldName: 'mainDept',
          disabledValues: ['1'],
          defaultExpandedKeys: ['1'],
          optionUrl: {
            api: 'ProjectApply.deptTree',
            params: {}
          },
          colLayout: 'doubleCol',
          rules: [{ required: true, message: '请选择主承部门' }]
        },
        // {
        //   type: 'blank',
        //   labelText: '领域主管所领导',
        //   slotName: 'mainLeadUserName',
        //   fieldName: 'mainLeadUserName',
        //   colLayout: 'doubleCol',
        //   placeholder: '请选择主管所领导',
        //   rules: [{ required: true, message: '请选择主管所领导' }]
        // },
        {
            type: 'select',
            labelText: '领域主管所领导',
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
            rules: [{ required: true, message: '请选择主管所领导' }]
          },
        // {
        //   type: 'text',
        //   labelText: '申请日期',
        //   fieldName: 'createTime',
        //   colLayout: 'doubleCol'
        // },
        {
          type: 'textarea',
          labelText: '项目概述',
          fieldName: 'backdrop',
          placeholder: '背景+目标+成果'
        }
      ]
      return tempDataSource
    },
    initDisabledValuesArray () {
        let _this = this
        this.$api['ProjectApply.getDisabledValuesArray'](this.formData).then(function (res) {
                    _this.disabledValuesArray = res
                })
      },
    rendered () {
      let that = this
      let date = new Date()
      let createDate = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString()
      if (that.planInfoId && this.planInfoId !== '') {
        this.$api['ProjectApply.getOne']({ wholeDescribeId: that.planInfoId }).then(function (res) {
          if (res) {
            console.log(res.processDefinitionKey, '查看修改数据')
            that.formData = res
            let configEmData = {
              classifyName: res.classifyName,
              filedName: res.filedName,
              sourceName: res.sourceName,
              decisionForm: res.decisionForm,
              processDefinitionKey: res.processDefinitionKey,
              modelClassify: res.modelClassify
            }
            that.filedId = res.filedId
            that.configEmData = configEmData
            that.formData.entityId = res.id
            if (!res.appropriationBudget) {
              that.formData.appropriationBudget = undefined
            }
            if (!res.localBudaget) {
              that.formData.localBudaget = undefined
            }
            if (!res.crossBudaget) {
              that.formData.crossBudaget = undefined
            }
            if (!res.raiseBudget) {
              that.formData.raiseBudget = undefined
            }
            if (!res.createTime) {
              that.formData.createTime = createDate
            }
            that.formData.modelClassify = res.modelClassify

            // that.formData.entityId = res.id
            // that.formData = Object.assign({}, that.formData)
            that.$refs.form.form.kprojectClassifyId = ''// 选择型号后将已经选择的项目类型清空
            that.$api['ProjectApply.projectClassifyTreeById']({ filedId: that.filedId, sid: res.modelClassify }).then(res2 => {
              if (res2 && res2.length > 0) {
                that.$refs.form.renderDataSource.filter(item => item.fieldName === 'kprojectClassifyId')[0].options = res2
              }
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      } else {
        that.formData.indexno = this.dateNumber
         console.log(createDate, '查看当日时间')
         that.formData.createTime = createDate
      }
      that.formData.configId = that.configId
    },
    showModal () {
      this.selectProjectVisible = true
    },
    openTable () {
      this.visible1 = true
    },
    closeModal1 (selectedRow1) {
      this.visible1 = false
      this.selectedRow1 = selectedRow1
      console.log(selectedRow1, '查看领导选择')
      if (this.selectedRow1) {
        let that = this
        that.formData.mainLeadUser = this.selectedRow1[0].id
        that.formData.mainLeadUserName = this.selectedRow1[0].realName
      }
    },
    closeModal (selectedRow) {
      console.log(selectedRow, '查看返回数据')
      this.selectProjectVisible = false
      if (selectedRow) {
        let that = this
        that.formData.filedName = selectedRow.location
        that.formData.modelInformationName = selectedRow.label
        that.formData.modelInformationCode = selectedRow.code
        that.formData.modelInformationId = selectedRow.id
        that.sid = selectedRow.sid// 领域id
        that.$refs.form.form.kprojectClassifyId = ''// 选择型号后将已经选择的项目类型清空
        this.$api['ProjectApply.projectClassifyTreeById']({ filedId: this.filedId, sid: this.sid }).then(res => {
          if (res && res.length > 0) {
            that.$refs.form.renderDataSource.filter(item => item.fieldName === 'kprojectClassifyId')[0].options = res
          }
        })
      }
      // this.selectedRow = selectedRow
      // if (this.selectedRow) {
      //   let that = this
      //   this.$api['planInfoManager.getWholeDescribeById']({ wholeDescribeId: that.selectedRow.id }).then(function (res) {
      //     if (res) {
      //       that.formData.name = res.name
      //       that.formData.planCode = res.planCode
      //       that.formData.planName = res.name + '的计划'
      //       that.formData.indexNo = res.indexNo
      //       that.formData.beginEndTime = [res.pBeginTime, res.pEndTime]
      //       that.formData.forecastTime = [res.FBeginTime, res.FEndTime]
      //       that.otherParam = { wholeDescribeId: that.selectedRow.id }
      //       that.formData = Object.assign({}, that.formData)
      //     }
      //   }).catch(function (error) {
      //     console.log(error)
      //   })
      // }
    },
    customValidate (saveParams) {
          //  console.log(this.formData, 'this.formData')

     saveParams.customItem1 = this.formData.customItem1
     saveParams.fundsSource = this.formData.fundsSource

    //  console.log(saveParams, 'saveParams')
      this.$refs.form.submitForm(saveParams, this.saveApi)
    },
    clickEvent () {
      console.log('click')
    },
    saved (res) {
      // 保存成功回调
      if (!this.formData.entityId && res.id) {
        this.formData.entityId = res.id
      }
      if (res && res.id) {
        this.$bus.$emit('setProjectEntityId', res.id)
      }
      let that = this
      if (that.isPush) {
        console.log(this.configEmData, 1111)
        console.log(this.configEmData.processDefinitionKey, 22222)
        if (that.formData.entityId) {
          that.$confirm(`是否提交决策形式确认？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.releaseMenuParams = {
              processDefinitionKey: that.configEmData.processDefinitionKey,
              id: that.formData.entityId,
              status: that.formData.status
            }
            that.nextApproveUserBeforehand(that.configEmData.processDefinitionKey)
          }).catch(() => { })
        }
      }

      this.$emit('save-success', res)
    },
    submitHandle (res) {
      this.isPush = false
      if (!this.formData.entityId && res.id) {
        this.formData.entityId = res.id
      }
      this.$refs.form.handleSubmit(res)
    },
    fpHandle (res) {
      if (!this.formData.entityId && res.id) {
        this.formData.entityId = res.id
      }
      this.$refs.form.handleSubmit(res)// 异步
      this.isPush = true
    },
    nextApproveUserBeforehand (processDefinationTwoKey) {
      let that = this
      nextApproveUserBeforehand.initDataSource(processDefinationTwoKey, that).then(res1 => {
        if (res1 === true) {
          that.isSelectApproveUserBeforehandView = true
        }
      })
    },
    closeSelectApproveUserBeforehand () {
      this.isSelectApproveUserBeforehandView = false
      this.$emit('close-modal')
    },
    saveSuccessCallBack () {
      this.isSelectApproveUserBeforehandView = false
      this.$emit('close-modal')
    },
    commitSelectApproveUserBeforehand (fullParams) {
      let that = this
      this.releaseMenuParams.beforehandParams = { ...fullParams }
      this.$api['ProjectApply.startProcessByPocessDefinitionKey']({ userMap: this.releaseMenuParams }).then(function (res) {
        that.$message({
          message: '操作成功',
          type: 'success'
        })
      }).catch(function (error) {
        console.error(error)
      })

      that.visibleProjectIndexDrawer = false
      that.isSelectApproveUserBeforehandView = false
      this.$emit('close-modal')
    },
    formDataChange (formSub) {
      // if (formSub.formData.appropriationBudget || formSub.formData.crossBudaget || formSub.formData.localBudaget || formSub.formData.raiseBudget) {
      //   this.formData.customItem1 =
      //           parseInt(formSub.formData.appropriationBudget || 0) + parseInt(formSub.formData.crossBudaget || 0) +
      //           parseInt(formSub.formData.localBudaget || 0) + parseInt(formSub.formData.raiseBudget || 0)
      // }
      this.buildSource()
    },
    buildSource () {
      let message = ''
      let num = 0
      if (this.formData.appropriationBudget > 0) {
        message += '国拨金额+'
        num += this.formData.appropriationBudget
      }
      if (this.formData.localBudaget > 0) {
        message += '地配金额+'
        num += this.formData.localBudaget
      }
      if (this.formData.crossBudaget > 0) {
        message += '横向合同来款+'
        num += this.formData.crossBudaget
      }
      if (this.formData.raiseBudget > 0) {
        message += '自筹金额+'
        num += this.formData.raiseBudget
      }
      let num1 = message.length
      this.formData.fundsSource = message.substring(0, num1 - 1)
      this.formData.customItem1 = parseFloat(num.toFixed(5))
      // this.formData = Object.assign({}, this.formData)
    }
  }
}
</script>
