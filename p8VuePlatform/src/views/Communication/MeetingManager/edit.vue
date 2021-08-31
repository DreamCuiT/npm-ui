<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   :existDefaultBtn="false"
                   :existCustomBtn='true'
                   @close="closeModal">
            <template #mainUserList>
                <div>
                    <el-main>
                        <ul class="userList">
                            <li>
                                <el-button class="selectedBtn" type="link" size="small"
                                           icon="user-add"
                                           @click="showModalMain">选择
                                </el-button>
                            </li>
                            <li v-for="item in selectedData.mainUserList" :key="item.id">
                                <span>{{item.realName}} [ {{item.departmentName}} ]</span>
                                <i class="el-icon-circle-close"
                                   @click="deleteUserMain(item.id)"></i>
                            </li>
                        </ul>
                    </el-main>
                </div>
            </template>
            <template #sendUserList>
                <div>
                    <el-main>
                        <ul class="userList">
                            <li>
                                <el-button class="selectedBtn" type="link" size="small"
                                           icon="user-add"
                                           @click="showModalSend">选择
                                </el-button>
                            </li>
                            <li v-for="item in selectedData.sendUserList" :key="item.id">
                                <span>{{item.realName}} [ {{item.departmentName}} ]</span>
                                <i class="el-icon-circle-close"
                                   @click="deleteUserSend(item.id)"></i>
                            </li>
                        </ul>
                    </el-main>
                </div>
            </template>
            <template #otherUserList>
                <div>
                    <el-main>
                        <ul class="userList">
                            <li>
                                <el-button class="selectedBtn" type="link" size="small"
                                           icon="user-add"
                                           @click="showModalOther">选择
                                </el-button>
                                <el-button class="selectedBtn" type="link" size="small"
                                           icon="user-add"
                                           @click="showModalAdd">添加
                                </el-button>
                            </li>
                            <li v-for="item in selectedData.otherUserList" :key="item.id">
                                <span>{{item.realName}} [ {{item.departmentName}} ]</span>
                                <i class="el-icon-circle-close"
                                   @click="deleteUserOther(item.id)"></i>
                            </li>
                        </ul>
                    </el-main>
                </div>
            </template>
            <template #customBtn>
                <el-button type="primary" size="mini" @click="handleSubmit">保存</el-button>
                <el-button type="primary" size="mini" @click="handleSubmitPublish">保存并发布</el-button>
            </template>
        </form-list>
        <select-user v-if="visibleMain" :visible="visibleMain" @close-dialog="closeModalMain"
                     :disabled-row="formData.mainUserIds"></select-user>
        <select-user v-if="visibleSend" :visible="visibleSend" @close-dialog="closeModalSend"
                     :disabled-row="formData.sendUserIds"></select-user>
        <select-user v-if="visibleOther" :visible="visibleOther" @close-dialog="closeModalOther"
                     :disabled-row="formData.otherUserIds"></select-user>

        <user-add v-if="userConfigDialog" :visible="userConfigDialog"
                  @close-dialog="onVisibleAddClose"></user-add>
    </div>
</template>
<style scoped>
    .userList {
        background: #ffffff;
        overflow: hidden;
    }
    .el-main {
        display: block;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        -ms-flex-preferred-size: auto;
        flex-basis: auto;
        overflow: auto;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0px;
    }

    .userList li {
        float: left;
        padding: 0px 5px;
        border-radius: 3px;
        /*border:1px solid #1890FF;*/
        border: 1px solid #e8e8e8;
    }

    .userList li i {
        font-size: 10px;
        margin-left: 10px;
        cursor: pointer;
    }

    .userList li:first-child {
        border: none;
        padding: 0px;
    }

    .userList li:first-child .selectedBtn {
        border: 2px dashed #1890ff;
        height: 32px;
    }
</style>
<script>
    import { Main, Button } from '~/index'
    import userAdd from './userAdd'
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'

    export default {
        name: 'Edit',
        components: {
            'el-main': Main,
            'el-button': Button,
            userAdd,
            FormList,
            SelectUser
        },
        props: {
            id: {
                type: String,
                default: ''
            },
            wholeDescribeId: {
                type: String,
                default: ''
            },
            wholeDescribeName: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                saveApi: 'meetingManager.save',
                formData: {
                    mainUserList: [],
                    sendUserList: [],
                    otherUserList: [],
                    mainUserIds: [],
                    sendUserIds: [],
                    otherUserIds: [],
                    themeList: [],
                    getFile: []
                },
                selectedRows: [],
                visibleMain: false,
                visibleSend: false,
                visibleOther: false,
                visibleAdd: false,
                selectedData: {
                    mainUserList: [],
                    sendUserList: [],
                    otherUserList: []
                },
                drawerTitle: null,
                drawerConfig: {
                    modal: false
                },
                isCustomValidate: true,
                userConfigDialog: false,
                dataSource: [
                    {
                        type: 'hidden', // 控件类型
                        fieldName: 'wholeDescribeId',
                        defaultValue: this.wholeDescribeId
                    },
                    {
                        type: 'hidden', // 控件类型
                        fieldName: 'status',
                        defaultValue: '9000'
                    },
                    {
                        type: 'view',
                        labelText: '项目名称',
                        fieldName: 'wholeDescribeName',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'select',
                        labelText: '会议密级',
                        fieldName: 'security',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: '一般一类',
                                value: '一般一类'
                            },
                            {
                                label: '一般二类',
                                value: '一般二类'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '会议时间',
                        fieldName: 'meetingTime',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '主持人',
                        fieldName: 'compere',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '拟稿人',
                        fieldName: 'draftPerson',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select', // 控件类型
                        labelText: '会议类型', // 控件显示的文本
                        fieldName: 'meetingType',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: '一总例会',
                                value: '一总例会'
                            },
                            {
                                label: '两总例会',
                                value: '两总例会'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank',
                        slotName: 'mainUserList',
                        labelText: '主送',
                        fieldName: 'mainUserList',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        slotName: 'sendUserList',
                        labelText: '抄送',
                        fieldName: 'sendUserList',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        slotName: 'otherUserList',
                        labelText: '会议参加人员',
                        fieldName: 'otherUserList',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '会议议题',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'addField',
                        colLayout: 'singleCol',
                        fieldName: 'themeList',
                        children: [
                            {
                                type: 'text', // 控件类型
                                fieldName: 'theme',
                                placeholder: '请输入议题'
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        labelText: '会议内容',
                        fieldName: 'content',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'upload',
                        labelText: '附件',
                        fieldName: 'getFile',
                        colLayout: 'singleCol',
                        uploadConfig: {
                        },
                        listType: 'secret' // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                    }
                ],
                modify: {}
            }
        },
        mounted () {
        },
        methods: {
            closeModal () {

            },
            rendered () {
                if (this.id && this.id !== '') {
                    this.getProjectTeamSettingData(this.id)
                } else {
                    this.formData.wholeDescribeName = this.wholeDescribeName
                    this.formData = Object.assign({}, this.formData)
                }
            },
            clickEvent () {
                console.log('click')
            },
            getProjectTeamSettingData (id) {
                let that = this
                that.$api['meetingManager.getInfo']({
                    id: id
                }).then(function (res) {
                    for (let i = 0; i < res.userList.length; i++) {
                        if (res.userList[i].type === 'main') {
                            that.formData.mainUserIds.push(res.userList[i].userId)
                            that.formData.mainUserList.push(res.userList[i])
                            that.selectedData.mainUserList.push(res.userList[i])
                        } else if (res.userList[i].type === 'send') {
                            that.formData.sendUserIds.push(res.userList[i].userId)
                            that.formData.sendUserList.push(res.userList[i])
                            that.selectedData.sendUserList.push(res.userList[i])
                        } else if (res.userList[i].type === 'other') {
                            if (res.userList[i].userId != null) {
                                that.formData.otherUserIds.push(res.userList[i].userId)
                                that.formData.otherUserList.push(res.userList[i])
                                that.selectedData.otherUserList.push(res.userList[i])
                            } else if (res.userList[i].realName != null) {
                                that.formData.otherUserList.push(res.userList[i])
                                that.selectedData.otherUserList.push(res.userList[i])
                            }
                        }
                    }
                    that.formData.id = res.id
                    that.formData.wholeDescribeId = res.wholeDescribeId
                    that.formData.wholeDescribeName = res.wholeDescribeName
                    that.formData.security = res.security
                    that.formData.meetingTime = res.meetingTime
                    that.formData.compere = res.compere
                    that.formData.draftPerson = res.draftPerson
                    that.formData.meetingType = res.meetingType
                    that.formData.content = res.content
                    that.formData.themeList = res.themeList
                    that.formData.getFile = res.getFile
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('saveSuccess', res)
            },
            handleSubmit (e) {
                this.formData.status = '9000'
                this.$refs.form.handleSubmit(e)
            },
            handleSubmitPublish (e) {
                this.$refs.form.formData.status = '9001'
                this.$refs.form.handleSubmit(e)
            },
            handleChange (info) {
                console.log(info, 'info')
            },
            showModalMain () {
                this.visibleMain = true
            },
            showModalSend () {
                this.visibleSend = true
            },
            showModalOther () {
                this.visibleOther = true
            },
            showModalAdd () {
                this.userConfigDialog = true
            },
            closeModalMain (selectedRows) {
                this.visibleMain = false
                let idArr = selectedRows.map(v => {
                    return v.id
                })
                this.formData.mainUserIds.push(...idArr)
                this.selectedData.mainUserList.push(...selectedRows)
                for (let i = 0; i < selectedRows.length; i++) {
                    let obj = {}
                    obj.userId = selectedRows[i].id
                    this.formData.mainUserList.push(obj)
                }
                this.formData = Object.assign({}, this.formData)
            },
            deleteUserMain (id) {
                this.formData.mainUserList.splice(this.formData.mainUserList.findIndex(
                    v => v.id === id), 1)
                this.selectedData.mainUserList.splice(this.selectedData.mainUserList.findIndex(
                    v => v.id === id), 1)
            },
            closeModalSend (selectedRows) {
                this.visibleSend = false
                let idArr = selectedRows.map(v => {
                    return v.id
                })
                this.formData.sendUserIds.push(...idArr)
                this.selectedData.sendUserList.push(...selectedRows)
                for (let i = 0; i < selectedRows.length; i++) {
                    let obj = {}
                    obj.userId = selectedRows[i].id
                    this.formData.sendUserList.push(obj)
                }
                this.formData = Object.assign({}, this.formData)
            },
            deleteUserSend (id) {
                this.formData.sendUserList.splice(this.formData.sendUserList.findIndex(v => v.id === id), 1)
                this.selectedData.sendUserList.splice(this.selectedData.sendUserList.findIndex(v => v.id === id), 1)
            },
            closeModalOther (selectedRows) {
                this.visibleOther = false
                let idArr = selectedRows.map(v => {
                    return v.id
                })
                this.formData.otherUserIds.push(...idArr)
                this.selectedData.otherUserList.push(...selectedRows)
                for (let i = 0; i < selectedRows.length; i++) {
                    let obj = {}
                    obj.userId = selectedRows[i].id
                    this.formData.otherUserList.push(obj)
                }
                this.formData = Object.assign({}, this.formData)
            },
            deleteUserOther (id) {
                this.formData.otherUserList.splice(this.formData.otherUserList.findIndex(v => v.id === id), 1)
                this.selectedData.otherUserList.splice(this.selectedData.otherUserList.findIndex(v => v.id === id), 1)
            },
            onVisibleAddClose (selectedRows) {
                this.userConfigDialog = false
                this.visibleAdd = false
                this.selectedData.otherUserList.push(...selectedRows)
                let obj = {}
                obj.realName = selectedRows[0].realName
                obj.departmentName = selectedRows[0].departmentName
                this.formData.otherUserList.push(obj)
                this.formData = Object.assign({}, this.formData)
            }
        }

    }

</script>
