<template>
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

<script>
    import Vue from 'vue'
    import { P8Table as CommonTable } from '~/index'
    export default {
        name: 'list',
        components: {
            CommonTable
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
                    title: '质量人员名称',
                    dataIndex: 'memberName',
                    align: 'center'
                },
                {
                    title: '检验印章编号',
                    dataIndex: 'sealNum',
                    align: 'center'
                },
                {
                    title: '单位',
                    dataIndex: 'borrowUnitName',
                    align: 'center'
                },
                {
                    title: '领用日期',
                    dataIndex: 'borrowTime',
                    align: 'center'
                },
                {
                    title: '备注',
                    dataIndex: 'remarks',
                    align: 'center'
                },
                {
                    title: '单据号',
                    dataIndex: 'docNum',
                    align: 'center'
                },
                {
                    title: '单据编号',
                    dataIndex: 'docCode',
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
            const searchData = []
            return {
                comp: this,
                treeApi: 'QualityEvaluation.deptTree',
                tableApi: 'QualityCheckoutArchives.borrowList',
                columns,
                searchData,
                queryParams: {},
                visibleEdit: false,
                editTitle: '',
                record: {},
                treeParam: {
                    dataRange: 'select-all'
                },
                treeConfig: {
                    // showLine: true,
                    // checkable: true
                }
            }
        },
        methods: {
            createCheckoutArchives () {
                this.record = {}
                this.editTitle = '新建'
                this.visibleEdit = true
            },
            updateCheckoutArchives (record) {
                this.$emit('update', record)
            },
            removeCheckoutArchives (record) {
                let that = this
                that.$confirm(`是否要删除该计划？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let type = 'success'
                    let msg = '删除成功！'
                    that.$api['QualityCheckoutArchives.remove']({ id: record.id }).then(res => {
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
            search () {},
            reset () {},
            onSelect (node) {
                this.queryParams.fillingUnit = node.id
                this.$refs.table.searchData()
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
            },
            onEditClose () {
                this.visibleEdit = false
            }
        }
    }
</script>

<style scoped>

</style>
