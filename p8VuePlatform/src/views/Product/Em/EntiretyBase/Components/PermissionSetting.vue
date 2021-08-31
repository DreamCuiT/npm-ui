<template>
    <common-dialog
            title="权限设置"
            :visible="isView"
            :showHandleBtn="false"
            :dialogConfig="dialogConfig"
            @handle-cancel="handleCancel"
            @handle-ok="handleOk"
            @close="handleCancel"
            width="80%"
            :dialogHeight="dialogHeight"
    >
        <template #dialog>
            <form-list ref="form" @rendered="rendered" @saved="saved" :dataSource="dataSource" :api="saveApi" :form="formData">

                <template #titleMsg>
                    <el-alert
                            :title="alertTitle"
                            type="warning"
                            :closable="false"
                            >
                        <span>
                            {{ description }}
                        </span>
                    </el-alert>

                </template>
                <template #selectUser>
                    <ul class="userList">
                        <li>
                            <el-button class="selectedBtn" type="link" size="small" icon="user-add" @click="showModal">选择人员</el-button>
                        </li>
                        <li :style="itemStyle(item)" v-for="item in userList" :key="item.userId">
                            <span>{{item.realName}} [ {{item.departmentName}} ]</span>
                            <span v-if="item.isTeamManager === 1">
                                <i style="color: #ec808d;" class="el-icon-s-custom"></i>
                            </span>
                            <span v-else-if="item.isTeamMember ===1">
                                <i class="el-icon-s-custom" @click="deleteUser(item)"></i>
                                <i class="el-icon-circle-close" @click="deleteUser(item)"></i>
                            </span>
                            <span v-else>
                                <i class="el-icon-circle-close" @click="deleteUser(item)"></i>
                            </span>
                        </li>
                    </ul>
                </template>
                <template #userList>
                    <el-main>
                        <ul class="userList">

                        </ul>
                    </el-main>
                </template>
            </form-list>
            <template>
                <select-user v-if="visible" :visible="visible" @close-dialog="closeModal" :disabled-row="formData.toUserIds"></select-user>
            </template>
        </template>
    </common-dialog>
</template>
<script>
import { Main, Button, Alert } from '~/index'
import { P8Form as FormList } from '~/index'
import { P8SelectUser as SelectUser } from '~/index'
import { P8Dialog as CommonDialog } from '~/index'
export default {
  name: 'PermissionSetting',
  components: {
    FormList,
    'el-alert': Alert,
    'el-main': Main,
    'el-button': Button,
    SelectUser,
    CommonDialog
  },
  props: {
    record: {
      type: Object,
      default: () => {}
    },
    isPermissionSettingView: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      alertTitle: '',
      description: '为人员设置该项目权限后，系统的部分功能中将对目标人员开放查看统计等权限。',
      dialogHeight: 400,
      dialogConfig: {
        beforeClose: this.handleCancel,
        destroyOnClose: 'true',
        modal: false
      },
      isView: false,
      saveApi: 'ProjectApply.permissionSettingSave',
      visible: false,
      selectedRows: [],
      otherParam: {
      },
      userList: [],
      dataSource: [
        {
          type: 'blank',
          labelText: '',
          slotName: 'titleMsg',
          colLayout: 'singleCol'
        },
        {
          type: 'blank',
          labelText: '',
          slotName: 'selectUser',
          colLayout: 'singleCol'
        },
        {
          type: 'blank',
          labelText: '',
          slotName: 'userList',
          colLayout: 'singleCol'
        }
      ],
      formData: {
        dataId: null,
        toUserIds: []
      },
      activePane: 'setLimit'
    }
  },
  mounted () {
    this.isView = this.isPermissionSettingView
    this.formData.dataId = this.record.id
    this.alertTitle = '正在为【' + (this.record.name != null ? this.record.name : '此项目') + '】设置人员权限'
    this.rendered()
  },
  methods: {
    itemStyle (item) {
      let style = {
        float: 'left',
        margin: '5px',
        borderRadius: '3px',
        border: '1px solid #E8E8E8',
        height: '29px'
      }
      return style
    },
    rendered () {
      if (this.record.id && this.record.id !== '') {
        this.getPermissionSetting(this.record.id)
      }
    },
    clickEvent () {
    },
    getPermissionSetting (id) {
      let that = this
      this.$api['ProjectApply.getPermissionSetting']({ dataId: id }).then(function (res) {
        that.userList = res
        let selectedUserIds = res.map(u => u.userId)
        that.formData.toUserIds = selectedUserIds
      }).catch(function (error) {
        console.log(error)
      })
    },
    saved (res) {
      this.$emit('saveSuccess', res)
      this.handleCancel()
    },
    handleChange (info) {
    },
    showModal () {
      this.visible = true
    },
    closeModal (selectedRows) {
      this.visible = false
      this.userList.push(...selectedRows)
      let idArr = selectedRows.map(v => { return v.id })
      this.formData.toUserIds.push(...idArr)
    },
    deleteUser (item) {
      if (item.isTeamMember === 1) {
        this.$confirm(`该人员为项目团队成员，确定删除？`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteUserRe(item.userId)
        }).catch(() => {
        })
      } else {
        this.deleteUserRe(item.userId)
      }
    },
    deleteUserRe (userId) {
      this.formData.toUserIds.splice(this.formData.toUserIds.findIndex(v => v === userId), 1)
      this.userList.splice(this.userList.findIndex(v => v.userId === userId), 1)
    },
    handleOk (e) {
    },
    handleCancel (e) {
      this.isView = false
      this.$emit('close-permissionSetting')
    }
  }

}

</script>
<style scoped>
    .userList{
        background:#ffffff;
        overflow:hidden;
    }
    .userList li:first-child{
        float:left;
        /*padding:5px 10px;*/
        margin:5px;
        border-radius:3px;
        /*border:1px solid #1890FF;*/
        border:1px solid #E8E8E8;
        height:29px;
        border:none;
        padding:0px;
    }
    .userList li:first-child .selectedBtn{
        border:1px dashed #1890FF;
        height:29px;
    }
</style>
