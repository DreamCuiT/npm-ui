<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp" ></common-button>
            <search-form-list ref="search" :dataSource="searchData" @search="search" ></search-form-list>
        </template>
        <template #center>
            <div id="table-contain">
                <common-table ref="table"
                              :fiex="200"
                              :columns="columns"
                              :table-Refresh="tableRefresh"
                              :params="queryParam"
                              :api="tableApi"
                              :comp="comp"
                              :pagination=true
                >
                    <template #monitorpoint="{ scope }">
                <span
                        v-for="item in scope.row.monitorPointsPic"
                        :key="item"
                        style="padding: 0 2px"
                >
                  <i :class="item.ICON"></i>
                </span>
                    </template>

                    <template #planTypePic="{ scope }">
                        <span   :class="scope.row.planTypePic"
                                style="padding: 0 2px"
                                >
                        </span>
                    </template>
                </common-table>
            </div>
        </template>
        <!--        <template #drawer-panel>-->
        <!--            <common-drawer v-if="visibleModelEditDrawer"  size="50%" :title="drawerTitle" :visible="visibleModelEditDrawer" @close="onEditModelClose">-->
        <!--                <template #drawer>-->
        <!--                    <model-edit @saveSuccess="saveCallback" :id="id"></model-edit>-->
        <!--                </template>-->
        <!--            </common-drawer>-->
        <!--        </template>-->
    </list-layout>
</template>

<style scoped>
</style>
<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Search as SearchFormList } from '~/index'

    const columns = [
        {
            title: '序号',
            type: 'index'
        },
        {
            title: '任务名称',
            dataIndex: 'name',
            template: function (task) {
                if (task.style) {
                    return '<div style="color:' + task.style + '">' + task.name + '</div>'
                } else {
                    return task.name
                }
            }
        },
        {
            title: '责任人',
            dataIndex: 'realName'
        },
        {
            title: '部门',
            dataIndex: 'deptName'
        },
        {
            title: '是否可控',
            dataIndex: 'weatherControl',
            formatter (row, column, cellValue, index) {
                if (cellValue) {
                    if (cellValue === '1') {
                        return '是'
                    } else {
                        return '否'
                    }
                }
            }
        },
        {
            title: '进度',
            dataIndex: 'progress',
            template: function (task) {
                if (task.progress > 0) {
                    return Math.round(task.progress * 100) + '%'
                }
                return '未开始'
            }
        },
        {
            title: '排程类型',
            dataIndex: 'autoScheduling',
            formatter (row, column, cellValue, index) {
                if (cellValue) {
                    if (cellValue === '1') {
                        return '自动'
                    } else {
                        return '手动'
                    }
                }
            }
        },
        {
            title: '计划开始时间',
            dataIndex: 'start_date',
            formatter (row, column, cellValue, index) {
                if (cellValue) {
                    return cellValue.slice(0, 9)
                }
            }
        },
        {
            title: '计划完成时间',
            dataIndex: 'end_date',
            formatter (row, column, cellValue, index) {
                if (cellValue) {
                    return cellValue.slice(0, 9)
                }
            }
        },
        {
            title: '实际开始时间',
            dataIndex: 'forecastBeginDate',
            formatter (row, column, cellValue, index) {
                if (cellValue) {
                    return cellValue.slice(0, 9)
                }
            }
        },
        {
            title: '实际完成时间',
            dataIndex: 'forecastEndDate',
            formatter (row, column, cellValue, index) {
                if (cellValue) {
                    return cellValue.slice(0, 9)
                }
            }
        }
    ]

    export default {
        name: 'ModelList',
        components: {
            ListLayout,
            CommonTable,
            CommonButton,
            SearchFormList
        },
        props: {
            planId: {
                type: String,
                default: ''
            },
            planType: {
                type: Array
            },
            deptId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                drawerTitle: '',
                comp: this,
                visibleModelEditDrawer: false,
                queryParam: {
                    planId: this.planId,
                    planType: this.planType,
                    deptId: this.deptId
                },
                tableConfig: {
                    queryParam: {},
                    highlightCurrentRow: true
                },
                tableApi: 'PlanFinishRate.getPlanCompleteData',
                columns: columns,
                tableHeight: 1,
                id: '',
                searchData: [
                    {
                        type: 'text',
                        labelText: '型号代号',
                        fieldName: 'modelCode',
                        placeholder: '请输入型号代号',
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    },
                    {
                        type: 'text',
                        labelText: '型号名称',
                        fieldName: 'modelName',
                        placeholder: '请输入型号名称',
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    },
                    {
                        type: 'text',
                        labelText: '型号简称',
                        fieldName: 'abbreviation',
                        placeholder: '请输入型号简称',
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    },
                    {
                        labelText: '所属领域',
                        type: 'select',
                        fieldName: 'classify',
                        placeholder: '请选择所属领域',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'OWNER_TYPE' },
                            label: 'label',
                            value: 'value'
                        }
                    }
                ]
            }
        },
        mounted () {
        },
        computed: {

        },
        methods: {
            setQueryParam () {
                this.queryParam.planId = this.planId
                this.queryParam.planType = this.planType
                this.queryParam.deptId = this.deptId
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            search (param) {
                let newParams = { ...param }
                this.queryParam = newParams
                this.setQueryParam()
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reSet () {
                let that = this
                Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            }
        }
    }

</script>
