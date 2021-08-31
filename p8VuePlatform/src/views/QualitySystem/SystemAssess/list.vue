<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
        </template>
        <template #center>
            <common-table
                    ref="table"
                    :comp="comp"
                    :columns="columns"
                    :params="queryParams"
                    :api="tableApi"
                    :tableRefresh="tableRefresh"
                    :pagination=true
            >
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="visibleDrawer"
                           :visible="visibleDrawer"
                           :title="drawerTitle"
                           placement="left"
                           size="100%"
                           @close="onEditProjectClose">
                <template #drawer>
                    <assess-edit @saveSuccess="saveCallback" :record="record"></assess-edit>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>

<script>
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import AssessEdit from './edit'
    export default {
        name: 'list',
        components: {
            ListLayout,
            CommonTable,
            CommonButton,
            CommonDrawer,
            AssessEdit
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
                    title: '表单编号',
                    dataIndex: 'formCode',
                    align: 'center'
                },
                {
                    title: '表单密级',
                    dataIndex: 'cmeaning',
                    align: 'center'
                },
                {
                    title: '评估要素',
                    dataIndex: 'assessFactor',
                    align: 'center'
                },
                {
                    title: '责任单位/部门',
                    dataIndex: 'name',
                    align: 'center'
                },
                {
                    title: '责任人',
                    dataIndex: 'dutyPeople',
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
            return {
                comp: this,
                columns,
                queryParams: {},
                tableApi: 'qualitySystemAssess.getList',
                visibleDrawer: false,
                drawerTitle: '',
                record: {}
            }
        },
        methods: {
            createSystemAssess () {
                this.record = {}
                this.visibleDrawer = true
                this.drawerTitle = '新建信息'
            },
            updateSystemAssess (record) {
                this.record = record
                this.visibleDrawer = true
                this.drawerTitle = '修改信息'
            },
            removeSystemAssess (record) {
                let that = this
                that.$confirm(`是否要删除该计划？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let type = 'success'
                    let msg = '删除成功！'
                    that.$api['qualitySystemAssess.remove']({ id: record.id }).then(res => {
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
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.onEditProjectClose()
            },
            onEditProjectClose () {
                this.visibleDrawer = false
                this.$refs.table.searchData()
            }
        }
    }
</script>

<style scoped>

</style>
