<template>
  <div style="height: 100%">
    <center-right-layout>
      <template #left>
          <normal-layout >
            <template #north>
              <div v-if="visibleAddUser" class="upload-con">
                <div class="text">人员任命文件:</div>
                <el-upload :action="uploadActionApi">
                  <el-button icon="el-icon-upload2"> 上传附件 </el-button>
                </el-upload>
              </div>
            </template>
            <template #west>
              <div class="role-con">
                <!-- <div class="add-role">
                  <el-button type="text" icon="el-icon-circle-plus" @click="addRolesHandle">添加角色</el-button>
                </div> -->
                <vue-perfect-scrollbar class="role-list">
                  <ul class="fixed-role">
                    <li :class="item.roleId===rolesSelectedId?'active':''" v-for="item in fixedRoles" :key="item.id" @click="rolesHandle(item,1)">
                      <i class="el-icon-s-custom"></i>
                      <edit-input :textValue="item.name" :record="item"></edit-input>
                    </li>
                  </ul>
                  <div class="general-role">
                    <li :class="item.id===rolesSelectedId?'active':''" v-for="(item,index) in generalRoles" :key="item.id" @click="rolesHandle(item,2)">
                      <i class="el-icon-s-custom"></i>
                      <edit-input :textValue="item.name || item.roleName" :record="item" :iconShow="false" @delete="deleteRolesHandle(index)" @onChange="changeRolesHandle"></edit-input>
                    </li>
                  </div>
                </vue-perfect-scrollbar>
              </div>
            </template>
            <template #center>
              <div class="table-con">
                <div class="add-member">
                  <el-button v-if="visibleAddUser" type="text" icon="el-icon-circle-plus" @click="addMemberHandle">添加人员</el-button>
                </div>
                <div class="common-table">
                  <!-- <div :class="{'small-table': true}" :style="{height: flexHeight}"> -->
                    <el-table
                      ref="table"
                      height="100%"
                      stripe
                      :data="tableData"
                      row-key="id"
                      row-class-name="rowStyle"
                      header-row-class-name="headerRowStyle">
                      <el-table-column
                        prop="realName"
                        label="姓名"
                        align="center">
                      </el-table-column>
                      <el-table-column
                        prop="deptName"
                        label="部门"
                        align="center">
                      </el-table-column>
                      <el-table-column
                        prop="taskCount"
                        label="承担任务总数"
                        align="center">
                      </el-table-column>
                      <el-table-column
                        prop="userState"
                        label="状态"
                        align="center">
                        <template slot-scope="props">
                          <div class="userState">
                            <span v-if="props.row.entryTime && !props.row.departureTime" class="state-working">团队中</span>
                            <span v-if="props.row.entryTime && props.row.departureTime" class="state-out">已退出</span>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="entryTime"
                        label="进入时间"
                        align="center">
                      </el-table-column>
                      <el-table-column
                        prop="departureTime"
                        label="退出时间"
                        align="center">
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        align="center">
                        <template slot-scope="props">
                          <el-popover
                            placement="top"
                            width="100"
                            trigger="hover">
                            <p v-if="(props.row.entryTime && props.row.departureTime)||(!props.row.entryTime && !props.row.departureTime)">确定要删除吗?</p>
                            <p v-if="props.row.entryTime && !props.row.departureTime">该人员当前不可被删除</p>
                            <div style="text-align: right; margin: 0" v-if="!(props.row.entryTime && !props.row.departureTime)">
                              <!-- <el-button size="mini" type="text" @click="memberPopoverVisible = false">取消</el-button> -->
                              <el-button type="primary" size="mini" @click="tableDeleteMemberHandle(props.row, props.$index)">好</el-button>
                            </div>
                            <el-button v-if="visibleAddUser" slot="reference" size="mini" type="text">删除</el-button>
                          </el-popover>
                        </template>
                      </el-table-column>
                    </el-table>
                  <!-- </div> -->
                </div>
              </div>
            </template>
          </normal-layout>
      </template>
      <template #bottom>
        <div class="bottom-con">
          <div class="operation">
            <!-- <el-button-group>
              <el-button size="mini" @click="copyRoleHandle">从历史项目复制</el-button>
              <el-button size="mini" @click="loadStandardTeamHandle">载入标准团队</el-button>
            </el-button-group> -->
          </div>
          <div class="submit">
            <el-button size="mini" type="primary" :loading="submitLoading" @click="submit">提交</el-button>
          </div>
        </div>
      </template>
      <template #right>
        <project-form-view :id="id"></project-form-view>
      </template>
    </center-right-layout>
    <dialog-tabs-roles :visibleDialogRoles="visibleDialogRoles" :activeName="dialogRolesActiveName" :id="id"
      @exp-roles-close="expRolesCloseHandle" @standard-roles-close="standardRolesCloseHandle"></dialog-tabs-roles>
    <factory-select-member
      :visibleDislogMember="visibleDialogMember"
      @member-close="memberCloseHandle" :loginFlag="loginFlag" :existsData="tableData"></factory-select-member>
  </div>
</template>
<script>
import { P8NormalLayout as NormalLayout } from '~/index'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import CenterRightLayout from './Components/CenterRightLayout'
import EditInput from './Components/EditInput'
import ProjectFormView from './Components/ProjectFormView'
import FactorySelectMember from './Components/FactorySelectMember'
import DialogTabsRoles from './Components/DialogTabsRoles'
import { Table, TableColumn, Upload, Button, Popover } from '~/index'
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'teamManager',
  props: {
    // id: {
    //   type: String
    // },
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      id: null,
      uploadActionApi: '',
      rolesSelectedId: 0,
      tableData: [],
      fixedRoles: [],
      generalRoles: [],
      submitLoading: false,
      saveLoading: false,
      visibleDialogMember: false,
      visibleDialogRoles: false,
      memberPopoverVisible: false,
      dialogRolesActiveName: '',
      teamsId: '',
      loginFlag: '1',
      isSave: false,
      visibleAddUser: true
    }
  },
  mounted () {
    this.id = this.thirdMenuParam.id
    this.getTeamInfo()
  },
  methods: {
    getTeamInfo () {
      this.$api['projectTeam.index']({ wholeDescribeId: this.id }).then(res => {
        if (res) {
          res.fixedRoles && res.fixedRoles.forEach(item => {
            if (item.projectTeamRoleUsers && item.projectTeamRoleUsers.length) {
              item.projectTeamRoleUsers.forEach(citem => {
                citem.entryTime = citem.entryTime ? moment(citem.entryTime).format('YYYY-MM-DD hh:mm:ss') : ''
                citem.departureTime = citem.departureTime ? moment(citem.departureTime).format('YYYY-MM-DD hh:mm:ss') : ''
              })
            } else {
              item.projectTeamRoleUsers = []
            }
          })
          res.generalRoles && res.generalRoles.forEach(item => {
            if (item.projectTeamRoleUsers && item.projectTeamRoleUsers.length) {
              item.projectTeamRoleUsers.forEach(citem => {
                citem.entryTime = citem.entryTime ? moment(citem.entryTime).format('YYYY-MM-DD hh:mm:ss') : ''
                citem.departureTime = citem.departureTime ? moment(citem.departureTime).format('YYYY-MM-DD hh:mm:ss') : ''
              })
            } else {
              item.projectTeamRoleUsers = []
            }
          })
          this.fixedRoles = res.fixedRoles || []
          this.generalRoles = res.generalRoles || []
          if (this.fixedRoles.length) {
            this.tableData = this.fixedRoles[0].projectTeamRoleUsers
            this.rolesSelectedId = this.fixedRoles[0].roleId
            this.visibleAddUser = false
          } else if (this.generalRoles.length) {
            this.tableData = this.generalRoles[0].projectTeamRoleUsers
            this.rolesSelectedId = this.generalRoles[0].id
            this.visibleAddUser = true
          }
          // eslint-disable-next-line eqeqeq
          // if (this.fixedRoles != []) {
          //   this.visibleAddUser = false
          // }
          this.teamsId = this.team && this.team.teamsId ? this.team.teamsId : ''
        }
      })
    },
    rolesHandle (item, index) { // 角色列表点击切换
      if (this.rolesSelectedId === (item.roleId || item.id)) {
        return
      }
      this.rolesSelectedId = item.roleId || item.id
      this.tableData = item.projectTeamRoleUsers ? item.projectTeamRoleUsers : []
      if (index === 2) {
        this.visibleAddUser = true
      }
      if (index === 1) {
        this.visibleAddUser = false
      }
    },
    // addRolesHandle () {
    //   // 添加角色
    //   let defaultObj = {
    //     id: (-this.generalRoles.length + 1) + '',
    //     indexNo: 0,
    //     name: '角色名称',
    //     klTeamRoleClassifyId: '',
    //     projectTeamRoleUsers: []
    //   }
    //   this.generalRoles.push(defaultObj)
    // },
    changeRolesHandle (text, record) {
      record.name = text
    },
    deleteRolesHandle (index) {
      this.generalRoles.splice(index, 1)
      this.tableData = []
    },
    tableDeleteMemberHandle (row, index) {
      if ((row.entryTime && row.departureTime) || (!row.entryTime && !row.departureTime)) {
        this.tableData.splice(index, 1)
      }
    },
    addMemberHandle () {
      // 添加人员
      if ((this.fixedRoles && this.fixedRoles.length > 0) || (this.generalRoles && this.generalRoles.length > 0)) {
        if (this.rolesSelectedId) {
          this.visibleDialogMember = true
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择角色'
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请先添加角色'
        })
      }
    },
    // copyRoleHandle () {
    //   // 从历史项目复制
    //   this.visibleDialogRoles = true
    //   this.dialogRolesActiveName = 'experience'
    // },
    expRolesCloseHandle (experienceTeamSelectValue) {
      // (我的经验团队)从历史项目复制-面板关闭
      this.visibleDialogRoles = false
      if (experienceTeamSelectValue.length > 0) {
        this.loadRolesCommonHandle(experienceTeamSelectValue)
      }
    },
    // loadStandardTeamHandle () {
    //   // 载入标准团队
    //   this.visibleDialogRoles = true
    //   this.dialogRolesActiveName = 'standard'
    // },
    standardRolesCloseHandle (info) {
      // (标准团队)载入标准团队-面板关闭
      this.visibleDialogRoles = false
      if (info && info.kTeamId) {
        this.teamsId = info.kTeamId
        this.loadRolesCommonHandle(info.data)
      }
    },
    loadRolesCommonHandle (data) {
      let tempArr = []
      data.forEach(item => {
        let tempObj = {
          id: item.id,
          indexNo: item.indexNo,
          name: item.name,
          klTeamRoleClassifyId: item.teamRoleClassifyId || item.klTeamRoleClassifyId,
          projectTeamRoleUsers: []
        }
        tempArr.push(tempObj)
      })
      this.generalRoles.push(...tempArr)
      this.generalRoles = _.uniqWith(this.generalRoles, _.isEqual)
    },
    memberCloseHandle (tableSelectValue) {
      // 添加人员-面板关闭
      this.visibleDialogMember = false
      if (tableSelectValue.length > 0) {
        tableSelectValue.forEach(item => {
          item.sysuserId = item.id
          item.id = ''
        })
        this.tableData.push(...tableSelectValue)
      }
    },
    submit () {
      let _this = this
      _this.submitLoading = true
      let params = this.submitParamsHandle()
      this.$api['projectTeam.save'](params).then(function (res) {
        _this.submitLoading = false
        // _this.isSave = true
        _this.$message({
          message: '信息已提交',
          type: 'success'
        })
        _this.getTeamInfo()
      }).catch(function (err) {
        _this.submitLoading = false
        // _this.isSave = false
        console.log('--save-err--', err)
      })
    },
    submitParamsHandle () {
      let params = {
        uploadFiles: [],
        team: {
          wholeDescribeId: this.id,
          teamsId: this.teamsId
        },
        fixedRoles: [],
        generalRoles: []
      }
      this.fixedRoles.forEach(fixedItem => {
        let temp = {}
        let fixedRolesKeys = Object.keys(fixedItem)
        fixedRolesKeys.forEach(key => {
          if (key === 'projectTeamRoleUsers') {
            temp[key] = []
            fixedItem[key].forEach(projectItem => {
              let projectTemp = {}
              projectTemp.id = projectItem.id && projectItem.id.length === 32 ? projectItem.id : '' // projectItem.id ? projectItem.id :
              projectTemp.sysuserId = projectItem.sysuserId ? projectItem.sysuserId : ''
              projectTemp.entryTime = projectItem.entryTime ? projectItem.entryTime : ''
              projectTemp.departureTime = projectItem.departureTime ? projectItem.departureTime : ''
              temp[key].push(projectTemp)
            })
          } else {
            temp[key] = fixedItem[key]
          }
        })
        params.fixedRoles.push(temp)
      })
      this.generalRoles.forEach(generalItem => {
        let temp = {}
        let generalRolesKeys = Object.keys(generalItem)
        generalRolesKeys.forEach(key => {
          if (key === 'projectTeamRoleUsers') {
            temp[key] = []
            generalItem[key].forEach(projectItem => {
              let projectTemp = {}
              projectTemp.id = projectItem.id && projectItem.id.length === 32 ? projectItem.id : '' // projectItem.id ? projectItem.id :
              projectTemp.sysuserId = projectItem.sysuserId ? projectItem.sysuserId : ''
              projectTemp.entryTime = projectItem.entryTime ? projectItem.entryTime : ''
              projectTemp.departureTime = projectItem.departureTime ? projectItem.entryTime : ''
              temp[key].push(projectTemp)
            })
          } else {
            temp[key] = generalItem[key]
            temp.id = temp.id.length !== 32 ? '' : temp.id // id长度为32
          }
        })
        params.generalRoles.push(temp)
      })
      return params
    }
  },
  components: {
    CenterRightLayout,
    NormalLayout,
    VuePerfectScrollbar,
    EditInput,
    ProjectFormView,
    FactorySelectMember,
    DialogTabsRoles,
    'el-upload': Upload,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-popover': Popover
  }
}
</script>
<style lang="scss">
  .headerRowStyle {
    color: #333;
    font-size: 14px;
    background-color: #fafafa !important;
    height: 50px
  }
  .rowStyle {
    color: #5a5a5a;
    font-size: 14px;
  }
  .upload-con {
    display: flex;
    align-items: center;
    div.text{
      padding-right: 10px;
      font-size: 14px;
    }
  }
  .role-con {
    height: 100%;
    overflow-y: auto;
    .add-role {
      box-sizing: border-box;
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #cccccc;
      button {
        color: #999
      }
    }
    .role-list {
      height: calc(100% - 40px);
      li {
        position: relative;
        display: flex;
        align-items: center;
        height: 40px;
        border-bottom: 1px solid #cccccc;
        color: #323232;
        box-sizing: border-box;
        padding: 0 6px;
        &.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          border-left: 3px solid #46a6ff
        }
        i {
          font-size: 18px;
        }
      }
      .fixed-role {
        i {
          color: #ec808d;
        }
      }
    }
  }
  .table-con {
    height: 100%;
    .add-member {
      height: 40px;
      line-height: 40px;
      box-sizing: border-box;
      button {
        border: 1px dashed #cccccc;
        color: #999;
        padding: 9px 16px;
      }
    }
    .common-table {
      height: calc(100% - 40px);
    }
    .userState {
      .state-working, .state-out {
        position: relative;
        padding-left: 10px;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      }
      .state-working::before {
        background-color: #0e77d1;
      }
      .state-out::before {
        background-color: #f04134;
      }
    }
  }
  .bottom-con {
    width: 100%;
    height: 50px;
    margin-top: 5px;
    padding: 0 10px 0 16px;
    background-color: #ffffff;
    // box-shadow: 0px 0px 6px 4px rgba(0, 0, 0, .2);
    border: 1px solid #fafafa;
    display: flex;
    align-items: center;
    div.tip {
      font-size: 16px;
      color: #323232;
      span:nth-child(2) {
        color: #999;
        padding-left: 6px
      }
    }
    .operation {
      flex: 1;
      text-align: right;
      margin-right: 50px
    }
  }
</style>
