<template>
    <common-dialog
            title="选择型号"
            :visible="visible"
            :showHandleBtn="true"
            :dialogConfig="dialogConfig"
            @handle-cancel="handleCancel"
            @handle-ok="handleOk"
            width="70%"
    >
        <template #dialog>
            <list-layout>
                <template #north>
                    <search-form-list
                            ref="search"
                            :dataSource="searchData"
                            @search="search"
                            @re-set="reSet">
                    </search-form-list>
                </template>
                <template #center>
                    <div id="table-contain">
                        <common-table ref="table"
                                      :comp='comp'
                                      :columns="columns"
                                      :params="queryParam"
                                      :api="tableApi"
                                      :pagination="true"
                                      @select="select"
                                      :tableConfig="tableConfig"
                                      @row-click='rowClick'
                        >
                            >
                        </common-table>
                    </div>
                </template>
            </list-layout>
        </template>
    </common-dialog>
</template>

<script>
    import Vue from 'vue'

    import { P8Table as CommonTable } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Search as searchFormList } from '~/index'

    const columns = [
        {
            title: '',
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
            title: '型号代号',
            dataIndex: 'modelCode',
            width: 420,
            align: 'center'
        },
        {
            title: '型号名称',
            dataIndex: 'modelName',
            width: 420,
            align: 'center'
        },
        {
            title: '所属领域',
            dataIndex: 'classify',
            width: 390,
            align: 'center'
        }
    ]
    export default {
        name: 'SelectModel',
        components: {
            CommonTable,
            CommonDialog,
            ListLayout,
            searchFormList
        },
        props: ['visible', 'disabled-row'],
        data () {
            return {
                comp: this,
                confirmLoading: false,
                queryParam: {},
                columns: columns,
                tableApi: 'ProjectApply.commonModelList',
                loading: false,
                skeletonLoading: true,
                selectedRow: null,
                multipleSelection: [],
                selectData: [],
                dialogConfig: {
                    beforeClose: this.handleCancel,
                    destroyOnClose: 'true',
                    modal: false
                },
                tableConfig: {
                    highlightCurrentRow: true,
                    showOverflowTooltip: true
                },
                searchData: [
                    {
                        type: 'text',
                        labelText: '型号代号',
                        fieldName: 'modelCode',
                        placeholder: '请输入型号代号进行搜索',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '型号名称',
                        fieldName: 'modelName',
                        placeholder: '请输入型号名称进行搜索',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'select',
                        labelText: '所属领域',
                        fieldName: 'classifyDisplay',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'OWNER_TYPE' }
                        },
                        options: [],
                        colLayout: 'doubleCol'
                    }
                ]
            }
        },
        mounted () {
        },
        computed: {},
        methods: {
            handleOk (e) {
                if (this.selectedRow) {
                    this.$emit('close-modal', this.selectedRow)
                } else {
                    this.$message({ message: '没有选中或选中多个', type: 'error' })
                }
            },
            handleCancel (e) {
                this.$emit('close-modal')
            },
            search (param) {
                let newParams = { ...param, ...(this.queryParam.roleName ? { roleName: this.queryParam.roleName } : {}) }
                this.queryParam = newParams
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reSet () {
                let that = this
                Object.keys(that.queryParam).forEach(key => that.queryParam[key]) //
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            select (selection, row) {
                this.$refs.table.$refs.table.clearSelection()
                this.$refs.table.$refs.table.toggleRowSelection(row)
                this.selectedRow = row
            },
            rowClick (val) {
                this.$refs.table.$refs.table.clearSelection()
                this.$refs.table.$refs.table.toggleRowSelection(val)
                this.selectedRow = val
            }
        }
    }
</script>

<style scoped>

</style>
