<template>
    <div>
        <form-list ref='form'
                   @rendered='rendered'
                   @saved='saved'
                   :form='formData'
                   :dataSource='dataSource'
                   :api='saveApi'>
        </form-list>
        <template>
            <el-tabs type="card" v-model="activePane">
                <el-tab-pane label="设置人员" name="setUser" key="1">
                    <div>
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
            </el-tabs>
        </template>
    </div>
</template>

<script>
    import { Tabs, TabPane, Main, Button } from '~/index'
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    export default {
        name: 'edit',
        components: {
            FormList,
            SelectUser,
            'el-tabs': Tabs,
            'el-tab-pane': TabPane,
            'el-main': Main,
            'el-button': Button
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            return {
                dataSource: [
                    {
                        type: 'number',
                        labelText: '排序号',
                        fieldName: 'indexNo',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '组织机构名称',
                        fieldName: 'name',
                        placeholder: '组织机构名称',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '组织机构简称',
                        fieldName: 'abbreviation',
                        placeholder: '组织机构简称',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '组织机构编号',
                        fieldName: 'code',
                        placeholder: '组织机构编号',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    }],
                formData: {
                    memberList: []
                },
                saveApi: 'productOrganization.saveTree',
                // 人员分配
                activePane: 'setUser',
                visible: false,
                selectedData: {
                    userList: []
                }
            }
        },
        methods: {
            rendered () {
                if (this.record && this.record !== '') {
                    console.log(this.currContractId)
                    this.getOrganizationData(this.record, 'update')
                }
            },
            getOrganizationData (record) {
                let that = this
                that.$api['productOrganization.getNodeDetail']({ id: record.id }).then(res => {
                    let data = {}
                    data.id = res.id
                    data.indexNo = res.indexNo
                    data.name = res.name
                    data.abbreviation = res.abbreviation
                    data.code = res.code
                    data.parentId = res.parentId
                    data.memberList = res.memberList
                    that.selectedData.userList.push(...res.memberList)
                    that.formData = Object.assign(data, {})
                })
            },
            saved (res) {
                this.$emit('save-success', res)
                this.$emit('save-member-success', res)
            },
            // 设置人员
            showModal () {
                this.visible = true
            },
            deleteUser (id) {
                this.formData.memberList.splice(this.formData.memberList.findIndex(v => v === id), 1)
                // this.otherParam.sysuserIds.splice(this.otherParam.sysuserIds.findIndex(v => v === id), 1)
                this.selectedData.userList.splice(this.selectedData.userList.findIndex(v => v.id === id), 1)
                // this.selectedRows.splice（(this.selectedRows.findIndex(v => v.id === id), 1)
            },
            closeModal (selectedRows) {
                var _this = this
                let memberList = []
                this.visible = false
                this.selectedData.userList.push(...selectedRows)
                let idArr = selectedRows.map(v => { return v.id })
                memberList.push(...idArr)
                if (_this.formData.memberList) {
                    for (let i = 0; i < memberList.length; i++) {
                        let member = {
                            userId: memberList[i],
                            realName: ''
                        }
                        _this.formData.memberList.push(member)
                    }
                } else {
                    _this.formData.memberList = memberList
                }
            }
        }
    }
</script>

<style scoped>
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

</style>
