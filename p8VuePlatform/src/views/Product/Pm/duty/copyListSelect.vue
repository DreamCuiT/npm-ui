<template>
    <common-dialog
            title="责任令组选择"
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
            title: '责任令组名称',
            dataIndex: 'name',
            minWidth: 300,
            align: 'left'
        },
        {
            title: '责任令组简称',
            dataIndex: 'shortName',
            width: 300,
            align: 'center'
        },
        {
            title: '年度',
            dataIndex: 'year',
            width: 120,
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
                queryParam: { flag: 'copy' },
                columns: columns,
                tableApi: 'DutyToken.projectList',
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
                        type: 'text', // 控件类型
                        labelText: '责任令组名称', // 控件显示的文本
                        fieldName: 'name',
                        placeholder: '请输入名称'
                    },
                    {
                        type: 'select',
                        labelText: '年度',
                        optionUrl: {
                            api: 'thirdPartInterface.getYear'
                        },
                        options: [],
                        fieldName: 'year',
                        colLayout: 'singleCol'
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
                    this.$api['DutyToken.copyDutyGroup']({
                        id: this.selectedRow.id,
                        name: this.selectedRow.name,
                        short_name: this.selectedRow.shortName,
                        year: this.selectedRow.year
                    }).then(response => {
                        if (response.result) {
                            this.$message({
                                type: 'error',
                                message: '复制失败，' + response.resultMsg
                            })
                        } else {
                            this.$emit('save-success')
                        }
                    })
                } else {
                    this.$message({ message: '没有选中或选中多个', type: 'error' })
                }
            },
            handleCancel (e) {
                this.$emit('close-modal')
            },
            search (param) {
                this.queryParam = param
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.queryList()
                })
            },
            reSet () {
                Object.keys(this.queryParam).forEach(key => {
                    this.queryParam[key] = ''
                })
                this.queryParam.flag = 'copy'
                Vue.nextTick(function () {
                    this.$refs.table.searchData()
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
