<template>
    <normal-layout>
        <template #north v-if="buttonView">
            <common-button :comp="comp"></common-button>
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
                              :data="tableData"
                              :comp="comp"
                              :table-config="tableConfig"
                              :columns="columns"
                              :tree="treeParams"
                              :params="queryParam"
                              :api="tableApi"
                              :table-Refresh="tableRefresh"
                              :pagination=true
                              @icon-click="iconClick"
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
            <common-drawer v-if='visibleMemberDrawer'
                           :title='organizationTitle'
                           :visible='visibleMemberDrawer'
                           size='50%'
                           @close='onEditFileManageClose'>
                <template #drawer>
                    <member-edit @save-member-success='saveCallback' :record="record"></member-edit>
                </template>
            </common-drawer>
        </template>
    </normal-layout>
</template>

<style scoped>
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
    import Vue from 'vue'
    import { P8Button as CommonButton } from '~/index'
    import { P8NormalLayout as NormalLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import MemberEdit from './edit'
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
            title: '部门名称',
            dataIndex: 'name',
            align: 'center'
        },
        {
            title: '部门编号',
            dataIndex: 'code',
            align: 'center'
        },
        {
            title: '部门简称',
            dataIndex: 'abbreviation',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: '150',
            scopedSlots: {
                customRender: 'operation'
            },
            align: 'center'
        }
    ]
    export default {
        name: 'FileManageList',
        components: {
            NormalLayout,
            'common-button': CommonButton,
            CommonTable,
            CommonDrawer,
            MemberEdit,
            SystemMenuTree,
            TreeEdit
        },
        data () {
            return {
                drawerSize: '70%',
                drawerTitle: '',
                visibleMemberDrawer: false,
                visibleFileManageViewDrawer: false,
                organizationTitle: '',
                currFileManageId: '',
                queryParam: {},
                treeParams: {},
                tableApi: 'productOrganization.organizationList',
                advanced: false,
                columns: columns,
                tableHeight: 0,
                currentSelectDeptId: '', // 当前选中的标识
                tableConfig: {
                    // bordered: true,
                    // size:'middle'
                },
                comp: this,
                selectTaskId: '',
                tableData: [],
                record: {},
                // tree数据

                clickedNodeData: {},
                showUpdateDialog: false,
                isCreate: true, // 当前是新建还是编辑
                // dialog
                dialogTitle: '新建组织',
                visibleDialog: false,
                visibleTreeEdit: false,
                buttonView: false

            }
        },
        mounted () {
        },
        computed: {},
        methods: {
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            saveCallback () {
                console.log('修改页面关闭时的回调方法')
                this.$refs.table.searchData()
                this.$refs.tree.update()
                this.onEditFileManageClose()
            },
            saveTreeCallback () {
                console.log('修改页面关闭时的回调方法')
                this.closeModal()
            },
            onEditFileManageClose () {
                this.visibleMemberDrawer = false
                this.$refs.table.searchData()
            },
            reSet () {
                let orgId
                if (this.queryParam.id) {
                    orgId = this.queryParam.id
                }
                let that = this
                Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
                if (orgId) {
                    this.queryParam.id = orgId
                }
                Vue.nextTick(
                    function () {
                        that.$refs.table.searchData()
                    })
            },
            iconClick (record) {
                console.log(record, 'record')
            },

            // tree
            onSelect (data) {
                this.queryParam.id = data.id
                this.$refs.table.queryList()
            },

            handleNodeClick ({ data, node, nodeCom }) {
                this.clickedNodeData = data
                this.tableData = data
                this.queryParam.id = data.id
                this.buttonView = true
                this.$refs.table.queryList()
            },
            updateTree (componentName, nodeData) {
                this.clickedNodeData = nodeData
                this.dialogTitle = '修改组织机构信息'
                this.visibleDialog = true
                this.visibleTreeEdit = true
            },
            update (record) {
                this.record = record
                this.organizationTitle = '修改组织机构信息'
                this.visibleMemberDrawer = true
            },
            remove (record) {
                if (record.id) {
                    this.$confirm(`此操作将删除:[${record.name}], 确认要删除吗?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$api['productOrganization.removeNode']({ id: record.id }).then(res => {
                            if (res) {
                                // eslint-disable-next-line no-undef
                                that.$message({
                                    message: res.message,
                                    type: 'warning'
                                })
                            } else {
                                this.$refs.table.queryList()
                                this.$refs.tree.update()
                            }
                        })
                    }).catch(() => {})
                }
            },
            openDialog (nodeData) {
                this.dialogTitle = '新建菜单'
                this.clickedNodeData = nodeData
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
