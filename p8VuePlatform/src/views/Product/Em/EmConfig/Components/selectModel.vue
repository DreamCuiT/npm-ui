<template>
    <common-dialog title="选择流程"
                   :visible="visible"
                   :showHandleBtn="true"
                   :dialogConfig="dialogConfig"
                   :dialogHeight="dialogHeight"
                   @handle-cancel="handleCancel"
                   @handle-ok="handleOk"
                   @close="handleCancel"
                   @isfullscreen="fullScreen"
                   width="60%">
        <template #dialog>
            <list-layout>
                <template #north>
                    <search-form-list ref="search"
                                      :dataSource="searchData"
                                      @search="search"
                                      @re-set="reSet">
                    </search-form-list>
                </template>
                <template #center>
                    <common-table ref="table"
                                  :style="{height: dialogHeight - 120 + 'px'}"
                                  :comp='comp'
                                  :columns="columns"
                                  :params="queryParam"
                                  :api="tableApi"
                                  :pagination="true"
                                  @select="select"
                                  :tableConfig="tableConfig"
                                  @row-click='rowClick'
                                  @row-dblclick='rowDblclick'
                    >
                    </common-table>
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
    import { getTableHeightInDialog } from '@/utils/common'
    const columns = [
        {
            title: '序号',
            type: 'index',
            width: '50',
            align: 'center'
        },
        {
            title: 'key',
            dataIndex: 'myKey',
            align: 'center'
        },
        {
            title: '名称',
            dataIndex: 'name',
            align: 'center'
        },
        {
            title: '版本',
            dataIndex: 'version',
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
                dialogHeight: getTableHeightInDialog(),
                comp: this,
                confirmLoading: false,
                queryParam: {},
                columns: columns,
                tableApi: 'ProcessDefinition.list',
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
                ]
            }
        },
        mounted () {

        },
        computed: {
        },
        methods: {
            fullScreen (isfullscreen) {
                const docHeight = document.documentElement.clientHeight
                if (isfullscreen) {
                    this.dialogHeight = docHeight - 50
                } else {
                    this.dialogHeight = getTableHeightInDialog()
                }
            },
            handleOk (e) {
                if (this.selectedRow) {
                    this.$emit('close-dialog', this.selectedRow)
                } else {
                    this.$message({ message: '未选择流程信息', type: 'error' })
                }
            },
            handleCancel (e) {
                this.$emit('close-dialog')
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
            // 单击选中行
            rowClick (row, column, event) {
                // this.$refs.table.$refs.table.clearSelection()
                // this.$refs.table.$refs.table.toggleRowSelection(row)
                this.selectedRow = row
            },
            // 勾选复选框选中行
            select (selection, row) {
                this.$refs.table.$refs.table.clearSelection()
                this.$refs.table.$refs.table.toggleRowSelection(row)
                this.selectedRow = row
            },
            // 双击行，直接关闭抽屉、回填值
            rowDblclick (row, column, event) {
                // this.$refs.table.$refs.table.clearSelection()
                // this.$refs.table.$refs.table.toggleRowSelection(row)
                this.selectedRow = row
                this.handleOk()
            }
        }
    }
</script>

<style scoped>
</style>
