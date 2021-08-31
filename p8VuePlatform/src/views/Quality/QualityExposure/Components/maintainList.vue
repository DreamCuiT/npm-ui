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
            <exposure-view v-if='visibleExposureView'
                           :visible="visibleExposureView"
                           :record='record'
                           @close-modal="ExposureViewClose"></exposure-view>
            <Exposure-edit v-if="exposureEditVisible"
                           :visible="exposureEditVisible"
                           @close-modal="ExposureViewClose"
                           @saveSuccess="saveCallback"
                           :title="drawerTitle"
                           :record="record"></Exposure-edit>
            <Exposure-import v-if="exposureImportVisible"
                             :visible="exposureImportVisible"
                             :title="drawerTitle"
                             @close-modal="ExposureViewClose"
                             @saveSuccess="saveCallback"></Exposure-import>
        </template>
        <div>
            <common-drawer v-if="drawerVisible2"
                           :title="drawerTitle"
                           :visible="drawerVisible2"
                           :drawerConfig="drawerConfig"
                           size="70%"
                           @close="onDrawerClose">
                <template #drawer>

                </template>
            </common-drawer>
        </div>
    </list-layout>
</template>

<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import exposureView from './exposureView'
    import ExposureImport from './exposureImport'
    import ExposureEdit from '@/views/Quality/QualityExposure/edit'
    export default {
        name: 'list',
        components: {
            ListLayout,
            CommonTable,
            CommonButton,
            SearchFormList,
            CommonDrawer,
            exposureView,
            ExposureImport,
            ExposureEdit
        },
        data () {
            const columns = [
                {
                    title: '序号',
                    type: 'index',
                    align: 'center'
                },
                {
                    title: '飞行试验名称',
                    dataIndex: 'testName',
                    align: 'left'
                },
                {
                    title: '填报单位',
                    dataIndex: 'fillingUnitName',
                    align: 'center'
                },
                {
                    title: '填报人',
                    dataIndex: 'filler',
                    align: 'center'
                },
                {
                    title: '填报日期',
                    dataIndex: 'fillingDate',
                    align: 'center'
                },
                {
                    title: '具体情况分析',
                    dataIndex: 'flightMatter',
                    align: 'left'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    scopedSlots: { customRender: 'operation' },
                    width: 120,
                    align: 'center'
                }
            ]
            const searchData = [
                {
                    type: 'text', // 控件类型
                    labelText: '飞行试验', // 控件显示的文本
                    fieldName: 'flightTestId',
                    placeholder: '请输入飞行试验'
                }
            ]
            return {
                tableApi: 'qualityExposure.list',
                columns: columns,
                searchData,
                queryParam: {},
                comp: this,
                record: {},
                drawerTitle: '',
                visibleExposureView: false,
                visibleDialog: false,
                exposureEditVisible: false,
                drawerVisible2: false,
                exposureImportVisible: false,
                drawerConfig: { /// z-index
                    destroyOnClose: true,
                    modal: false,
                    appendToBody: true,
                    wrapperClosable: true
                }
            }
        },
        methods: {
            search (params) {
                this.queryParam = params
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            createExposure () {
                this.drawerTitle = '新建信息'
                this.exposureEditVisible = true
                this.record = {}
            },
            updateExposure (record) {
                this.drawerTitle = '修改信息'
                this.exposureEditVisible = true
                this.record = { record }
            },
            getExposure (record) {
                this.visibleExposureView = true
                this.visibleDialog = true
                this.record = { record }
            },
            importExposure () {
                this.drawerTitle = '导入信息'
                this.exposureImportVisible = true
            },
            removeExposure (record) {
                console.log(record, '=======')
                let that = this
                that.$confirm(`是否要删除该计划？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let type = 'success'
                    let msg = '删除成功！'
                    that.$api['qualityExposure.remove']({ id: record.id }).then(res => {
                        if (res && res.data) {
                            that.$message({
                                message: res.data.resultMsg,
                                type: 'warning'
                            })
                        } else {
                            that.$refs.table.searchData()
                        }
                    }).catch(function (error) {
                        type = 'error'
                        msg = '删除失败！'
                        console.log(error, 'error')
                    })
                    this.$message(
                        {
                            message: msg,
                            type: type
                        }
                    )
                }).catch(() => { })
            },
            onDrawerClose () {
                this.visibleDialog = false
                this.drawerVisible2 = false
                this.exposureEditVisible = false
                this.exposureImportVisible = false
                this.record = {}
            },
            ExposureViewClose () {
                this.visibleExposureView = false
                this.exposureEditVisible = false
                this.exposureImportVisible = false
                this.visibleDialog = false
                this.record = {}
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.onDrawerClose()
            }
        }
    }
</script>
