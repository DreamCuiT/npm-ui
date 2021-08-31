<template>
    <el-dialog title='选择部门'
               :visible='visible'
               width='800px'
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
                <common-table ref='tableCom'
                              style="height: 400px;"
                              :columns='columns'
                              :params='queryParam'
                              :flex='500'
                              :api='tableApi'
                              :table-Refresh='tableRefresh'
                              :table-config='tableConfig'
                              @row-click='rowClick'
                ></common-table>
            </template>
        </list-layout>
    </el-dialog>
</template>
<style>
</style>
<script>
    import { P8Table as CommonTable } from '~/index'
    import { P8ListLayout as ListLayout } from '~/index'
    import { Dialog, Button } from '~/index'
    import Vue from 'vue'
    import { P8Search as SearchFormList } from '~/index'

    const columns = [

        {
            title: '部门全称',
            dataIndex: 'name'
        },
        {
            title: '部门简称',
            dataIndex: 'deptAbbreviation'
        },
        {
            title: '部门编号',
            dataIndex: 'no'
        },
        {
            title: '部门类型',
            dataIndex: 'deptTypeDisplay'
        }
    ]

    export default {
        name: 'SelectProject',
        props: ['selectedRow', 'visible'],
        components: {
            'el-dialog': Dialog,
            CommonTable,
            ListLayout,
            'el-button': Button,
            SearchFormList
        },
        data () {
            return {
                tableConfig: {
                    highlightCurrentRow: true
                },
                currentRow: {},
                queryParam: {},
                tableApi: 'UncorrectionItems.getDepartment',
                columns: columns,
                searchData: [
                    {
                        type: 'text', // 控件类型
                        labelText: '部门名称', // 控件显示的文本
                        fieldName: 'name',
                        placeholder: '请输入部门名称',
                        defaultValue: null
                    },
                    {
                        type: 'text', // 控件类型
                        labelText: '部门简称', // 控件显示的文本
                        fieldName: 'deptAbbreviation',
                        placeholder: '请输入部门简称',
                        defaultValue: null
                    },
                    {
                        type: 'text', // 控件类型
                        labelText: '部门编号', // 控件显示的文本
                        fieldName: 'no',
                        placeholder: '请输入部门编号',
                        defaultValue: null
                    },
                    {
                        type: 'select',
                        defaultValue: null,
                        labelText: '部门类型',
                        fieldName: 'deptTypeDisplays',
                        placeholder: '选择所属型号',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'DEPARTMENT_TYPE' }
                        },
                        fieldConfig: {
                            multiple: true
                        }
                    }
                ]
            }
        },
        methods: {
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
            }
        }
    }
</script>
