<template>
    <normal-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData"
                              @search="search"></search-form-list>
        </template>
        <template #west>
            <common-tree :tree-api="treeApi" @select="onSelect"></common-tree>
        </template>
        <template #center>
            <div id="table-contain">
                <common-table ref="table" :comp="comp" :columns="columns" :params="queryParam"
                              :api="tableApi" :table-Refresh="tableRefresh" :pagination="true"
                              :tree="treeParams" @row-click='rowClick' :table-config='tableConfig'>
                </common-table>
            </div>
        </template>
        <template #drawer-panel>
            <common-drawer :title="drawerTitle"
                           :visible="drawerVisible"
                           size="50%"
                           @close="onDrawerClose">
                <template #drawer>
                    <edit @saveSuccess="saveCallback" :record="record"></edit>
                </template>
            </common-drawer>
            <common-drawer :title="drawerTitle"
                           :visible="uploadOpeningVisible"
                           size="50%"
                           @close="onDrawerClose">
                <template #drawer>
                    <report-edit @saveSuccess="saveCallback" :reportType="reportType" :record="record"></report-edit>
                </template>
            </common-drawer>
            <common-drawer :title="drawerTitle"
                           :visible="uploadFinalVisible"
                           size="50%"
                           @close="onDrawerClose">
                <template #drawer>
                    <report-edit @saveSuccess="saveCallback" :reportType="reportType" :record="record"></report-edit>
                </template>
            </common-drawer>
        </template>
    </normal-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8NormalLayout as NormalLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Tree as CommonTree } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import Edit from './edit'
    import reportEdit from './reportEdit'

    export default {
        name: 'list',
        data () {
            const columns = [
                {
                    title: '序号',
                    type: 'index',
                    width: 45,
                    align: 'center'
                },
                {
                    title: '单据编号',
                    dataIndex: 'documentNo',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '单位',
                    dataIndex: 'unit',
                    formatter: function (row) {
                        if (row.punitName) {
                            return row.punitName + '-' + row.unitName
                        } else {
                            return row.unitName
                        }
                    },
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '级别',
                    dataIndex: 'projectLevel',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '项目名称',
                    dataIndex: 'wholeDescribeName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '项目类别',
                    dataIndex: 'wholeDescribeType',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '项目负责人',
                    dataIndex: 'wholeDescribeResponsibler',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '研究内容',
                    dataIndex: 'researchContents',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '完成形式',
                    dataIndex: 'completeForm',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '院拨经费',
                    dataIndex: 'yardFunds',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '自筹经费',
                    dataIndex: 'raiseIndependentlyFunds',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '总经费',
                    dataIndex: 'totalFunds',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '项目完成日期',
                    dataIndex: 'completionDate',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '申请说明',
                    dataIndex: 'applicationDescription',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '开题报告',
                    dataIndex: 'openingReportName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '结题报告',
                    dataIndex: 'finalReportName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    scopedSlots: { customRender: 'operation' },
                    width: 120,
                    align: 'center'
                }
            ]
            return {
                tableConfig: {
                    highlightCurrentRow: true
                },
                columns: columns,
                treeApi: 'QualityEvaluation.deptTree',
                treeParams: {},
                tableApi: 'QualityProject.list',
                queryParam: {},
                searchData: [
                    {
                        type: 'text', // 控件类型
                        labelText: '单据编号', // 控件显示的文本
                        fieldName: 'documentNo',
                        placeholder: '请输入单据编号'
                    },
                    {
                        type: 'treeSelect', // 控件类型
                        defaultValue: '',
                        defaultExpandAll: true,
                        labelText: '单位', // 控件显示的文本
                        fieldName: 'unit',
                        placeholder: '请选择单位',
                        optionUrl: {
                            api: 'userManager.deptTree'
                        }
                    },
                    {
                        type: 'text', // 控件类型
                        labelText: '项目名称', // 控件显示的文本
                        fieldName: 'wholeDescribeName',
                        placeholder: '请输入项目名称'
                    },
                    {
                        type: 'select', // 控件类型
                        labelText: '级别', // 控件显示的文本
                        fieldName: 'projectLevels',
                        placeholder: '请输入级别',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'QUALITY_PROJECT_LEVEL' },
                            label: 'label',
                            value: 'label'
                        },
                        fieldConfig: {
                            multiple: true
                        }
                    },
                    {
                        type: 'text', // 控件类型
                        labelText: '审批人', // 控件显示的文本
                        fieldName: 'approver',
                        placeholder: '请输入审批人'
                    }
                ],
                comp: this,
                drawerTitle: null,
                drawerVisible: false,
                uploadOpeningVisible: false,
                uploadFinalVisible: false,
                record: {},
                reportType: ''
            }
        },
        methods: {
            rowClick (row) {
                this.record = row
            },
            onSelect (node) {
                this.queryParam.reportUnit = node.id
                this.$refs.table.searchData()
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            search (param) {
                if (param) {
                    this.queryParam = param
                    if (this.queryParam.unit != null) {
                        if (this.queryParam.unit.length === 0) {
                            this.queryParam.unit = ''
                        }
                    }
                }
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            createProject () {
                this.drawerTitle = '新建质量项目管理'
                this.drawerVisible = true
                this.record = {}
            },
            updateProject (record) {
                this.drawerTitle = '修改质量项目管理'
                this.drawerVisible = true
                this.record = record
            },
            removeProject (record) {
                let that = this
                this.$confirm('是否确定要删除该质量项目管理？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    that.$api['QualityProject.remove']({ id: record.id }).then(res => {
                        if (res && res.data) {
                            that.$message({
                                message: res.data.resultMsg,
                                type: 'warning'
                            })
                        } else {
                            that.$refs.table.searchData()
                        }
                    })
                }).catch(() => {
                    console.log('取消')
                })
            },
            uploadOpeningReport () {
                if (this.record.id) {
                    this.drawerTitle = '上传开题报告'
                    this.uploadOpeningVisible = true
                    this.reportType = 'openingReport'
                } else {
                    this.$alert('未选择质量项目，不可执行此操作', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    })
                }
            },
            uploadFinalReport () {
                if (this.record.id) {
                    this.drawerTitle = '上传结题报告'
                    this.uploadFinalVisible = true
                    this.reportType = 'finalReportName'
                } else {
                    this.$alert('未选择质量项目，不可执行此操作', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    })
                }
            },
            onDrawerClose () { // 抽屉关闭
                this.drawerVisible = false
                this.uploadOpeningVisible = false
                this.uploadFinalVisible = false
                // this.record = {}
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.onDrawerClose()
            }
        },
        components: {
            NormalLayout,
            CommonTable,
            CommonDrawer,
            CommonButton,
            SearchFormList,
            CommonTree,
            Edit,
            reportEdit
        }
    }
</script>

<style scoped>
</style>
