<template>
    <div>
        <form-list ref="form" @rendered="rendered" @saved="saved" :dataSource="dataSource" :api="saveApi" :form="formData">

        </form-list>
       <template>
            <el-tabs type="card" v-model="activePane">
                <el-tab-pane label="设置权限" name="setLimit" key="1">
                    <select-btn ref="selectBtn" @btn-select-change="btnSelectChange" :buttonSelected="selectedData.resourceList"></select-btn>
                </el-tab-pane>
               <el-tab-pane label="设置人员" name="setUser" key="2">
                    <div :style="{height:setUserHeight, overflowY: 'auto'}">
                        <el-main>
                            <ul class="userList">
                                <li>
                                    <el-button class="selectedBtn" type="link" size="small" icon="user-add" @click="showModal">选择人员</el-button>
                                </li>
                                <li v-for="item in selectedData.userList" :key="item.id">
                                    <span>{{item.realName}} [ {{item.departmentName}} ]</span>
                                    <i class="el-icon-circle-close" @click="deleteUser(item.id)"></i>
                                </li>
                            </ul>
                        </el-main>
                        <select-user v-if="visible" :visible="visible" @close-dialog="closeModal" :disabled-row="formData.sysuserIds"></select-user>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="设置应用" name="setApp" key="3"></el-tab-pane>
            </el-tabs>
        </template>
        <el-dropdown v-if="activePane === 'setLimit'" size="mini" split-button type="primary" trigger="click"
                     style="margin-top: 10px;margin-left: 10px;">
            关联操作
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="allSelect()">全部勾选</el-dropdown-item>
                <el-dropdown-item @click.native="unAllSelect()">取消全选</el-dropdown-item>
                <el-dropdown-item @click.native="relate()">父子关联</el-dropdown-item>
                <el-dropdown-item @click.native="unRelate()">取消关联</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<style lang="scss" scoped>
    .userList{
        background:#ffffff;
        overflow:hidden;
    }
    .userList li{
        float:left;
        padding:5px 10px;
        margin:5px;
        border-radius:3px;
        /*border:1px solid #1890FF;*/
        border:1px solid #E8E8E8;
    }
    .userList li:first-child{
        border:none;
        padding:0px;
    }
    .userList li:first-child .selectedBtn{
        border:1px dashed #1890FF;
        height:29px;
    }
    /deep/ .el-tabs__nav-wrap{
      margin-bottom:0;
    }
</style>
<script>
import { Tabs, TabPane, Main, Button, Dropdown, DropdownMenu, DropdownItem } from '~/index'
import { P8Form as FormList } from '~/index'
import SelectBtn from './SelectButtons.vue'
import { P8SelectUser as SelectUser } from '~/index'
export default {
  name: 'RoleEdit',
  components: {
      FormList,
      'el-tabs': Tabs,
      'el-tab-pane': TabPane,
      'el-main': Main,
      'el-button': Button,
    // 'form-list' : FormList,
    // 'select-user' : httpVueLoader('components/CommonFunction/SelectUser.vue'),
      'select-btn': SelectBtn,
      SelectUser,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'el-dropdown': Dropdown
  },
  props: {
    roleId: {
      type: String,
      default: ''
    },
      dateNumber: {
          type: Number,
          default: 0
      }
  },
  data () {
    return {
      setUserHeight: document.documentElement.clientHeight - 267 + 'px',
      saveApi: 'role.save',
      visible: false,
      selectedRows: [],
      // selectedRowKeys:[],
      // disabledRow:[],
      // userIds:[],
      otherParam: {
        sysuserIds: [],
        buttonIds: []
      },
      selectedData: {
        resourceList: [],
        userList: [],
        appList: []
      },
      dataSource: [
        {
          type: 'text', // 控件类型
          labelText: '角色名称', // 控件显示的文本
          fieldName: 'name',
          placeholder: '请输入角色名称', // 默认控件的空值文本
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              maxLength: 15
            },
            {
              validator: (rule, value, callback) => {
                console.log('asyncValidator-repeatedCheck')
                let that = this
                this.$api['role.repeatedCheck']({ id: that.formData.id, name: value }).then(response => {
                  // console.log(response)
                  if (response.result) {
                    callback(new Error('角色名称已被使用！'))
                  } else {
                    callback()
                  }
                })
              },
              trigger: 'blur'
            }
          ]
        },
        {
          labelText: '排序',
          type: 'number',
          fieldName: 'indexNo',
          placeholder: '请输入排序号',
          colLayout: 'singleCol'
        }
      ],
      formData: {
        id: null,
        name: null,
        indexNo: null,
        sysuserIds: [],
        appIds: [],
        resourceIds: []
      },
      activePane: 'setLimit'
    }
  },
  mounted () {
    window.addEventListener('resize', () => { this.setUserHeight = document.documentElement.clientHeight - 267 + 'px' })
  },
  methods: {
    rendered () {
      console.log('roleId', this.roleId)
      if (this.roleId && this.roleId !== '') {
        this.getRoleData(this.roleId)
      } else {
          this.formData.indexNo = this.dateNumber
      }
    },
    clickEvent () {
      console.log('click')
    },
    getRoleData (roleId) {
      let that = this
      console.log('loadRoleId', roleId)
      this.$api['role.getRole']({ id: roleId }).then(function (res) {
        console.log('role.getRole', res)
        let { id, name, indexNo, userList = [], resourceList = [], appList = [] } = res
        that.formData = { ...that.formData, id, name, indexNo }

        let selectedUserIds = userList.map(u => u.id)
        that.formData.sysuserIds = selectedUserIds
        that.formData.resourceIds = resourceList

        that.selectedData = { ...that.selectedData, userList, resourceList, appList }

        console.log('selectedData, formData:', that.selectedData, that.formData)
      }).catch(function (error) {
        console.log(error)
      })
    },
    saved (res) {
      console.log('edit saved')
      this.$emit('saveSuccess', res)
    },
    handleChange (info) {
      console.log(info, 'info')
    },
    showModal () {
      this.visible = true
    },
    closeModal (selectedRows) {
      this.visible = false
      this.selectedData.userList.push(...selectedRows)
      // this.selectedRows.push(...selectedRows)
      let idArr = selectedRows.map(v => { return v.id })
      this.formData.sysuserIds.push(...idArr)
      // this.otherParam.sysuserIds.push(...idArr)
    },
    deleteUser (id) {
      this.formData.sysuserIds.splice(this.formData.sysuserIds.findIndex(v => v === id), 1)
      // this.otherParam.sysuserIds.splice(this.otherParam.sysuserIds.findIndex(v => v === id), 1)
      this.selectedData.userList.splice(this.selectedData.userList.findIndex(v => v.id === id), 1)
      // this.selectedRows.splice（(this.selectedRows.findIndex(v => v.id === id), 1)
    },
    btnSelectChange (selectedRes) {
      this.$set(this.formData, 'resourceIds', selectedRes)
      // this.formData.resourceIds = selectedRes
      console.log('selectButtons.vue', selectedRes)
    },
      unAllSelect () {
          this.$refs.selectBtn.unCheckAll()
    },
      allSelect () {
          this.$refs.selectBtn.checkAll()
      },
      relate () {
          this.$refs.selectBtn.relate()
      },
      unRelate () {
          this.$refs.selectBtn.unRelate()
      }
  }

}

</script>
