<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
        </template>
        <template #center>
            <common-table ref="table" :comp="comp" :columns="columns" :params="queryParam"
                          :api="tableApi" :table-Refresh="tableRefresh" :pagination="true"
                          @row-click="tempRowClick"
                          @open-third-menu="openThirdMenu">
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer :title="drawerTitle"
                           :visible="drawerVisible"
                           size="70%"
                           @close="onDrawerClose">
                <template #drawer>
                    <edit @saveSuccess="saveCallback" :record="record"></edit>
                </template>
            </common-drawer>
            <common-drawer
                    v-if="visibleResourcesDrawer"
                    :visible="visibleResourcesDrawer"
                    :title="drawerTitle"
                    placement="top"
                    direction="ttb"
                    size="100%"
                    @close="onEditResourcesClose"
            >
                <template #drawer>
                    <menu-layout :third-menu-param='thirdMenuParam'
                                 :default-menu="defaultMenu"></menu-layout>
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
    import { P8MenuLayout as MenuLayout } from '~/index'
    import Edit from './edit'

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
                    title: '#',
                    type: 'index',
                    dataIndex: 'thirdMenu',
                    scopedSlots: { customRender: 'thirdMenu' },
                    width: 45,
                    align: 'center'
                },
                {
                    title: '主对象',
                    dataIndex: 'mainObject',
                    width: 700,
                    align: 'center'
                },
                {
                    title: '月份',
                    dataIndex: 'month',
                    width: 460,
                    align: 'center'
                },
                {
                    title: '次数',
                    dataIndex: 'count',
                    width: 460,
                    align: 'center'
                }
            ]
            return {
                columns: columns,
                tableApi: 'importantReception.list',
                queryParam: {},
                searchData: [
                    {
                        type: 'datetimeRange',
                        labelText: '创建日期',
                        fieldName: 'receptionTime',
                        placeholder: ['开始日期', '结束日期'],
                        fieldConfig: {
                            format: 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'text', // 控件类型
                        labelText: '主对象名称', // 控件显示的文本
                        fieldName: 'mainObject',
                        placeholder: '请输入主对象名称', // 默认控件的空值文本
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    }
                ],
                comp: this,
                drawerTitle: null,
                drawerVisible: false,
                record: {},
                visibleResourcesDrawer: false,
                defaultMenu: {},
                thirdMenuParam: {}
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
                    if (param.receptionTime && param.receptionTime.length === 2) {
                        param.fromDate = param.receptionTime[0]
                        param.toDate = param.receptionTime[1]
                    }
                    this.queryParam = param
                }
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reSet () {
                let that = this
                Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = null })
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            createCommunication () {
                this.drawerTitle = '新建重大接待'
                this.drawerVisible = true
                this.record = {}
            },
            onDrawerClose () { // 抽屉关闭
                this.drawerVisible = false
                this.record = {}
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.onDrawerClose()
            },
            tempRowClick (record) {
                this.drawerTitle = '查看'
                this.thirdMenuParam = record
                this.visibleResourcesDrawer = true
            },
            openThirdMenu (record, item) {
                this.drawerTitle = '查看'
                this.visibleResourcesDrawer = true
                this.defaultMenu = item
                this.thirdMenuParam = record
            },
            onEditResourcesClose () {
                this.visibleResourcesDrawer = false
            }
        },
        components: {
            ListLayout,
            MenuLayout,
            CommonTable,
            CommonDrawer,
            CommonButton,
            SearchFormList,
            Edit
        }
    }
</script>

<style scoped>

</style>
