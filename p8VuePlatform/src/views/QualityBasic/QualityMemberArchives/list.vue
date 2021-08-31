<template>
    <normal-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reset"></search-form-list>
        </template>
        <template #west>
            <common-tree ref="tree"
                         :treeApi="treeApi"
                         @select="onSelect"></common-tree>
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
                           size="100%"
                           @close="onEditClose">
                <template #drawer>
                    <archives-edit @save-success='saveCallback' :record="record"></archives-edit>
                </template>
            </common-drawer>
        </template>
    </normal-layout>
</template>

<script>
    // import Vue from 'vue'
    import { P8NormalLayout as NormalLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import { P8Tree as CommonTree } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import ArchivesEdit from './edit'
    export default {
        name: 'list',
        components: {
            NormalLayout,
            CommonTable,
            SearchFormList,
            CommonButton,
            CommonTree,
            CommonDrawer,
            ArchivesEdit
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
                    title: '人员名称',
                    dataIndex: 'memberName',
                    align: 'center'
                },
                {
                    title: '所属单位',
                    dataIndex: 'belongToUnitName',
                    align: 'center'
                },
                {
                    title: '发证日期',
                    dataIndex: 'certificationDate',
                    align: 'center'
                },
                {
                    title: '职称',
                    dataIndex: 'positionalTitles',
                    align: 'center'
                },
                {
                    title: '职务',
                    dataIndex: 'positional',
                    align: 'center'
                },
                {
                    title: '工种',
                    dataIndex: 'workType',
                    align: 'center'
                },
                {
                    title: '检验印章号',
                    dataIndex: 'sealNum',
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
                tableApi: 'MemberArchives.list',
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
            createMemberArchives () {
                this.record = {}
                this.editTitle = '新建'
                this.visibleEdit = true
            },
            updateMemberArchives (record) {
                this.record = record
                this.editTitle = '修改'
                this.visibleEdit = true
            },
            removeMemberArchives (record) {
                let that = this
                that.$confirm(`是否要删除该计划？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let type = 'success'
                    let msg = '删除成功！'
                    that.$api['MemberArchives.removeAll']({ id: record.id }).then(res => {
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
                this.queryParams.releaseOrg = node.id
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