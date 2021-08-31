<template>
    <common-dialog
        :title="title"
        :visible="visible"
        destroy-on-close
        @close="handleCancel"
        :dialogHeight="dialogHeight"
        :width="width"
        :showHandleBtn="false"
        :dialogConfig="dialogConfig"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
   <template #dialog>
    <list-layout>
        <template #north >
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search"
                              :dataSource='searchData'
                              @search='search'
                              @re-set='reSet'></search-form-list>

        </template>
        <template #center>
            <div id="table-contain">
                <common-table ref="table"
                              :fiex="200"
                              :columns="columns"
                              :customHeight="customHeight"
                              :table-Refresh="tableRefresh"
                              :params="queryParam"
                              :api="tableApi"
                              :comp="comp"
                              :pagination=true
                >
                </common-table>
            </div>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="createMenu" size="50%"  :visible='createMenu' :title="drawerTitle"  :drawerConfig="drawerConfig"  @close="createClose">
                <template #drawer>
                    <create-risk-base @save-success="saveCallback"   :riskBaseId="riskBaseId" :wholeId="wholeId"></create-risk-base>
                </template>
            </common-drawer>
            <common-drawer v-if="viewRiskBase" size="50%"  :visible='viewRiskBase'   :title="drawerTitle"  :drawerConfig="drawerConfig"  @close="createClose">
                <template #drawer>
                    <view-risk-base   :riskBaseId="riskBaseId" ></view-risk-base>
                </template>
            </common-drawer>
        </template>
    </list-layout>
   </template>
    </common-dialog>
</template>
<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import CreateRiskBase from './createRiskManage'
    import ViewRiskBase from './viewRiskBase'

    const columns = [
        {
            title: '序号',
            type: 'index',
            width: '45px',
            align: 'center'
        },
        {
            title: '项目名称',
            dataIndex: 'name',
            align: 'left'
        },
        {
            title: '风险任务',
            dataIndex: 'projectTaskName',
            align: 'left'
        },
        {
            title: '风险起点任务',
            dataIndex: 'startProjectTaskName',
            align: 'left'
        },
        {
            title: '风险终点任务',
            dataIndex: 'endProjectTaskName',
            align: 'left'
        },
        {
            title: '风险描述',
            dataIndex: 'riskDesc',
            align: 'left'
        },
        {
            title: '风险类型',
            dataIndex: 'riskType',
            align: 'center'
        },
        {
            title: '风险后果',
            dataIndex: 'riskResult',
            align: 'left'
        },
        {
            title: '提出人',
            dataIndex: 'riskLaunchUser',
            align: 'center'
        },
        {
            title: '处理人',
            dataIndex: 'riskDutyUser',
            align: 'center'
        },
        {
            title: '风险等级',
            dataIndex: 'riskLevel',
            align: 'center'
        },
        {
            title: '状态',
            dataIndex: 'status',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            align: 'center'
        }
    ]
    export default {
        name: 'riskBaseList',
        components: {
            SearchFormList,
            CommonButton,
            CreateRiskBase,
            CommonDialog,
            CommonTable,
            CommonDrawer,
            ViewRiskBase,
            ListLayout
        },
        data () {
            return {
                comp: this,
                width: '70%',
                menuStateObj: [],
                thirdMenuParam: {},
                thirdMenuTitle: '',
                defaultMenu: {},
                queryParam: { wholeDescribeId: this.wholeId, ifCreate: false },
                drawerConfig: {
                    modal: false
                    // appendToBody: true
                    // modalAppendToBody: false
                },
                createMenu: false,
                viewRiskBase: false,
                drawerTitle: '',
                riskBaseId: '',
                tableApi: 'riskManager.listData',
                columns: columns,
                searchData: [
                    {
                        type: 'text',
                        labelText: '风险描述',
                        fieldName: 'riskDesc',
                        placeholder: '请输入风险描述',
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    },
                    {
                        type: 'text',
                        labelText: '风险类型',
                        fieldName: 'riskType',
                        placeholder: '请输入风险类型',
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    }
                ],
                dialogConfig: {
                    // fullscreen: true
                    // modal: true,
                    // appendToBody: true,
                    // modalAppendToBody: false
                }
            }
        },
        computed: {
        },
        props: {
            wholeId: {
                type: String,
                default: ''
            },
            dialogHeight: {
                type: Number,
                default: 500
            },
            customHeight: {
                type: Number,
                default: 500
            },
            visible: {
                type: Boolean
            },
            title: {
                type: String
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
                // 项目ID + 查询条件中的值
                let newParams = { ...param,
                    ...(this.queryParam.wholeDescribeId ? {
                        wholeDescribeId: this.queryParam.wholeDescribeId
                    } : {})
                }
                this.queryParam = newParams
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reSet () {
                let wholeDescribeId
                let that = this
                if (this.queryParam.wholeDescribeId) {
                    wholeDescribeId = this.queryParam.wholeDescribeId
                }
                // 查询参数置为空
                Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
                // 再重新将项目ID放入查询参数中
                if (wholeDescribeId) {
                    this.queryParam.wholeDescribeId = wholeDescribeId
                }
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            createClose () {
                this.createMenu = false
                this.viewRiskBase = false
            },
            saveCallback (res) {
                this.createMenu = false
                this.$refs.table.searchData()
            },
            handleCancel (e) {
                this.$emit('close-modal')
            },
            createRiskManageMenu () {
                this.drawerTitle = '新建风险信息'
                this.riskBaseId = this.wholeId
                this.createMenu = true
            },
            updateRiskManageMenu (record) {
                this.riskBaseId = record.id
                this.wholeId = this.wholeId
                this.drawerTitle = '修改风险信息'
                this.createMenu = true
            },
            viewRiskManagMenu (record) {
                this.riskBaseId = record.id
                this.drawerTitle = '查看风险信息'
                this.viewRiskBase = true
            },
            deleteRiskManageMenu (record) {
                let that = this
                that.$confirm(`是否要删除该条数据？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.riskBaseId = record.id
                    this.$api['riskManager.removeById']({ id: this.riskBaseId }).then(function (res) {
                        that.$refs.table.searchData()
                        that.showMessage(that, '删除成功！', 'success')
                    }).catch(function (error) {
                        console.log('error' + error)
                    })
                }).catch(() => console.log('Oops errors!'))
            },
            doRiskManageMenu (record) {
                let that = this
                that.$confirm(`是否要处理该条数据？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.riskBaseId = record.id
                    this.$api['riskManager.updateRiskManage']({ id: this.riskBaseId, status: '7501' }).then(function (res) {
                        that.$refs.table.searchData()
                        that.showMessage(that, '问题分配已分配给责任人！', 'success')
                    }).catch(function (error) {
                        console.log('error' + error)
                    })
                }).catch(() => console.log('Oops errors!'))
            }
        }
    }
</script>
<style>
</style>
