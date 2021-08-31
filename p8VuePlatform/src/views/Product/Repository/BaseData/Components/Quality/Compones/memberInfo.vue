<template>
    <list-layout>
        <template #center>
            <div class="tableDiv">
                <el-table :data="tableData"
                          :max-height="flexHeight"
                          highlight-current-row
                          row-key="id"
                          v-bind="tableConfig"
                          :cell-style="columnStyle"
                          :default-expand-all="true"
                          @cell-click="cellClick">
                    <el-table-column v-for="(item, index) in columns"
                                     :key="index"
                                     :prop="item.prop"
                                     :align='item.align'
                                     :type="item.type"
                                     :label="item.label"
                                     :width="item.width">
                        <template slot-scope="scope">
                            <template v-if="item.prop == 'tableSetting'">
                                <el-dropdown trigger="click" :hide-on-click="false">
                                      <span class="el-dropdown-link">
                                        <i class="el-icon-s-tools" style="cursor: pointer;color:#2196F3"></i>
                                      </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-if="scope.row.parentId == null">
                                            <div @click="createData(scope.row,item)">
                                                <i class="p8 icon-new-subordinate"></i>新建
                                            </div>
                                        </el-dropdown-item>
                                        <el-dropdown-item v-if="scope.row.parentId != null">
                                            <div @click="deleteData(scope.row,item)">
                                                <i class="p8 icon-delete"></i>删除
                                            </div>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                            <template v-else-if="item.prop == 'name'">
                                <el-input v-if="scope.row.parentId != null"
                                          type="text"
                                          required="required"
                                          v-model="scope.row[item.prop]"
                                          @blur="removeClass"
                                          @change="nameChange(item.prop, item.label,scope.row[item.prop],scope.row)">
                                </el-input>
                                <span>{{ scope.row[item.prop] }}</span>
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

<script>
    import { generateTree } from '@/utils/generateTree'
    import { P8ListLayout as ListLayout } from '~/index'
    import {
        Table,
        TableColumn,
        Input,
        Dropdown,
        DropdownMenu,
        DropdownItem
    } from '~/index'
    const mh = document.documentElement.clientHeight - 165
    export default {
        name: 'memberEdit',
        components: {
            ListLayout,
            'el-table': Table,
            'el-table-column': TableColumn,
            'el-dropdown': Dropdown,
            'el-dropdown-menu': DropdownMenu,
            'el-input': Input,
            'el-dropdown-item': DropdownItem
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            return {
                tableData: [],
                flexHeight: mh,
                tableConfig: {
                    expandIconColumnIndex: 2
                },
                columns: [],
                tableApi: 'QualityMember.getMember',
                isListLoading: false,
                formData: {},
                visibleDialog: false,
                dialogTitle: ''
            }
        },
        created () {
            this.initColumns()
            this.queryList()
        },
        methods: {
            initColumns () {
                const columns = [
                    {
                        label: '序号',
                        type: 'index',
                        prop: 'index',
                        width: '80',
                        align: 'center'
                    },
                    {
                        label: '操作',
                        type: 'index',
                        prop: 'tableSetting',
                        width: '80',
                        align: 'center'
                    },
                    {
                        label: '名称',
                        prop: 'name'

                    }
                ]
                this.columns = columns
            },
            queryList (message, msgType) {
                console.log(this.record, 'rrrr')
                const that = this
                this.isListLoading = true
                this.tableRefresh(new Promise((resolve, reject) => {
                    if (that.tableApi) {
                        that.$api[that.tableApi]({ id: this.record.id }).then(function (res) {
                            that.isListLoading = false
                            res[0].parentId = null

                            let data = generateTree(res, 'parentId')

                            if (data && data.length > 0) {
                                data.forEach(function (item, idx) {
                                    that.setItemKey(item)
                                })
                                for (let i = 0; i < data.length; i++) {
                                    if (data[i].children && data[i].children.length > 0) {
                                        for (let j = 0; j < data[i].children.length; j++) {
                                            data[i].children[j].index = j + 1
                                            if (data[i].children[j] && data[i].children[j].children.length > 0) {
                                                for (let k = 0; k < data[i].children[j].children.length; k++) {
                                                    data[i].children[j].children[k].index = k + 1
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            that.tableData = data
                            console.log(that.tableData, data, res, 'tttt')
                            if (msgType) {
                                that.$message(
                                    {
                                        message: message,
                                        type: msgType
                                    }
                                )
                            }
                            resolve()// 调用列表接口成功后的回调方法
                        }).catch(function (error) {
                            reject(error) // 调用列表接口失败后的回调方法
                        })
                    }
                }))
            },
            columnStyle ({ row, column, rowIndex, columnIndex }) {
                if (row.children && row.children.length > 0) {
                    return 'font-weight: 900;'
                }
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
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
            cellClick (row, column, cell, event) {
                this.clickData = row
                for (let i = 0; i < document.getElementsByClassName('current-cell').length; i++) {
                    document.getElementsByClassName('current-cell')[i].classList.remove('current-cell')
                }
                cell.classList.add('current-cell')
            },
            createData (record, item) {
                let that = this
                let type = 'success'
                let msg = '保存成功！'
                that.$api['QualityMember.update']({
                    parentId: record.id,
                    name: '新名称'
                }).then(res => {
                    if (res && res === true) {
                        that.queryList(msg, type)
                    } else {
                        that.$message(
                            {
                                message: '保存失败！',
                                type: 'error'
                            }
                        )
                    }
                })
            },
            removeClass () {
                document.getElementsByClassName('current-cell')[0].classList.remove('current-cell')
            },
            nameChange (prop, label, value, row) {
                let params = {}
                params = {
                    name: value,
                    id: row.id,
                    parentId: row.parentId
                }
                this.updateBudgetData(params)
            },
            updateBudgetData (params) {
                let that = this
                let type = 'success'
                let msg = '保存成功！'
                that.$api['QualityMember.update'](params).then(res => {
                    if (res && res === true) {
                        that.queryList(msg, type)
                    }
                })
            },
            deleteData (record, item) {
                let type = 'success'
                let msg = '删除成功！'
                let that = this
                that.$confirm(`是否要删除该节点？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$api['QualityMember.deleteMemberData']({ id: record.id }).then(res => {
                        if (res && res === true) {
                            that.queryList(msg, type)
                        } else {
                            that.$message(
                                {
                                    msg: '删除失败！',
                                    type: 'error'
                                }
                            )
                        }
                    })
                }).catch(() => {
                })
            }
        }
    }
</script>

<style scoped>
    .tableDiv .el-input {
        display: none;
    }

    .current-cell .el-input {
        display: block;
    }

    .current-cell .el-input + span {
        display: none;
    }

</style>
