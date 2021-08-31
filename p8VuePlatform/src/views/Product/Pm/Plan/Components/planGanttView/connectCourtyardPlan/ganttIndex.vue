<template>
    <list-layout :headerVisible="false">
        <template #center>
            <common-table ref="table"
                          :api="tableApi"
                          :columns="columns"
                          :params="tableOtherParams"
                          :tableConfig="tableConfig"
                          :pagination="false"
                          :useTreeFormat="true"
                          :isStripe="false"
                          :useTreePId="parentId"
                          :table-refresh='tableRefresh'
                          @row-click='rowClick'
                          @requested-table-data="requestedTableData">
                <template #serialNum='{scope}'>
                  <span>
                    {{scope.row.serialNum}}
                  </span>
                </template>
                <template #monitorpoint='{scope}'>
                    <i class="p8 icon-relation" v-if="scope.row.taskIds" :class="{'connectRow': scope.row.yconnectStatus}"></i>
                </template>
                <template #overdue='{scope}'>
                    <div v-html="overdueTextHandle(scope.row.status, scope.row.planEndDate, scope.row.realEndDate)"></div>
                </template>
            </common-table>
        </template>
    </list-layout>
</template>
<script>
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { getTaskStatusInfo } from './commonBusinessJs'
    import moment from 'moment'
    import Vue from 'vue'
    export default {
        name: 'Test',
        components: {
            CommonTable,
            ListLayout
        },
        props: {
            planId: {
                type: String,
                default: ''
            },
            planTaskId: {
                type: String,
                default: ''
            },
            taskIds: {
                type: String,
                default: ''
            }
        },
        data () {
            const columns = [
                {
                    title: '标记',
                    dataIndex: 'monitorpoint',
                    type: 'index',
                    width: 60,
                    align: 'center',
                    scopedSlots: {
                        customRender: 'custom'
                    }
                },
                {
                    title: '院计划名称',
                    dataIndex: 'name',
                    sortable: false,
                    minWidth: 180,
                    filterable: false, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'text'
                    },
                    formatter: function (row) {
                        if (row.name) {
                            return row.name
                        } else {
                            return row.dataType === 'plan' ? '项目' : row.dataType === 'task' ? '任务' : ''
                        }
                    }
                },
                {
                    title: '工期',
                    dataIndex: 'duration',
                    width: 80,
                    align: 'center',
                    formatter: function (row) {
                        if (row.duration) {
                            return row.duration + '天'
                        } else {
                            return ''
                        }
                    }
                },
                {
                    title: '计划开始时间',
                    dataIndex: 'planBeginDate',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '计划完成时间',
                    dataIndex: 'planEndDate',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '超期/剩余天数',
                    dataIndex: 'overdue',
                    width: 100,
                    scopedSlots: {
                        customRender: 'custom'
                    },
                    align: 'center'
                },
                {
                    title: '数量',
                    dataIndex: 'num',
                    sortable: false,
                    width: 90,
                    align: 'center'
                },
                {
                    title: '预测开始时间',
                    dataIndex: 'forecastBeginDate',
                    sortable: false,
                    width: 120,
                    align: 'center'
                },
                {
                    title: '预测完成时间',
                    dataIndex: 'forecastEndDate',
                    sortable: false,
                    width: 120,
                    align: 'center'
                },
                {
                    title: '前置',
                    dataIndex: 'isBudget',
                    width: 60,
                    sortable: false,
                    align: 'center'
                },
                {
                    title: '进度',
                    dataIndex: 'progress',
                    width: 60,
                    align: 'center',
                    formatter: function (row) {
                        if (row.dataType === 'task') {
                            return (row.progress * 100).toFixed(0) + '%'
                        }
                    }
                },
                {
                    title: '实际开始时间',
                    dataIndex: 'realBeginDate',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '实际完成时间',
                    dataIndex: 'realEndDate',
                    width: 120,
                    align: 'center'
                }
            ]
            return {
                visible: false,
                tableApi: 'courtyardPlanManager.taskTreeList',
                columns,
                parentId: 'parentId',
                taskId: '',
                importExcelTitle: 'Excel文件导入',
                visibleImportExcel: false,
                tableOtherParams: { planId: this.planId }, // 负责接收从项目结构树接收参数
                tableConfig: {
                    defaultExpandAllRows: true,
                    'default-expand-all': true,
                    scroll: { x: 1300 },
                    'highlight-current-row': true,
                    expandIconColumnIndex: 6
                },
                planInfo: {},
                drawerConfig: {
                    modal: false
                },
                allStatus: [],
                tableDataAll: []
            }
        },
        mounted () {
            this.getAllStatusOptions()
            let _this = this
            this.$bus.$on('refresh', function () {
                Vue.nextTick(function () {
                    _this.$refs.table.searchData()
                })
            })
        },
        watch: {
            planId (val, oldVal) {
                this.tableOtherParams.planId = val
            },
            planTaskId (val) {
                this.toggleSelectRow(this.tableDataAll, val)
            }
        },
        methods: {
            refreshTableData () {
                this.$refs.table.searchData()
            },
            rowClick (row) {
                this.$emit('rowClick', row)
                this.toggleSelectRowIcon(this.tableDataAll, row.id)
            },
            toggleSelectRow (data, key) {
                data.forEach(item => {
                    if (item.children && item.children.length) {
                        if (item.id === key) {
                            item.yconnectStatus = true
                        } else {
                            item.yconnectStatus = false
                        }
                        this.toggleSelectRow(item.children, key)
                    } else {
                        if (item.id === key) {
                            item.yconnectStatus = true
                        } else {
                            item.yconnectStatus = false
                        }
                    }
                })
            },
            toggleSelectRowIcon (data, key) {
                data.forEach(item => {
                    if (item.children && item.children.length) {
                        if (item.id === key) {
                            item.yconnectStatus = true
                        } else {
                            item.yconnectStatus = false
                        }
                        this.toggleSelectRowIcon(item.children, key)
                    } else {
                        if (item.id === key) {
                            item.yconnectStatus = true
                        } else {
                            item.yconnectStatus = false
                        }
                    }
                })
            },
            deleteCourtTask (record) {
                let that = this
                that.$confirm(`是否要删除该条任务以及下面的所有子任务？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$api['courtyardPlanManager.deleteCourtTask']({ id: record.id, indexNo: record.indexNo, planId: this.planId })
                        .then(function (res) {
                            that.$refs.table.queryList()
                            that.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                        })
                        .catch(function (error) {
                            console.log(error)
                        })
                }).catch(() => console.log('Oops errors!'))
            },
            importExcel (record) {
                this.taskId = record.id
                this.visibleImportExcel = true
            },
            importExcelClosed () {
                this.visibleImportExcel = false
            },
            importExcelSuccessClosed () {
                this.visibleImportExcel = false
                this.$refs.table.queryList()
            },
            search (param) {
                if (param && param.beginEndTime && param.beginEndTime.length === 2) {
                    param.beginEndTime[0] = moment(param.beginEndTime[0]).format('YYYY-MM-DD')
                    param.beginEndTime[1] = moment(param.beginEndTime[1]).format('YYYY-MM-DD')
                }
                console.log(this.tableOtherParams)
                let newParams = { ...param, ...(this.tableOtherParams.id ? { id: this.tableOtherParams.id } : {}) } // 项目类别ID
                this.tableOtherParams = newParams
                let _this = this
                Vue.nextTick(function () {
                    _this.$refs.table.searchData()
                })
            },
            reset () {
                let that = this
                Object.keys(that.tableOtherParams).forEach(function (key) { return (that.tableOtherParams[key] = '') })
                this.tableOtherParams.beginEndTime = []
                this.tableOtherParams.planId = this.planId
                let _this = this
                Vue.nextTick(function () {
                    _this.$refs.table.searchData()
                })
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            requestedTableData (tableData) {
                this.tableDataAll = tableData
                if (Object.keys(this.planInfo).length) {
                    const _this = this
                    let filterItem = null
                    tableData.forEach(item => {
                        filterItem = item.children.filter(citem => citem.id === _this.planInfo.id)
                    })
                    console.log('requestedTableData', filterItem)
                    if (filterItem) {
                        _this.planInfo = { allStatus: this.allStatus, ...filterItem[0], progress: filterItem[0].progress * 100 }
                    }
                }
            },
            getAllStatusOptions () {
                let _this = this
                getTaskStatusInfo({ currentStatus: 'all' }).then(data => {
                    _this.allStatus = data
                    let multipleData = _this.searchData.filter(item => item.type === 'multiple')
                    if (multipleData.length) {
                        multipleData[0].options = data
                    }
                })
                // 加载通用gantt操作权限决策，并存入vuex
                _this.$api['planInfoManager.loadPlanStatusLimitStrategy']().then(function (res) {
                    if (res) {
                        _this.$store.dispatch('setPlanStatusLockMap', res['plan'])
                        _this.$store.dispatch('setTaskStatusLockMap', res['task'])
                    }
                })
            },
            overdueTextHandle (currStatus, planEndDate, realEndDate) {
                if (!currStatus) {
                    return ''
                }
                let currDate = realEndDate || moment().format('YYYY-MM-DD')
                let diffDays = Math.abs(moment(planEndDate).diff(moment(currDate), 'days'))
                let text = ''
                if (currStatus === '6700') {
                    // 已完成
                    if (moment(currDate).isAfter(moment(planEndDate))) {
                        text = `<span style="color: #F80012">超期${diffDays}天完成</span>`
                    } else if (diffDays === 0) {
                        text = `<span style="color: #1892FF">当天完成</span>`
                    } else {
                        text = `<span style="color: #1892FF">提前${diffDays}天完成</span>`
                    }
                } else {
                    if (moment(currDate).isAfter(moment(planEndDate))) {
                        text = `<span style="color: #F80012">超期${diffDays}天</span>`
                    } else {
                        text = `<span style="color: #1BBF9E">剩余${diffDays}天</span>`
                    }
                }
                return text
            },
            withdrawTaskApprove (rowInfo) {
                let taskId = rowInfo.taskId
                const url = 'taskManager.withdrawTaskApprove'
                const _this = this
                _this.$confirm('是否要撤回审批', '提示', {
                    confirmButtonText: '撤回',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$api[url]({ taskId: taskId }).then(res => {
                        _this.$message({
                            type: 'success',
                            message: '审批已撤回'
                        })
                        Vue.nextTick(function () {
                            _this.$refs.table.searchData()
                        })
                    })
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    /deep/ .custom-drawer {
        background-color: #FAFBFF;
        .el-drawer__close-btn {
            z-index: 10;
        }
    }
    .base-custom-style {
        color: $base-white-color;
        padding: 0 2px;
        font-size: 12px;
        border-radius: 10px;
        cursor: pointer;
        &.approve {
            background-color: $base-red-color
        }
        &.leaf {
            background-color: $base-green-color
        }
    }
    .connectRow{
        color: #F87500;
    }
</style>
