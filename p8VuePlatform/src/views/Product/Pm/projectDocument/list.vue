<template>
    <list-layout>
        <template #north>
            <search-form-list ref='search'
                              :dataSource='searchData'
                              @search='search'
                              @re-set='reset'></search-form-list>
        </template>
        <template #center>
            <common-table
                    ref="table"
                    :comp="comp"
                    :columns="columns"
                    :params="queryParams"
                    :api="tableApi"
                    :tableRefresh="tableRefresh"
                    :pagination=true
                    @cell-click="cellClick"
            >
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer v-if='visibleDrawer'
                           :title='documentTitle'
                           :visible='visibleDrawer'
                           size='100%'
                           @close='onClose'>
                <template #drawer>
                    <task-document :record='record'></task-document>
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
    import { P8Drawer as CommonDrawer } from '~/index'
    import TaskDocument from './taskDocument'
    export default {
        name: 'list',
        components: {
            ListLayout,
            SearchFormList,
            CommonTable,
            CommonDrawer,
            TaskDocument
        },
        data () {
            const columns = [
                {
                    title: '序号',
                    type: 'index'
                },
                {
                    title: '型号代号',
                    dataIndex: 'modelName'
                },
                {
                    title: '项目编号',
                    dataIndex: 'projectNum'
                },
                {
                    title: '项目名称',
                    dataIndex: 'projectName'
                },
                {
                    title: '项目类型',
                    dataIndex: 'projectClassify'
                },
                {
                    title: '项目文档',
                    dataIndex: 'projectDocCount'
                }
            ]
            const searchData = [
                {
                    type: 'text', // 控件类型
                    labelText: '项目名称', // 控件显示的文本
                    fieldName: 'projectName',
                    placeholder: '请输入项目名称'
                }
            ]
            return {
                tableApi: 'projectDocument.proDocList',
                comp: this,
                columns,
                searchData,
                queryParams: {},
                record: '',
                visibleDrawer: false,
                documentTitle: '项目文档'
            }
        },
        methods: {
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            search (params) {
                this.queryParams = params
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reset () {
                let that = this
                Object.keys(that.queryParams).forEach(key => {
                    return (that.queryParams[key] = null)
                })
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            cellClick (row, column, cell, event) {
                this.visibleDrawer = true
                this.record = row
            },
            onClose () {
                this.visibleDrawer = false
            }
        }
    }
</script>
