<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData" @search="search"></search-form-list>
        </template>
        <template #center>
            <common-table ref="table" :comp="comp" :columns="columns" :params="queryParam"
                          :api="tableApi" :table-Refresh="tableRefresh" :pagination="true">
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer :title="drawerTitle"
                           :visible="drawerVisible"
                           size="100%"
                           @close="onDrawerClose">
                <template #drawer>
                    <edit @saveSuccess="saveCallback" :record="record"></edit>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import Edit from './edit'

    export default {
        name: 'list',
        data () {
            const columns = [
                {
                    title: '序号',
                    type: 'index',
                    width: 45,
                    align: 'center'
                },
                {
                    title: '编号',
                    dataIndex: 'code',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '密级',
                    dataIndex: 'secretGradeName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '责任部门',
                    dataIndex: 'responsibleDepartment',
                    formatter: function (row) {
                        if (row.presponsibleDepartmentName) {
                            return row.presponsibleDepartmentName + '-' + row.responsibleDepartmentName
                        } else {
                            return row.responsibleDepartmentName
                        }
                    },
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '审核依据',
                    dataIndex: 'auditBasis',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '严重程度',
                    dataIndex: 'severity',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '不符合事实描述',
                    dataIndex: 'inconformityDescription',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    scopedSlots: { customRender: 'operation' },
                    width: 120,
                    align: 'center'
                }
            ]
            return {
                columns: columns,
                tableApi: 'UncorrectionItems.list',
                queryParam: {},
                searchData: [
                    {
                        type: 'select',
                        defaultValue: [],
                        labelText: '密级',
                        fieldName: 'secretGrades',
                        placeholder: '选择密级',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'SECRET_LEVEL' }
                        },
                        fieldConfig: {
                            multiple: true
                        }
                    },
                    {
                        type: 'text', // 控件类型
                        labelText: '编号', // 控件显示的文本
                        fieldName: 'code',
                        defaultValue: '',
                        placeholder: '请输入编号'
                    },
                    {
                        type: 'treeSelect', // 控件类型
                        defaultValue: '',
                        defaultExpandAll: true,
                        labelText: '责任部门', // 控件显示的文本
                        fieldName: 'responsibleDepartment',
                        placeholder: '请选择责任部门',
                        optionUrl: {
                            api: 'userManager.deptTree'
                        }
                    },
                    {
                        type: 'select',
                        defaultValue: [],
                        labelText: '严重程度',
                        fieldName: 'severitys',
                        placeholder: '严重程度',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'UNCORRECTION_ITEMS_SEVERITY' },
                            label: 'label',
                            value: 'label'
                        },
                        fieldConfig: {
                            multiple: true
                        }
                    }
                ],
                comp: this,
                drawerTitle: null,
                drawerVisible: false,
                record: {}
            }
        },
        mounted () {
        },
        methods: {
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            search (param) {
                if (param) {
                    this.queryParam = param
                    if (this.queryParam.responsibleDepartment != null) {
                        if (this.queryParam.responsibleDepartment.length === 0) {
                            this.queryParam.responsibleDepartment = ''
                        }
                    }
                }
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            createUncorrectionItems () {
                this.drawerTitle = '新建不符合项纠正项'
                this.drawerVisible = true
                this.record = {}
            },
            updateUncorrectionItems (record) {
                this.drawerTitle = '修改不符合项纠正项'
                this.drawerVisible = true
                this.record = record
            },
            removeUncorrectionItems (record) {
                let that = this
                this.$confirm('是否确定要删除该不符合项纠正项？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    that.$api['UncorrectionItems.remove']({ id: record.id }).then(res => {
                        if (res && res.data) {
                            that.$message({
                                message: res.data.resultMsg,
                                type: 'warning'
                            })
                        } else {
                            that.$refs.table.searchData()
                        }
                    })
                }).catch(() => {
                    console.log('取消')
                })
            },
            onDrawerClose () { // 抽屉关闭
                this.drawerVisible = false
                this.record = {}
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.onDrawerClose()
            }
        },
        components: {
            ListLayout,
            CommonTable,
            CommonDrawer,
            CommonButton,
            SearchFormList,
            Edit
        }
    }
</script>

<style scoped>

</style>
