<template>
    <normal-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
        </template>
        <template #west>
            <common-tree :tree-api="treeApi" @select="onSelect"></common-tree>
        </template>
        <template #center>
            <div id="table-contain">
                <common-table ref="table" :comp="comp" :columns="columns" :params="queryParam"
                              :api="tableApi" :table-Refresh="tableRefresh" :pagination="true"
                              :tree="treeParams">
                </common-table>
            </div>
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
    </normal-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8NormalLayout as NormalLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Tree as CommonTree } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import Edit from './testEdit'

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
                    title: '设备编号',
                    dataIndex: 'equipmentCode',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '设备名称',
                    dataIndex: 'equipmentName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '所属型号',
                    dataIndex: 'modelName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '归口管理',
                    dataIndex: 'centralizedManagement',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
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
                treeApi: 'QualityEvaluation.deptTree',
                treeParams: {},
                tableApi: 'MeteringTest.list',
                queryParam: {},
                searchData: [
                    {
                        type: 'select', // 控件类型
                        labelText: '密级',
                        fieldName: 'secretGrades',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'SECRET_LEVEL' }
                        },
                        fieldConfig: {
                            multiple: true
                        }
                    },
                    {
                        type: 'datetime', // 控件类型
                        labelText: '制单日期', // 控件显示的文本
                        placeholder: '请选择查询开始时间',
                        fieldName: 'startTime',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        defaultValue: ''
                    },
                    {
                        type: 'datetime', // 控件类型
                        labelText: '制单日期', // 控件显示的文本
                        placeholder: '请选择查询结束时间',
                        fieldName: 'endTime',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        defaultValue: ''
                    }
                ],
                comp: this,
                drawerTitle: null,
                drawerVisible: false,
                record: {}
            }
        },
        methods: {
            onSelect (node) {
                this.queryParam.reportUnit = node.id
                this.$refs.table.searchData()
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            search (param) {
                if (param) {
                    if (param.endTime === 'Invalid date') {
                        param.endTime = ''
                    }
                    if (param.startTime === 'Invalid date') {
                        param.startTime = ''
                    }
                    this.queryParam = param
                }
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reSet () {
                let that = this
                that.queryParam.secretGrades = []
                that.queryParam.startTime = ''
                that.queryParam.endTime = ''
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            createDevice () {
                this.drawerTitle = '新建计量标准装置管理'
                this.drawerVisible = true
                this.record = {}
            },
            updateDevice (record) {
                this.drawerTitle = '修改计量标准装置管理'
                this.drawerVisible = true
                this.record = record
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
            NormalLayout,
            CommonTable,
            CommonDrawer,
            CommonButton,
            SearchFormList,
            CommonTree,
            Edit
        }
    }
</script>

<style scoped>
</style>
