<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData" @search="search"
                              @re-set="reSet"></search-form-list>
        </template>
        <template #center>
            <common-table ref="table" :comp="comp" :columns="columns" :params="queryParam"
                          :api="tableApi" :table-Refresh="tableRefresh" :pagination="true"
                          @selection-change="handleSelectionChange">
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer :title="drawerTitle"
                           :visible="drawerVisible"
                           size="70%"
                           @close="onDrawerClose">
                <template #drawer>
                    <plan-add @saveSuccess="saveCallback" :record="record"></plan-add>
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
    import PlanAdd from './planAdd'

    export default {
        name: 'list',
        data () {
            const columns = [
                {
                    type: 'selection'
                },
                {
                    title: '序号',
                    type: 'index',
                    width: 45,
                    align: 'center'
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    align: 'center'
                },
                {
                    title: '编号',
                    dataIndex: 'code',
                    align: 'center'
                },
                {
                    title: '资源名称',
                    dataIndex: 'name',
                    align: 'left'
                },
                {
                    title: '主管单位',
                    dataIndex: 'deptName',
                    align: 'center'
                },
                {
                    title: '主管调度',
                    dataIndex: '',
                    align: 'center'
                }
            ]
            return {
                columns: columns,
                tableApi: 'commonResourcesPlan.analysis',
                queryParam: {},
                searchData: [
                    {
                        type: 'text', // 控件类型
                        labelText: '资源名称', // 控件显示的文本
                        fieldName: 'name',
                        placeholder: '请输入资源名称', // 默认控件的空值文本
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    }
                ],
                comp: this,
                drawerTitle: null,
                drawerVisible: false,
                selectedRows: [],
                record: {}
            }
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
                }
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reSet () {
                let that = this
                Object.keys(that.queryParam).forEach(key => {
                    that.queryParam[key] = null
                })
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            create () {
                this.drawerTitle = '共性资源负载图'
                this.drawerVisible = true
                this.record = {}
            },
            onDrawerClose () { // 抽屉关闭
                this.drawerVisible = false
                this.record = {}
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.onDrawerClose()
            },
            handleSelectionChange (selection) {
                if (this.selectType === '0') {
                    this.selectedRows = selection
                } else {
                    this.selectedRows = []
                    this.selectedRows = selection
                    if (selection.length > 1) {
                        this.$refs.table.clearSelection()
                        this.$refs.table.toggleRowSelection(selection.pop())
                    }
                }
            }
        },
        components: {
            ListLayout,
            CommonTable,
            SearchFormList,
            CommonDrawer,
            CommonButton,
            PlanAdd
        }
    }
</script>

<style scoped>

</style>
