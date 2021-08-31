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
                    title: '责任单位',
                    dataIndex: 'responsibleUnit',
                    formatter: function (row) {
                        if (row.presponsibleUnitName) {
                            return row.presponsibleUnitName + '-' + row.responsibleUnitName
                        } else {
                            return row.responsibleUnitName
                        }
                    },
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '责任部门',
                    dataIndex: 'responsibleDept',
                    formatter: function (row) {
                        if (row.presponsibleDeptName) {
                            return row.presponsibleDeptName + '-' + row.responsibleDeptName
                        } else {
                            return row.responsibleDeptName
                        }
                    },
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '责任人',
                    dataIndex: 'responsiblePerson',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '完成时间',
                    dataIndex: 'completionTime',
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
                tableApi: 'CustomerOpinion.list',
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
                        labelText: '责任单位', // 控件显示的文本
                        fieldName: 'responsibleUnit',
                        placeholder: '请选择责任单位',
                        optionUrl: {
                            api: 'userManager.deptTree'
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
                    if (this.queryParam.responsibleUnit != null) {
                        if (this.queryParam.responsibleUnit.length === 0) {
                            this.queryParam.responsibleUnit = ''
                        }
                    }
                }
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            createCustomerOpinion () {
                this.drawerTitle = '新建顾客意见表'
                this.drawerVisible = true
                this.record = {}
            },
            updateCustomerOpinion (record) {
                this.drawerTitle = '修改顾客意见表'
                this.drawerVisible = true
                this.record = record
            },
            removeCustomerOpinion (record) {
                let that = this
                this.$confirm('是否确定要删除该顾客意见表？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    that.$api['CustomerOpinion.remove']({ id: record.id }).then(res => {
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
