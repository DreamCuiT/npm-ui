<template>
    <list-layout>
        <template #north>
            <search-form-list :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
        </template>
        <template #center>
            <el-table :data="tableData"
                      :height="flexHeight"
                      :max-height="flexHeight"
                      highlight-current-row
                      row-key="id"
                      v-bind="tableConfig"
                      :cell-style="columnStyle"
                      :default-expand-all="true"
                      @cell-click="cellClick">
                <el-table-column v-for="(item, index) in columns"
                                 :key="index"
                                 :prop="item.prop"
                                 :align='item.align'
                                 :type="item.type"
                                 :label="item.label"
                                 :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.prop == 'tableSetting'">
                            <el-dropdown trigger="click" :hide-on-click="false">
                                      <span class="el-dropdown-link">
                                        <i class="el-icon-s-tools" style="cursor: pointer;color:#2196F3"></i>
                                      </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>
                                        <div @click="assign(scope.row,item)">
                                            <i class="p8 icon-new-subordinate"></i>指派
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div @click="implementTask(scope.row,item)">
                                            <i class="p8 icon-new-subordinate"></i>执行
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div @click="show(scope.row,item)">
                                            <i class="p8 icon-new-subordinate"></i>查看
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <template v-else-if="item.prop == 'sysReviewersId'">
                            <el-button v-if="scope.row.sysReviewersId == null"
                                       class="selectedBtn"
                                       type="link"
                                       size="small"
                                       icon="user-add"
                                       @click="showModal">选择负责人
                            </el-button>
                        </template>
                        <template
                                v-if="item.prop == 'sysReviewersId' && scope.row.sysReviewersId != null">
                            <span>{{ scope.row[item.prop] }}</span>
                            <i class="el-icon-circle-close"
                               @click="deleteUser(scope.row)"></i>
                        </template>
                        <template v-else-if="item.prop == 'getFile' && scope.row.getFile != null && scope.row.getFile.length > 0">
                            <div @click="getAttachment(scope.row,item)">
                                <i class="el-icon-paperclip"></i>
                            </div>
                        </template>
                        <template v-else-if="item.prop == 'index'">
                            <span>{{ scope.row[item.prop] }}</span>
                        </template>
                        <template v-else>
                            <span>{{ scope.row[item.prop] }}</span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <duty-task-view v-if='visibleDutyTaskView'
                            :title='DutyTaskTitle'
                            :visible="visibleDialog"
                            :dutyTaskId='dutyTaskId'
                            @close-modal="DutyTaskViewClose">

            </duty-task-view>
            <select-user v-if="selectUserVisible"
                         :visible="selectUserVisible"
                         @close-dialog="closeModal"
                         :disabled-row="formData.tempUserList"></select-user>
        </template>
        <template #drawer-panel>
            <common-drawer v-if='visibleDutyTaskDrawer'
                           :title='DutyTaskTitle'
                           :visible='visibleDutyTaskDrawer'
                           size='70%'
                           @close='onEditDutyTaskClose'>
                <template #drawer>
                    <duty-task-edit @save-success='saveCallback' :dutyTaskId='dutyTaskId'></duty-task-edit>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>

<script>
    import Vue from 'vue'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import DutyTaskView from './dutyTaskView'
    import DutyTaskEdit from './dutyTaskEdit'
    import {
        Table,
        TableColumn,
        Button,
        Dropdown,
        DropdownMenu,
        DropdownItem
    } from '~/index'

    const mh = document.documentElement.clientHeight - 260
    export default {
        name: 'leaderTask',
        components: {
            ListLayout,
            SelectUser,
            SearchFormList,
            DutyTaskEdit,
            CommonDrawer,
            DutyTaskView,
            'el-table': Table,
            'el-table-column': TableColumn,
            'el-dropdown': Dropdown,
            'el-dropdown-menu': DropdownMenu,
            'el-dropdown-item': DropdownItem,
            'el-button': Button
        },
        data () {
            const searchData = [
                {
                    type: 'text', // 控件类型
                    labelText: '评审计划内容',
                    fieldName: 'content',
                    placeholder: '请输入评审计划内容'
                },
                {
                    type: 'multiple',
                    defaultValue: '',
                    optionUrl: {
                        api: 'thirdPartInterface.getDic',
                        params: { dicType: 'QUALITY_STATUS' }
                    },
                    options: [],
                    labelText: '状态', // 控件显示的文本
                    fieldName: 'states',
                    placeholder: '选择状态'
                }
            ]
            return {
                tableApi: 'manageAppraise.leaderTaskList',
                flexHeight: mh,
                columns: [],
                tableData: [],
                tableConfig: {
                    expandIconColumnIndex: 2
                },
                clickData: [],
                isListLoading: false,
                selectUserVisible: false,
                searchData,
                formData: {
                    id: null,
                    name: null,
                    indexNo: null,
                    sysuserIds: [],
                    appIds: [],
                    resourceIds: []
                },
                visibleDutyTaskDrawer: false,
                visibleDutyTaskView: false,
                visibleDialog: false,
                dutyTaskId: '',
                DutyTaskTitle: '',
                dutyApi: 'manageAppraise.dutyTaskList'
            }
        },
        created () {
            this.initColumns()
        },
        mounted () {
            this.queryList()
        },
        methods: {
            initColumns () {
                const columns = [
                    {
                        label: '序号',
                        type: 'index',
                        prop: 'index',
                        width: '80',
                        align: 'center'
                    },
                    {
                        label: '操作',
                        type: 'index',
                        prop: 'tableSetting',
                        width: '80',
                        align: 'center'
                    },
                    {
                        label: '体系类型',
                        prop: 'systemtype',
                        align: 'left',
                        width: '200'

                    },
                    {
                        label: '管理评审计划内容',
                        prop: 'content',
                        width: '400',
                        align: 'left'
                    },
                    {
                        label: '责任人',
                        prop: 'sysReviewersId',
                        width: '120',
                        align: 'center'
                    },
                    {
                        label: '责任部门',
                        prop: 'departmentName',
                        align: 'center'
                    },
                    {
                        label: '计划开始时间',
                        prop: 'planBeginDate',
                        width: '200',
                        align: 'center'
                    },
                    {
                        label: '计划完成时间',
                        prop: 'planEndDate',
                        width: '200',
                        align: 'center'
                    },
                    {
                        label: '状态',
                        prop: 'state',
                        width: '100',
                        align: 'center'
                    },
                    {
                        label: '附件',
                        prop: 'getFile',
                        width: '100',
                        align: 'center'
                    }
                ]
                this.columns = columns
            },
            setItemKey (item) {
                item.key = item.id
                let that = this
                if (item.children && item.children.length > 0) {
                    item.children.map(function (subItem, idx) {
                        that.setItemKey(subItem)
                    })
                }
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            queryList (message, msgType, param) {
                const that = this
                this.isListLoading = true
                if (!param) {
                    param = { id: null }
                }
                this.tableRefresh(new Promise((resolve, reject) => {
                    if (that.tableApi) {
                        that.$api[that.tableApi](param).then(function (res) {
                            that.isListLoading = false

                            let data = res

                            if (data && data.length > 0) {
                                data.forEach(function (item, idx) {
                                    that.setItemKey(item)
                                })
                                for (let i = 0; i < data.length; i++) {
                                    data[i].index = i + 1
                                }
                            }
                            that.tableData = data
                            if (msgType) {
                                that.$message(
                                    {
                                        message: message,
                                        type: msgType
                                    }
                                )
                            }
                            resolve()// 调用列表接口成功后的回调方法
                        }).catch(function (error) {
                            reject(error) // 调用列表接口失败后的回调方法
                        })
                    }
                }))
            },
            implementTask (row, item) {
                this.DutyTaskTitle = '任务执行'
                this.dutyTaskId = row.id
                if (row.state === '已指派' || row.state === '进行中') {
                    this.visibleDutyTaskDrawer = true
                } else {
                    console.log(row.state)
                    this.visibleDutyTaskView = true
                    this.visibleDialog = true
                }
            },
            assign (record, item) {
                let that = this
                that.$confirm(`是否要指派该计划？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let msg = '指派成功！'
                    if (record.state === '已下发') {
                        if (record.sysReviewersId == null) {
                            that.$message({
                                message: '未选择负责人！',
                                type: 'warning'
                            })
                        } else {
                            let params = {
                                id: record.id,
                                state: 'Q1005'
                            }
                            this.updateData(params, msg)
                        }
                    } else {
                        that.$message({
                            message: '计划已指派！',
                            type: 'warning'
                        })
                    }
                }).catch(() => { })
            },
            updateData (params, msg) {
                let that = this
                let type = 'success'
                that.$api['manageAppraise.updateAppraiseData'](params).then(res => {
                    if (res && res === true) {
                        that.queryList(msg, type, null)
                    }
                })
            },
            showModal () {
                this.selectUserVisible = true
            },
            closeModal (selectedRows) {
                let msg = '保存成功！'
                this.selectUserVisible = false
                let params = {
                    sysReviewersId: selectedRows[0].id,
                    id: this.clickData.id
                }
                this.updateData(params, msg)
            },
            deleteUser (row) {
                console.log(row, '----------')
                if (row.state === '已下发') {
                    let msg = '删除成功！'
                    let params = {
                        sysReviewersId: '',
                        id: row.id
                    }
                    this.updateData(params, msg)
                } else {
                    this.$message({
                        message: '已指派无法删除！',
                        type: 'warning'
                    })
                }
            },
            search (param) {
                if (param) {
                    this.$api['manageAppraise.searchLeaderTask'](param).then(res => {
                        this.isListLoading = false

                        let data = res

                        if (data && data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                data[i].index = i + 1
                            }
                        }
                        this.tableData = data
                    })
                }
                Vue.nextTick(function () {
                })
            },
            reSet () {
                let that = this
                Object.keys(that.queryParam).forEach(key => {
                    that.queryParam[key] = ''
                })
                Vue.nextTick(function () {
                })
            },
            cellClick (row, column, cell, event) {
                this.clickData = row
                for (let i = 0; i < document.getElementsByClassName('current-cell').length; i++) {
                    document.getElementsByClassName('current-cell')[i].classList.remove('current-cell')
                }
                cell.classList.add('current-cell')
            },
            columnStyle ({ row, column, rowIndex, columnIndex }) {
                if (row.children && row.children.length > 0) {
                    return 'font-weight: 900;'
                }
            },
            onEditDutyTaskClose () {
                this.visibleDutyTaskDrawer = false
            },
            DutyTaskViewClose () {
                this.visibleDutyTaskView = false
            },
            saveCallback () {
                console.log('修改页面关闭时的回调方法')
                let msg = '保存成功'
                let type = 'success'
                this.onEditDutyTaskClose()
                this.queryList(msg, type)
            },
            show (row, item) {
                this.DutyTaskTitle = '任务执行'
                this.dutyTaskId = this.clickData.id
                this.visibleDutyTaskView = true
                this.visibleDialog = true
            },
            getAttachment (row, item) {
                console.log(row, 'row')
                let attachmentId = row.getFile[0].id
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
                    link.download = row.getFile[0].fileName
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
            }
        }
    }
</script>
