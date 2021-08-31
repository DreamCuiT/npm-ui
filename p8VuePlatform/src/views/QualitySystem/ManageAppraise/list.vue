<template>
    <normal-layout>
        <template #north v-if="buttonView">
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="dataSource" @search="search" @re-set="reset"></search-form-list>
        </template>
        <template #west>
            <common-tree ref="tree"
                         :treeApi="treeApi"
                         @select="onSelect"
                         :tree-config="treeConfig"
                         :tree-Param="treeParam"></common-tree>
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
                <manage-edit
                        ref="manage"
                        v-if="visibleAppraiseEdit"
                        :visible="visibleDialog"
                        :title="dialogTitle"
                        :nodeData="nodeDate"
                        @close-modal="closeModal"
                        @save-success="saveCallback">
                </manage-edit>
            </div>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="visibleDrawer"
                           :visible="visibleDrawer"
                           :title="drawerTitle"
                           placement="left"
                           size="100%"
                           @close="onEditProjectClose">
                <template #drawer>
                    <appraise-task-edit @save-success='saveCallback' :appraiseData="appraiseData"></appraise-task-edit>
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
    import ManageEdit from './edit'
    import AppraiseTaskEdit from './Components/appraiseEdit'
    export default {
        name: 'appraiseList',
        components: {
            NormalLayout,
            CommonTable,
            SearchFormList,
            CommonButton,
            CommonTree,
            CommonDrawer,
            ManageEdit,
            AppraiseTaskEdit
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
                    title: '年度',
                    dataIndex: 'years',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '体系类型',
                    dataIndex: 'systemtype',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '管理评审计划内容',
                    dataIndex: 'name',
                    minWidth: 35,
                    align: 'left'
                },
                {
                    title: '状态',
                    dataIndex: 'state',
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
            const dataSource = [
                {
                    type: 'datetime', // 控件类型
                    labelText: '年度', // 控件显示的文本
                    fieldName: 'years',
                    placeholder: '请输入年度'
                },
                {
                    type: 'text', // 控件类型
                    labelText: '评审计划内容', // 控件显示的文本
                    fieldName: 'content',
                    placeholder: '请输入内容' // 默认控件的空值文本
                }
            ]
            return {
                comp: this,
                dataSource,
                columns,
                queryParams: {},
                tableApi: 'manageAppraise.manageAppraiseList',
                treeApi: 'manageAppraise.getTree',
                treeParam: {
                    dataRange: 'select-all'
                },
                treeConfig: {
                    // showLine: true,
                    // checkable: true
                },

                // dialog
                dialogTitle: '新建',
                visibleDialog: false,
                visibleAppraiseEdit: false,

                visibleDrawer: false,
                visibleBpmView: false,
                nodeDate: [],
                drawerTitle: '管理评审任务管理',
                appraiseData: [],
                buttonView: false
            }
        },
        methods: {
            search (params) {
                this.queryParams = params
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reset () {
                let that = this
                Object.keys(that.queryParams).forEach(key => {
                    return (that.queryParams[key] = null)
                })
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            createManageAppraise () {
                if (this.nodeDate.length !== 0) {
                    this.visibleDialog = true
                    this.visibleAppraiseEdit = true
                }
            },
            saveCallback () {
                console.log('修改页面关闭时的回调方法')
                this.$refs.table.searchData()
                this.closeModal()
            },
            closeModal () {
                this.visibleAppraiseEdit = false
            },
            onSelect (node) {
                this.nodeDate = node
                console.log(this.nodeDate, '------')
                this.queryParams.systemtype = node.id
                this.buttonView = true
                this.$refs.table.searchData()
            },
            manageAppraiseEdit (record) {
                console.log(record, 'record')
                this.visibleDrawer = true
                if (record) {
                    this.appraiseData = record
                } else {
                    this.appraiseData = this.$refs.manage.appraiseData
                }
            },
            onEditProjectClose () {
                this.$router.push({ path: this.currentRouterPath })
                this.visibleDrawer = false
                this.$refs.table.searchData()
            },
            remove (record) {
                let that = this
                console.log(record, 'record')
                // eslint-disable-next-line eqeqeq
                if (record.state == '草稿') {
                    that.$confirm(`是否要删除该计划？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let type = 'success'
                        let msg = '删除成功！'
                        that.$api['manageAppraise.remove']({ id: record.id }).then(res => {
                            if (res && res.data) {
                                that.$message({
                                    message: res.data.resultMsg,
                                    type: 'warning'
                                })
                                this.$refs.table.searchData()
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
                } else {
                    that.$confirm(record.state + `无法删除`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                }
            },
            issue (record) {
                let that = this
                that.$confirm(`是否要下发该计划？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // eslint-disable-next-line no-unused-vars
                    let type = 'success'
                    let msg = '下发成功！'
                    that.$api['manageAppraise.issue']({ id: record.id }).then(res => {
                        if (res && res === true) {
                            that.$message({
                                message: msg,
                                type: 'warning'
                            })
                            this.$refs.table.searchData()
                        } else {
                            that.$message({
                                message: '下发失败！',
                                type: 'warning'
                            })
                            that.$refs.table.searchData()
                        }
                    }).catch(function (error) {
                        type = 'error'
                        msg = '下发失败！'
                        console.log(error, 'error')
                    })
                }).catch(() => { })
            },
            complete (record) {
                let that = this
                console.log(record, 'record')
                if (record.state !== '草稿') {
                    that.$confirm(`是否要完成该计划？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // eslint-disable-next-line no-unused-vars
                        let type = 'success'
                        let msg = '操作成功！'
                        that.$api['manageAppraise.complete']({ id: record.id }).then(res => {
                            if (res && res === true) {
                                that.$message({
                                    message: msg,
                                    type: 'warning'
                                })
                                this.$refs.table.searchData()
                            } else {
                                that.$message({
                                    message: '有未完成任务！',
                                    type: 'warning'
                                })
                                that.$refs.table.searchData()
                            }
                        }).catch(function (error) {
                            type = 'error'
                            msg = '删除失败！'
                            console.log(error, 'error')
                        })
                    }).catch(() => { })
                } else {
                    that.$confirm(`编辑状态无法完成`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                }
            }
        }
    }
</script>
