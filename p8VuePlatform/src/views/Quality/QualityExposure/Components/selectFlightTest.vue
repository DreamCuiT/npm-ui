<template>
    <el-dialog title='飞行试验选择'
               :visible.sync='visible'
               width='1200px'
               :before-close="cancel"
               :append-to-body='true'>
        <list-layout>
            <template #north>
                <el-button type="primary"
                           @click="submit">确 定</el-button>
                <search-form-list ref="search"
                                  :dataSource="searchData"
                                  @search="search"
                                  @re-set="reSet"></search-form-list>
            </template>
            <template #center>
                <common-table ref='tableCom'
                              :columns='columns'
                              :params='queryParam'
                              :flex='500'
                              :api='tableApi'
                              :table-Refresh='tableRefresh'
                              :table-config='tableConfig'
                              @row-click='rowClick'></common-table>
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
    import { P8Search as SearchFormList } from '~/index'
    import Vue from 'vue'

    const columns = [
        {
            type: 'selection',
            width: 45,
            align: 'center'
        },
        {
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
        },
        {
            title: '型号',
            dataIndex: 'modelName',
            width: 120,
            align: 'center'
        },
        {
            title: '研制阶段',
            dataIndex: 'developmentStageName',
            width: 120,
            align: 'center'
        },
        {
            title: '试验名称',
            dataIndex: 'testName',
            minWidth: 250,
            align: 'left'
        },
        {
            title: '飞行试验情况',
            dataIndex: 'flightTest',
            width: 120,
            align: 'center'
        },
        {
            title: '试验基地',
            dataIndex: 'testBaseName',
            width: 120,
            align: 'center'
        },
        {
            title: '技术负责人',
            dataIndex: 'technicalDirector',
            width: 120,
            align: 'center'
        }
    ]
    const searchData = [
        {
            type: 'select',
            defaultValue: [],
            labelText: '所属型号',
            fieldName: 'modelInformationIds',
            placeholder: '选择所属型号',
            optionUrl: {
                api: 'ProjectApply.getModelListData',
                label: 'modelName',
                value: 'id'
            },
            fieldConfig: {
                multiple: true
            }
        },
        {
            type: 'select', // 控件类型
            labelText: '研制阶段', // 控件显示的文本
            fieldName: 'developmentStages',
            placeholder: '请选择研制阶段',
            optionUrl: {
                api: 'thirdPartInterface.getDic',
                params: { dicType: 'QUALITY_DEVELOPMENT_STAGE' }
            },
            fieldConfig: {
                multiple: true
            }
        },
        {
            type: 'text', // 控件类型
            labelText: '型号批次', // 控件显示的文本
            fieldName: 'modelBatch',
            placeholder: '请输入批次', // 默认控件的空值文本
            fieldEvent: {
                'click': 'clickEvent(this)'
            }
        }
    ]

    export default {
        name: 'SelectProject',
        props: ['selectedRow', 'visible'],
        components: {
            'el-dialog': Dialog,
            CommonTable,
            SearchFormList,
            ListLayout,
            'el-button': Button
        },
        data () {
            return {
                tableConfig: {
                    queryParam: {},
                    highlightCurrentRow: true
                },
                currentRow: {},
                queryParam: {
                },
                searchData: searchData,
                tableApi: 'flight.list',
                columns: columns
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
                this.$emit('close-modal', {})
            },
            submit () {
                this.$emit('close-modal', this.currentRow)
            },
            search (param) {
                let newParams = {
                    ...param,
                    ...(this.queryParam.roleName
                        ? { roleName: this.queryParam.roleName }
                        : {})
                }
                this.queryParam = newParams
                let that = this
                Vue.nextTick(function () {
                    that.$refs.tableCom.queryList()
                })
            },
            reSet () {
                Object.keys(this.queryParam).forEach(key => {
                    this.queryParam[key] = ''
                })
                Vue.nextTick(function () {
                    this.$refs.tableCom.searchData()
                })
            }
        }
    }
</script>
