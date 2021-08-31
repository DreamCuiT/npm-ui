<template>
    <div style="height: 100%"
         class="team-manager-wrap">
        <nlcr-layout class="custom-nlcr"
                     :headerVisible="false"
                     :leftUsePerfectScrollbar="false">
            <template #left>
                <div class="role-con">
                    <div class="add-role"
                         v-if="group_add_role">
                        <el-button type="plan"
                                   icon="el-icon-circle-plus"
                                   @click="addRolesHandle">添加角色
                        </el-button>
                    </div>
                    <div class="add-role not-edit"
                         v-else>
                        <span>团队角色</span>
                    </div>
                    <vue-perfect-scrollbar class="role-list">
                        <li :class="[
                  { 'active': index === rolesSelectedIndex },
                  { 'fixed-role': item.roleType === 'fixed' },
                ]"
                            v-for="(item, index) in rolesData"
                            :key="item.id"
                            @click="rolesHandle(item, index)">
                            <i class="el-icon-s-custom"></i>
                            <edit-input :textValue="item.name || item.roleName"
                                        :record="item"
                                        :iconShow="item.roleType === 'general' && group_add_role"
                                        @delete="deleteRolesHandle(index, item)"
                                        @onChange="changeRolesHandle"></edit-input>
                        </li>
                    </vue-perfect-scrollbar>
                    <!-- <div class="refresh">
                        <el-tooltip content="点击查看全部成员"
                                    placement="left">
                            <i class="el-icon-refresh"
                               @click="refreshHandle"></i>
                        </el-tooltip>
                    </div> -->
                </div>
            </template>
            <template #center>
                <div class="table-con">
                    <div class="add-member">
                        <div>
                            <el-button icon="el-icon-circle-plus" v-if="group_add_member" type="plan" @click="addMemberHandle">添加人员</el-button>
                            <el-button type="plan" @click="refreshHandle">查看全部成员</el-button>
                        </div>
                        <search-form-list style="top: 2px"
                                          ref="search"
                                          :resetAfterToSearch="false"
                                          :dataSource="dataSource"
                                          @search="search"
                                          @re-set="reset"></search-form-list>
                    </div>
                    <div class="common-table-member">
                        <common-table ref="table"
                                      style="height: 100%"
                                      :columns="columns"
                                      :pagination="false"
                                      :tableSetting="false"
                                      :noApiTableData="tableData">
                            <template #taskCount="{ scope }">
                                <div class="task-count">
                                    <template v-if="scope.row.taskCount">
                                        <el-link @click.stop="opentDialogUserTask(scope.row)">{{
                                            scope.row.taskCount
                                            }}<i class="el-icon-view el-icon--right"></i></el-link>
                                    </template>
                                    <template v-else>
                                        <span>{{ scope.row.taskCount }}</span>
                                    </template>
                                </div>
                            </template>
                            <template #userState="{ scope }">
                                <div class="userState">
                  <span v-if="scope.row.entryTime && !scope.row.departureTime"
                        class="state-working">团队中</span>
                                    <span v-if="scope.row.entryTime && scope.row.departureTime && scope.row.waitout"
                                          class="state-waitout">待退出</span>
                                    <span v-if="scope.row.entryTime && scope.row.departureTime && !scope.row.waitout"
                                          class="state-out">已退出</span>
                                </div>
                            </template>
                            <template #operation="{ scope }">
                                <template v-if="!scope.row.departureTime">
                                    <template v-if="scope.row.taskCount">
                                        <el-popconfirm title="确认要将该人退出项目组吗?"
                                                       confirmButtonText="确认"
                                                       cancelButtonText="取消"
                                                       @onConfirm="deleteUserHandle(scope, scope.$index)">
                                            <el-button slot="reference"
                                                       size="mini"
                                                       type="text"
                                                       v-if="group_add_member">删除
                                            </el-button>
                                        </el-popconfirm>
                                    </template>
                                    <template v-else>
                                        <el-button v-if="group_add_member"
                                                   size="mini"
                                                   type="text"
                                                   @click="deleteUserHandle(scope, scope.$index)">删除
                                        </el-button>
                                    </template>
                                </template>
                            </template>
                        </common-table>
                    </div>
                </div>
            </template>
            <template #right>
                <div class="right-con">
                    <project-form-view :id="id"
                                       :plan-info-id="planInfoId"></project-form-view>
                    <member-upload :files="namedFiles"
                                   :view="!group_add_role"
                                   @upload="handleUpload"
                                   @remove="handleRemove"></member-upload>
                </div>
            </template>
        </nlcr-layout>
        <div class="bottom-con">
            <p class="operation"
               v-if="group_add_role">
                <!-- <el-button-group>
                    <el-button size="mini"
                               @click="copyRoleHandle">从历史项目复制
                    </el-button>
                    <el-button size="mini"
                               @click="loadStandardTeamHandle">载入标准团队
                    </el-button>
                </el-button-group> -->
            </p>
            <p class="submit"
               v-if="group_add_role || group_add_member">
                <el-button size="mini"
                           type="primary"
                           :loading="submitLoading"
                           @click="submit">保 存
                </el-button>
            </p>
        </div>
        <dialog-tabs-roles :visibleDialogRoles="visibleDialogRoles"
                           :activeName="dialogRolesActiveName"
                           :id="id"
                           @exp-roles-close="expRolesCloseHandle"
                           @standard-roles-close="standardRolesCloseHandle"></dialog-tabs-roles>
        <dialog-select-member v-if="visibleDialogMember"
                              :visibleDislogMember="visibleDialogMember"
                              :loginFlag="loginFlag"
                              :selectRoleId="selectRoleId"
                              :loadingUserDeptStrategy="loadingUserDeptStrategy"
                              @member-close="memberCloseHandle"
                              :existsData="tableData"></dialog-select-member>
        <dialog-user-task :dialogVisible="visibleDialogUserTask"
                          :tableParams="userTaskTableParams"
                          :customSearch="true"
                          @close="closeDialogUserTask()"
                          @custom-search="userTaskCustomSearch"
                          @custom-reset="userTaskCustomReset">
        </dialog-user-task>
    </div>
</template>
<script>
    import { P8NlcrLayout as NlcrLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import EditInput from './Components/EditInput'
    import ProjectFormView from './Components/ProjectFormView'
    import DialogSelectMember from './Components/DialogSelectMember'
    import DialogTabsRoles from './Components/DialogTabsRoles'
    import DialogUserTask from './Components/DialogUserTask'
    import MemberUpload from './Components/memberUpload'
    import { P8Search as SearchFormList } from '~/index'
    import { Button, Popconfirm, Link, Notification } from '~/index'

    import _ from 'lodash'
    import moment from 'moment'

    export default {
        name: 'teamManager',
        props: {
            thirdMenuParam: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            group_type: {
                type: String,
                default: '6' // 默认团队编辑
            }
        },
        data () {
            const columns = [
                {
                    title: '姓名',
                    dataIndex: 'realName'
                },
                {
                    title: '部门',
                    dataIndex: 'deptName'
                },
                {
                    title: '承担任务总数',
                    dataIndex: 'taskCount',
                    scopedSlots: {
                        customRender: 'custom'
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'userState',
                    scopedSlots: {
                        customRender: 'custom'
                    }
                },
                {
                    title: '进入时间',
                    dataIndex: 'entryTime'
                },
                {
                    title: '退出时间',
                    dataIndex: 'departureTime'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 80,
                    scopedSlots: {
                        customRender: 'custom'
                    }
                }
            ]
            const dataSource = [
                {
                    type: 'text', // 控件类型
                    labelText: '姓名', // 控件显示的文本
                    fieldName: 'realName',
                    placeholder: '请输入人员姓名'
                },
                {
                    type: 'text', // 控件类型
                    labelText: '部门', // 控件显示的文本
                    fieldName: 'deptName',
                    placeholder: '请输入部门名称'
                }
            ]
            const groupType = [ // 0否 1 是

                {
                    id: '3',
                    name: '计划编制（部分可编辑）',
                    group_add_role: false,
                    group_add_member: true,
                    is_fixed_user: false,
                    is_general_user: true
                },
                {
                    id: '4',
                    name: '计划分解（部分可编辑）',
                    group_add_role: true,
                    group_add_member: true,
                    is_fixed_user: false,
                    is_general_user: true,
                    is_loading_userDept: 'strategyA' // 登录在厂所的只能查询当前场所，院里面未所有
                },
                {
                    id: '5',
                    name: '立项管理-已发布，整体管理（查看页面）',
                    group_add_role: false,
                    group_add_member: false
                },
                {
                    id: '6',
                    name: '立项管理-未发布/资源管理（完全可以编辑）',
                    group_add_role: true, // 是否显示添加角色按钮
                    group_add_member: true, // 是否显示添加人员、删除按钮
                    is_fixed_user: true, // 控制 固定角色【添加人员】按钮是否显示，在group_add_member=true的情况下生效，并动态修改group_add_member
                    is_general_user: true // 控制 自定义角色【添加人员】按钮是否显示，在group_add_member=true的情况下生效，并动态修改group_add_member
                }
            ]
            return {
                id: null,
                planInfoId: null,
                columns,
                dataSource,
                visible: false,
                loginFlag: '1',
                rolesSelectedIndex: 0,
                tableData: [],
                fixedRoles: [],
                selectRoleId: '',
                generalRoles: [],
                submitLoading: false,
                saveLoading: false,
                visibleDialogMember: false,
                visibleDialogRoles: false,
                memberPopoverVisible: false,
                dialogRolesActiveName: 'experience',
                teamsId: '',
                isSave: false,
                visibleDialogUserTask: false,
                userTaskTableParams: {
                    currentUserId: '',
                    wholeDescribeId: this.thirdMenuParam.id || ''
                },
                isAddMember: false,
                isAddUser: false,
                isDelete: false,
                namedFiles: [], // 人员上传文件
                rolesData: [], // 固定角色和一般角色
                group_add_role: true, // 是否可以添加角色
                group_add_member: true, // 是否可以添加人员
                groupType,
                groupTypeData: {},
                loadingUserDeptStrategy: ''
            }
        },
        mounted () {
            this.id = this.thirdMenuParam.id || ''
            this.planInfoId = this.thirdMenuParam.planInfoId || ''

            this.getTeamInfo()
            this.initButton()
        },
        methods: {
            initButton () {
                let _this = this
                _this.groupType.forEach(function (data) {
                    if (data.id === _this.group_type) {
                        _this.groupTypeData = data
                    }
                })
                _this.group_add_role = _this.groupTypeData.group_add_role
                _this.group_add_member = _this.groupTypeData.group_add_member
                if (_this.groupTypeData.is_loading_userDept) {
                    console.log(_this.groupTypeData, '_this.groupTypeData')
                    _this.loadingUserDeptStrategy = _this.groupTypeData.is_loading_userDept
                }
            },
            handleUpload (file) {
                this.namedFiles.push(file)
            },
            handleRemove (file) {
                let removeIndex = this.namedFiles.findIndex((fileItem) => fileItem.filePath === file.filePath)
                this.namedFiles.splice(removeIndex, 1)
            },
            search (params) {
                let realName = params.realName ? params.realName : null
                let deptName = params.deptName ? params.deptName : null
                let tableData = this.tableData.filter(item => {
                    if ((item.realName.indexOf(realName) > -1) || (item.deptName.indexOf(deptName) > -1)) {
                        return item
                    }
                })
                this.tableData = tableData
            },
            reset () {
                if (this.rolesSelectedIndex > -1) {
                    this.tableData = this.rolesData[this.rolesSelectedIndex].projectTeamRoleUsers
                } else {
                    let tableData = []
                    this.rolesData.map(item => {
                        tableData.push(...item.projectTeamRoleUsers)
                    })
                    this.tableData = tableData
                }
            },
            getTeamInfo () {
                this.$api['projectTeam.index']({
                    wholeDescribeId: this.id,
                    planInfoId: this.planInfoId
                }).then(res => {
                    if (res) {
                        this.namedFiles = res.uploadFiles ? res.uploadFiles : []
                        res.fixedRoles && res.fixedRoles.forEach(item => {
                            item.roleType = 'fixed'
                            if (item.projectTeamRoleUsers && item.projectTeamRoleUsers.length) {
                                item.projectTeamRoleUsers.forEach(citem => {
                                    citem.entryTime = citem.entryTime ? moment(citem.entryTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                    citem.departureTime = citem.departureTime ? moment(citem.departureTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                })
                            } else {
                                item.projectTeamRoleUsers = []
                            }
                        })
                        res.generalRoles && res.generalRoles.forEach(item => {
                            item.roleType = 'general'
                            if (item.projectTeamRoleUsers && item.projectTeamRoleUsers.length) {
                                item.projectTeamRoleUsers.forEach(citem => {
                                    citem.entryTime = citem.entryTime ? moment(citem.entryTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                    citem.departureTime = citem.departureTime ? moment(citem.departureTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                })
                            } else {
                                item.projectTeamRoleUsers = []
                            }
                        })
                        this.fixedRoles = res.fixedRoles || []
                        this.generalRoles = res.generalRoles || []
                        this.rolesData = [...this.fixedRoles, ...this.generalRoles]
                        if (this.rolesData.length) {
                            if (this.rolesSelectedIndex > -1) {
                                // > -1 说明左侧角色列表有被选中的
                                this.tableData = this.rolesData[this.rolesSelectedIndex].projectTeamRoleUsers
                                this.selectRoleId = this.rolesData[this.rolesSelectedIndex].roleType === 'fixed' ? this.rolesData[this.rolesSelectedIndex].roleId : ''
                                if (this.groupTypeData.group_add_member) {
                                    if (this.rolesData[this.rolesSelectedIndex].roleType === 'general') {
                                        this.group_add_member = this.groupTypeData.is_general_user
                                    } else {
                                        this.group_add_member = this.groupTypeData.is_fixed_user
                                    }
                                }
                            } else {
                                // 否则 列表未被选中, 展示全部角色
                                this.selectRoleId = ''
                                let tableData = []
                                this.rolesData.map(item => {
                                    let projectTeamRoleUsers = item.projectTeamRoleUsers && item.projectTeamRoleUsers.map(pitem => {
                                        pitem.roleName = item.name
                                        pitem.roleId = item.id
                                        pitem.roleType = item.roleType
                                        return pitem
                                    })
                                    tableData.push(...projectTeamRoleUsers)
                                })
                                this.tableData = tableData
                            }
                        }
                        this.teamsId = this.team && this.team.teamsId ? this.team.teamsId : ''
                        res.uploadFiles && res.uploadFiles.length && res.uploadFiles.forEach(function (data) {
                            let name = data.fileName
                            data.name = name
                        })
                    }
                })
            },
            rolesHandle (item, index) { // 角色列表点击切换
                if (this.rolesSelectedIndex === index) {
                    return
                }
                this.rolesSelectedIndex = index
                this.selectRoleId = item.roleType === 'fixed' ? item.roleId : ''
                this.tableData = item.projectTeamRoleUsers ? item.projectTeamRoleUsers : []
                if (this.columns.filter(item => item.dataIndex === 'roleName').length) {
                    this.columns.shift()
                }

                // 自定义角色和固定角色 是否可以操作人员
                if (this.groupTypeData.group_add_member) {
                    if (item.roleType === 'general') {
                        this.group_add_member = this.groupTypeData.is_general_user
                    } else {
                        this.group_add_member = this.groupTypeData.is_fixed_user
                    }
                    // console.log(this.group_add_member, 'this.group_add_member')
                }
            },
            addRolesHandle () {
                // 添加角色
                let defaultObj = {
                    // id: (-this.generalRoles.length + 1) + '',
                    id: this.rolesData.length + '',
                    indexNo: 0,
                    name: '角色名称',
                    klTeamRoleClassifyId: '',
                    projectTeamRoleUsers: [],
                    roleType: 'general'
                }
                this.rolesData.push(defaultObj)
                this.generalRoles.push(defaultObj)
                // 添加角色操作有修改
                this.isAddMember = true
            },
            refreshHandle () {
                /**
                 * 刷新: 1. 清空角色选中; 2. 人员列表展示所有角色下的人员 3. 对应人员列表添加角色信息
                 */
                if (this.rolesSelectedIndex < 0) {
                    return
                }
                this.rolesSelectedIndex = -1
                let tableData = []
                this.rolesData.map(item => {
                    let projectTeamRoleUsers = item.projectTeamRoleUsers.map(pitem => {
                        pitem.roleName = item.name
                        pitem.roleId = item.id
                        pitem.roleType = item.roleType
                        return pitem
                    })
                    tableData.push(...projectTeamRoleUsers)
                })
                this.columns.unshift({
                    title: '角色',
                    dataIndex: 'roleName'
                })
                this.tableData = tableData
            },
            changeRolesHandle (text, record) {
                record.name = text
            },
            deleteRolesHandle (index) {
                // this.generalRoles.splice(index, 1)
                // this.tableData = []
                this.rolesSelectedIndex = index - 1
                this.generalRoles.splice(index - this.fixedRoles.length, 1)
                this.tableData = this.rolesData[index - 1].projectTeamRoleUsers ? this.rolesData[index - 1].projectTeamRoleUsers : []
                this.rolesData.splice(index, 1)
                this.isDelete = true
            },
            tableDeleteMemberHandle (row, index) {
                if ((row.entryTime && row.departureTime) || (!row.entryTime && !row.departureTime)) {
                    this.tableData.splice(index, 1)
                }
            },
            deleteUserHandle (scope, index) {
                /**
                 * 人员删除
                 *    人员在该项目中的任务数为0时，直接删除
                 *    人员在该项目中的任务数不为0时，状态为： 已退出
                 *       前台手动处理: 获取当前时间作为已退出的时间(此时列-状态: 待退出), 当用户点击保存的时, 处理的退出时间一起提交保存, 成功之后为 已退出
                 *
                 *    处于刷新的情况下(即点击角色列表右下角的刷新按钮)
                 *      此时的删除人员要考虑对应角色下的人员的删除(1. 当前列表页的一个删除, 2.点击切换到该人员对应的角色下时, 此时人员也应该被删除)
                 */
                if (scope.row.taskCount) {
                    scope.row.visible = false // 先隐藏弹窗
                    scope.row.departureTime = moment().format('YYYY-MM-DD HH:mm:ss')
                    scope.row.waitout = true
                } else {
                    this.tableData.splice(index, 1)
                    if (this.rolesSelectedIndex < 0) {
                        let row = scope.row
                        let roleInfo = row.roleType === 'fixed' ? this.fixedRoles.filter(item => item.id === row.roleId) : this.generalRoles.filter(item => item.id === row.roleId)
                        let projectTeamRoleUsers = roleInfo[0].projectTeamRoleUsers
                        let pIndex = projectTeamRoleUsers.findIndex(item => item.sysuserId === row.sysuserId)
                        if (pIndex > -1) {
                            projectTeamRoleUsers.splice(pIndex, 1)
                        }
                    }
                }
                this.isDelete = true
            },
            addMemberHandle () {
                // 添加人员
                if ((this.fixedRoles && this.fixedRoles.length > 0) || (this.generalRoles && this.generalRoles.length > 0)) {
                    if (this.rolesSelectedIndex > -1) {
                        this.visibleDialogMember = true
                    } else {
                        this.$message({
                            type: 'error',
                            message: '请先选择角色'
                        })
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: '请先添加角色'
                    })
                }
            },
            copyRoleHandle () {
                // 从历史项目复制
                this.visibleDialogRoles = true
                this.dialogRolesActiveName = 'experience'
            },
            expRolesCloseHandle (experienceTeamSelectValue) {
                // (我的经验团队)从历史项目复制-面板关闭
                this.visibleDialogRoles = false
                if (experienceTeamSelectValue.length > 0) {
                    this.loadRolesCommonHandle(experienceTeamSelectValue)
                }
            },
            loadStandardTeamHandle () {
                // 载入标准团队
                this.visibleDialogRoles = true
                this.dialogRolesActiveName = 'standard'
            },
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
                        projectTeamRoleUsers: [],
                        roleType: 'general'
                    }
                    tempArr.push(tempObj)
                })
                this.generalRoles.push(...tempArr)
                this.generalRoles = _.uniqWith(this.generalRoles, _.isEqual)
                this.rolesData.push(...tempArr)
                this.rolesData = _.uniqWith(this.rolesData, _.isEqual)
            },
            memberCloseHandle (tableSelectValue) {
                // 添加人员-面板关闭
                this.visibleDialogMember = false
                if (tableSelectValue.length > 0) {
                    let tempSelectData = []
                    tableSelectValue.forEach(item => {
                        let filter = this.tableData.filter(titem => titem.sysuserId === item.id).length
                        if (!filter) {
                            item.sysuserId = item.id
                            item.id = ''
                            tempSelectData.push(item)
                        }
                    })
                    this.tableData.push(...tempSelectData)
                    // 有信息修改
                    this.isAddUser = true
                }
            },
            opentDialogUserTask (row) {
                this.userTaskTableParams.currentUserId = row.sysuserId
                this.userTaskTableParams.wholeDescribeId = this.thirdMenuParam.id || ''
                this.visibleDialogUserTask = true
            },
            closeDialogUserTask (row) {
                /**
                 * 人员列表-承担任务总数-任务明细 弹窗关闭
                 */
                Object.keys(this.userTaskTableParams).forEach(key => {
                    this.userTaskTableParams[key] = ''
                })
                this.visibleDialogUserTask = false
            },
            userTaskCustomSearch (searchParam, _table) {
                /**
                 * 人员列表-承担任务总数-任务明细列表搜索
                 */
                if (searchParam.beginEndTime) {
                    searchParam.planBeginDate = moment(searchParam.beginEndTime[0]).format('YYYY-MM-DD')
                    searchParam.planEndDate = moment(searchParam.beginEndTime[1]).format('YYYY-MM-DD')
                }
                this.userTaskTableParams = { ...this.userTaskTableParams, ...searchParam }
            },
            userTaskCustomReset () {
                /**
                 * 人员列表-承担任务总数-任务明细列表搜索重置
                 */
                let currentUserId = ''
                if (this.userTaskTableParams.currentUserId) {
                    currentUserId = this.userTaskTableParams.currentUserId
                    this.wholeDescribeId = this.id
                }
                Object.keys(this.userTaskTableParams).forEach(key => {
                    this.userTaskTableParams[key] = ''
                })
                this.userTaskTableParams.currentUserId = currentUserId
            },
            submitVerifyHandle () {
                let result = true
                let sysRoleNotNull = {
                    'roleRules': [{
                        roleId: 'SYS_ROLE032',
                        roleName: '型号调度'
                    }],
                    'msg': '以下角色不能为空：'
                }
                let sysRoleOnlyOne = {
                    'roleRules': [{
                        roleId: 'SYS_ROLE030',
                        roleName: '领域调度',
                        roleUsers: []
                    }, {
                        roleId: 'SYS_ROLE031',
                        roleName: '行政负责人',
                        roleUsers: []

                    }, {
                        roleId: 'SYS_ROLE033',
                        roleName: '主管所领导',
                        roleUsers: []
                    }, {
                        roleId: 'SYS_ROLE034',
                        roleName: '综合计划管理',
                        roleUsers: []
                    }],
                    'msg': '以下角色不能为空且仅需一个：'
                }
                let sysRoleNotNullMsg = []
                let sysRoleOnlyOneMsg = []
                this.fixedRoles.forEach(fixedItem => {
                    sysRoleNotNull.roleRules.map(item => {
                        console.log(fixedItem.projectTeamRoleUsers, 'fixedItem.projectTeamRoleUsers')
                        if (fixedItem.roleId === item.roleId && fixedItem.projectTeamRoleUsers.length === 0) {
                            sysRoleNotNullMsg.push(item.roleName)
                        }
                    })
                    sysRoleOnlyOne.roleRules.map(item => {
                        if (fixedItem.roleId === item.roleId && (fixedItem.projectTeamRoleUsers.length > 1 || fixedItem.projectTeamRoleUsers.length === 0)) {
                            sysRoleOnlyOneMsg.push(item.roleName)
                        }
                    })
                })
                if (sysRoleNotNullMsg.length > 0) {
                    Notification.error({
                        title: sysRoleNotNull.msg,
                        message: sysRoleNotNullMsg.join('<br/>'),
                        dangerouslyUseHTMLString: true
                    })
                }

                if (sysRoleOnlyOneMsg.length > 0) {
                    Notification.error({
                        title: sysRoleOnlyOne.msg,
                        offset: sysRoleNotNullMsg.length > 0 ? 70 : 0,
                        message: sysRoleOnlyOneMsg.join('<br/>'),
                        dangerouslyUseHTMLString: true
                    })
                }

                if (sysRoleOnlyOneMsg.length > 0 || sysRoleNotNullMsg.length > 0) {
                    result = false
                }
                return result
            },
            submit () {
                let _this = this
                let params = this.submitParamsHandle()
                console.log(params, '提交--参数')
                if (!params.team.wholeDescribeId) {
                    _this.$message({
                        message: '无项目信息',
                        type: 'error'
                    })
                    return false
                }
                // 项目发布后需要校验团队固定角色
                let replaceStatus = ['2210', '2209']
                if (_this.thirdMenuParam.status && replaceStatus.indexOf(_this.thirdMenuParam.status) !== -1) {
                  let verifyResult = this.submitVerifyHandle()
                  if (!verifyResult) {
                    return false
                  }
                }

                this.$api['projectTeam.save'](params).then(function (res) {
                    _this.submitLoading = false
                    _this.$message({
                        message: '信息已提交',
                        type: 'success'
                    })
                    _this.getTeamInfo()
                    _this.isAddUser = false
                    _this.isAddMember = false
                }).catch(function (err) {
                    _this.submitLoading = false
                    console.log('--save-err--', err)
                })
                return true
            },
            submitParamsHandle () {
                let params = {
                    uploadFiles: this.namedFiles,
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
                        delete temp.roleType
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
                            temp.id = !temp.id || temp.id.length !== 32 ? '' : temp.id // id长度为32
                        }
                        delete temp.roleType
                    })
                    params.generalRoles.push(temp)
                })
                return params
            },
            changeCheak () {
                let result = false
                if (this.isAddMember || this.isAddUser || this.isDelete) {
                    result = true
                }
                return result
            }
        },
        components: {
            VuePerfectScrollbar,
            EditInput,
            CommonTable,
            ProjectFormView,
            DialogSelectMember,
            DialogTabsRoles,
            DialogUserTask,
            MemberUpload,
            SearchFormList,
            NlcrLayout,
            'el-button': Button,
            // 'el-button-group': ButtonGroup,
            'el-popconfirm': Popconfirm,
            'el-link': Link

        }
    }
</script>

<style lang="scss" scoped>
    .normal-nlcr-layout.custom-normal-layout {
        margin: 0;
        height: 100% !important;
    }

    /**调整 左中右布局样式 */
    /deep/ .normal-nlcr-layout.custom-nlcr {
        height: calc(100% - 60px);

        .normal-nlcr-main {
            .el-row,
            .el-col {
                .normal-nlcr-left {
                    border-right: none;
                }

                .normal-nlcr-right {
                    border-left: none;
                }
            }
        }
    }

    .role-con {
        position: relative;
        height: 100%;
        overflow-y: auto;
        padding: 0 10px 0 0;

        .add-role {
            box-sizing: border-box;
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px dashed $base-light-color;

            &.not-edit {
                background: #ffffff;
                font-size: 14px;
                color: #323232;
            }

            button {
                width: 100%;
                height: 100%;
                border-radius: 0;
                border: none;
                color: $base-light-color;
            }
        }

        .refresh {
            position: absolute;
            bottom: 0;
            left: 0;
            width: calc(100% - 10px);
            height: 50px;
            box-sizing: border-box;
            padding-right: 10px;
            text-align: right;
            line-height: 50px;
            font-size: 24px;
            background-color: #ffffff;

            .el-icon-refresh {
                &:hover {
                    cursor: pointer;
                }
            }
        }

        .role-list {
            height: calc(100% - 40px);
            // border-bottom: 1px dashed #cccccc;
            background-color: #ffffff;
            box-sizing: border-box;

            li {
                position: relative;
                display: flex;
                align-items: center;
                height: 40px;
                border-bottom: 1px solid #cccccc;
                color: #323232;
                box-sizing: border-box;
                padding: 0 6px;

                &.active {
                    /deep/ span {
                        font-weight: bolder;
                        color: #0e77d1 !important;
                    }
                }

                &.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    border-left: 3px solid #46a6ff;
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
        background: #fff;
        padding: 0 10px 8px;
        box-sizing: border-box;

        .add-member {
            height: 50px;
            line-height: 50px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            button {
                border: 1px solid $base-light-color;
                color: $base-light-color;
            }
        }

        .common-table-member {
            height: calc(100% - 50px);
            /deep/ .el-table::before {
            top: 0;
            bottom: auto;
            }
            /deep/ .el-table::after {
            background: transparent;
            }
        }

        .userState {
            .state-working,
            .state-waitout,
            .state-out {
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

            .state-waitout::before {
                background-color: #999999;
            }

            .state-out::before {
                background-color: #f04134;
            }
        }
    }

    .bottom-con {
        width: 100%;
        height: 50px !important;
        margin-top: 8px;
        background-color: #ffffff !important;
        display: flex;
        align-items: center;
        justify-content: center;

        div.tip {
            font-size: 16px;
            color: #323232;

            span:nth-child(2) {
                color: #999;
                padding-left: 6px;
            }
        }

        .operation {
            // flex: 1;
            text-align: right;
            margin-right: 50px;
        }
    }

    .right-con {
        height: 100%;
        background-color: #fff;
        margin-left: 8px;
    }
</style>
