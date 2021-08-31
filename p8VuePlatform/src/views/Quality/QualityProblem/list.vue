<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
        </template>
        <template #center>
            <common-table ref="table" :comp="comp" :columns="columns" :params="queryParam"
                          :api="tableApi" :table-Refresh="tableRefresh" :pagination="true">
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="visibleProblemEditDrawer" :title="drawerTitle"
                           :visible="visibleProblemEditDrawer"
                           size="70%"
                           @close="onProblemDrawerClose">
                <template #drawer>
                    <problem-edit @saveSuccess="saveCallback" :record="record"></problem-edit>
                </template>
            </common-drawer>
            <common-drawer v-if="visibleTozeroEditDrawer" :title="drawerTitle"
                           :visible="visibleTozeroEditDrawer"
                           size="70%"
                           @close="onTozeroDrawerClose">
                <template #drawer>
                    <tozero-edit @saveSuccess="onTozeroDrawerClose" :problemId="problemId"></tozero-edit>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import ProblemEdit from './edit'

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
                    title: '问题名称',
                    dataIndex: 'productName',
                    minWidth: 200,
                    align: 'left'
                },
                {
                    title: '所属领域',
                    dataIndex: 'modelClassifyDisplay',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '型号名称',
                    dataIndex: 'modelName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '发生日期',
                    dataIndex: 'detectedDate',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '发生阶段',
                    dataIndex: 'happenPhase',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '设计单位',
                    dataIndex: 'designUnit',
                    formatter: function (row) {
                        if (row.pdesignUnitName) {
                            return row.pdesignUnitName + '-' + row.designUnitName
                        } else {
                            return row.designUnitName
                        }
                    },
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '责任单位',
                    dataIndex: 'productionUnit',
                    formatter: function (row) {
                        if (row.pproductionUnitName) {
                            return row.pproductionUnitName + '-' + row.productionUnitName
                        } else {
                            return row.productionUnitName
                        }
                    },
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '快报编号',
                    dataIndex: 'productNum',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '快报上传',
                    dataIndex: 'modelBatch',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '归零状态',
                    dataIndex: 'tozeroStatus',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '最后修改',
                    dataIndex: 'lastRevision',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '归零进展',
                    dataIndex: 'tozeroProgress',
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
                columns: columns,
                tableApi: 'quality.list',
                queryParam: {
                    productName: ''
                },
                searchData: [
                    {
                        type: 'text', // 控件类型
                        labelText: '质量问题信息', // 控件显示的文本
                        fieldName: 'productName',
                        placeholder: '请输入质量问题名称', // 默认控件的空值文本
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    },
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
                        type: 'treeSelect', // 控件类型
                        defaultValue: [],
                        labelText: '设计单位', // 控件显示的文本
                        fieldName: 'designUnit',
                        placeholder: '请选择设计单位',
                        disabledValues: ['1'],
                        defaultExpandedKeys: ['1'],
                        optionUrl: {
                            api: 'userManager.deptTree'
                        },
                        fieldConfig: {
                            multiple: true
                        }
                    },
                    {
                        type: 'select', // 控件类型
                        labelText: '研制阶段', // 控件显示的文本
                        fieldName: 'developmentStages',
                        placeholder: '请输入发生阶段',
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
                        labelText: '快报编号', // 控件显示的文本
                        fieldName: 'productNum',
                        placeholder: '请输入快报编号', // 默认控件的空值文本
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    },
                    {
                        type: 'datetime', // 控件类型
                        labelText: '发生日期', // 控件显示的文本
                        fieldName: 'detectedDate',
                        placeholder: '请输入发生日期', // 默认控件的空值文本
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        },
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    }
                ],
                comp: this,
                drawerTitle: null,
                visibleProblemEditDrawer: false,
                visibleTozeroEditDrawer: false,
                record: {},
                problemId: ''
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
            search (param) {
                if (param) {
                    this.queryParam = param
                }
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reSet () {
                let that = this
                Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            createProblem () {
                this.drawerTitle = '新建质量问题快报'
                this.visibleProblemEditDrawer = true
                this.record = {}
            },
            updateProblem (record) {
                this.drawerTitle = '修改质量问题快报'
                this.visibleProblemEditDrawer = true
                this.record = record
            },
            tozero (record) {
                let that = this
                that.$api['tozero.save']({ qualityProblemName: record.productName,
                    qualityProblemBulletin: record.productCode }).then(res => {
                    if (res && res.data) {
                        that.$message({
                            message: res.data.resultMsg,
                            type: 'warning'
                        })
                    } else {
                        this.$router.push({ path: 'QualityTozero' })
                    }
                })
            },
            removeProblem (record) {
                let that = this
                this.$confirm('是否确定要删除该质量问题快报？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    that.$api['quality.remove']({ id: record.id }).then(res => {
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
            exportExcel () {
                this.$api['quality.exportExcel'](this.queryParam, { responseType: 'blob' }).then(function (data) {
                    let date = new Date()
                    // eslint-disable-next-line camelcase
                    let file_name = '质量问题快报数据导出' + date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate()
                    // eslint-disable-next-line camelcase
                    let file_type = 'xls'
                    let blob = new Blob([data.data], { type: 'application/vnd.ms-excel' })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    // eslint-disable-next-line camelcase
                    link.download = `${file_name}.${file_type}`
                    document.body.appendChild(link)
                    link.click()
                }).catch((error) => {
                    console.log(error)
                })
            },
            onProblemDrawerClose () { // 抽屉关闭
                this.visibleProblemEditDrawer = false
                this.record = {}
            },
            onTozeroDrawerClose () { // 抽屉关闭
                this.visibleTozeroEditDrawer = false
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.onProblemDrawerClose()
            }
        },
        components: {
            ListLayout,
            CommonTable,
            CommonDrawer,
            CommonButton,
            SearchFormList,
            ProblemEdit
        }
    }
</script>

<style scoped>

</style>
