<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp" :specialRoteName="roteName" :button-config="buttonConfig"></common-button>
        </template>
        <template #center>
            <common-table ref="table"
                          :comp="comp"
                          :table-config="tableConfig"
                          :columns="columns"
                          :api="tableApi"
                          :specialRoteName="roteName"
                          :params="queryParam"
                          :table-Refresh="tableRefresh"
                          :pagination=true
            >
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="visibleEditDrawer" :title="drawerTitle"
                           :visible="visibleEditDrawer" @close="onEditClose">
                <template #drawer>
                    <edit-resource @saveSuccess="saveCallback" :resId="resId"></edit-resource>
                </template>
            </common-drawer>
            <common-drawer v-if="visibleWorkDrawer" :title="drawerTitle"
                           :visible="visibleWorkDrawer" @close="onEditClose">
                <template #drawer>
                    <work-status-edit @saveSuccess="saveCallback" :record="record"></work-status-edit>
                </template>
            </common-drawer>
            <common-drawer v-if="visibleReasonDrawer" :title="drawerTitle"
                           :visible="visibleReasonDrawer" @close="onEditClose">
                <template #drawer>
                    <reason-edit @saveSuccess="saveCallback" :record="record"></reason-edit>
                </template>
            </common-drawer>
            <common-drawer v-if="visibleFaultDrawer" :title="drawerTitle"
                           :visible="visibleFaultDrawer" @close="onEditClose">
                <template #drawer>
                    <fault-edit @saveSuccess="saveCallback" :record="record"></fault-edit>
                </template>
            </common-drawer>
            <common-drawer v-if="visibleMemberDrawer" :title="drawerTitle"
                           :visible="visibleMemberDrawer" @close="onEditClose">
                <template #drawer>
                    <member-info @saveSuccess="saveCallback" :record="record"></member-info>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>

<script>
    import Edit from './edit'
    import WorkStatusEdit from './Compones/edit'
    import ReasonEdit from './Compones/reasonEdit'
    import FaultEdit from './Compones/faultEdit'
    import MemberInfo from './Compones/memberInfo'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'

    let columns = [
        {
            title: '序号',
            type: 'index'
        },
        {
            title: '名称',
            dataIndex: 'name'
        },
        {
            title: '产品队伍描述',
            dataIndex: 'describe'
        },
        {
            title: '创建者',
            dataIndex: 'creater'
        },
        {
            title: '创建单位',
            dataIndex: 'deptName'
        },
        {
            title: '创建日期',
            dataIndex: 'createTime'
        },
        {
            title: '备注',
            dataIndex: 'remark'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' }
        }
    ]

    const columns1 = [
        {
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
        },
        {
            title: '工作状态代号',
            dataIndex: 'workStatusCode',
            align: 'center'
        },
        {
            title: '名称',
            dataIndex: 'workStatus',
            align: 'center'
        },
        {
            title: '工作状态说明',
            dataIndex: 'workStatusExplain',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            width: 150
        }
    ]

    const columns2 = [
        {
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
        },
        {
            title: '公司',
            dataIndex: 'name',
            align: 'center'
        },
        {
            title: '登记日期',
            dataIndex: 'registerTime',
            align: 'center'
        },
        {
            title: '一层原因',
            dataIndex: 'firstReason',
            align: 'center'
        },
        {
            title: '二层原因',
            dataIndex: 'secondReason',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            width: 150
        }
    ]

    const columns3 = [
        {
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
        },
        {
            title: '故障模式编码',
            dataIndex: 'faultCode',
            align: 'center'
        },
        {
            title: '故障模式名称',
            dataIndex: 'faultName',
            align: 'center'
        },
        {
            title: '故障模式说明',
            dataIndex: 'faultExplain',
            align: 'center'
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            width: 150
        }
    ]

    const columns5 = [
        {
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
        },
        {
            title: '名称',
            dataIndex: 'name',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            width: 150
        }
    ]

    export default {
        name: 'PublicResourceList',
        props: {
            type: {// 用于区分共性资源库(1)和共性资源类型(2)
                type: String,
                default: ''
            },
            roteName: {
                type: String
            }
        },
        components: {
            'edit-resource': Edit,
            ListLayout,
            CommonTable,
            CommonButton,
            WorkStatusEdit,
            ReasonEdit,
            FaultEdit,
            MemberInfo,
            CommonDrawer

        },
        data () {
            return {
                headers: {
                    authorization: 'authorization-text'
                },
                comp: this,
                columns: [],
                tableApi: 'baseData.productTeam',
                visibleEditDrawer: false,
                visibleWorkDrawer: false,
                visibleReasonDrawer: false,
                visibleFaultDrawer: false,
                visibleMemberDrawer: false,
                drawerTitle: '',
                resId: '',
                record: {},
                queryParam: {
                    resType: this.type
                },
                tableConfig: {},
                buttonConfig: {
                    icon: 'edit'
                }
            }
        },
        created () {
            this.columnsTriger()
        },
        methods: {
            columnsTriger () {
                if (this.type && this.type === '1') {
                    this.columns = columns
                } else if (this.type === '2') {
                    this.columns = columns1
                    this.tableApi = 'QualityWorkStatus.list'
                } else if (this.type === '3') {
                    this.columns = columns2
                    this.tableApi = 'QualityReason.list'
                } else if (this.type === '4') {
                    this.columns = columns3
                    this.tableApi = 'QualityFaultPattern.list'
                } else if (this.type === '5') {
                    this.columns = columns5
                    this.tableApi = 'QualityMember.parentList'
                }
            },
            createQuality () {
                if (this.type === '1') {
                    this.resId = ''
                    this.drawerTitle = '新建'
                    this.visibleEditDrawer = true
                } else if (this.type === '2') {
                    this.record = {}
                    this.drawerTitle = '新建'
                    this.visibleWorkDrawer = true
                } else if (this.type === '3') {
                    this.record = {}
                    this.drawerTitle = '新建'
                    this.visibleReasonDrawer = true
                } else if (this.type === '4') {
                    this.record = {}
                    this.drawerTitle = '新建'
                    this.visibleFaultDrawer = true
                }
            },
            editQuality (record) {
                if (this.type === '1') {
                    this.resId = record.id
                    this.drawerTitle = '修改'
                    this.visibleEditDrawer = true
                } else if (this.type === '2') {
                    this.record = record
                    this.drawerTitle = '修改'
                    this.visibleWorkDrawer = true
                } else if (this.type === '3') {
                    this.record = record
                    this.drawerTitle = '修改'
                    this.visibleReasonDrawer = true
                } else if (this.type === '4') {
                    this.record = record
                    this.drawerTitle = '修改'
                    this.visibleFaultDrawer = true
                } else if (this.type === '5') {
                    this.record = record
                    this.drawerTitle = '修改'
                    this.visibleMemberDrawer = true
                }
                    },
            showMessage (obj, message, type) {
                obj.$message({
                    message: message,
                    type: type
                })
            },
            deleteQuality (record) {
                let deleteApi = ''
                if (this.type === '1') {
                    deleteApi = 'baseData.productTeamRemove'
                } else if (this.type === '2') {
                    deleteApi = 'QualityWorkStatus.remove'
                } else if (this.type === '3') {
                    deleteApi = 'QualityReason.remove'
                } else if (this.type === '4') {
                    deleteApi = 'QualityFaultPattern.remove'
                }
                let that = this
                this.$confirm(`是否要删除该条数据？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$api[deleteApi]({
                        id: record.id
                    }).then(res => {
                        if (!res) {
                            this.showMessage(that, '删除失败', 'error')
                            return false
                        }
                        this.showMessage(that, '删除成功', 'success')
                        that.$refs.table.searchData()
                    })
                }).catch(() => {
                })
            },
            onEditClose () {
                this.visibleEditDrawer = false
                this.visibleWorkDrawer = false
                this.visibleReasonDrawer = false
                this.visibleFaultDrawer = false
                this.visibleMemberDrawer = false
                this.$refs.table.searchData()
            },
            saveCallback (res) {
                this.visibleEditDrawer = false
                this.visibleWorkDrawer = false
                this.visibleReasonDrawer = false
                this.visibleFaultDrawer = false
                this.visibleMemberDrawer = false
                this.$refs.table.searchData()
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            }
        }
    }
</script>
