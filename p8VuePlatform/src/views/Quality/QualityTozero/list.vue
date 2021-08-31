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
            <common-drawer :title="drawerTitle"
                           :visible="drawerVisible"
                           size="70%"
                           @close="onDrawerClose">
                <template #drawer>
                    <tozero-edit @saveSuccess="saveCallback" :record="record"></tozero-edit>
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
    import TozeroEdit from './edit'

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
                    title: '问题名称',
                    dataIndex: 'qualityProblemName',
                    minWidth: 250,
                    align: 'left'
                },
                {
                    title: '发生日期',
                    dataIndex: 'discoveryDate',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '归零日期',
                    dataIndex: 'questionProductionDate',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '发生阶段',
                    dataIndex: 'questionDevelopmentStage',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '责任单位',
                    dataIndex: 'responsibleUnit',
                    formatter: function (row) {
                        if (row.presponsibleUnitName) {
                            return row.presponsibleUnitName + '-' + row.responsibleUnitName
                        } else {
                            return row.responsibleUnitName
                        }
                    },
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '快报编号',
                    dataIndex: 'qualityProblemBulletin',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '填报单位',
                    dataIndex: 'cardFillingUnit',
                    formatter: function (row) {
                        if (row.pcardFillingUnitName) {
                            return row.pcardFillingUnitName + '-' + row.cardFillingUnitName
                        } else {
                            return row.cardFillingUnitName
                        }
                    },
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '最后修改',
                    dataIndex: 'discoveryDate',
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
                tableApi: 'tozero.list',
                queryParam: {
                    qualityProblemName: ''
                },
                searchData: [
                    {
                        type: 'text', // 控件类型
                        labelText: '质量问题信息', // 控件显示的文本
                        fieldName: 'qualityProblemName',
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
                        labelText: '设计单位', // 控件显示的文本
                        fieldName: 'questionDesignUnit',
                        placeholder: '请选择设计单位', // 默认控件的空值文本
                        disabledValues: ['1'],
                        defaultExpandedKeys: ['1'],
                        optionUrl: {
                            api: 'userManager.deptTree'
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
                        labelText: '快报编号', // 控件显示的文本
                        fieldName: 'qualityProblemBulletin',
                        placeholder: '请输入快报编号', // 默认控件的空值文本
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    }
                ],
                comp: this,
                drawerTitle: null,
                drawerVisible: false,
                record: {}
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
            createTozero (type) {
                this.drawerTitle = '新建质量问题归零'
                this.drawerVisible = true
                this.record = {}
            },
            updateTozero (record) {
                this.drawerTitle = '修改质量问题归零'
                this.drawerVisible = true
                this.record = record
            },
            removeTozero (record) {
                let that = this
                this.$confirm('是否确定要删除该质量问题归零？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    that.$api['tozero.remove']({ id: record.id }).then(res => {
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
                this.$api['tozero.exportExcel'](this.queryParam, { responseType: 'blob' }).then(function (data) {
                    let date = new Date()
                    // eslint-disable-next-line camelcase
                    let file_name = '质量归零数据导出' + date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate()
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
            onDrawerClose () { // 抽屉关闭
                this.drawerVisible = false
                this.record = {}
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.onDrawerClose()
            }
        },
        components: {
            ListLayout,
            CommonTable,
            CommonDrawer,
            CommonButton,
            SearchFormList,
            TozeroEdit
        }
    }
</script>

<style scoped>

</style>
