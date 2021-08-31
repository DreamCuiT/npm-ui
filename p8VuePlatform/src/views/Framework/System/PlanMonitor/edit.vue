<template>
    <div>
        <form-list ref="form"
            @rendered="rendered"
            @saved="saved"
            :dataSource="dataSource"
            :api="saveApi"
            :form="modify" >
            <template #icon>
                <el-input
                    @click.native="iconPopover=true"
                    v-model="modify.icon"
                    placeholder="请选择图标"></el-input>
                <common-dialog
                  title="图标选择"
                  width="50%"
                  v-if="iconPopover"
                  :visible="iconPopover"
                  :dialogConfig="dialogConfig"
                  :dialogHeight="dialogHeight"
                  @close="handleClose"
                  @handle-cancel="handleClose"
                  @handle-ok="handleClose">
                  <template #dialog>
                    <icon-selector @icon-select="iconSelect" :selectedName="modify.icon"></icon-selector>
                  </template>
                </common-dialog>
            </template>
        </form-list>
    </div>
</template>
<script>
import { P8Form as FormList } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
import { P8IconSelector as IconSelector } from '~/index'
import { Input } from '~/index'
export default {
  name: 'PlanLogoEdit',
  components: {
    FormList,
    CommonDialog,
    IconSelector,
    'el-input': Input
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    record: {}
  },
  data () {
    return {
      saveApi: 'PlanMonitor.savePlanLogo',
      radioType: null,
      dataSource: [
        {
          type: 'text',
          fieldName: 'name',
          labelText: '标识名称',
          placeholder: '请输入标识名称',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              message: '必须输入标识名称'
            }
          ]
        },
        {
          type: 'blank',
          slotName: 'icon',
          fieldName: 'icon',
          labelText: '图标',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              message: '必填'
            },
            {
              validator: (rule, value, callback, source, options) => {
                let that = this
                return this.$api['PlanMonitor.checkName']({ id: that.id, name: value }).then(res => {
                  if (res === 'accept') {
                    return true
                  } else {
                    this.$message({ message: `标识名称已被使用！`, type: 'error' })
                    return false
                  }
                })
              },
              trigger: 'blur'
            }]
        },
        {
          labelText: '排序号',
          type: 'number',
          fieldName: 'indexNo',
          placeholder: '请输入排序号',
          colLayout: 'doubleCol'
        },
        {
          type: 'radio',
          labelText: '时间控制', // 提示信息：“时间控制”为开启状态时，该标识在任务中使用时，将需要能够单独保存开始和结束时间，与任务开始和结束时间为两套时间。
          fieldName: 'controlTimeType',
          defaultValue: '1',
          colLayout: 'doubleCol',
          options: [
            {
              label: '是',
              value: '0'
            },
            {
              label: '否',
              value: '1'
            }
          ]

        },
        {
          type: 'radio',
          labelText: '固定标识', // 提示信息：“时间控制”为开启状态时，该标识在任务中使用时，将需要能够单独保存开始和结束时间，与任务开始和结束时间为两套时间。
          fieldName: 'constantMarkType',
          defaultValue: '1',
          colLayout: 'doubleCol',
          options: [
            {
              label: '是',
              value: '0'
            },
            {
              label: '否',
              value: '1'
            }
          ]

        },
        {
          type: 'hidden',
          fieldName: 'constantMarkReason',
          labelText: '固定原因',
          placeholder: '请输入固定原因',
          colLayout: 'doubleCol'
        },
        {
          type: 'treeSelect',
          multiple: true,
          labelText: '项目类型',
          fieldName: 'monitorPointClassifyIds',
          colLayout: 'doubleCol',
          defaultValue: [],
          placeholder: '请选择项目类型',
          optionUrl: {
            api: 'ProjectApply.projectClassifyTree',
            value: 'id'
          },
          treeData: []
        },
        {
          labelText: '系统角色',
          type: 'multiple',
          fieldName: 'monitorPointRoleIds',
          optionUrl: {
            api: 'PlanMonitor.getRoleData',
            params: { id: this.id }
          },
          options: [],
          colLayout: 'doubleCol',
          defaultValue: []
        },
        {
          labelText: '依赖标识', // 提示信息:依赖标识是指在计划编辑时，当某任务已经选择了依赖标识后该标识才可以选择，任务取消依赖标识时，给予确认框提示依赖关系后，选择确定删除的情况下该标识自动取消，该属性的编辑关系为单项关系。
          type: 'multiple',
          fieldName: 'monitorPointRelyIds',
          optionUrl: {
            api: 'PlanMonitor.getMonitorPointData',
            params: { id: this.id }
          },
          options: [],
          colLayout: 'doubleCol',
          defaultValue: []
        },
        {
          labelText: '互斥标识', // 提示信息：互斥标识指在计划编辑时，当某任务已经选择了该标识互斥列表中的标识时，该标识不可被选择，该属性的编辑关系为双向关系。例:A与B为互斥关系，修改A或修改B时，都应显示可编辑该关系。
          type: 'multiple',
          fieldName: 'monitorPointMutexIds',
          optionUrl: {
            api: 'PlanMonitor.getMonitorPointData',
            params: { id: this.id }
          },
          options: [],
          colLayout: 'doubleCol',
          defaultValue: []
        },
        {
          type: 'hidden',
          fieldName: 'id',
          colLayout: 'doubleCol'
        },
        {
          type: 'hidden',
          fieldName: 'type',
          defaultValue: '1',
          colLayout: 'doubleCol'
        },
        {
          type: 'textarea',
          fieldName: 'describes',
          labelText: '标识描述',
          placeholder: '请输入标识描述',
          colLayout: 'doubleCol'
        }
      ],
      modify: { constantMarkType: '1' },
      iconPopover: false,
      icon: '',
      monitorPointList: [],
      constantMarkType: '1',
      monitorPoint: [],
      roleIds: [],
      dialogHeight: document.documentElement.clientHeight * 0.4,
      dialogConfig: {
        modal: false
      }
    }
  },
  mounted () {
  },
  methods: {
    rendered () {
      if (this.id && this.id !== '') {
        this.modify = Object.assign({}, this.record)
      }
    },
    onChange (e) {
      if (e.target.value === '0') {
        this.dataSource[5].type = 'textarea'
      } else {
        this.dataSource[5].type = 'hidden'
      }
    },
    saved (res) {
      this.$emit('save-success', res)
    },
    handleClose () {
      this.iconPopover = false
    },
    iconSelect (select) {
      this.$set(this.modify, 'icon', select.icon)
    }
  }

}

</script>
<style scoped>
</style>
