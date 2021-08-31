<template>
    <common-dialog
            title="人员选择"
            :visible="visible"
            :showHandleBtn="true"
            :dialogConfig="dialogConfig"
            @handle-cancel="handleCancel"
            @handle-ok="handleOk"
            @close="handleCancel"
            width="60%"
            :dialogHeight="500"
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
                                      :flex="240"
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
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
        },

        {
            title: '名称',
            dataIndex: 'realName',
            align: 'center'
        },
        { title: '所属部门',
            dataIndex: 'department',
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
                tableApi: 'DutyToken.dutyUser',
                loading: false,
                skeletonLoading: true,
                selectedRow: null,
                multipleSelection: [],
                selectData: [],
                dialogConfig: {
                    beforeClose: this.handleCancel,
                    destroyOnClose: 'true',
                    'append-to-body': 'true',
                    modal: true
                },
                tableConfig: {
                    highlightCurrentRow: true,
                    showOverflowTooltip: true
                },
                searchData: [
                    {
                        type: 'text',
                        labelText: '名称',
                        fieldName: 'playerName',
                        placeholder: '请输入型号代号进行搜索',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'treeSelect',
                        labelText: '部门',
                        fieldName: 'deptId',
                        defaultValue: [],
                        placeholder: '选择管理部门',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'ProjectApply.deptTree',
                            params: {}
                        },
                        treeData: []
                    }
                ]
            }
        },
        mounted () {
        },
        computed: {
        },
        methods: {
            render () {

            },
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
            select (val) {
                this.$refs.table.$refs.table.clearSelection()
                this.$refs.table.$refs.table.toggleRowSelection(val)
                this.selectedRow = val
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
