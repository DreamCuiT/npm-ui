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
            <div>
                <common-tabs :tabsData="tabsData"
                             height="auto"
                             :activeTabs="activeTabs">
                    <template #borrow>
                        <borrow-list ref="borrowTable" @update="update"></borrow-list>
                    </template>
                    <template #return>
                        <return-list ref="returnTable" @update="update"></return-list>
                    </template>
                </common-tabs>
            </div>
        </template>
        <template #drawer-panel>
            <common-drawer ref="edit"
                           v-if="visibleEdit"
                           :visible="visibleEdit"
                           :title="editTitle"
                           :record="record"
                           size="50%"
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
    import { P8Tabs as CommonTabs } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import { P8Tree as CommonTree } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import ActivityEdit from './edit'
    import ReturnList from './returnList'
    import borrowList from './borrowList'
    export default {
        name: 'list',
        components: {
            NormalLayout,
            CommonTabs,
            SearchFormList,
            CommonButton,
            CommonTree,
            CommonDrawer,
            ReturnList,
            borrowList,
            ActivityEdit
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            const columns = [
                {
                    title: '序号',
                    type: 'index',
                    width: 45,
                    align: 'center'
                },
                {
                    title: '质量人员名称',
                    dataIndex: 'memberName',
                    align: 'center'
                },
                {
                    title: '检验印章编号',
                    dataIndex: 'sealNum',
                    align: 'center'
                },
                {
                    title: '制单人',
                    dataIndex: 'creator',
                    align: 'center'
                },
                {
                    title: '制单日期',
                    dataIndex: 'createTime',
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
                },
                tabsData: [
                    {
                        label: '领用记录',
                        name: 'borrow',
                        value: 0
                    },
                    {
                        label: '归还记录',
                        name: 'return',
                        value: 1
                    }
                ],
                activeTabs: 'borrow',
                renderHeight: height + 'px',
            }
        },
        methods: {
            createCheckoutArchives () {
                this.record = {}
                this.editTitle = '新建'
                this.visibleEdit = true
            },
            update (record) {
                console.log(record, 'uuuu')
                this.record = record
                this.editTitle = '修改'
                this.visibleEdit = true
            },
            removeCheckoutArchives (record) {
                let that = this
                that.$confirm(`是否要删除该计划？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let type = 'success'
                    let msg = '删除成功！'
                    that.$api['QualityCheckoutArchives.remove']({ id: record.id }).then(res => {
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
                this.$refs.borrowTable.saveCallback()
                this.$refs.returnTable.saveCallback()
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
