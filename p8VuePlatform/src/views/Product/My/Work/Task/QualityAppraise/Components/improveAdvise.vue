<template>
    <list-layout>
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
    </list-layout>
</template>

<script>
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    export default {
        name: 'improveAdvise',
        components: {
            ListLayout,
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
                    title: '改进项目名称',
                    dataIndex: 'improveName',
                    align: 'left'
                },
                {
                    title: '责任人',
                    dataIndex: 'dutyPeople',
                    align: 'left'
                },
                {
                    title: '责任部门',
                    dataIndex: 'dutyUnitName',
                    align: 'left'
                },
                {
                    title: '完成形式',
                    dataIndex: 'finishForm',
                    align: 'center'
                },
                {
                    title: '计划完成时间',
                    dataIndex: 'planEndTime',
                    align: 'center'
                },
                {
                    title: '整改措施',
                    dataIndex: 'rectifyMeasures',
                    align: 'center'
                }
            ]
            return {
                columns,
                comp: this,
                queryParams: {},
                tableApi: 'manageImproveTract.getImproveAdvise'
            }
        },
        methods: {
            tableRefresh () {}
        }
    }
</script>

<style scoped>

</style>