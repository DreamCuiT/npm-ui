<template>
    <el-dialog
            title="选择风险库"
            width="80%"
            :visible="visible"
            :style="{'--height':dialogHeight+'px'}"
            append-to-body
            :modal="false"
            destroy-on-close
            @close="handleCancel">
            <list-layout>
                <template #north>
    <!--                <el-input placeholder="请输入任务名称进行搜索" v-model="taskParam.name" style="width:250px;"></el-input>-->
    <!--                <el-button icon="search" type="primary" @click="search">搜索</el-button>-->
                    <el-button style=" position: absolute; right :100px;" type="primary" @click="handleOk">确 定</el-button>
                    <el-button style=" position: absolute; right :30px;" @click="handleCancel">取 消</el-button>
                </template>
                <template #center>
                    <div class="common-table">
                        <div :class="{'small-table': true}" :style="{height: dialogHeight - 110 + 'px' }">
                            <el-table
                                    ref="table"
                                    height="100%"
                                    stripe
                                    :data="data"
                                    row-key="id"
                                    @row-click="rowClick"
                                    @select="select"
                                    @row-dblclick='rowDblclick'
                                    @selection-change="handleSelectionChange">
                                <el-table-column
                                        type="selection"
                                        :selectable='checkSelect'
                                        width="50"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        type="index"
                                        label="序号"
                                        width="50"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="riskDesc"
                                        label="风险内容描述"
                                        width="300"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="classifyId"
                                        label="项目类型"
                                        width="230"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="suit"
                                        label="风险范围"
                                        width="230"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="kpiEffrct"
                                        label="影响KPI"
                                        width="230"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="riskMeasure"
                                        label="风险应对措施"
                                        width="230"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="riskTypeDisplay"
                                        label="风险类型"
                                        width="230"
                                        align="center">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="panination">
                            <el-pagination
                                    background
                                    layout="total, prev, pager, next"
                                    :current-page="page.current"
                                    :page-size="page.size"
                                    :total="page.total"
                                    @current-change="changePage"
                            ></el-pagination>
                        </div>
                    </div>
                </template>
            </list-layout>

    </el-dialog>
</template>
<script>
    import { Dialog, Button, Table, TableColumn, Pagination } from '~/index'
    import { P8ListLayout as ListLayout } from '~/index'
    import Vue from 'vue'

    export default {
        name: 'SelectUser',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            disabledRow: {
                type: Array,
                default: () => []
            },
            wholeDescribeId: {
                type: String
            }
        },
        data () {
            const mh = document.documentElement.clientHeight
            return {
                dialogHeight: mh * 0.7,
                treeApi: 'planGanttManager.projectPlanTree',
                flexHeight: '350px',
                queryParam: {},
                taskParam: {},
                planInfoId: '',
                data: [], // 列表数据
                page: {
                    current: 1,
                    size: 1000,
                    total: 0,
                    orders: []
                }, // 分页
                selectedRows: []
            }
        },
        components: {
            'el-dialog': Dialog,
            'el-button': Button,
            'el-table': Table,
            'el-table-column': TableColumn,
            'el-pagination': Pagination,
            ListLayout
        },
        created () {
            this.formTrigger()
        },
        mounted () {
            this.refresh()
        },
        methods: {
            rowClick (row, column, event) {
                this.$refs.table.toggleRowSelection(row)
                this.currentRow = row
            },
            // 勾选复选框选中行
            select (selection, row) {
                this.$refs.table.clearSelection()
                this.$refs.table.toggleRowSelection(row)
                this.currentRow = row
            },
            // 双击行，直接关闭抽屉、回填值
            rowDblclick (row, column, event) {
                this.$refs.table.clearSelection()
                this.$refs.table.toggleRowSelection(row)
                this.currentRow = row
                this.handleOk()
            },
            formTrigger () {
            },
            handleCancel () {
                this.$refs.table.clearSelection()
                this.$emit('close')
            },
            handleOk (e) {
                this.$emit('close', this.selectedRows)
            },
            onSelect (obj) {
                this.queryParam.id = obj.id
                this.planInfoId = obj.id
                this.searchData()
            },
            handleSelectionChange (val) {
                // 多选改为单选
                if (val.length > 1) {
                    this.$refs.table.clearSelection() // 清空列表的选中
                    this.$refs.table.toggleRowSelection(val[val.length - 1]) // 只显示选中最后一个这时val还是多选的列表
                    this.selectedRows = val[val.length - 1]
                } else if (val.length === 1) {
                    this.selectedRows = val[val.length - 1]
                } else {
                    this.selectedRows = [] // multipleTable是选中行的最后一条数据
                }
            },
            checkSelect (row, index) {
                if (this.disabledRow.includes(row.id)) {
                    return false
                } else {
                    return true
                }
            },
            search () {
                let newParams = { ...this.taskParam, ...(this.queryParam.departmentId ? { departmentId: this.queryParam.departmentId } : {}) }
                this.queryParam = newParams
                let that = this
                Vue.nextTick(function () {
                    that.searchData()
                })
            },
            searchData () { // 查询列表数据时调用列表数据接口
                this.refresh()
            },
            changePage (pageNo) { // 分页时调用列表数据接口
                this.page.current = pageNo
                this.refresh()
            },
            refresh () {
                let params = {
                    ...this.taskParam,
                    ...this.queryParam,
                    wholeDescribeId: this.wholeDescribeId,
                    planInfoId: this.planInfoId,
                    page: {
                        current: this.page.current ? this.page.current : 1,
                        size: this.page.size ? this.page.size : 10,
                        orders: this.page.orders ? this.page.orders : []
                    }
                }
                const that = this
                this.$api['riskManager.storeListDate'](params).then(function (res) {
                    const data = res.records
                    data.forEach(function (item, idx) {
                        item.key = item.id
                    })
                    that.data = data

                    that.page = {
                        total: res.total,
                        current: res.current,
                        size: res.size,
                        orders: res.orders
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        }
    }
</script>

<style lang="scss">
    .common-table {
        &.flex-table {
            display: flex;
            flex-direction: column;
        }
        .small-table {
            width: 100%;
            flex: 1;
            display: inherit;
            // thead th, tbody td { padding: 7px 0 !important; }
        }
        .panination {
            margin: 9px 0;
            display: flex;
            flex: none;
            justify-content: flex-end;
        }
    }

</style>
