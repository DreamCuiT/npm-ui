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
            <common-drawer v-if='visibleCreateFileManageDrawer'
                           :title='createFileManageTitle'
                           :visible='visibleCreateFileManageDrawer'
                           size='70%'
                           @close='onEditFileManageClose'>
                <template #drawer>
                    <file-manage-edit @save-success='saveCallback'
                                      :clickedNodeData="clickedNodeData"
                                      :record="record"></file-manage-edit>
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
    import FileManageEdit from './edit'
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
            title: '文件编号',
            dataIndex: 'fileCode',
            align: 'center'
        },
        {
            title: '名称',
            dataIndex: 'fileName',
            align: 'center'
        },
        {
            title: '文件性质',
            dataIndex: 'fileType',
            align: 'center'
        },
        {
            title: '责任人',
            dataIndex: 'dutyPeople',
            align: 'center'
        },
        {
            title: '计划完成时间',
            dataIndex: 'planEndTime',
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
            FileManageEdit,
            SystemMenuTree,
            TreeEdit
        },
        data () {
            return {
                drawerSize: '70%',
                drawerTitle: '',
                visibleCreateFileManageDrawer: false,
                visibleFileManageViewDrawer: false,
                createFileManageTitle: '上传附件',
                currFileManageId: '',
                treeApi: 'qualitySystem.qualityTree',
                queryParam: {},
                treeParams: {},
                tableApi: 'qualitySystem.getFileList',
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
                dialogTitle: '新建菜单',
                visibleDialog: false,
                visibleTreeEdit: false,
                buttonView: false

            }
        },
        mounted () {
            this.qualityTree()
        },
        computed: {},
        methods: {
            qualityTree () {

            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            createFileResource () {
                this.record = ''
                if (this.clickedNodeData.id && this.clickedNodeData.pId != null) {
                    this.visibleCreateFileManageDrawer = true
                } else {
                    this.visibleCreateFileManageDrawer = false
                }
            },
            updateFileResource (record) {
                this.record = record
                this.visibleCreateFileManageDrawer = true
            },
            removeFileResource (record) {
                let that = this
                that.$confirm(`是否要删除该计划？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let type = 'success'
                    let msg = '删除成功！'
                    that.$api['qualitySystem.remove']({ id: record.id }).then(res => {
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

            downloadFileResource (record) {
                console.log(record, 'record')
                let attachmentId = record.getFile[0].id
                if (!attachmentId) {
                    this.$message({
                        message: '文件id不存在,请先保存数据',
                        type: 'warning'
                    })
                    return
                }
                this.$api['SystemSettings.getFileUrl']({ attachmentId: attachmentId }, { responseType: 'blob' }).then(backJson => {
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(new Blob([backJson.data]))
                    link.download = record.getFile[0].fileName
                    document.body.appendChild(link)

                    link.click()
                    window.URL.revokeObjectURL(link.href)
                    document.body.removeChild(link)
                }).catch(() => {
                    this.$message({
                        type: 'warning',
                        message: '文件下载失败'
                    })
                })
            },

            saveCallback () {
                console.log('修改页面关闭时的回调方法')
                this.$refs.table.searchData()
                this.onEditFileManageClose()
            },
            saveTreeCallback () {
                console.log('修改页面关闭时的回调方法')
                this.closeModal()
            },
            onEditFileManageClose () {
                this.visibleCreateFileManageDrawer = false
                this.$refs.table.searchData()
            },
            reSet () {
                let qualitySystemId
                if (this.queryParam.qualitySystemId) {
                    qualitySystemId = this.queryParam.qualitySystemId
                }
                let that = this
                Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
                if (qualitySystemId) {
                    this.queryParam.qualitySystemId = qualitySystemId
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
                this.queryParam.qualitySystemId = data.id
                this.$refs.table.queryList()
            },

            handleNodeClick ({ data, node, nodeCom }) {
                this.clickedNodeData = data
                this.tableData = data
                this.queryParam.qualitySystemId = data.id
                this.buttonView = true
                this.$refs.table.queryList()
            },
            updateTree (componentName, nodeData) {
                this.clickedNodeData = nodeData
                this.dialogTitle = '修改菜单'
                this.visibleDialog = true
                this.visibleTreeEdit = true
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
