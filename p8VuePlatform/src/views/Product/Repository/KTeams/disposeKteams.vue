<template>
    <normal-layout :normalLayout="normalLayout">
        <template #north>
            <el-button type="primary" style="margin-left: 30px" @click="createRoleClassify" icon="el-icon-plus">新建角色类别</el-button>
        </template>
        <template #west>
            <common-table
                    ref="table"
                    :columns="columns"
                    :api="tableApi"
                    :params="queryParam"
                    :comp="comp"
                    :tableConfig="tableConfig"
                    @row-click="editRoleClassify"
                    :pagination="false"
                    :tableSetting="false"
            >
                <template slot="delete" slot-scope="scope">
                    <el-button  type="danger" round  size="mini" class="el-icon-delete"   @click="removeRoleClassify(scope)" ></el-button>
                </template>
            </common-table>
        </template>
        <template #center>
            <div style="position: relative; height: 93%">
                <form-list ref="form"
                           @rendered="rendered"
                           @saved="saved"
                           :dataSource="dataSource"
                           :api="saveApi"
                           :isCustomValidate="true"
                           @custom-validate="customValidate"
                           :form="modify"
                >
                </form-list>
            </div>
        </template>
    </normal-layout>
</template>

<style scoped>
</style>
<script>
    import { Button } from '~/index'
    import api from '@/plugins/api'
    import { P8Form as FormList } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8NormalLayout as NormalLayout } from '~/index'
    let me = {}
    const columns = [
        {
            title: '类别名称',
            dataIndex: 'name',
            width: '150px'
        },
        {
            dataIndex: 'delete',
            property: 'delete',
            scopedSlots: {
                customRender: 'custom'
            }
        }
    ]
    export default {
        name: 'RoleClassifyList',
        components: {
            'el-button': Button,
            FormList,
            CommonTable,
            NormalLayout
        },
        props: {
            teamsId: {
                type: String,
                default: ''
            },
            drawerTitle: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                normalLayout: {
                    west: {
                        xs: 12, sm: 11, md: 10, lg: 9, xl: 8
                    },
                    center: {
                        xs: 12, sm: 13, md: 14, lg: 15, xl: 16
                    }
                },
                tableApi: 'baseData.RoleClassifyListData',
                saveApi: 'baseData.RoleClassifySave',
                pppp: 'title-slot',
                queryParam: {
                    'kteamsId': this.teamsId
                },
                advanced: false,
                columns: columns,
                tableHeight: 0,
                loading: false,
                comp: this,
                dataSource: [
                    {
                        type: 'text', // 控件类型
                        labelText: '类别名称', // 控件显示的文本
                        fieldName: 'name',
                        placeholder: '请输入类别名称', // 默认控件的空值文本
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            },
                            {
                                validator: (rule, value, callback) => {
                                    let that = this
                                    api['baseData.RoleClassifyRepeatedCheck']({ name: value, id: that.modify.id, kteamsId: that.modify.kteamsId }).then(res => {
                                        console.log(res)
                                        if (res === 'reject') {
                                            this.$message({ message: `标识名称已被使用！`, type: 'error' })
                                            return
                                        }
                                        callback()
                                    })
                                },
                                trigger: 'blur'
                            }
                        ]
                    },
                    {
                        type: 'text', // 控件类型
                        labelText: '类别描述', // 控件显示的文本
                        fieldName: 'describes',
                        placeholder: '请输入类别描述', // 默认控件的空值文本
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'hidden',
                        fieldName: 'id',
                        colLayout: 'singleCol',
                        urlParam: true
                    },
                    {
                        type: 'hidden',
                        fieldName: 'kteamsId',
                        colLayout: 'singleCol',
                        defaultValue: this.teamsId
                    },
                    {
                        type: 'number',
                        labelText: '排序号',
                        fieldName: 'indexNo',
                        placeholder: '请输入排序号',
                        colLayout: 'doubleCol'
                    },
                    {
                        labelText: '角色名称',
                        type: 'addField',
                        colLayout: 'singleCol',
                        fieldName: 'teamRoleList',
                        children: [
                            {
                                type: 'text', // 控件类型
                                fieldName: 'name',
                                placeholder: '请输入角色名称', // 默认控件的空值文本
                                rules: [
                                    {
                                        required: true,
                                        message: '必填'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                tableConfig: {
                    'highlight-current-row': true
                },
                modify: Object.assign({}, {
                    teamRoleList: []
                }),
                modifyData: {},
                teamRoleList: {}
            }
        },
        created () {
            this.formTrigger()
        },
        mounted () {

        },
        computed: {

        },
        methods: {
            formTrigger () {
                me = this
            },
            showMessage (obj, message, type) {
                obj.$message({
                    message: message,
                    type: type
                })
            },
            fetch (teamsId, classifyid) {
                let that = this
                console.log(teamsId, classifyid, 'teamsId, classifyid')
                api['baseData.RoleClassifyListData']({ kteamsId: teamsId }).then(function (res) {
                    let data = res.records
                    if (classifyid !== undefined) {
                        for (let i = 0; i < that.data.length; i++) {
                            if (classifyid === that.data[i].id) {
                                that.modify = data[i]
                            }
                        }
                    } else {
                        if (data.length > 0) {
                            that.modify = data[0]
                        }
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            rendered () {
                this.fetch(this.teamsId)
            },
            customValidate (saveParams) {
                let dataList = saveParams.teamRoleList
                let flag = true
                if (dataList) {
                    for (let i = 0; i < dataList.length; i++) {
                        for (let j = i; j < dataList.length; j++) {
                            if (i !== j) {
                                if (dataList[i].name === dataList[j].name) {
                                    flag = false
                                    me.showMessage(me, '角色名称不可重复！', 'error')
                                }
                            }
                        }
                    }
                }
                if (flag) {
                    this.$refs.form.submitForm(saveParams, this.saveApi)
                }
            },
            createRoleClassify () {
                let that = this

                that.modifyData['kteamsId'] = that.teamsId
                that.modifyData['indexNo'] = ''
                that.modifyData['describes'] = ''
                that.modifyData['name'] = ''
                that.modifyData['id'] = ''
                that.modifyData['teamRoleList'] = []

                that.modify = Object.assign({}, that.modifyData)
            },
            editRoleClassify (row, column, event) {
                let that = this
                that.modify = Object.assign({}, row)
            },
            removeRoleClassify (scope) {
                let that = this
                let record = scope.scope.row
                if (record.classifyCountName !== '' && record.classifyCountName !== null && record.classifyCountName !== undefined) {
                    that.showMessage(that, '该设置已在流程中使用，不可删除！', 'error')
                } else {
                    that.$confirm(`是否确定要删除该角色类别？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        that.$api['baseData.RoleClassifyDelete']({ id: record.id }).then(res => {
                            that.$refs.table.searchData()
                            that.fetch(this.teamsId)
                        })
                    }).catch(() => console.log('Oops errors!'))
                }
            },
            saved (res) {
                let that = this
                this.$refs.table.searchData()
                that.fetch(this.teamsId)
            }
        }
    }
</script>
