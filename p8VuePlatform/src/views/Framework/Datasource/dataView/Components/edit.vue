<template>
  <div>
    <form-list
      ref="form"
      :dataSource="dataSource"
      :form="formData"
      :api="saveApi"
      @saved="saved"
      labelWidth="90px"
      @rendered="rendered"
      :isCustomValidate="true"
      @custom-validate="parseCheck"
    >
      <template #sql>
        <codemirror v-model="formData.sql" :options="cmOptions"></codemirror>
      </template>
    </form-list>
    <div>

    </div>
    <editable-table :columns="paramColumns" :addRow="true" :params="params" api="formGenerator.sqlParam" :renderHeight="renderHeight" @save-param-data="saveParamData">
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
  </div>
</template>

<script>
import { Input, InputNumber } from '~/index'
import { codemirror } from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/sql/sql'
import { P8Form as FormList } from '~/index'
import { P8EditTable as EditableTable } from '~/index'
export default {
  name: 'SqlEdit',
  components: {
    FormList,
    codemirror,
    EditableTable,
    'el-input': Input,
    'el-input-number': InputNumber
  },
  props: {
    record: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    const height = document.documentElement.clientHeight - 528
    return {
      renderHeight: height + 'px',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'sql',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      },
      saveApi: 'formGenerator.sqlSave',
      dataSource: [
        {
          type: 'text',
          labelText: 'SQL编码',
          fieldName: 'code',
          placeholder: '请输入SQL编码',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'text',
          labelText: 'SQL名字',
          fieldName: 'name',
          placeholder: '请输入SQL名字',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true
            }
          ]
        },
        {
          type: 'blank',
          labelText: 'SQL正文',
          fieldName: 'sql',
          slotName: 'sql',
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '该项为必填项'
            }
          ]
        },
        // {
        //   type: 'textarea',
        //   labelText: 'SQL正文',
        //   fieldName: 'sql',
        //   placeholder: '请输入SQL正文',
        //   colLayout: 'singleCol',
        //   rules: [
        //     {
        //       required: true
        //     }
        //   ]
        // },
        {
          type: 'select',
          labelText: '动态数据源',
          fieldName: 'dbSource',
          placeholder: '下拉选择你要的',
          colLayout: 'singleCol',
          options: [
            {
              label: 'DB_SOURCE1',
              value: 'DB_SOURCE1'
            },
            {
              label: 'DB_SOURCE2',
              value: 'DB_SOURCE2'
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
          placeholder: '请输入描述',
          colLayout: 'singleCol',
          rules: [
            {
              required: true
            }
          ]
        }
      ],
      formData: {
        sql: ''
      },
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
      params: {},
      sqlParams: {
        sqlParamList: []
      }
    }
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
      this.sqlParams['sqlParamList'] = data
    },
    saved (res) {
      console.log('修改页面关闭时的回调方法')
      this.$emit('saveSuccess', res)
    },
    parseCheck (saveParams) {
      let params = { ...saveParams, ...this.sqlParams }
      let _this = this
      this.$api['formGenerator.sqlParseCheck'](params).then(res => {
        if (res) {
          _this.$refs.form.submitForm(params, _this.saveApi)
        } else {
          _this.$message({
            message: 'SQL解析失败，请重新检查！',
            type: 'warning'
          })
        }
      })
    },
    changeSql (val) {
      this.params = { sqlId: val }
    }
  }
}
</script>
<style lang="scss">
  .CodeMirror{
    height:150px;
  }
</style>
