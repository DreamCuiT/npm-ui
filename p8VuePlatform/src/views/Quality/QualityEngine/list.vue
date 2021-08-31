<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData"
                              @search="search"></search-form-list>
        </template>
        <template #center>
            <common-table ref="table" :comp="comp" :columns="columns" :params="queryParam"
                          :api="tableApi" :table-Refresh="tableRefresh" :pagination="true">
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer :title="drawerTitle"
                           :visible="drawerVisible"
                           size="100%"
                           @close="onDrawerClose">
                <template #drawer>
                    <engine-edit @saveSuccess="saveCallback" :record="record"></engine-edit>
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
    import EngineEdit from './edit'

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
                    title: '填卡单位',
                    dataIndex: 'fillingCardUnitName',
                    formatter: function (row) {
                        if (row.pfillingCardUnitName) {
                            return row.pfillingCardUnitName + '-' + row.fillingCardUnitName
                        } else {
                            return row.fillingCardUnitName
                        }
                    },
                    minWidth: 180,
                    align: 'center'
                },
                {
                    title: '采集卡号',
                    dataIndex: 'acquisitionCard',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '是否返回做修改',
                    dataIndex: 'isReturnData',
                    width: 130,
                    align: 'center'
                },
                {
                    title: '填报日期',
                    dataIndex: 'fillingDate',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '发动机名称',
                    dataIndex: 'engineName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '发动机代号',
                    dataIndex: 'engineCodeName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '发动机图号',
                    dataIndex: 'engineDrawingNumber',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '发动机批次',
                    dataIndex: 'engineBatch',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '发动机编号',
                    dataIndex: 'engineCode',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '型号',
                    dataIndex: 'modelName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '型号批次',
                    dataIndex: 'modelBatch',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '试车代号',
                    dataIndex: 'trialCodeName',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '试车状态',
                    dataIndex: 'trialStatus',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '试车地点',
                    dataIndex: 'trialPlace',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '试车台载',
                    dataIndex: 'trialBenchLoad',
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
                tableApi: 'engine.list',
                queryParam: {
                    modelBatch: ''
                },
                searchData: [
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
                        defaultValue: [],
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
                console.log(param)
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
                Object.keys(that.queryParam).forEach(key => {
                    that.queryParam[key] = ''
                })
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            createEngine (type) {
                this.drawerTitle = '新建发动机实验'
                this.drawerVisible = true
                this.record = {}
            },
            updateEngine (record) {
                this.drawerTitle = '修改发动机实验'
                this.drawerVisible = true
                this.record = record
            },
            removeEngine (record) {
                let that = this
                this.$confirm('是否确定要删除该发动机实验？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    that.$api['engine.remove']({ id: record.id }).then(res => {
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
                this.$api['engine.exportExcel'](this.queryParam, { responseType: 'blob' }).then(function (data) {
                    let date = new Date()
                    // eslint-disable-next-line camelcase
                    let file_name = '发动机试验数据导出' + date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate()
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
            },
            startDownload () {
                console.log('开始下载-showLoading')
            },
            finishDownload () {
                console.log('下载完成-hideLoading')
            }
        },
        components: {
            ListLayout,
            CommonTable,
            CommonDrawer,
            CommonButton,
            SearchFormList,
            EngineEdit
        }
    }
</script>

<style scoped>

</style>
