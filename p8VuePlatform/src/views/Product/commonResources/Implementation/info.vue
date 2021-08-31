<template>
    <list-layout>
        <template #center>
            <common-table ref="table"
                          :api="tableApi"
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
            </common-table>
        </template>
    </list-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'

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
                    columnConfig: {
                        minWidth: 200
                    }
                },
                {
                    title: '资源类别',
                    align: 'center',
                    dataIndex: 'ctyName'
                },
                {
                    title: '计划名称',
                    dataIndex: 'projectName'
                },
                {
                    title: '联系人',
                    align: 'center',
                    dataIndex: 'contact'
                },
                {
                    title: '联系电话',
                    align: 'center',
                    dataIndex: 'tel'
                },
                {
                    title: '责任人',
                    align: 'center',
                    dataIndex: 'dutyUser'
                },
                {
                    title: '资源接收时间',
                    align: 'center',
                    dataIndex: 'receiveTime'
                },
                {
                    title: '共性资源开始时间',
                    align: 'center',
                    dataIndex: 'planBeginTime'
                },
                {
                    title: '共性资源完成时间',
                    align: 'center',
                    dataIndex: 'planEndTime'
                },
                {
                    title: '状态',
                    width: 80,
                    align: 'center',
                    dataIndex: 'commStatusDisplay'
                }
            ]
            return {
                columns: columns,
                tableApi: 'commonResourcesPlan.plan',
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
        props: {
            id: { type: String },
            modelId: { type: String },
            statusNum: { type: String }
        },
        watch: {
            id: {
                handler: function (val, oldVal) {
                    let this_ = this
                    this_.queryParam.commResourceTypeId = val
                },
                immediate: true // 当前页面一进来就对 id 进行监听
            },
            statusNum: {
                handler: function (val, oldVal) {
                    let this_ = this
                    this_.queryParam.statusNum = val
                },
                immediate: true // 当前页面一进来就对 id 进行监听
            },
            modelId: {
                handler: function (val, oldVal) {
                    let this_ = this
                    this_.queryParam.modelId = val
                },
                immediate: true // 当前页面一进来就对 id 进行监听
            }
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
            commResourcesEdit (record) {
                this.id = record.id
                this.formType = this.type
                this.codeType = this.dicType
                this.drawerTitle = '修改'
                this.visibleEditDrawer = true
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
            }
        },
        components: {
            ListLayout,
            CommonTable
        }
    }
</script>

<style scoped>

</style>
