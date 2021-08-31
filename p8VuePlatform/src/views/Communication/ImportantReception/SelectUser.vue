<template>
    <el-dialog
            title="选择人员"
            width="50%"
            :visible="visible"
            append-to-body
            destroy-on-close
            @close="handleCancel">
        <normal-layout>
            <template #north>
                <el-input placeholder="请输入人员姓名进行搜索" v-model="userParam.userName"
                          style="width:250px;"></el-input>
                <el-button icon="search" type="primary" @click="search">搜索</el-button>
            </template>
            <template #west>
                <div style="height:392px;">
                    <common-tree treeApi="userManager.deptTree" @select="onSelect"
                                 :treeConfig="treeConfig"></common-tree>
                </div>
            </template>
            <template #center>
                <div class="common-table">
                    <div :class="{'small-table': true}" :style="{height: flexHeight }">
                        <el-table
                                ref="table"
                                height="100%"
                                stripe
                                :data="data"
                                row-key="id"
                                highlight-current-row
                                @row-click="rowClick"
                                @select="select"
                                @row-dblclick='rowDblclick'
                        >
                            <el-table-column label width="50">
                                <template slot-scope="scope">
                                    <el-radio :label="scope.row.realName" v-model="selectedRows">&nbsp;
                                    </el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    type="index"
                                    label="序号"
                                    width="50"
                                    align="center">
                            </el-table-column>
                            <el-table-column
                                    prop="realName"
                                    label="用户名称"
                                    align="center">
                            </el-table-column>
                            <el-table-column
                                    prop="departmentName"
                                    label="所属部门"
                                    width="260"
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
        </normal-layout>
        <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
    </el-dialog>
</template>
<script>
    import { Dialog, Input, Button, Table, TableColumn, Pagination, Radio } from '~/index'
    import { P8NormalLayout as NormalLayout } from '~/index'
    import { P8Tree as CommonTree } from '~/index'
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
            }
        },
        data () {
            return {
                templateSelection: '',
                flexHeight: '350px',
                queryParam: {},
                userParam: {},
                data: [], // 列表数据
                page: {
                    current: 1,
                    size: 10,
                    total: 0,
                    orders: []
                }, // 分页
                selectedRows: [],
                treeConfig: {
                    'expand-on-click-node': false,
                    'check-on-click-node': true
                }
            }
        },
        components: {
            'el-radio': Radio,
            'el-dialog': Dialog,
            'el-input': Input,
            'el-button': Button,
            'el-table': Table,
            'el-table-column': TableColumn,
            'el-pagination': Pagination,
            NormalLayout,
            CommonTree
        },
        mounted () {
            this.refresh()
        },
        methods: {
            // rowClick (row) {
            //     this.selectedRows = row.realName
            // },
            select (selection, row) {
                this.$refs.table.clearSelection()
                this.$refs.table.toggleRowSelection(row)
                this.selectedRows[0] = row.realName
            },
            // 单击选中行
            rowClick (row, column, event) {
                this.$refs.table.toggleRowSelection(row)
                this.selectedRows[0] = row.realName
            },
            // 双击行，直接关闭抽屉、回填值
            rowDblclick (row, column, event) {
                this.$refs.table.clearSelection()
                this.$refs.table.toggleRowSelection(row)
                this.selectedRows[0] = row.realName
                this.handleOk()
            },
            handleCancel () {
                this.$refs.table.clearSelection()
                this.$emit('close-dialog', this.selectedRows)
            },
            handleOk (e) {
                this.$emit('close-dialog', this.selectedRows)
            },
            onSelect (obj) {
                this.queryParam.departmentId = obj.id
                this.searchData()
            },
            handleSelectionChange (selection) {
                this.selectedRows = selection
                this.templateRadio = selection.id
            },
            checkSelect (row, index) {
                if (this.disabledRow.includes(row.id)) {
                    return false
                } else {
                    return true
                }
            },
            search () {
                let newParams = { ...this.userParam, ...(this.queryParam.departmentId ? { departmentId: this.queryParam.departmentId } : {}) }
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
                    ...this.userParam,
                    ...this.queryParam,
                    page: {
                        current: this.page.current ? this.page.current : 1,
                        size: this.page.size ? this.page.size : 10,
                        orders: this.page.orders ? this.page.orders : []
                    }
                }
                const that = this
                this.$api['userManager.list'](params).then(function (res) {
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

    .normal-west {
        .custom-tree-node {
            > span {
                font-size: 13px;
            }
        }
    }

</style>
