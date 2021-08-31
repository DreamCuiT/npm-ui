<template>
    <el-dialog title='选择部门'
               :visible='visible'
               width='800px'
               height='500px'
               :before-close="cancel"
               :append-to-body='true'>
        <list-layout>
            <template #north>
                <el-button type="primary" @click="submit">确 定</el-button>
                <search-form-list ref="search"
                                  :dataSource="searchData"
                                  @search="search">
                </search-form-list>
            </template>
            <template #center>
                <el-table :data="tableData"
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
                            <template v-if="item.prop == 'name'">
                                <span>{{ scope.row[item.prop] }}</span>
                            </template>
                            <template v-else>
                                <span>{{ scope.row[item.prop] }}</span>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </list-layout>
    </el-dialog>
</template>
<style>
</style>
<script>
    import { generateTree } from '@/utils/generateTree'
    import { P8ListLayout as ListLayout } from '~/index'
    import Vue from 'vue'
    import { P8Search as SearchFormList } from '~/index'
    import {
        Dialog,
        Button,
        Table,
        TableColumn
    } from '~/index'
    const mh = document.documentElement.clientHeight - 165

    export default {
        name: 'SelectProject',
        props: ['selectedRow', 'visible', 'QualityType'],
        components: {
            'el-dialog': Dialog,
            ListLayout,
            'el-button': Button,
            SearchFormList,
            'el-table': Table,
            'el-table-column': TableColumn
        },
        data () {
            return {
                tableData: [],
                flexHeight: mh,
                tableConfig: {
                    highlightCurrentRow: true
                },
                currentRow: {},
                queryParam: {},
                columns: [],
                tableApi: 'QualityMember.getQualityMemberSys',
                isListLoading: false,
                searchData: [
                ]
            }
        },
        mounted () {
            this.initColumns()
            this.getData()
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
                        label: '名称',
                        prop: 'name'

                    }
                ]
                this.columns = columns
            },
            getData () {
                const that = this
                this.isListLoading = true
                this.tableRefresh(new Promise((resolve, reject) => {
                    if (that.tableApi) {
                        that.$api[that.tableApi]({ type: this.QualityType }).then(function (res) {
                            that.isListLoading = false
                            for (let i = 0; i < res.length; i++) {
                                if (res[i].parentId === '0') {
                                    res[i].parentId = null
                                }
                            }

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
                            resolve()// 调用列表接口成功后的回调方法
                        }).catch(function (error) {
                            reject(error) // 调用列表接口失败后的回调方法
                        })
                    }
                }))
            },
            rowClick (row, column, event) {
                this.$refs.tableCom.$refs.table.setCurrentRow(row)
                this.currentRow = row
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
            cancel () {
                this.$emit('close-dialog')
            },
            submit () {
                this.$emit('close-dialog', this.currentRow)
            },
            search (param) {
                let newParams = { ...param }
                let that = this
                this.queryParam = newParams
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            columnStyle ({ row, column, rowIndex, columnIndex }) {
                if (row.children && row.children.length > 0) {
                    return 'font-weight: 900;'
                }
            },
            cellClick (row, column, cell, event) {
                this.currentRow = row
                for (let i = 0; i < document.getElementsByClassName('current-cell').length; i++) {
                    document.getElementsByClassName('current-cell')[i].classList.remove('current-cell')
                }
                cell.classList.add('current-cell')
            }
        }
    }
</script>
