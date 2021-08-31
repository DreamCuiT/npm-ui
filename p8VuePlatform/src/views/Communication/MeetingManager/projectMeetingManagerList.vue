<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
        </template>
        <template #center>
            <common-table ref="table" :comp="comp" :columns="columns" :params="queryParam"
                          :api="tableApi" :table-Refresh="tableRefresh" :pagination="true"
                          >
            </common-table>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="visibleEditDrawer" :title="drawerTitle"
                           :visible="visibleEditDrawer"
                           :drawerConfig='drawerConfig'
                           size="70%"
                           @close="onEditDrawerClose">
                <template #drawer>
                    <edit @saveSuccess="saveCallback" :id="id" :wholeDescribeId="wholeDescribeId"
                          :wholeDescribeName="wholeDescribeName"></edit>
                </template>
            </common-drawer>
            <common-drawer v-if="visibleToDoListDrawer" :title="drawerTitle"
                           :visible="visibleToDoListDrawer"
                           :drawerConfig='drawerConfig'
                           size="100%"
                           @close="onToDoListDrawerClose">
                <template #drawer>
                    <list-edit @saveSuccess="onToDoListDrawerClose" :id="id"></list-edit>
                </template>
            </common-drawer>
            <common-drawer v-if="visibleMeetingDrawer" :title="drawerTitle"
                           :visible="visibleMeetingDrawer"
                           :drawerConfig='drawerConfig'
                           size="50%"
                           @close="onMeetingDrawerClose">
                <template #drawer>
                    <meeting  :id="id" ></meeting>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import Edit from './edit'
    import listEdit from './toDoList'
    import meeting from './projectMeeting'

    export default {
        name: 'list',
        props: {
            wholeDescribe: {
                type: Object
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
                    title: '项目名称',
                    dataIndex: 'wholeDescribeName',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '主持人',
                    dataIndex: 'compere',
                    align: 'center'
                },
                {
                    title: '会议密级',
                    dataIndex: 'security',
                    align: 'center'
                },
                {
                    title: '会议内容',
                    dataIndex: 'content',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '会议时间',
                    dataIndex: 'meetingTime',
                    align: 'center'
                },
                {
                    title: '会议类型',
                    dataIndex: 'meetingType',
                    align: 'center'
                },
                {
                    title: '会议状态',
                    dataIndex: 'status',
                    formatter: function (row, column, cellValue, index) {
                        if (cellValue === '9000') {
                            return '未开始'
                        } else if (cellValue === '9001') {
                            return '已发布'
                        }
                    },
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 200,
                    scopedSlots: { customRender: 'operation' },
                    align: 'center'
                }
            ]
            return {
                columns: columns,
                tableApi: 'meetingManager.list',
                queryParam: {
                    wholeDescribeId: this.wholeDescribe.id
                },
                drawerConfig: {
                    modal: false
                },
                searchData: [
                    {
                        type: 'hidden', // 控件类型
                        fieldName: 'wholeDescribeId',
                        defaultValue: this.wholeDescribe.id
                    },
                    {
                        type: 'text', // 控件类型
                        labelText: '主持人', // 控件显示的文本
                        fieldName: 'compere',
                        placeholder: '请输入主持人', // 默认控件的空值文本
                        fieldEvent: {
                            'click': 'clickEvent(this)'
                        }
                    },
                    {
                        type: 'datetimeRange',
                        labelText: '会议时间',
                        fieldName: 'meetingTime',
                        placeholder: ['开始日期', '结束日期'],
                        fieldConfig: {
                            format: 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'select', // 控件类型
                        labelText: '会议类型', // 控件显示的文本
                        fieldName: 'meetingType',
                        placeholder: '请选择会议类型',
                        options: [
                            {
                                label: '一总例会',
                                value: '一总例会'
                            },
                            {
                                label: '两总例会',
                                value: '两总例会'
                            }
                        ],
                        fieldConfig: {
                            multiple: true
                        }
                    },
                    {
                        type: 'select', // 控件类型
                        labelText: '会议状态', // 控件显示的文本
                        fieldName: 'status',
                        placeholder: '请选择会议状态',
                        options: [
                            {
                                label: '未开始',
                                value: '9000'
                            },
                            {
                                label: '已发布',
                                value: '9001'
                            }
                        ],
                        fieldConfig: {
                            multiple: true
                        }
                    }
                ],
                comp: this,
                drawerTitle: null,
                visibleEditDrawer: false,
                visibleToDoListDrawer: false,
                visibleMeetingDrawer: false,
                id: '',
                wholeDescribeId: '',
                wholeDescribeName: ''
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
                if (param) {
                    if (param.meetingTime && param.meetingTime.length === 2) {
                        param.beginDate = param.meetingTime[0]
                        param.endDate = param.meetingTime[1]
                    }
                    this.queryParam = param
                }
                this.queryParam.wholeDescribeId = this.wholeDescribe.id
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reSet () {
                this.queryParam = {}
                this.search(this.queryParam)
            },
            toDoList (record) {
                this.id = record.id
                this.drawerTitle = '录入待办事项'
                this.visibleToDoListDrawer = true
            },
            createMeetingManager () {
                this.id = ''
                this.wholeDescribeId = this.wholeDescribe.id
                this.wholeDescribeName = this.wholeDescribe.name
                this.drawerTitle = '新建会议'
                this.visibleEditDrawer = true
            },
            updateMeetingManager (record) {
                this.id = record.id
                this.drawerTitle = '修改会议'
                this.visibleEditDrawer = true
            },
            checkMeeting (record) {
                this.id = record.id
                this.drawerTitle = '会议详情'
                this.visibleMeetingDrawer = true
            },
            removeMeetingManager (record) {
                let that = this
                this.$confirm('是否确定要删除？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    that.$api['meetingManager.remove']({ id: record.id }).then(res => {
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
            onEditDrawerClose () { // 抽屉关闭
                this.visibleEditDrawer = false
                this.$refs.table.searchData()
            },
            onToDoListDrawerClose () { // 抽屉关闭
                this.visibleToDoListDrawer = false
                this.$refs.table.searchData()
            },
            onMeetingDrawerClose () { // 抽屉关闭
                this.visibleMeetingDrawer = false
                this.$refs.table.searchData()
            },
            saveCallback () {
                this.$refs.table.searchData()
                this.onEditDrawerClose()
            }
        },
        components: {
            ListLayout,
            CommonTable,
            CommonDrawer,
            CommonButton,
            SearchFormList,
            Edit,
            listEdit,
            meeting
        }
    }
</script>

<style scoped>

</style>
