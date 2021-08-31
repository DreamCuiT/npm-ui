<template>
    <list-layout>
        <template #north >
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
                              :pagination=true
                >
                </common-table>
            </div>
        </template>
    </list-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'

    const columns = [
        {
            title: '序号',
            type: 'index'
        },
        {
            title: '审批节点',
            dataIndex: 'processTaskName'
        },
        {
            title: '审批结果',
            dataIndex: 'yesOrNo'
        },
        {
            title: '审批意见',
            dataIndex: 'opinion'
        },
        {
            title: '审批人',
            dataIndex: 'approveUser'
        },
        {
            title: '审批时间',
            dataIndex: 'approvalTime'
        }
    ]
    export default {
        name: 'infoVOList',
        components: {
            CommonTable,
            ListLayout
        },
        data () {
            return {
                comp: this,
                menuStateObj: [],
                thirdMenuParam: {},
                thirdMenuTitle: '',
                defaultMenu: {},
                queryParam: {
                   processInstId: this.processInstId
                },
                drawerConfig: {
                    'modal': false
                },
                drawerTitle: '',
                tableApi: 'PersonalProcessApproval.approvalHistoryList',
                columns: columns,
                searchData: [
                ]
            }
        },
        computed: {
        },
        props: {
            processInstId: {
                type: String
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
                let newParams = { ...param }
                this.queryParam = newParams
                let that = this
                console.log(this.queryParam, 'queryParam')
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
            saveCallback (res) {
                this.$refs.table.searchData()
            }
        }

    }
</script>
<style>
</style>
