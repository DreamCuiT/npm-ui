<template>
    <common-dialog title='项目选择'
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
<!--                    <el-button type="primary"-->
<!--                               @click="submit">确 定-->
<!--                    </el-button>-->
                    <search-form-list ref="search"
                                      :dataSource="searchData"
                                      @search="search"
                                      @re-set="reSet"></search-form-list>
                </template>
                <template #center>
                    <common-table ref='tableCom'
                                  :style="{height: dialogHeight - 120 + 'px'}"
                                  :columns='columns'
                                  :params='queryParam'
                                  :flex='500'
                                  :api='tableApi'
                                  :table-Refresh='tableRefresh'
                                  :tableConfig='tableConfig'
                                  @select-all="selectAll"
                                  @row-click="rowClick"
                                  @select="select"
                                  @row-dblclick='rowDblclick'></common-table>
                </template>
            </list-layout>
        </template>
    </common-dialog>
</template>
<script>
    import { P8Table as CommonTable } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'
    import { P8ListLayout as ListLayout } from '~/index'
    import { Button } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import { getTableHeightInDialog } from '@/utils/common'
    import Vue from 'vue'

    const columns = [
        // {
        //   type: 'selection',
        //   width: 45,
        //   align: 'center'
        // },
        {
            title: '序号',
            type: 'index',
            width: 55,
            align: 'center'
        },
        // {
        //     title: '项目编码',
        //     dataIndex: 'pjCode',
        //     width: 180,
        //     align: 'center'
        // },
        {
            title: '项目名称',
            dataIndex: 'name',
            minWidth: 300,
            align: 'left'
        },
        {
            title: '型号代号',
                width: 130,
                dataIndex: 'modelCode',
                align: 'center',
        },
        {
            title: '项目类型',
            dataIndex: 'kprojectClassifyname',
            width: 120,
            align: 'center'
        }

        // {
        //     title: '项目分级',
        //     dataIndex: 'projectOrderDisplay',
        //     width: 120,
        //     align: 'center'
        // }
        // ,
        // {
        //   title: '管理部门',
        //   dataIndex: 'departmentName',
        //   width: 180,
        //   align: 'center'
        // }
    ]
    const searchData = [
        // {
        //   type: 'treeSelect',
        //   labelText: '管理部门',
        //   fieldName: 'deptId',
        //   defaultValue: [],
        //   placeholder: '选择管理部门',
        //   optionUrl: {
        //     api: 'ProjectApply.deptTree',
        //     params: {}
        //   },
        //   treeData: []
        // },
        {
            type: 'text', // 控件类型
            labelText: '项目名称', // 控件显示的文本
            fieldName: 'productName',
            placeholder: '请输入项目名称'
        },
        // {
        //     type: 'text', // 控件类型
        //     labelText: '项目编码', // 控件显示的文本
        //     fieldName: 'pjCode',
        //     placeholder: '请输入项目编码', // 默认控件的空值文本
        //     fieldEvent: {
        //         click: 'clickEvent(this)'
        //     }
        // },
        {
            type: 'multiple',
            labelText: '所属型号',
            fieldName: 'modelCode',
            placeholder: '选择所属型号',
            optionUrl: {
            api: 'ProjectApply.getModelListData',
            label: 'modelCode',
            value: 'id',
            params: {}
            },
            treeData: [],
            defaultValues: []
        },
        {
            type: 'treeSelect',
            labelText: '项目类型',
            fieldName: 'kprojectClassifyId',
            placeholder: '请输入项目类型',
            multiple: true,
            optionUrl: {
                api: 'ProjectApply.projectClassifyTree',
                params: {},
                // label: 'name',
                value: 'id'
            },
            treeData: []
        }
        // {
        //     type: 'select', // 控件类型
        //     optionUrl: {
        //         api: 'thirdPartInterface.getDic',
        //         params: { dicType: 'PROJECT_ORDER' }
        //     },
        //     options: [],
        //     labelText: '项目分级', // 控件显示的文本
        //     fieldName: 'projectOrderId',
        //     placeholder: '请输入项目分级'
        // }
    ]

    export default {
        name: 'SelectProject',
        props: {
            createPlanInfo: {
                type: String,
                default: ''
            },
            selectedRow: {
                type: Object,
                default: () => {}
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        components: {
            CommonDialog,
            CommonTable,
            SearchFormList,
            ListLayout,
            // eslint-disable-next-line vue/no-unused-components
            'el-button': Button
        },
        data () {
            return {
                dialogHeight: getTableHeightInDialog(),
                dialogConfig: {
                    beforeClose: this.handleCancel,
                    destroyOnClose: 'true',
                    modal: false
                },
                tableConfig: {
                    highlightCurrentRow: true,
                    showOverflowTooltip: true
                },
                currentRow: {},
                queryParam: { createPlanInfo: this.createPlanInfo },
                searchData: searchData,
                tableApi: 'planInfoManager.getWholeDescribePage',
                columns: columns
            }
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
                this.submit()
            },
            handleCancel (e) {
                this.$emit('close-modal')
            },
            selectAll () {
                this.$refs.tableCom.$refs.table.clearSelection()
            },
            // 单击选中行
            rowClick (row, column, event) {
                // this.$refs.tableCom.$refs.table.clearSelection()
                // this.$refs.tableCom.$refs.table.setCurrentRow(row)
                // this.$refs.tableCom.$refs.table.toggleRowSelection(row, true)
                this.currentRow = row
            },
            // 勾选复选框选中行
            select (selection, row) {
                this.$refs.tableCom.$refs.table.clearSelection()
                this.$refs.tableCom.$refs.table.toggleRowSelection(row)
                this.currentRow = row
            },
            // 双击行，直接关闭抽屉、回填值
            rowDblclick (row, column, event) {
                // this.$refs.tableCom.$refs.table.clearSelection()
                // this.$refs.tableCom.$refs.table.toggleRowSelection(row)
                this.currentRow = row
                this.submit()
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
                    createPlanInfo: this.createPlanInfo,
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
                this.queryParam.createPlanInfo = this.createPlanInfo
                 this.queryParam.modelCode = []
                 this.queryParam.kprojectClassifyId = []
                Vue.nextTick(function () {
                    this.$refs.tableCom.searchData()
                })
            }
        }
    }
</script>
