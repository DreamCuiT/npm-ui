<template>
    <normal-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reset"></search-form-list>
        </template>
        <template #west>
            <common-tree :tree-api="treeApi" @select="onSelect"></common-tree>
        </template>
        <template #center>
            <div id="table-contain">
                <common-table
                        ref="table"
                        :comp="comp"
                        :columns="columns"
                        :params="queryParams"
                        :api="tableApi"
                        :tableRefresh="tableRefresh"
                        :pagination=true
                >
                </common-table>
            </div>
        </template>
        <template #drawer-panel>
            <common-drawer ref="edit"
                           v-if="visibleEdit"
                           :visible="visibleEdit"
                           :title="editTitle"
                           :record="record"
                           size="70%"
                           @close="onEditClose">
                <template #drawer>
                    <activity-edit @save-success='saveCallback' :record="record"></activity-edit>
                </template>
            </common-drawer>
        </template>
    </normal-layout>
</template>

<script>
    import Vue from 'vue'
    import { P8NormalLayout as NormalLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import { P8Tree as CommonTree } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import ActivityEdit from './edit'
    export default {
        name: 'list',
        components: {
            NormalLayout,
            CommonTable,
            SearchFormList,
            CommonButton,
            CommonTree,
            CommonDrawer,
            ActivityEdit
        },
        data () {
            const columns = [
                {
                    title: '序号',
                    type: 'index',
                    width: 45,
                    align: 'center'
                },
                {
                    title: '报告标题',
                    dataIndex: 'reportTitle',
                    align: 'center'
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    align: 'center'
                },
                {
                    title: '填报单位',
                    dataIndex: 'name',
                    formatter: function (row) {
                        if (row.pname) {
                            return row.pname + '-' + row.name
                        } else {
                            return row.name
                        }
                    },
                    align: 'center'
                },
                {
                    title: '发布时间',
                    dataIndex: 'releaseTime',
                    align: 'center'
                },
                {
                    title: '表单密级',
                    dataIndex: 'cmeaning',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: '150',
                    scopedSlots: {
                        customRender: 'operation'
                    },
                    align: 'center'
                }
            ]
            const searchData = []
            return {
                comp: this,
                treeApi: 'QualityEvaluation.deptTree',
                tableApi: 'activityReport.list',
                columns,
                searchData,
                queryParams: {},
                visibleEdit: false,
                editTitle: '',
                record: {},
                treeParam: {
                    dataRange: 'select-all'
                },
                treeConfig: {
                    // showLine: true,
                    // checkable: true
                }
            }
        },
        methods: {
            createActivity () {
                this.record = {}
                this.editTitle = '新建活动简报'
                this.visibleEdit = true
            },
            updateActivity (record) {
                this.record = record
                this.editTitle = '修改活动简报'
                this.visibleEdit = true
            },
            removeActivity (record) {
                let that = this
                that.$confirm(`是否要删除该计划？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let type = 'success'
                    let msg = '删除成功！'
                    that.$api['activityReport.remove']({ id: record.id }).then(res => {
                        if (res && res.data) {
                            that.$message({
                                message: res.data.resultMsg,
                                type: 'warning'
                            })
                        } else {
                            that.$refs.table.searchData()
                        }
                    }).catch(function (error) {
                        type = 'error'
                        msg = '删除失败！'
                        console.log(error, 'error')
                    })
                    this.$message(
                        {
                            message: msg,
                            type: type
                        }
                    )
                }).catch(() => { })
            },
            search () {},
            reset () {},
            onSelect (node) {
                this.queryParams.fillingUnit = node.id
                this.$refs.table.searchData()
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.visibleEdit = false
            },
            onEditClose () {
                this.visibleEdit = false
            }
        }
    }
</script>

<style scoped>

</style>