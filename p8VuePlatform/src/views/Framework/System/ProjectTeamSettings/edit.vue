<template>
  <div style="height:100%;">
    <form-list ref="form"
               @rendered="rendered"
               @saved="saved"
               :dataSource="dataSource"
               :api="saveApi"
               :form="modify">
    </form-list>
  </div>
</template>
<style scoped>
</style>
<script>
import { P8Form as FormList } from '~/index'

export default {
  name: 'ProjectTeamSettingsEdit',
  components: {
    FormList
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      saveApi: 'projectTeamSetting.create',
      classifyDisabledTree: [],
      modify: {
        detailList: []
      }
    }
  },
  created: function () {
    let that = this
    that.$api['ProjectApply.projectClassifyTree']({ dataType: '' }).then(res => {
      if (res) {
        res.forEach(node => {
          if (node.id === '0' || node.pId === '0') {
            that.classifyDisabledTree.push(node.id)
          }
        })
      }
    })

    let dataSourceTemp = [
      {
        type: 'treeSelect',
        multiple: false,
        labelText: '项目类型',
        fieldName: 'kprojectClassifyId',
        colLayout: 'doubleCol',
        defaultValue: [],
        defaultExpandAll: true,
        disabledValues: this.classifyDisabledTree,
        placeholder: '请选择项目类型',
        optionUrl: {
          api: 'ProjectApply.projectClassifyTree',
          value: 'id'
        },
        treeData: [],
        rules: [
          {
            required: true,
            message: '必须选择项目类型'
          },
          {
            validator: (rule, value) => {
              if (!value) {
                return true
              }
              let that = this
              return new Promise((resolve, reject) => {
                that.$api['projectTeamSetting.repeatedCheckClassify']({ id: that.id, kprojectClassifyId: value }).then(res => {
                  if (res === 'reject') {
                    that.$message({
                      message: '同一分支的项目类型已被使用！',
                      type: 'error'
                    })
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject()
                  } else {
                    resolve()
                  }
                })
              }).catch((e) => {
                console.log(e, 'e')
              })
            },
            trigger: 'blur'
          }
        ]
      },
      {
        type: 'hidden', // 控件类型
        fieldName: 'id',
        colLayout: 'singleCol'
      },
      {
        type: 'hidden', // 控件类型
        fieldName: 'status',
        defaultValue: '1',
        colLayout: 'singleCol'
      },
      {
        type: 'text', // 控件类型
        fieldName: 'name',
        labelText: '团队名称',
        placeholder: '请输入团队名称',
        colLayout: 'singleCol',
        rules: [
          {
            required: true,
            message: '必须输入团队名称'
          },
          {
            validator: (rule, value) => {
              let that = this
              return new Promise((resolve, reject) => {
                that.$api['projectTeamSetting.repeatedCheck']({ id: that.id, name: value }).then(res => {
                  console.log(res, 'res')
                  if (res === 'reject') {
                    that.$message({
                      message: '名称已存在！',
                      type: 'error'
                    })
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject(`名称已存在`)
                  } else {
                    resolve()
                  }
                })
              }).catch((e) => {
                console.log(e)
              })
            }
          }
        ]
      },
      {
        type: 'textarea', // 控件类型
        fieldName: 'describe',
        labelText: '团队描述',
        placeholder: '请输入团队描述',
        colLayout: 'singleCol'
      },
      {
        labelText: '角色信息',
        type: 'addField',
        colLayout: 'singleCol',
        fieldName: 'detailList',
        children: [
          {
            type: 'hidden', // 控件类型
            fieldName: 'id',
            urlParam: true
          },
          {
            type: 'text', // 控件类型
            fieldName: 'roleName',
            placeholder: '请输入角色名称', // 默认控件的空值文本
            rules: [
              {
                required: true,
                message: '必填'
              }
            ]
          },
          {
            /* labelText: '系统角色', */
            type: 'select',
            fieldName: 'roleId',
            placeholder: '请选择系统角色',
            colLayout: 'doubleCol',
            optionUrl: {
              api: 'projectTeamSetting.getRole',
              params: {}
            },
            options: [],
            rules: [
              {
                required: true,
                message: '必填'
              }
            ]
          }
        ]
      }
    ]
    this.dataSource = dataSourceTemp
  },
  mounted () {

  },
  methods: {
    rendered () {
      if (this.id && this.id !== '') {
        this.getProjectTeamSettingData(this.id)
      }
    },
    clickEvent () {
      console.log('click')
    },
    getProjectTeamSettingData (id) {
      let that = this
      that.$api['projectTeamSetting.detail']({ id: id }).then(function (res) {
        let data = res.team
        data.detailList = res.detailList
        if (data.name === '默认团队') {
          that.dataSource[0].disabled = true
          that.dataSource[3].fieldConfig.disabled = true
          that.dataSource[4].fieldConfig.disabled = true
          data.kprojectClassifyId = ' '
        } else {
          data.kprojectClassifyId = res.team.kprojectClassifyId
        }
        that.modify = Object.assign(data, {})
        console.log(that.modify, 'that.modify')
      }).catch(function (error) {
        console.log(error)
      })
    },
    saved (res) {
      this.$emit('save-success', res)
    },
    handleChange (info) {
      console.log(info, 'info')
    }
  }

}

</script>
