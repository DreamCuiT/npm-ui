<template>
    <normal-layout>
        <template #north>
            <common-button :comp="comp" ></common-button>
        </template>
        <template #west>
            <system-menu-tree
                    ref="tree"
                    :isCreate.sync="isCreate"
                    :clickedNodeData="clickedNodeData"
                    @nodeClick="handleNodeClick"
                    @openDialog="openDialog"
                    @updateTree="updateTree"
                    @select="onSelect"
            />
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
                <tree-edit
                        v-if="visibleTreeEdit"
                        :visible="visibleDialog"
                        :title="dialogTitle"
                        @close-modal="closeModal"
                        @save-success="saveTreeCallback"
                        :clickedNodeData="clickedNodeData">
                </tree-edit>
            </div>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="visibleFlowEditDrawer" :title="drawerTitle" :visible="visibleFlowEditDrawer" @close="onEditFlowClose">
                <template #drawer>
                    <edit @saveSuccess="saveCallback" :expertId="expertId" :teamId="teamId"></edit>
                </template>
            </common-drawer>
        </template>
    </normal-layout>
</template>

<style>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
<script>
    import Edit from './edit'
    import { P8Table as CommonTable } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8NormalLayout as NormalLayout } from '~/index'
    import SystemMenuTree from './Components/Tree'
    import TreeEdit from './Components/TreeEdit'

    const columns = [
        {
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 70,
            align: 'center'
        },
        {
            title: '性别',
            dataIndex: 'sex',
            width: 70,
            align: 'center'
        },
        {
            title: '所属单位',
            dataIndex: 'unitName',
            width: 150,
            align: 'center'
        },
        {
            title: '专业',
            dataIndex: 'major',
            width: 120,
            align: 'center'
        },
        {
            title: '专家描述',
            dataIndex: 'expertDescription',
            minWidth: 250,
            align: 'left'
        },
        {
            title: '创建者',
            dataIndex: 'creater',
            width: 85,
            align: 'center'
        },
        {
            title: '创建单位',
            dataIndex: 'createUnitName',
            width: 150,
            align: 'center'
        },
        {
            title: '创建日期',
            dataIndex: 'createTime',
            width: 100,
            align: 'center'
        },
        {
            title: '备注',
            dataIndex: 'remark',
            minWidth: 250,
            align: 'left'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            width: 150,
            align: 'center'
        }
    ]

    export default {
        name: 'FlowIndex',
        components: {
            'edit': Edit,
            NormalLayout,
            CommonTable,
            CommonButton,
            CommonDrawer,
            SystemMenuTree,
            TreeEdit
        },
        data () {
            return {
                drawerTitle: '',
                comp: this,
                visibleFlowEditDrawer: false,
                treeParams: {},
                queryParam: {},
                treeApi: 'ExpertDatabaseInformation.productTeamTree',
                tableApi: 'ExpertDatabaseInformation.listData',
                advanced: false,
                columns: columns,
                tableHeight: 0,
                teamId: '',
                expertId: '',
                searchData: [],

                clickedNodeData: {},
                showUpdateDialog: false,
                isCreate: true, // 当前是新建还是编辑
                // dialog
                dialogTitle: '新建菜单',
                visibleDialog: false,
                visibleTreeEdit: false
            }
        },
        methods: {
            onSelect (obj) {
                this.teamId = obj.id
                this.queryParam.productTeamId = obj.id
                this.$refs.table.searchData()
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            createProductTeam () {
                this.expertId = ''
                this.teamId = this.teamId
                this.drawerTitle = '新建'
                this.visibleFlowEditDrawer = true
            },
            updateProductTeam (record) {
                this.expertId = record.id
                this.drawerTitle = '修改'
                this.visibleFlowEditDrawer = true
            },
            onEditFlowClose () {
                this.visibleFlowEditDrawer = false
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.onEditFlowClose()
            },
            showMessage (obj, message, type) {
                obj.$message({
                    message: message,
                    type: type
                })
            },
            removeProductTeam (record) {
                let that = this
                this.$confirm(`是否要删除该条数据？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$api['ExpertDatabaseInformation.remove']({ id: record.id }).then(res => {
                        if (!res) {
                            this.showMessage(that, '删除失败', 'error')
                            return false
                        }
                        this.showMessage(that, '删除成功', 'success')
                        that.$refs.table.searchData()
                    })
                }).catch(() => console.log('Oops errors!'))
            },
            saveTreeCallback () {
                console.log('修改页面关闭时的回调方法')
                this.closeModal()
            },
            handleNodeClick (obj) {
                this.teamId = obj.data.id
                this.queryParam.productTeamId = obj.data.id
                this.$refs.table.searchData()
            },
            updateTree (componentName, nodeData) {
                this.clickedNodeData = nodeData
                this.dialogTitle = '修改菜单'
                this.visibleDialog = true
                this.visibleTreeEdit = true
            },
            openDialog () {
                this.clickedNodeData = null
                this.visibleDialog = true
                this.visibleTreeEdit = true
            },
            closeModal () {
                this.visibleTreeEdit = false
                this.$refs.tree.update()
            }
        }
    }

</script>
