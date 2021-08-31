<template>
  <div>
    <form-list
      ref="form"
      :dataSource="dataSource"
      :form="formData"
      :api="saveApi"
      @saved="saved"
      labelWidth="100px"
      :isCustomValidate="true"
      @custom-validate="customValidate"
      @rendered="rendered"
    >
      <template #sqlid>
        <el-select v-model="formData.sqlid" @change="changeSql" style="width:100%;">
          <template v-for="(item, index) in sqlIdOption">
            <el-option :label="item.name" :value="item.id" :key="index"></el-option>
          </template>
        </el-select>
      </template>
    </form-list>
    <common-tabs :tabsData="tabsData" :height="height" :activeTabs="activeTabs">
      <template #tableConfigDetails>
        <editable-table :columns="columns" :addRow="true" :needParams="true" :params="tableParams" :api="tableConfigDetailsApi" @save-param-data="saveTableData">
          <template #fieldName="{scope, data}">
            <el-input v-model="scope.row.fieldName" @blur="saveTableData(data)"></el-input>
          </template>
          <template #fieldType="{scope, data}">
            <el-input v-model="scope.row.fieldType" @blur="saveTableData(data)"></el-input>
          </template>
          <template #fieldTxt="{scope, data}">
            <el-input v-model="scope.row.fieldTxt" @blur="saveTableData(data)"></el-input>
          </template>
          <template #fieldWidth="{scope, data}">
            <el-input-number v-model="scope.row.fieldWidth" @blur="saveTableData(data)"></el-input-number>
          </template>
          <template #isListShow="{scope, data}">
            <el-checkbox v-model="scope.row.isListShow" :true-label="1" :false-label="0" @change="saveTableData(data)"></el-checkbox>
          </template>
          <template #isViewShow="{scope, data}">
            <el-checkbox v-model="scope.row.isViewShow" :true-label="1" :false-label="0" @change="saveTableData(data)"></el-checkbox>
          </template>
          <template #isOrder="{scope, data}">
            <el-checkbox v-model="scope.row.isOrder" :true-label="1" :false-label="0" @change="saveTableData(data)"></el-checkbox>
          </template>
          <template #isSearch="{scope, data}">
            <el-checkbox v-model="scope.row.isSearch" :true-label="1" :false-label="0" @change="saveTableData(data)"></el-checkbox>
          </template>
          <template #isCustomColumn="{scope, data}">
            <el-checkbox v-model="scope.row.isCustomColumn" :true-label="1" :false-label="0" @change="saveTableData(data)"></el-checkbox>
          </template>
          <template #searchMode="{scope, data}">
            <el-select v-model="scope.row.searchMode" clearable @change="saveTableData(data)">
              <el-option label="单条件查询" value="singleSearch"></el-option>
              <!-- <el-option label="范围查询" value="rangeSearch"></el-option> -->
            </el-select>
          </template>
          <template #replaceVal="{scope, data}">
            <el-input v-model="scope.row.replaceVal" @blur="saveTableData(data)"></el-input>
          </template>
          <template #dictCode="{scope, data}">
            <el-input v-model="scope.row.dictCode" @blur="saveTableData(data)"></el-input>
          </template>
          <template #fieldHref="{scope, data}">
            <el-input v-model="scope.row.fieldHref" @blur="saveTableData(data)"></el-input>
          </template>
          <template #orderNum="{scope, data}">
            <el-input-number v-model="scope.row.orderNum" @blur="saveTableData(data)"></el-input-number>
          </template>
        </editable-table>
      </template>
      <template #tableParam>
        <editable-table :columns="paramColumns" :addRow="true" :needParams="true" :params="paramParams" api="formGenerator.tableParam" @save-param-data="saveParamData">
          <template #paramName="{scope, data}">
            <el-input v-model="scope.row.paramName" @blur="saveParamData(data)"></el-input>
          </template>
          <template #paramTxt="{scope, data}">
            <el-input v-model="scope.row.paramTxt" @blur="saveParamData(data)"></el-input>
          </template>
          <template #paramValue="{scope, data}">
            <el-input v-model="scope.row.paramValue" @blur="saveParamData(data)"></el-input>
          </template>
          <template #orderNum="{scope, data}">
            <el-input-number v-model="scope.row.orderNum" @blur="saveParamData(data)"></el-input-number>
          </template>
        </editable-table>
      </template>
      <template #tableButton>
        <editable-table :columns="buttonColumns" :addRow="true" :needParams="true" :params="buttonParams" api="formGenerator.tableButton" @save-param-data="saveButtonData">
          <template #title="{scope, data}">
            <el-input v-model="scope.row.title" @blur="saveButtonData(data)"></el-input>
          </template>
          <!-- <template #id="{scope, data}">
            <el-input v-model="scope.row.id" @blur="saveButtonData(data)"></el-input>
          </template>
          <template #parentId="{scope, data}">
            <el-input v-model="scope.row.parentId" @blur="saveButtonData(data)"></el-input>
          </template> -->
          <template #image="{scope, data}">
            <el-input v-model="scope.row.image" @blur="saveButtonData(data)"></el-input>
          </template>
          <!-- <template #enable="{scope, data}">
            <el-checkbox v-model="scope.row.enable" @change="saveButtonData(data)"></el-checkbox>
          </template> -->
          <!-- <template #isDisabled="{scope, data}">
            <el-checkbox v-model="scope.row.isDisabled" @change="saveButtonData(data)"></el-checkbox>
          </template> -->
          <template #location="{scope, data}">
            <el-select v-model="scope.row.location" @change="saveButtonData(data)">
              <el-option label="行内" value="row"></el-option>
              <el-option label="顶部" value="head"></el-option>
            </el-select>
          </template>
          <template #eventHandle="{scope, data}">
            <el-autocomplete
              v-model="scope.row.eventHandle"
              :fetch-suggestions="querySearch"
              @blur="saveButtonData(data)">
              <template slot-scope="{ item }">
                <div class="name">{{ item }}</div>
              </template>
            </el-autocomplete>
          </template>
          <template #belongTo="{scope, data}">
            <el-input v-model="scope.row.belongTo" @blur="saveButtonData(data)"></el-input>
          </template>
          <template #permission="{scope, data}">
            <el-input type="textarea" v-model="scope.row.permission" @change="saveButtonData(data)"></el-input>
          </template>
          <template #component="{scope, data}">
            <el-input type="textarea" v-model="scope.row.component" @change="saveButtonData(data)"></el-input>
          </template>
          <template #remark="{scope, data}">
            <el-input type="textarea" v-model="scope.row.remark" @change="saveButtonData(data)"></el-input>
          </template>
          <template #rdesc="{scope, data}">
            <el-input type="textarea" v-model="scope.row.rdesc" @blur="saveButtonData(data)"></el-input>
          </template>
        </editable-table>
      </template>
    </common-tabs>
  </div>
</template>

<script>
import { Input, Checkbox, Select, Option, InputNumber, Autocomplete } from '~/index'
import { P8Form as FormList } from '~/index'
import { P8Tabs as CommonTabs } from '~/index'
import { P8EditTable as EditableTable } from '~/index'
export default {
  name: 'TableEdit',
  components: {
    FormList,
    CommonTabs,
    EditableTable,
    'el-input': Input,
    'el-checkbox': Checkbox,
    'el-select': Select,
    'el-option': Option,
    'el-input-number': InputNumber,
    'el-autocomplete': Autocomplete
  },
  props: {
    record: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    const height = document.documentElement.clientHeight - 342
    return {
      saveApi: 'formGenerator.tableSave',
      dataSource: [
        {
          type: 'text',
          labelText: '报表编码',
          fieldName: 'code',
          placeholder: '请输入报表编码',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'text',
          labelText: '报表名字',
          fieldName: 'name',
          placeholder: '请输入报表名字',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'blank',
          labelText: '报表SQLId',
          fieldName: 'sqlid',
          slotName: 'sqlid',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              message: '该项为必填项'
            }
          ]
        },
        {
          type: 'radioButton',
          labelText: '显示复选框',
          fieldName: 'selectType',
          colLayout: 'doubleCol',
          defaultValue: 0,
          options: [
            {
              label: '无', value: 0
            },
            {
              label: '单选', value: 1
            },
            {
              label: '复选', value: 2
            }
          ],
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'radioButton',
          labelText: '查询条件位置',
          fieldName: 'searchPos',
          colLayout: 'doubleCol',
          defaultValue: 0,
          options: [
            {
              label: 'header区域', value: 0
            },
            {
              label: '表头', value: 1
            }
          ]
        },
        {
          type: 'radioButton',
          labelText: '启用行单击',
          fieldName: 'enableClick',
          colLayout: 'doubleCol',
          defaultValue: 0,
          options: [
            {
              label: '不启用', value: 0
            },
            {
              label: '启用', value: 1
            }
          ],
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'textarea',
          labelText: '描述',
          fieldName: 'content',
          placeholder: '请填写描述',
          colLayout: 'singleCol',
          rules: [
            {
              required: true
            }
          ]
        }
      ],
      formData: {
        sqlid: ''
      },
      sqlIdOption: [],
      height: height + 'px',
      tabsData: [
        {
          label: '报表配置明细',
          name: 'tableConfigDetails',
          icon: 'icon-multi-project-manage'
        },
        {
          label: '报表参数',
          name: 'tableParam',
          icon: 'icon-business-execution'
        },
        {
          label: '报表按钮',
          name: 'tableButton',
          icon: 'icon-process-template'
        }
      ],
      columns: [
        {
          title: '字段名称',
          dataIndex: 'fieldName',
          width: 160,
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '字段类型',
          dataIndex: 'fieldType',
          width: 120,
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '字段文本',
          dataIndex: 'fieldTxt',
          width: 180,
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '字段宽度',
          dataIndex: 'fieldWidth',
          width: 140,
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '列表是否显示',
          dataIndex: 'isListShow',
          minWidth: 100,
          align: 'center',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '查看是否显示',
          dataIndex: 'isViewShow',
          minWidth: 100,
          align: 'center',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '是否排序',
          dataIndex: 'isOrder',
          minWidth: 80,
          align: 'center',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '是否查询',
          dataIndex: 'isSearch',
          minWidth: 80,
          align: 'center',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '是否自定义列',
          dataIndex: 'isCustomColumn',
          minWidth: 100,
          align: 'center',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '查询模式',
          dataIndex: 'searchMode',
          width: 140,
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '取值表达式',
          dataIndex: 'replaceVal',
          width: 180,
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '字典Code',
          dataIndex: 'dictCode',
          width: 120,
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '字段跳转href',
          dataIndex: 'fieldHref',
          width: 180,
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '排序',
          dataIndex: 'orderNum',
          width: 140,
          scopedSlots: { customRender: 'custom' }
        }
      ],
      paramColumns: [
        {
          title: '参数字段',
          dataIndex: 'paramName',
          minWidth: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '参数文本',
          dataIndex: 'paramTxt',
          minWidth: 180,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '参数默认值',
          dataIndex: 'paramValue',
          minWidth: 180,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '排序',
          dataIndex: 'orderNum',
          width: 140,
          default: undefined,
          scopedSlots: { customRender: 'custom' }
        }
      ],
      buttonColumns: [
        {
          title: '按钮文本',
          dataIndex: 'title',
          minWidth: 120,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        // {
        //   title: 'ID',
        //   dataIndex: 'id',
        //   minWidth: 160,
        //   default: '',
        //   scopedSlots: { customRender: 'custom' }
        // },
        // {
        //   title: 'parentId',
        //   dataIndex: 'parentId',
        //   minWidth: 160,
        //   default: '',
        //   scopedSlots: { customRender: 'custom' }
        // },
        {
          title: '图标',
          dataIndex: 'image',
          width: 140,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        // {
        //   title: '是否可见',
        //   dataIndex: 'enable',
        //   width: 80,
        //   align: 'center',
        //   default: true,
        //   scopedSlots: { customRender: 'custom' }
        // },
        // {
        //   title: '是否禁用',
        //   dataIndex: 'isDisabled',
        //   width: 80,
        //   align: 'center',
        //   default: false,
        //   scopedSlots: { customRender: 'custom' }
        // },
        {
          title: '位置',
          dataIndex: 'location',
          width: 120,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '事件',
          dataIndex: 'eventHandle',
          width: 170,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '表单code',
          dataIndex: 'belongTo',
          width: 120,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '禁用规则',
          dataIndex: 'permission',
          width: 200,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '动态组件地址',
          dataIndex: 'component',
          width: 200,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '动态api',
          dataIndex: 'remark',
          width: 200,
          default: '',
          scopedSlots: { customRender: 'custom' }
        },
        {
          title: '描述',
          dataIndex: 'rdesc',
          width: 200,
          default: '',
          scopedSlots: { customRender: 'custom' }
        }
      ],
      tableParams: {},
      paramParams: {},
      buttonParams: {},
      activeTabs: 'tableConfigDetails',
      reportParams: {
        reportItem: [],
        reportParam: [],
        reportButton: []
      },
      tableConfigDetailsApi: '', // 报表配置列表的api，可切换
      oldSqlId: '',
      eventHandleArr: ['createForm', 'modifyForm', 'deleteForm', 'viewForm', 'openComponent', 'dynamicAPI'] // 报表内置事件名
    }
  },
  mounted () {
    window.addEventListener('resize', this._initTableSize)
    let param = {
      page: {
        current: -1,
        size: -1,
        orders: []
      }
    }
    let _this = this
    this.$api['formGenerator.sqlList'](param).then(res => {
      _this.sqlIdOption = res.records
    })
  },
  methods: {
    _initTableSize () {
      const vm = this
      let timer = null
      // 这里增加一个延迟保证不会触发频次不会太高,减少开销
      if (timer) return
      timer = setTimeout(() => {
        const mh = document.documentElement.clientHeight - 342
        vm.height = mh + 'px'
        timer = null
      }, 300)
    },
    rendered () {
      // 所有表单元素渲染后调用rendered
      if (this.record.id) {
        this.oldSqlId = this.record.sqlid
        this.getFormData()
      }
    },
    getFormData () {
      console.log(this.record, 'record')
      this.formData = Object.assign({}, this.record)
      this.modifyTableData(this.formData.id)
    },
    saved (res) {
      console.log('修改页面关闭时的回调方法')
      this.$emit('saveSuccess', res)
    },
    saveTableData (data) {
      this.reportParams['reportItem'] = data
    },
    saveParamData (data) {
      this.reportParams['reportParam'] = data
    },
    saveButtonData (data) {
      this.reportParams['reportButton'] = data
    },
    customValidate (saveParams) {
      let params = { ...saveParams, ...this.reportParams }
      this.$refs.form.submitForm(params, this.saveApi)
    },
    changeSql (val) {
      let _this = this
      if (this.record.id) {
        this.$confirm(`切换报表SQLID会丢失报表配置信息，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.tableConfigDetailsApi = 'formGenerator.tableSqlParse'
          _this.tableParams = { sqlId: val }
          _this.paramParams = { reportId: '' }
          _this.buttonParams = { reportId: '' }
        }).catch((e) => {
          _this.formData.sqlid = _this.oldSqlId
        })
      } else {
        this.tableConfigDetailsApi = 'formGenerator.tableSqlParse'
        this.tableParams = { sqlId: val }
        this.paramParams = { reportId: '' }
        this.buttonParams = { reportId: '' }
      }
    },
    modifyTableData (val) {
      this.tableConfigDetailsApi = 'formGenerator.tableColumnsInfo'
      this.tableParams = { reportId: val }
      this.paramParams = { reportId: val }
      this.buttonParams = { reportId: val }
    },
    // eventHandle输入框加建议下拉框
    querySearch (queryString, cb) {
      let eventHandleArr = this.eventHandleArr
      let results = queryString ? eventHandleArr.filter(this.createFilter(queryString)) : eventHandleArr
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (eventHandle) => {
        return (eventHandle.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    }
  }
}
</script>
