<template>
    <list-layout>
        <template #north>
            <i style="width:20px;height:20px;border-radius:50%;background-color:#EB3941;display: inline-block;margin-top: 5px"></i>
            <span style="font-size:15px;margin-left: 5px;">超期</span>
            <i style="width:20px;height:20px;border-radius:50%;background-color:#59A869;display: inline-block;margin-top: 5px;margin-left: 20px;"></i>
            <span style="font-size:15px;margin-left: 5px;">剩余</span>
            <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
        </template>
        <template #center>
            <div class="tableDiv">
                <el-table :data="tableData"
                          :height="flexHeight"
                          highlight-current-row
                          row-key="id"
                          v-bind="tableConfig"
                          :default-expand-all="true"
                          @rendered="rendered">
                    <el-table-column v-for="(item, index) in columns"
                                     :key="index"
                                     :prop="item.prop"
                                     :align='item.align'
                                     :type="item.type"
                                     :label="item.label"
                                     :width="item.width">
                        <template slot-scope="scope">
                            <template v-if="item.prop == 'surplusDate'">
                                <template v-if="scope.row[item.prop] > 0">
                                    <span style="color: #59A869">{{ scope.row[item.prop] }}</span>
                                </template>
                                <template v-else>
                                    <span style="color: #EB3941">{{ scope.row[item.prop] }}</span>
                                </template>
                            </template>
                            <template v-else>
                                <span>{{ scope.row[item.prop] }}</span>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </list-layout>
</template>
<style scoped>
    #centerHead{
        height: 71px;
    }
    .tableDiv .el-input-number {
        display: none;
    }
    .current-cell .el-input-number {
        display: block;
    }
    .current-cell .el-input-number + span {
        display: none;
    }
    .tableDiv .el-textarea {
        display: none;
    }
    .current-cell .el-textarea {
        display: block;
    }
    .current-cell .el-textarea + span {
        display: none;
    }
</style>

<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { Table, TableColumn } from '~/index'
    import { P8Search as SearchFormList } from '~/index'

    const mh = document.documentElement.clientHeight - 160
    export default {
        name: 'CollectionBudgetManager',
        components: {
            ListLayout,
            'el-table': Table,
            SearchFormList,
            'el-table-column': TableColumn
        },
        props: {
            record: {
                type: Object,
                default: () => { }
            }
        },
        data () {
            return {
                tableApi: 'planWarning.warningTaskList',
                flexHeight: mh,
                content: null,
                queryParam: {},
                columns: [],
                tableData: [],
                isListLoading: false, // 列表加载
                comp: this,
                planStatus: {},
                searchData: [],
                tableConfig: {

                },
                checkList: []
            }
        },
        created () {
            this.initColumns()
        },
        mounted () {
            this.queryList()
        },
        methods: {
            rendered () {
                // 所有表单元素渲染后调用rendered
                if (this.record.id) {
                    console.log(this.record.id)
                }
            },

            initColumns: function () {
                let that = this
                const columns = [
                    {
                        title: '序号',
                        type: 'index',
                        width: 50,
                        align: 'center'
                    },
                    {
                        label: '标记',
                        prop: 'sign',
                        align: 'center'
                    },
                    {
                        label: '任务层级',
                        prop: 'parentId',
                        align: 'center'
                    },
                    {
                        label: '任务名称',
                        prop: 'taskName',
                        align: 'center'
                    },
                    {
                        label: '负责人',
                        prop: 'dutyUser',
                        align: 'center'
                    },
                    {
                        label: '责任部门',
                        prop: 'department',
                        align: 'center'
                    },
                    {
                        label: '任务状态',
                        prop: 'status',
                        align: 'center'
                    },
                    {
                        label: '工期',
                        prop: 'duration',
                        align: 'center'
                    },
                    {
                        label: '未完成原因',
                        prop: 'security',
                        align: 'center'
                    },
                    {
                        label: '剩余/超期天数',
                        prop: 'surplusDate',
                        align: 'center'
                    },
                    {
                        label: '计划开始时间',
                        prop: 'planBeginDate',
                        align: 'center'
                    },
                    {
                        label: '计划完成时间',
                        prop: 'planEndDate',
                        align: 'center'
                    }
                ]
                that.columns = columns
            },
            setItemKey (item) {
                item.key = item.id
                let that = this
                if (item.children && item.children.length > 0) {
                    item.children.map(function (subItem, idx) {
                        that.setItemKey(subItem)
                    })
                }
            },
            queryList () {
                const that = this
                this.isListLoading = true
                this.tableRefresh(new Promise((resolve, reject) => {
                    if (that.tableApi) {
                        let planInfoId = that.record.planInfoId
                        that.$api[that.tableApi]({ 'planInfoId': planInfoId }, this.record).then(function (res) {
                            that.isListLoading = false
                            res.records.forEach(function (item, idx) {
                                that.setItemKey(item)
                                item.planBeginDate = item.planBeginDate.substring(0, 10)
                                item.planEndDate = item.planEndDate.substring(0, 10)
                            })
                            that.tableData = res.records
                            resolve()// 调用列表接口成功后的回调方法
                        }).catch(function (error) {
                            reject(error) // 调用列表接口失败后的回调方法
                        })
                    }
                }))
            },

            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            search (param) {
                let newParams = { ...param,
                    ...(this.queryParam.productName ? {
                        productName: this.queryParam.productName
                    } : {}),
                    ...(this.queryParam.productName ? {
                        productName: this.queryParam.productName
                    } : {}),
                    ...(this.queryParam.productName ? {
                        productName: this.queryParam.productName
                    } : {})
                }
                this.queryParam = newParams
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reSet () {
                let that = this
                Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = null })
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            }
        }
    }
</script>
