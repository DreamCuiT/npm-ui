<template>
    <normal-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
<!--            <search-form-list ref="search" :dataSource="searchData" @search="search"></search-form-list>-->
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
                           size="50%"
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
                    title: '类型',
                    dataIndex: 'type',
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
                    title: '报告标题',
                    dataIndex: 'title',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '发布时间',
                    dataIndex: 'publishDate',
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
                    title: '上报时间',
                    dataIndex: 'reportTime',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '制单人',
                    dataIndex: 'reporter',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '填报单位',
                    dataIndex: 'reportUnit',
                    formatter: function (row) {
                        if (row.preportUnitName) {
                            return row.preportUnitName + '-' + row.reportUnitName
                        } else {
                            return row.reportUnitName
                        }
                    },
                    minWidth: 180,
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
                tableApi: 'QualityBulletin.list',
                queryParam: {},
                searchData: [],
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
                    this.queryParam = param
                }
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            createBulletin () {
                this.drawerTitle = '新建每周归零动态'
                this.drawerVisible = true
                this.record = {}
            },
            updateBulletin (record) {
                this.drawerTitle = '修改每周归零动态'
                this.drawerVisible = true
                this.record = record
            },
            removeBulletin (record) {
                let that = this
                this.$confirm('是否确定要删除该每周归零动态？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    that.$api['QualityBulletin.remove']({ id: record.id }).then(res => {
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
