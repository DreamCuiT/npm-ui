<template>
    <list-layout>
        <template #north>
            <search-form-list :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
        </template>
        <template #center>
            <common-table ref="table"
                          :api="tableApi"
                          :flex="210"
                          :columns="columns"
                          :params='queryParam'
                          :pagination="true"
                          :table-refresh='tableRefresh'
                          :table-config='tableConfig'
                          @requested-table-data="requestedTableData">
                <template #monitorpoint='{scope}'>
                  <span v-for="item in monitorpointIconHandle(scope.row)" :key="item" style="padding: 0 2px">
                    <i :class="item"></i>
                  </span>
                </template>
                <template #overdue='{scope}'>
                    <div v-html="overdueTextHandle(scope.row.taskStatus, scope.row.taskPlanEndDate, scope.row.taskRealEndDate)"></div>
                </template>
                <template #tableSettings="{scope}">
                    <el-button type="text" v-if="scope.row.ctyName"
                               @click="commonResourcesReceive(scope.row)">修改&#12288;
                    </el-button>
                </template>
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="visibleEditDrawer"  :visible="visibleEditDrawer" :title="drawerTitle"  @close="onEditClose">
                <template #drawer>
                    <comm-resources-edit @save-success="saveCallback" :id="id"></comm-resources-edit>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import moment from 'moment'
    import CommResourcesEdit from './commResourcesEdit'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { Button } from '~/index'

    export default {
        name: 'list',
        provide () { // 使用 provide对深层组件进行数据信息传递 例:taskOperating/Progress.vue中 inject搭配computed接收数据
            return {
                getPlanInfo: () => this.planInfo
            }
        },
        data () {
            const columns = [
                // {
                //     title: '标记',
                //     dataIndex: 'monitorpoint',
                //     type: 'index',
                //     width: '100px',
                //     align: 'center',
                //     scopedSlots: {
                //         customRender: 'custom'
                //     }
                // },
                {
                    title: '型号/任务',
                    dataIndex: 'name',
                    fixed: 'left',
                    minWidth: 200
                },
                {
                    title: '资源类别',
                    width: 95,
                    align: 'center',
                    dataIndex: 'ctyName'
                },
                {
                    title: '项目名称',
                    minWidth: 180,
                    dataIndex: 'projectName'
                },
                {
                    title: '联系人',
                    width: 85,
                    align: 'center',
                    dataIndex: 'contact'
                },
                {
                    title: '联系电话',
                    align: 'center',
                    width: 100,
                    dataIndex: 'tel'
                },
                {
                    title: '任务责任人',
                    width: 110,
                    align: 'center',
                    dataIndex: 'realName'
                },
                {
                    title: '部门',
                    width: 90,
                    align: 'center',
                    dataIndex: 'parDepartmentName',
                    formatter: function (row) {
                        if (row.parDepartmentName) {
                            return row.parDepartmentName + '-' + row.deptName
                        } else {
                            return row.deptName
                        }
                    }
                },
                {
                    title: '任务状态',
                    width: 100,
                    align: 'center',
                    dataIndex: 'statusDisplay'
                },
                {
                    title: '计划完成时间',
                    width: 120,
                    align: 'center',
                    dataIndex: 'taskPlanEndDate'
                },
                {
                    title: '剩余/超期天数',
                    width: 120,
                    align: 'center',
                    dataIndex: 'overdue',
                    scopedSlots: {
                        customRender: 'custom'
                    }
                },
                {
                    title: '责任人',
                    width: 100,
                    align: 'center',
                    dataIndex: 'dutyUser'
                },
                {
                    title: '接收时间',
                    width: 100,
                    align: 'center',
                    dataIndex: 'receiveTime'
                },
                {
                    title: '共性资源计划完成时间',
                    width: 165,
                    align: 'center',
                    dataIndex: 'planEndTime'
                },
                {
                    title: '状态',
                    width: 80,
                    align: 'center',
                    dataIndex: 'commStatusDisplay'
                },
                {
                    title: '操作',
                    scopedSlots: { customRender: 'custom' },
                    dataIndex: 'tableSettings'
                }
            ]
            return {
                columns: columns,
                tableApi: 'commonResourcesPlan.myTaskPlan',
                parentId: 'parentId',
                drawerTitle: '',
                planInfo: {},
                queryParam: {},
                allStatus: [],
                selectedRow: [],
                currentRowId: null,
                visibleEditDrawer: false,
                tableConfig: {
                    'default-expand-all': true
                },
                searchData: [
                    {
                        type: 'text',
                        labelText: '项目名称',
                        fieldName: 'projectName',
                        defaultValue: '',
                        placeholder: '请输入项目名称'
                    },
                    {
                        type: 'text',
                        labelText: '任务名称',
                        fieldName: 'name',
                        defaultValue: '',
                        placeholder: '请输入任务名称'
                    },
                    {
                        type: 'select',
                        labelText: '状态',
                        placeholder: '请选择状态',
                        fieldName: 'status',
                        colLayout: 'singleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'COMM_RESOURCES_STATUS' }
                        },
                        options: []
                    },
                    {
                        type: 'select',
                        defaultValue: [],
                        labelText: '共性资源类别',
                        fieldName: 'commonResourceTypesId',
                        placeholder: '选择共性资源类别',
                        optionUrl: {
                            api: 'baseData.getPublicResourceTypes',
                            label: 'label',
                            value: 'value',
                            params: {}
                        },
                        treeData: [],
                        fieldConfig: {
                            multiple: true
                        }
                    },
                    {
                        type: 'datetimeRange',
                        labelText: '共性资源计划完成时间',
                        fieldName: 'beginEndTime',
                        placeholder: ''
                    }
                ]
            }
        },
        mounted () {
            let _this = this
            this.$bus.$on('refresh', function () {
                Vue.nextTick(function () {
                    _this.$refs.table.searchData()
                })
            })
        },
        methods: {
            onEditClose () {
                this.visibleEditDrawer = false
                this.$refs.table.searchData()
            },
            saveCallback (res) {
                this.visibleEditDrawer = false
                this.$refs.table.searchData()
            },
            commonResourcesReceive (row) {
                this.visibleEditDrawer = true
                this.id = row.id
                this.drawerTitle = '修改任务状态'
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
            reSet () {
                let that = this
                Object.keys(that.queryParam).forEach(key => {
                    that.queryParam[key] = ''
                })
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
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
            overdueTextHandle (currStatus, taskPlanEndDate, taskRealEndDate) {
                if (!currStatus) {
                    return ''
                }
                let currDate = taskRealEndDate || moment().format('YYYY-MM-DD')
                let diffDays = Math.abs(moment(taskPlanEndDate).diff(moment(currDate), 'days'))
                let text = ''
                if (currStatus === '6000') {
                    // 已完成
                    if (moment(currDate).isAfter(moment(taskPlanEndDate))) {
                        text = `<span style="color: #F80012">超期${diffDays}天完成</span>`
                    } else if (diffDays === 0) {
                        text = `<span style="color: #1892FF">当天完成</span>`
                    } else {
                        text = `<span style="color: #1892FF">提前${diffDays}天完成</span>`
                    }
                } else {
                    if (moment(currDate).isAfter(moment(taskPlanEndDate))) {
                        text = `<span style="color: #F80012">超期${diffDays}天</span>`
                    } else {
                        text = `<span style="color: #1BBF9E">剩余${diffDays}天</span>`
                    }
                }
                return text
            },
            closeModal (selectedRow) {
                this.selectedRow = selectedRow
                let dutyUserId = this.selectedRow[0].id
                if (this.selectedRow) {
                    this.$api['commonResourcesPlan.comResourceDutyUserSave']({ dutyUserId: dutyUserId, id: this.currentRowId }).then(res => {
                        // 成功之后的回调
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        })
                    })
                    this.search()
                }
            }
        },
        components: {
            ListLayout,
            CommonTable,
            SearchFormList,
            CommResourcesEdit,
            CommonDrawer,
            'el-button': Button
        }
    }
</script>

<style scoped>

</style>
