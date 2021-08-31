<template>
    <list-layout>
        <template #center>
            <common-table ref="table"
                          :api="tableApi"
                          :columns="columns"
                          :params="tableOtherParams"
                          :tableConfig="tableConfig"
                          :pagination="true"
                          :useTreeFormat="true"
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
                  <span v-for="item in monitorpointIconHandle(scope.row)" :key="item" style="padding: 0 2px">
                    <i :class="item"></i>
                  </span>
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
            }
        },
        data () {
            const columns = [

                {
                    title: '任务名称',
                    dataIndex: 'name',
                    fixed: 'left',
                    sortable: false,
                    minWidth: 180,
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
            let searchData = [
                {
                    type: 'datetimeRange',
                    labelText: '计划完成时间',
                    defaultValue: [],
                    placeholder: ['开始日期', '结束日期'],
                    fieldName: 'beginEndTime'
                },
                // {
                //     type: 'multiple',
                //     labelText: '任务状态',
                //     fieldName: 'status',
                //     defaultValue: '',
                //     placeholder: '选择状态',
                //     options: []
                // },
                {
                    type: 'text',
                    labelText: '任务名称',
                    fieldName: 'taskName',
                    defaultValue: '',
                    placeholder: '请输入任务名称'
                }
            ]
            return {
                visible: false,
                tableApi: 'courtyardPlanManager.taskTreeList',
                columns,
                parentId: 'parentId',
                searchData,
                taskId: '',
                importExcelTitle: 'Excel文件导入',
                visibleImportExcel: false,
                tableOtherParams: { planId: this.planId }, // 负责接收从项目结构树接收参数
                tableConfig: {
                    defaultExpandAllRows: true,
                    scroll: { x: 1300 },
                    expandIconColumnIndex: 6
                },
                planInfo: {},
                drawerConfig: {
                    modal: false
                },
                allStatus: []
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
            }
        },
        methods: {
            rowClick (row) {
                this.$emit('rowClick', row)
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
                    multipleData[0].options = data
                    console.log(data, 'data1')
                })
                // 加载通用gantt操作权限决策，并存入vuex
                _this.$api['planInfoManager.loadPlanStatusLimitStrategy']().then(function (res) {
                    console.log(res, 'res1')
                    if (res) {
                        _this.$store.dispatch('setPlanStatusLockMap', res['plan'])
                        _this.$store.dispatch('setTaskStatusLockMap', res['task'])
                    }
                })
            },
            monitorpointIconHandle (row) {
                if (row.monitorpointArray && row.monitorpointIconArray) {
                    let monitorpointArray = row.monitorpointArray.split(',')
                    let monitorpointIconArray = row.monitorpointIconArray.split(',')
                    let tempIcon = []
                    monitorpointArray.forEach((item, index) => {
                        tempIcon.push(monitorpointIconArray[index])
                    })
                    return tempIcon
                }
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
</style>
