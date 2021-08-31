<template>
  <div style="height:100%;">
    <form-list
            ref='form'
            :class="{emViewForm:modifyOrView === 'view', emModifyForm:modifyOrView === 'modify'}"
            style="height:100%;"
            @rendered='rendered'
            @saved='saved'
            :form='formData'
            labelWidth='170px'
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
          <i v-if='!formData["modelInformationCode"]'
             class='el-icon-link'
             slot='suffix'
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
      <template #majorDirection>
        <el-select v-model="formData['majorDirection']" style="width:100%" @change="changeMajorDirection">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </template>
      <template #guideDirection>
        <el-input :disabled="guideDirectionDisabled" v-model="formData['guideDirection']" :placeholder="guideDirectionPlaceHolder"></el-input>
      </template>
      <template #isSpecial>
        <el-select :disabled="isSpecialDisabled" v-model="formData['isSpecial']" style="width:100%" :placeholder="isSpecialPlaceHolder">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
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
  import { Tag } from '~/index'
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
        relateObj: {},
        relateId: '',
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
        modify: {},
        otherParam: {},
        formData: {
          entityId: '',
          isPush: '',
          name: '',
          kprojectClassifyId: '',
          classify: '',
          modelInformationName: '',
          filedName: '',
          modelInformationId: '',
          productCode: '',
          productName: '',
          productInfoId: '',
          pjCode: '',
          source: '',
          projectOrder: '',
          beginTime: '',
          endTime: '',
          dutyUser: '',
          dutyUserName: '',
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
          majorDirection: '',
          guideDirection: '',
          isSpecial: '',
          backdrop: '',
          researchObjective: '',
          achievement: '',
          result: '',
          applicationDirection: '',
             manageDept: ''
        },
        visible1: false,
        isPush: false,
        visibleDutyUser: false,
        guideDirectionRequired: false,
        isSpecialRule: [],
        fieldValue: '',
        eitherOrRequired: false, // 判断“型号名称”与“产品名称”两个必填一
        guideDirectionDisabled: false, // 对应指南方向是否禁用
        isSpecialDisabled: false, // 是否通过专题论证是否禁用
        guideDirectionPlaceHolder: '请输入对应指南方向',
        isSpecialPlaceHolder: '请选择是否通过专题论证'
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
      // this.rendered()
      this.getRelateId()
      // this.changeMajorDirection('0')
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
            type: 'select',
            labelText: '项目类别',
            fieldName: 'projectType',
            optionUrl: {
              api: 'thirdPartInterface.getDic',
              params: { dicType: 'BASE_PROJECT_TYPE_CATEGORY' }
            },
            colLayout: 'doubleCol',
            placeholder: '请选择项目类别',
            fieldConfig: { filterable: true }
          },
          {
            type: 'select',
            labelText: '工程技术方向',
            fieldName: 'techDirection',
            optionUrl: {
              api: 'thirdPartInterface.getDic',
              params: { dicType: 'ENGINEE_TECH' }
            },
            colLayout: 'doubleCol',
            placeholder: '请选择工程技术方向'
          },
          {
            type: 'blank',
            labelText: '是否符合专业技术发展指南',
            fieldName: 'majorDirection',
            slotName: 'majorDirection',
            colLayout: 'doubleCol'
          },
          {
            type: 'blank',
            labelText: '对应指南方向',
            fieldName: 'guideDirection',
            slotName: 'guideDirection',
            colLayout: 'doubleCol'
          },
          {
            type: 'blank',
            labelText: '是否通过专题论证',
            fieldName: 'isSpecial',
            slotName: 'isSpecial',
            colLayout: 'doubleCol'
          },
          {
            type: 'select',
            labelText: '是否重大项目',
            fieldName: 'isMajorProjects',
            options: [
              {
                label: '是',
                value: '1'
              },
              {
                label: '否',
                value: '0'
              }
            ],
            colLayout: 'doubleCol'
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
            labelText: '需求背景',
            fieldName: 'backdrop',
            colLayout: 'singleCol',
            style: { 'margin-left': '2px' }
          },
          {
            type: 'textarea',
            labelText: '研究目标',
            fieldName: 'researchObjective',
            colLayout: 'singleCol',
            style: { 'margin-left': '2px' }
          },
          {
            type: 'textarea',
            labelText: '成果形式',
            fieldName: 'achievement',
            colLayout: 'singleCol',
            style: { 'margin-left': '2px' }
          },
          {
            type: 'textarea',
            labelText: '预期效果',
            fieldName: 'expectResult',
            colLayout: 'singleCol',
            style: { 'margin-left': '2px' }
          },
          {
            type: 'textarea',
            labelText: '应用方向',
            fieldName: 'applicationDirection',
            colLayout: 'singleCol',
            style: { 'margin-left': '2px' }
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
            type: 'view',
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
            labelText: '项目类别',
            fieldName: 'projectTypeDisplay',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '工程技术方向',
            fieldName: 'techDirectionDisplay',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '是否符合专业技术发展指南',
            fieldName: 'majorDirectionDisplay',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '对应指南方向',
            fieldName: 'guideDirection',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '是否通过专题论证',
            fieldName: 'isSpecialDisplay',
            colLayout: 'doubleCol'
          },
          {
            type: 'view',
            labelText: '是否重大项目',
            fieldName: 'isMajorProjectsDisplay',
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
            labelText: '需求背景',
            fieldName: 'backdrop',
            colLayout: 'singleCol',
            style: { 'margin-left': '2px' }
          },
          {
            type: 'view',
            labelText: '研究目标',
            fieldName: 'researchObjective',
            colLayout: 'singleCol',
            style: { 'margin-left': '2px' }
          },
          {
            type: 'view',
            labelText: '成果形式',
            fieldName: 'achievement',
            colLayout: 'singleCol',
            style: { 'margin-left': '2px' }
          },
          {
            type: 'view',
            labelText: '预期效果',
            fieldName: 'expectResult',
            colLayout: 'singleCol',
            style: { 'margin-left': '2px' }
          },
          {
            type: 'view',
            labelText: '应用方向',
            fieldName: 'applicationDirection',
            colLayout: 'singleCol',
            style: { 'margin-left': '2px' }
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
          }
        ]
        let exportModifyData = []
        let exportViewData = []
        tempModifyDataSource.map(item => {
          let config = _this.formParam.filter(o => o.fieldName === item.fieldName)
          if (config.length) {
            if (config[0].required) {
                item.rules = [{ required: true, message: '该项为必填项' }]
              if (config[0].fieldName === 'guideDirection') {
                _this.guideDirectionRequired = true
              }
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
      changeMajorDirection (val) {
        if (val === '0') {
          this.isSpecialDisabled = false
          this.guideDirectionDisabled = true
          this.formData.guideDirection = null
          this.guideDirectionPlaceHolder = '已禁用'
          this.isSpecialPlaceHolder = '请选择是否通过专题论证'
          this.dataSource.map(item => {
            if (item.fieldName === 'isSpecial') {
               item.rules = [{ required: true, message: '该项为必填项' }]
            } else if (item.fieldName === 'guideDirection') {
              item.rules = [{ required: false, message: '该项为必填项' }]
            }
          })
        } else {
          let _this = this
          this.isSpecialDisabled = true
          this.guideDirectionDisabled = false
          this.formData.isSpecial = null
          this.formData.isSpecialDisplay = null
          this.guideDirectionPlaceHolder = '请输入对应指南方向'
          this.isSpecialPlaceHolder = '已禁用'
          this.dataSource.map(item => {
            if (item.fieldName === 'isSpecial') {
              item.rules = [{ required: false, message: '该项为必填项' }]
            } else if (_this.guideDirectionRequired && item.fieldName === 'guideDirection') {
              item.rules = [{ required: true, message: '该项为必填项' }]
            }
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
              if (that.formData.majorDirection !== '') {
                // alert('0')
                that.changeMajorDirection(that.formData.majorDirection)
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
      closeModalSelectUser (selectedRow1) {
        this.visibleDutyUser = false
        this.selectedRow1 = selectedRow1
        if (this.selectedRow1) {
          let that = this
          that.formData.dutyUser = this.selectedRow1[0].id
          that.formData.dutyUserName = this.selectedRow1[0].realName
        }
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
        if (!this.formData.entityId && res.id) {
          this.formData.entityId = res.id
        }
        this.formData.isPush = 'true'
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
        if (this.formData.field && this.formData.filed !== this.fieldValue) {
          this.getKprojectClassifyOptions(this.formData.field)
        }
      },
      buildSource () {
        let message = ''
        let num = 0
        if (this.modifyOrView === 'modify') {
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
          this.formData.totalBudget = num
        }
      }
    }
  }
</script>

<style lang="scss">
  .view {
    word-break: normal;
    display: block;
    word-wrap: break-word;
    overflow: hidden;
    color: #888888;
  }

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
