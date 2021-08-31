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
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
        },
        {
            title: '人员名称',
            dataIndex: 'memberName',
            align: 'center'
        },
        {
            title: '所属单位',
            dataIndex: 'belongToUnit',
            align: 'center'
        },
        {
            title: '发证日期',
            dataIndex: 'certificationDate',
            align: 'center'
        },
        {
            title: '职称',
            dataIndex: 'positionalTitles',
            align: 'center'
        },
        {
            title: '职务',
            dataIndex: 'positional',
            align: 'center'
        },
        {
            title: '工种',
            dataIndex: 'workType',
            align: 'center'
        },
        {
            title: '检验印章号',
            dataIndex: 'sealNum',
            align: 'center'
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
                tableApi: 'MemberArchives.list',
                columns: columns,
                searchData: [
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
