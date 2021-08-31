<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
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
                           :drawerConfig='drawerConfig'
                           @close="onDrawerClose">
                <template #drawer>
                    <edit @saveSuccess="saveCallback" :record="record"></edit>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>
<script>
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import Edit from './edit'

    export default {
        name: 'list',
        props: {
            thirdMenuParam: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data () {
            const columns = [
                {
                    title: '序号',
                    type: 'index',
                    width: 45,
                    align: 'center'
                },
                {
                    title: '接待时间',
                    dataIndex: 'receptionTime',
                    align: 'center'
                },
                {
                    title: '接待地点',
                    dataIndex: 'receptionLocation',
                    align: 'center'
                },
                {
                    title: '接待原由',
                    dataIndex: 'receptionReason',
                    minWidth: 400,
                    align: 'left'
                },
                {
                    title: '项目',
                    dataIndex: 'wholeDescribeName',
                    minWidth: 400,
                    align: 'left'
                },
                {
                    title: '是否来过本单位',
                    dataIndex: 'isToCompany',
                    align: 'center'
                },
                {
                    title: '与领导是否相熟',
                    dataIndex: 'isFamiliarLeader',
                    align: 'center'
                },
                {
                    title: '行程（接待活动）',
                    dataIndex: 'trip',
                    align: 'center'
                },
                {
                    title: '主对象',
                    dataIndex: 'mainObject',
                    align: 'center'
                },
                {
                    title: '活动参与院领导',
                    dataIndex: 'leadersOfActivity',
                    align: 'center'
                },
                {
                    title: '其他参与人员',
                    dataIndex: 'otherParticipants',
                    align: 'center'
                },
                {
                    title: '接待总结',
                    dataIndex: 'receptionSummary',
                    align: 'center'
                },
                {
                    title: '后续工作',
                    dataIndex: 'followUpWork',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 100,
                    scopedSlots: { customRender: 'operation' }
                }
            ]
            return {
                columns: columns,
                tableApi: 'importantReception.getInfoList',
                queryParam: {
                    month: this.thirdMenuParam.month
                },
                drawerTitle: null,
                drawerVisible: false,
                record: {},
                drawerConfig: {
                    modal: false
                },
                comp: this
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
            editCommunication (record) {
                this.drawerTitle = '修改重大接待'
                this.drawerVisible = true
                this.record = record
            },
            removeCommunication (record) {
                let that = this
                this.$confirm('是否确定要删除？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    that.$api['importantReception.remove']({ id: record.id }).then(res => {
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
            Edit,
            CommonButton
        }
    }
</script>

<style lang="scss">
    .el-header{
        height: 0;
    }
    .menuLayout.el-container .el-header {
         height: 0 !important;
         padding: 0;
     }
</style>
