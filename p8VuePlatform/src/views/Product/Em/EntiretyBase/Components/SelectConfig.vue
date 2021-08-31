<template>
    <common-dialog
            title="选择业务类型"
            destroy-on-close
            :visible="visible"
            :confirm-loading="confirmLoading"
            :dialogConfig="dialogConfig"
            width="90%"
            :dialogHeight="500"
            @close="handleCancel"
            @handle-cancel="handleCancel"
            @handle-ok="handleOk"
            @isfullscreen="isfullscreen"
    >
        <template #dialog>
            <list-layout>
                <template #center>
                    <div id="table-contain">
                        <common-table ref="table"
                                      :comp="comp"
                                      :columns="columns"
                                      :params="queryParam"
                                      :api="tableApi"
                                      :style="{height: cutomHeight + 'px'}"
                                      :table-Refresh="tableRefresh"
                                      @row-click='rowClick'
                                      :pagination="true"
                                      :tableConfig="tableConfig"
                                      @current-change="currentChange">
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
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    export default {
        name: 'copyIndex',
        components: {
            CommonDialog,
            ListLayout,
            CommonTable
        },
        props: ['visible', 'disabled-row'],
        data () {
            return {
                comp: this,
                tableApi: 'emConfig.list',
                confirmLoading: false,
                queryParam: {},
                tableConfig: {
                    highlightCurrentRow: true,
                    height: '400px'
                },
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 55,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        dataIndex: 'configName',
                        minWidth: 300,
                        align: 'left'
                    },
                    {
                        title: '业务范围',
                        dataIndex: 'filedName',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '来源',
                        dataIndex: 'sourceName',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '项目类型',
                        dataIndex: 'classifyName',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '决策形式确认流程',
                        dataIndex: 'processDefinationOneName',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '立项决策发布流程',
                        dataIndex: 'processDefinationTwoName',
                        minWidth: 200,
                        align: 'left'
                    },
                    {
                        title: '立项实施发布流程',
                        dataIndex: 'processDefinationThreeName',
                        minWidth: 200,
                        align: 'left'
                    }
                ],
                loading: false,
                skeletonLoading: true,
                visibleProjectViewDrawer: false,
                selectedCopyRowKeys: [],
                selectedCopyRows: [],
                selectData: [],
                deptData: [],
                statusData: [],
                value: '',
                name: '',
                sourceTaskBookId: '',
                drawerTitle: '项目信息',
                emData: {},
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                },
                drawerConfig: { /// z-index
                    destroyOnClose: true,
                    modal: false,
                    appendToBody: true,
                    wrapperClosable: true
                },
                searchData: [

                ],
                cutomHeight: 390
            }
        },
        mounted () {
        },
        computed: {},
        methods: {
            handleOk (e) {
                if (this.emData && Object.keys(this.emData).length) {
                    this.$emit(
                        'close',
                        this.emData
                    )
                } else {
                    this.$message({ message: '没有选中的记录', type: 'error' })
                }
            },
            rowClick (row, column, event) {
                this.emData.id = row.id
                this.emData.configName = row.configName
                this.emData.filedId = row.filedId
                this.emData.sourceId = row.sourceId
                this.emData.classifyId = row.classifyId
                this.emData.filedName = row.filedName
                this.emData.sourceName = row.sourceName
                this.emData.classifyName = row.classifyName
            },
            handleCancel (e) {
                this.visible = false
                this.$emit('close', {})
            },
            closeDrawer () {
                this.visibleProjectViewDrawer = false
            },
            copyData (copyData) {
                this.emData = copyData
            },
            isfullscreen (isfullscreen) {
                if (isfullscreen) {
                    this.cutomHeight = document.documentElement.clientHeight - 160
                } else {
                    this.cutomHeight = 390
                }
            },
            currentChange (currentRow, oldCurrentRow) {
                this.selectedRowKeys = []
                this.selectedRowKeys.push(currentRow.id)
                this.sourceTaskBookId = currentRow.id
                this.visibleProjectViewDrawer = true
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
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
                    that.$refs.table.queryList()
                })
            },
            reSet () {
                Object.keys(this.queryParam).forEach(key => {
                    this.queryParam[key] = ''
                })
                Vue.nextTick(function () {
                    this.$refs.table.search()
                })
            }
        },
        watch: {
            sourceTaskBookId: function (val, oldVal) {
                this.$emit('change-task-book-id', val)
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/.formList.el-form > .el-row.formBtn{
        height: 49px;
    }
    /deep/.el-drawer__wrapper{
        border-left:1px solid $base-line-color;
        box-shadow: -2px 0 5px $base-line-color;
    }
</style>
