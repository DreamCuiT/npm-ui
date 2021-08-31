<template>
    <div>
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :is-custom-validate="isCustomValidate"
                   @custom-validate="customValidate"
                   @changeTaskBookId="changeTaskBookId"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="modify"
                   :other-param="otherParam">
            <template #leader-main>
                <el-input v-model='modify.groupLeader'
                          readonly
                          autosize
                          v-on:click.native="openTable('1')">
                    <i class='el-icon-link'
                       slot='suffix'
                       type='link'
                       @click='openTable("1")'
                       :style='{ fontSize: "16px", color: "#08c" }'></i>
                </el-input>
            </template>
            <template #leader-assistant>
                <el-input v-model='modify.assistantGroupLeader'
                          readonly
                          autosize
                          v-on:click.native="openTable('2')">
                    <i class='el-icon-link'
                       slot='suffix'
                       type='link'
                       @click='openTable("2")'
                       :style='{ fontSize: "16px", color: "#08c" }'></i>
                </el-input>
            </template>
            <template #dispatch-main>
                <el-input v-model='modify.mainDispatch'
                          readonly
                          autosize
                          v-on:click.native="openTable('3')">
                    <i class='el-icon-link'
                       slot='suffix'
                       type='link'
                       @click='openTable("3")'
                       :style='{ fontSize: "16px", color: "#08c" }'></i>
                </el-input>
            </template>
            <template #dispatch-assistant>
                <el-input v-model='modify.assistantDispatch'
                          readonly
                          autosize
                          v-on:click.native="openTable('4')">
                    <i class='el-icon-link'
                       slot='suffix'
                       type='link'
                       @click='openTable("4")'
                       :style='{ fontSize: "16px", color: "#08c" }'></i>
                </el-input>
            </template>
            <template #member>
                <div :style="{height:setUserHeight, overflowY: 'auto'}">
                        <ul class="userList">
                            <li>
                                <el-button class="selectedBtn" type="link" size="small" icon="user-add" @click="openTableMul('5')">选择人员</el-button>
                            </li>
                            <li v-for="item in selectedData.userList" :key="item.id">
                                <span>{{item.realName}} [ {{item.departmentName}} ]</span>
                                <i class="el-icon-circle-close" @click="deleteUser(item.id)"></i>
                            </li>
                        </ul>
<!--                    <select-user v-if="visible" :visible="visible" @close-dialog="closeModal" :disabled-row="formData.sysuserIds"></select-user>-->
                </div>
            </template>
        </form-list>
        <select-user v-if="visible1" :visible="visible1" :selected-row='selectedRows1'
                     @close-dialog="closeModal" selectType="1"></select-user>
        <select-user v-if="visibles" :visible="visibles" :selected-row='selectedRows1' :otherParam = 'otherParam'
                     @close-dialog="closeModal" selectType="0"></select-user>
    </div>
</template>
<style lang="scss" scoped>
    .userList{
        background:#ffffff;
        overflow:hidden;
    }
    .userList li{
        float:left;
       /* padding:5px 10px;*/
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
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import { Input } from '~/index'

    export default {
        name: 'DutyMember',
        components: {
            FormList,
            SelectUser,
            'el-input': Input
        },
        props: {
            currEntityId: {
                type: String,
                default: ''
            },
            currEntityName: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                setUserHeight: document.documentElement.clientHeight - 290 + 'px',
                saveApi: 'DutyToken.saveMember',
                projectRoles: [],
                deptIds: [],
                selectType: '',
                selectedRows: [],
                selectedRowKeys: [],
                visible: false,
                visibles: false,
                visible1: false,
                selectedRows1: [],
                tableType: '',
                isCustomValidate: true,
                copyProjectIndexVisible: false,
                otherParam: {},
                selectedData: {
                    resourceList: [],
                    userList: [],
                    appList: []
                },
                formData: {
                    id: null,
                    name: null,
                    indexNo: null,
                    sysuserIds: [],
                    appIds: [],
                    resourceIds: []
                },
                modify: {
                    id: '',
                    name: '',
                    groupLeader: '',
                    groupLeaderId: '',
                    assistantGroupLeader: '',
                    assistantGroupLeaderId: '',
                    mainDispatch: '',
                    mainDispatchId: '',
                    assistantDispatch: '',
                    assistantDispatchId: '',
                    memberName: '',
                    memberId: ''
                },
                disabledRow: [],
                dataSource: [
                    {
                        type: 'text', // 控件类型
                        labelText: '责任令组名称', // 控件显示的文本
                        fieldName: 'name',
                        placeholder: '', // 默认控件的空值文本
                        colLayout: 'singleCol',
                        fieldConfig: {
                            disabled: true
                        }
                    },
                    {
                        type: 'blank',
                        labelText: '组长',
                        fieldName: 'groupLeader',
                        slotName: 'leader-main',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '副组长',
                        fieldName: 'assistantGroupLeader',
                        slotName: 'leader-assistant',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '总调度',
                        fieldName: 'mainDispatch',
                        slotName: 'dispatch-main',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '副总调度',
                        fieldName: 'assistantDispatch',
                        slotName: 'dispatch-assistant',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '团队成员',
                        fieldName: 'memberName',
                        slotName: 'member',
                        colLayout: 'singleCol'
                    }
                ],
                sourceTaskBookId: '',
                sourceCopyData: {},
                openTable (type) {
                    this.visible1 = true
                    this.tableType = type
                },
                openTableMul (type) {
                    this.visibles = true
                    this.tableType = type
                },
                otherParem: {}
            }
        },
        mounted: function () {
            let that = this
            this.$nextTick(function () {
                if (that.currEntityId) {
                    that.copyProjectButtonVisible = false
                } else {
                    that.copyProjectButtonVisible = true
                }
            })
        },
        methods: {
            customValidate (saveParams) {
                this.$refs.form.submitForm(saveParams, this.saveApi)
            },
            rendered () {
                if (this.currEntityId && this.currEntityId !== '') {
                    this.getProjectData(this.currEntityId, 'update')
                }
            },
            getProjectData (currEntityId, dataType) {
                let that = this
                if (dataType === 'update') {
                    that.$api['DutyToken.getMember']({ id: currEntityId }).then(res => {
                        that.fillData(that, res, dataType)
                    })
                } else if (dataType === 'copy') {
                    that.fillData(that, this.sourceCopyData, dataType)
                }
            },
            fillData (that, data, dataType) {
                console.log(data, '获取人员列表')
                that.modify.id = this.currEntityId
                that.modify.name = this.currEntityName

                that.modify.groupLeader = data.groupLeader
                that.modify.groupLeaderId = data.groupLeaderId
                that.modify.assistantGroupLeader = data.assistantGroupLeader
                that.modify.assistantGroupLeaderId = data.assistantGroupLeaderId
                that.modify.mainDispatch = data.mainDispatch
                that.modify.mainDispatchId = data.mainDispatchId
                that.modify.assistantDispatch = data.assistantDispatch
                that.modify.assistantDispatchId = data.assistantDispatchId
                this.selectedData.userList.push(...data.memberList)
                let idArr = data.memberList.map(v => { return v.id })
                this.formData.sysuserIds.push(...idArr)
                that.modify.memberId = this.formData.sysuserIds.join()
                this.otherParam.dutyGroupEsp = this.formData.sysuserIds
                that.modify = Object.assign({}, that.modify)
            },
            saved (res) {
                if (!this.modify.entityId && res.id) {
                    this.modify.entityId = res.id
                }
                this.$emit('save-success', res)
            },
            handleChange (info) {
                console.log(info, 'info')
            },
            showModal () {
                this.visible = true
            },
            deleteUser (id) {
                this.formData.sysuserIds.splice(this.formData.sysuserIds.findIndex(v => v === id), 1)
                // this.otherParam.sysuserIds.splice(this.otherParam.sysuserIds.findIndex(v => v === id), 1)
                this.selectedData.userList.splice(this.selectedData.userList.findIndex(v => v.id === id), 1)
                // this.selectedRows.splice（(this.selectedRows.findIndex(v => v.id === id), 1)
                this.modify.memberId = this.formData.sysuserIds.join()
            },
            closeModal (selectedRow) {
                this.visible1 = false
                this.visibles = false
                console.log(selectedRow, 'selectedRow')
                if (selectedRow) {
                    switch (this.tableType) {
                        case '1':
                            this.modify.groupLeader = selectedRow[0].realName
                            this.modify.groupLeaderId = selectedRow[0].id
                            break
                        case '2':
                            this.modify.assistantGroupLeader = selectedRow[0].realName
                            this.modify.assistantGroupLeaderId = selectedRow[0].id
                            break
                        case '3':
                            this.modify.mainDispatch = selectedRow[0].realName
                            this.modify.mainDispatchId = selectedRow[0].id
                            break
                        case '4':
                            this.modify.assistantDispatch = selectedRow[0].realName
                            this.modify.assistantDispatchId = selectedRow[0].id
                            break
                        default:
                            // let memberNames = []
                            // let memberIds = []
                            // selectedRow.forEach(row => {
                            //     memberNames.push(row.realName)
                            //     memberIds.push(row.id)
                            // })
                            this.selectedData.userList.push(...selectedRow)
                            let idArr = selectedRow.map(v => { return v.id })
                            this.formData.sysuserIds.push(...idArr)
                            // this.modify.memberName = memberNames.join()
                            this.modify.memberId = this.formData.sysuserIds.join()
                            this.otherParam.dutyGroupEsp = this.formData.sysuserIds
                    }
                }
            },
            deleteModel () {
                this.disabledRow = []
                this.selectedRows = []
                this.$refs.form.setFields({ modelCode: '' })
            },
            copyProject () {
                this.copyProjectIndexVisible = true
            },
            closeCopyProject (sourceTaskBookId, sourceCopyData) {
                this.copyProjectIndexVisible = false
                if (sourceCopyData) {
                    this.sourceTaskBookId = sourceTaskBookId
                    this.sourceCopyData = sourceCopyData
                    this.getProjectData(null, 'copy')
                }
            },
            changeTaskBookId: function (val) {
                this.sourceTaskBookId = val
            }
        }
    }
</script>

<style scoped>

</style>
