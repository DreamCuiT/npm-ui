<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
<!--            <search-form-list ref="search"-->
<!--                              :dataSource='searchData'-->
<!--                              @search='search'-->
<!--                              @re-set='reSet'></search-form-list>-->
        </template>
        <template #center>
            <div id="table-contain">
                <common-table ref="table"
                              :fiex="200"
                              :columns="columns"
                              :table-Refresh="tableRefresh"
                              :params="queryParam"
                              :api="tableApi"
                              :comp="comp"
                              :pagination=true>
                </common-table>
            </div>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="createMenu"
                           size="50%"
                           :visible='createMenu'
                           :title="drawerTitle"
                           @close="createClose">
                <template #drawer>
                    <create-risk-base @save-success="saveCallback"
                                      :configId="configId"></create-risk-base>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import CreateRiskBase from './Components/create'

    const columns = [
        {
            title: '序号',
            type: 'index',
            width: 55,
            align: 'center'
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
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            width: 120,
            align: 'center'
        }
    ]
    export default {
        name: 'configList',
        components: {
            CommonButton,
            CreateRiskBase,
            CommonTable,
            CommonDrawer,
            ListLayout
        },
        data () {
            return {
                comp: this,
                menuStateObj: [],
                thirdMenuParam: {},
                thirdMenuTitle: '',
                defaultMenu: {},
                queryParam: {},
                createMenu: false,
                viewRiskBase: false,
                drawerTitle: '',
                configId: '',
                tableApi: 'emConfig.list',
                columns: columns,
                searchData: [
                ]
            }
        },
        computed: {

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
                let newParams = { ...param }
                this.queryParam = newParams
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
            createClose () {
                this.createMenu = false
                this.viewRiskBase = false
            },
            saveCallback (res) {
                this.createMenu = false
                this.$refs.table.searchData()
            },
            addConfig (record) {
                this.configId = record.id
                this.drawerTitle = '新建项目决策配置'
                this.createMenu = true
            },
            modifyConfig (record) {
                this.configId = record.id
                this.drawerTitle = '修改项目决策配置'
                this.createMenu = true
            },
            delConfig (record) {
                let that = this
                that.$confirm(`是否要删除该计划？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$api['emConfig.deleteById']({ id: record.id }).then(res => {
                        if (res === 'false') {
                            that.showMessage('无法删除！', 'warning')
                        } else if (res === 'occupy') {
                            that.showMessage('已被占用，无法删除！', 'warning')
                        } else {
                            that.showMessage('删除成功！', 'success')
                        }
                        that.$refs.table.searchData()
                    }).catch(function (error) {
                        console.log(error, 'error')
                    })
                }).catch(() => { })
            },
            showMessage (msg, type) {
                this.$message(
                    {
                        message: msg,
                        type: type
                    }
                )
            }
        }

    }
</script>
