<template>
  <div style="height:100%;">
    <form-list
            ref='form'
            style="height:100%;"
            :class="{emViewForm:modifyOrView === 'view', emModifyForm:modifyOrView === 'modify'}"
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
      <!-- <template #other>
        <ul class="userList">
          <el-tag>{{configEmData.sourceName}}->{{configEmData.filedName}}->{{configEmData.classifyName}}</el-tag>
        </ul>
      </template> -->
      <template #customBtn>
        <template v-if="modifyOrView === 'modify'">
          <el-button type="primary" size="mini" @click="fpHandle" :isPush="isPush">保存并发布</el-button>
          <el-button type="primary" size="mini" @click="submitHandle">保存</el-button>
        </template>
      </template>
      <template #modelInformationCode>
        <el-input v-model='formData["modelInformationCode"]'
                  readonly
                  autosize
                  placeholder="请选择型号"
                  v-on:click.native="showModal()">
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
    </form-list>
    <!-- 预先设置审批人-->
    <selectApproveUserBeforehand v-if="isSelectApproveUserBeforehandView"
                                 :isSelectApproveUserBeforehandView="isSelectApproveUserBeforehandView"
                                 :selectUserBeforehandDataSource="selectUserBeforehandDataSource"
                                 :selectUserBeforehandFormData="selectUserBeforehandFormData"
                                 @close-modal="closeSelectApproveUserBeforehand"
                                 @commit="commitSelectApproveUserBeforehand"></selectApproveUserBeforehand>
    <select-model v-if='selectProjectVisible'
                  :selected-row='selectedRows'
                  :filedId='filedId'
                  :visible='selectProjectVisible'
                  @close-dialog='closeModal'></select-model>
    <select-user v-if="visible1"
                 :visible="visible1"
                 :selected-row='selectedRows1'
                 selectType="1"
                 @close-dialog="closeModal1"></select-user>
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
  // import { Tag } from '~/index'
  import { P8Form as FormList } from '~/index'
  import selectModel from './components/moduleSelectList'
  import SelectProduct from './selectProduct'
  import { P8SelectUser as SelectUser } from '~/index'
  import SelectApproveUserBeforehand from '@/views/Framework/BusinessActivity/ProcessApproval/selectApproveUserBeforehand'
  import { nextApproveUserBeforehand } from '@/assets/commonJS/BusinessActivity/nextApproveUserBeforehand'

  export default {
    name: 'researchModule',
    components: {
      FormList,
      selectModel,
      SelectUser,
      SelectProduct,
      SelectApproveUserBeforehand
      // 'el-tag': Tag
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
      },
      formParam: { // 使用该模板的表单参数
        type: Array,
        default: () => {
          return []
        }
      },
      modifyOrView: { // 判断是修改页面还是查看页面
        type: String,
        default: 'modify'
      }
    },
    data () {
      return {
        saveApi: 'ProjectApply.wholeDescribeSave',
        selectProjectVisible: false,
        labelWidth: 'auto',
        sid: '', // 领域id
        filedId: '',
        isCustomValidate: true,
        productVisible: false,
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
        selectedRow: {},
        selectedRows: [],
        selectedRows1: [],
        disabledValuesArray: [],
        dataSource: [],
        relateObj: [],
        modify: {},
        otherParam: {},
        formData: {
          entityId: '',
          isPush: '',
          name: '',
          relateId: '',
          kprojectClassifyId: '',
          classify: '',
          modelInformationName: '',
          filedName: '',
          modelInformationId: '',
          productCode: '',
          productName: '',
          productInfoId: '',
          pjCode: '',
          dutyUser: '',
          dutyUserName: '',
          source: '',
          projectOrder: '',
          beginTime: '',
          endTime: '',
          secretGrade: '',
          SYSDEPT: '',
          fundsSource: '',
          totalBudget: '',
          mainDept: '',
          mainLeadUser: '',
          createTime: '',
          configId: '',
          particular: '',
          modelClassify: '',
          manageDept: ''

        },
        visibleDutyUser: false,
        visible1: false,
        isPush: false,
        fieldValue: '',
        eitherOrRequired: false // 判断“型号名称”与“产品名称”两个必填一
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
      this.getRelateId()
      //  this.formData.manageDept = '2f93d9937635383c1232766797902d2b'
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
      initCloumn () {
        let _this = this
        let tempModifyDataSource = [
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
          // {
          //   type: 'blank',
          //   labelText: '业务来源/范围/类型:',
          //   slotName: 'other',
          //   colLayout: 'singleCol'
          // },
          {
            type: 'text',
            labelText: '项目名称',
            fieldName: 'name',
            colLayout: 'singleCol',
            placeholder: '请输入项目名称'
          },
          {
            type: 'select',
            labelText: '所属领域', // 只读
            fieldName: 'field',
            colLayout: 'doubleCol',
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
            placeholder: '请选择型号代号'
          },
          {
            type: 'view',
            labelText: '型号名称', // 只读
            fieldName: 'modelInformationName',
            colLayout: 'doubleCol'
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
            placeholder: '请选择项目来源'
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
            placeholder: '请选择项目密级'
          },
          {
            type: 'datetime',
            labelText: '预计开始时间',
            fieldName: 'beginTime',
            colLayout: 'doubleCol',
            placeholder: '请选择开始时间',
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
            labelText: '预计完成时间',
            fieldName: 'endTime',
            colLayout: 'doubleCol',
            placeholder: '请选择结束时间',
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
            colLayout: 'doubleCol'
          },
          {
            type: 'treeSelect',
            labelText: '参研部门',
            fieldName: 'leadDeptIds',
            clearable: true,
            multiple: true,
            defaultValue: [],
            disabledValues: ['1'],
            defaultExpandedKeys: ['1'],
            optionUrl: {
              api: 'ProjectApply.deptTree',
              params: {}
            },
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
            }
          },
          {
            type: 'text',
            labelText: '客户名称',
            fieldName: 'sysDept',
            colLayout: 'singleCol',
            placeholder: '请输入合同乙方名称'
          },
          {
            type: 'textarea',
            labelText: '项目概述',
            fieldName: 'backdrop',
            colLayout: 'singleCol',
            placeholder: '项目背景、任务目标（明确到单机）、达成成果'
          },
          {
            type: 'number',
            labelText: '国拨金额预估(万元)',
            min: 0,
            trigger: 'blur',
            fieldName: 'appropriationBudget',
            placeholder: '请输入国拨金额',
            colLayout: 'doubleCol'
          },
          {
            type: 'number',
            labelText: '地配金额预估(万元)',
            min: 0,
            fieldName: 'localBudaget',
            placeholder: '请输入地配金额',
            colLayout: 'doubleCol'
          },
          {
            type: 'number',
            labelText: '自筹金额预估(万元)',
            min: 0,
            fieldName: 'raiseBudget',
            placeholder: '请输入自筹金额',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '经费来源',
            fieldName: 'fundsSource',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '总概算预估(万元)',
            fieldName: 'totalBudget',
            colLayout: 'singleCol'
          },
          {
            type: 'number',
            labelText: '项目报价(万元)',
            min: 0,
            fieldName: 'projectOffer',
            colLayout: 'doubleCol',
            placeholder: '请输入项目报价(方案竞标必填)'
          }
        ]
        let tempViewDataSource = [
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
          // {
          //   type: 'blank',
          //   labelText: '业务来源/范围/类型:',
          //   slotName: 'other',
          //   colLayout: 'singleCol'
          // },
          {
            type: 'view',
            labelText: '项目名称',
            fieldName: 'name',
            colLayout: 'singleCol'
          },
          {
            type: 'view',
            labelText: '所属领域', // 只读
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
            labelText: '预计完成时间',
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
            type: 'view',
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
            labelText: '客户名称',
            fieldName: 'sysDept',
            colLayout: 'singleCol'
          },
          {
            type: 'view',
            labelText: '项目概述',
            fieldName: 'backdrop',
            colLayout: 'singleCol'
          },
          {
            type: 'view',
            labelText: '国拨金额预估(万元)',
            fieldName: 'appropriationBudget',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '地配金额预估(万元)',
            fieldName: 'localBudaget',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '自筹金额预估(万元)',
            fieldName: 'raiseBudget',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '经费来源',
            fieldName: 'fundsSource',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '总概算预估(万元)',
            fieldName: 'totalBudget',
            colLayout: 'singleCol'
          },
          {
            type: 'view',
            labelText: '项目报价(万元)',
            fieldName: 'projectOffer',
            colLayout: 'doubleCol'
          }
        ]
        let exportModifyData = []
        let exportViewData = []
        tempModifyDataSource.map(item => {
          let config = _this.formParam.filter(o => o.fieldName === item.fieldName)
          if (config.length) {
            if (config[0].required) {
              item.rules = [{ required: true, message: '该项为必填项' }]
            }
            if (config[0].eitherOrRequired) {
              _this.eitherOrRequired = true
            }
            if (!config[0].hidden) {
              exportModifyData.push(item)
            }
          } else {
            exportModifyData.push(item)
          }
        })
        tempViewDataSource.map(item => {
          let config = _this.formParam.filter(o => o.fieldName === item.fieldName)
          if (config.length) {
            if (!config[0].hidden) {
              exportViewData.push(item)
            }
          } else {
            exportViewData.push(item)
          }
        })
        if (this.modifyOrView === 'modify') {
          return exportModifyData
        } else {
          return exportViewData
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
              if (!res.projectOffer) {
                that.formData.projectOffer = undefined
              }

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
      showModal () {
        this.selectProjectVisible = true
      },
      openTable () {
        this.visible1 = true
      },
      closeModal1 (selectedRow1) {
        this.visible1 = false
        this.selectedRow1 = selectedRow1
        if (this.selectedRow1) {
          let that = this
          that.formData.mainLeadUser = this.selectedRow1[0].id
          that.formData.mainLeadUserName = this.selectedRow1[0].realName
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
      customValidate (saveParams) {
        saveParams.totalBudget = this.formData.totalBudget
        saveParams.fundsSource = this.formData.fundsSource
        this.$refs.form.submitForm(saveParams, this.saveApi)
      },
      clickEvent () {
        console.log('click')
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
      submitHandle (res) {
        this.isPush = false
        if (this.formData.modelInformationName === '') {
          this.$message({
            message: '请选择型号代号',
            type: 'warning'
          })
          return
        }
        if (!this.formData.entityId && res.id) {
          this.formData.entityId = res.id
        }
        this.$refs.form.handleSubmit(res)
      },
    fpHandle (res) {
      if (this.formData.modelInformationName === '') {
            this.$message({
              message: '请选择型号代号',
              type: 'warning'
            })
            return
        }
        this.$confirm(`是否确定要保存并发布该项目？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (!this.formData.entityId && res.id) {
              this.formData.entityId = res.id
            }
            this.formData.isPush = 'true'
            this.$refs.form.handleSubmit(res)// 异步
            this.isPush = true
          }).catch(() => { })
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
        this.buildSource()
        if (this.formData.field && this.formData.field !== this.fieldValue) {
          this.getKprojectClassifyOptions(this.formData.field)
          // this.clearModelAndClassify()
        }
      },
      // clearModelAndClassify () {
      //   let f = this.dataSource.filter(item => item.fieldName === 'field')
      //   console.log('fffffffffffff', f)
      //   if (f.length > 0) {
      //     this.formData.kprojectClassifyId = ''
      //     this.formData.modelInformationName = ''
      //     this.formData.modelInformationCode = ''
      //   }
      // },
      buildSource () {
        let message = ''
        let num = 0
        if (this.formData.appropriationBudget > 0) {
          message += '国拨金额+'
          num += Number(this.formData.appropriationBudget)
        }
        if (this.formData.localBudaget > 0) {
          message += '地配金额+'
          num += Number(this.formData.localBudaget)
        }
        if (this.formData.crossBudaget > 0) {
          message += '横向合同来款+'
          num += Number(this.formData.crossBudaget)
        }
        if (this.formData.raiseBudget > 0) {
          message += '自筹金额+'
          num += Number(this.formData.raiseBudget)
        }
        let num1 = message.length
        this.formData.fundsSource = message.substring(0, num1 - 1)
        this.formData.totalBudget = num
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
