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
                        <template v-else-if="item.prop == 'getFile' && scope.row.getFile != null && scope.row.getFile.length > 0">
                            <div @click="getAttachment(scope.row,item)">
                                <i class="el-icon-paperclip"></i>
                            </div>
                        </template>
                        <template v-else-if="item.prop == 'index'">
                            <span>{{ scope.row[item.prop] }}</span>
                        </template>
                        <template v-else-if="item.prop != 'getFile'">
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
    import { P8Search as SearchFormList } from '~/index'
    import DutyTaskEdit from './dutyTaskEdit'
    import DutyTaskView from './dutyTaskView'
    import {
        Table,
        TableColumn,
        Dropdown,
        DropdownMenu,
        DropdownItem
    } from '~/index'

    const mh = document.documentElement.clientHeight - 260
    export default {
        name: 'dutyTask',
        components: {
            ListLayout,
            CommonDrawer,
            SearchFormList,
            DutyTaskEdit,
            DutyTaskView,
            'el-table': Table,
            'el-table-column': TableColumn,
            'el-dropdown': Dropdown,
            'el-dropdown-menu': DropdownMenu,
            'el-dropdown-item': DropdownItem
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
                    type: 'select',
                    defaultValue: '',
                    optionUrl: {
                        api: 'thirdPartInterface.getDic',
                        params: { dicType: 'QUALITY_STATUS' }
                    },
                    options: [],
                    labelText: '状态', // 控件显示的文本
                    fieldName: 'states',
                    placeholder: '选择状态',
                    fieldConfig: {
                        multiple: true
                    }
                }
            ]
            return {
                tableApi: 'manageAppraise.dutyTaskList',
                flexHeight: mh,
                columns: [],
                tableData: [],
                tableConfig: {
                    expandIconColumnIndex: 2
                },
                clickData: [],
                isListLoading: false,
                searchData,
                visibleDutyTaskDrawer: false,
                visibleDutyTaskView: false,
                visibleDialog: false,
                dutyTaskId: '',
                DutyTaskTitle: ''
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
            queryList (message, msgType) {
                const that = this
                this.isListLoading = true
                this.tableRefresh(new Promise((resolve, reject) => {
                    if (that.tableApi) {
                        that.$api[that.tableApi]().then(function (res) {
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
            search (param) {
                console.log(param, 'search')
                if (param) {
                    console.log(param, 'search')
                    this.$api['manageAppraise.searchDutyTask'](param).then(res => {
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
            show (row, item) {
                this.DutyTaskTitle = '任务执行'
                this.dutyTaskId = this.clickData.id
                this.visibleDutyTaskView = true
                this.visibleDialog = true
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
