<template>
    <list-layout>
        <template #center>
            <div class="tableDiv">
                <el-table :data="tableData"
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
                            <template v-if="item.prop == 'tableSetting' && scope.row.state == '草稿'">
                                <el-dropdown trigger="click" :hide-on-click="false">
                                      <span class="el-dropdown-link">
                                        <i class="el-icon-s-tools" style="cursor: pointer;color:#2196F3"></i>
                                      </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                                v-if="scope.row.name != null || scope.row.planType == 'secondaryLevelPlan'">
                                            <div @click="createBudgetData(scope.row,item)">
                                                <i class="p8 icon-new-subordinate"></i>新建下级
                                            </div>
                                        </el-dropdown-item>
                                        <el-dropdown-item v-else>
                                            <div @click="deleteBudgetData(scope.row,item)">
                                                <i class="p8 icon-delete"></i>删除
                                            </div>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                            <el-input v-else-if="item.prop == 'name' && scope.row.planType == 'firstLevelPlan' && scope.row.state == '草稿'"
                                      type="text"
                                      required="required"
                                      style="width: 130px"
                                      v-model="scope.row[item.prop]"
                                      @blur="removeClass"
                                      @change="nameChange(item.prop, item.label,scope.row[item.prop],scope.row)">
                            </el-input>
                            <el-input v-else-if="item.prop == 'content' && scope.row.planType != 'firstLevelPlan' && scope.row.state == '草稿'"
                                      type="text"
                                      required="required"
                                      v-model="scope.row[item.prop]"
                                      @blur="removeClass"
                                      @change="nameChange(item.prop, item.label,scope.row[item.prop],scope.row)">
                            </el-input>
                            <template v-else-if="item.prop == 'dutyUserId'&& scope.row.planType == 'thirdLevelPlan'">
                                <el-button v-if="scope.row.dutyUserId == null"
                                           class="selectedBtn"
                                           type="link"
                                           size="small"
                                           icon="user-add"
                                           @click="showModal">选择责任人
                                </el-button>
                            </template>
                            <el-input v-else-if="item.prop == 'outputrequire' && scope.row.planType == 'thirdLevelPlan' && scope.row.state == '草稿'
                             || item.prop == 'remark' && scope.row.planType == 'thirdLevelPlan' && scope.row.state == '草稿'"
                                      type="text"
                                      required="required"
                                      v-model="scope.row[item.prop]"
                                      @blur="removeClass"
                                      @change="nameChange(item.prop, item.label,scope.row[item.prop],scope.row)">
                            </el-input>
                            <el-date-picker v-else-if="item.prop == 'planBeginDate' && scope.row.planType == 'thirdLevelPlan' && scope.row.state == '草稿'
                             || item.prop == 'planEndDate' && scope.row.planType == 'thirdLevelPlan' && scope.row.state == '草稿'"
                                            v-model="scope.row[item.prop]"
                                            type="date"
                                            size="mini"
                                            style="width: 162px;"
                                            placeholder="选择日期"
                                            @change="nameChange(item.prop, item.label,scope.row[item.prop],scope.row)">
                            </el-date-picker>
                            <template
                                    v-if="item.prop == 'dutyUserId' && scope.row.dutyUserId != null&& scope.row.planType == 'thirdLevelPlan'">
                                <span>{{ scope.row[item.prop] }}</span>
                                <i class="el-icon-circle-close"
                                   @click="deleteUser"></i>
                            </template>
<!--                            <template v-else-if="item.prop == 'name' && scope.row.planType == 'firstLevelPlan'">-->
<!--                                <i class="el-icon-suitcase"></i>-->
<!--                                <span>{{ scope.row[item.prop] }}</span>-->
<!--                            </template>-->
                            <template v-else-if="item.prop == 'name' && scope.row.planType == 'secondaryLevelPlan'">
                                <i class="el-icon-notebook-1"></i>
                            </template>
                            <template v-else-if="item.prop == 'name' && scope.row.planType == 'thirdLevelPlan'">
                                <i class="el-icon-notebook-2"></i>
                            </template>
                            <template v-else>
                                <span>{{ scope.row[item.prop] }}</span>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <select-user v-if="selectUserVisible"
                             :visible="selectUserVisible"
                             @close-dialog="closeModal"
                             :disabled-row="formData.tempUserList"></select-user>
            </div>
        </template>
    </list-layout>
</template>

<script>
    import { generateTree } from '@/utils/generateTree'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import {
        Table,
        TableColumn,
        Input,
        Button,
        Dropdown,
        DropdownMenu,
        DropdownItem,
        DatePicker
    } from '~/index'
    const mh = document.documentElement.clientHeight - 165

    export default {
        name: 'appraiseEdit',
        components: {
            ListLayout,
            SelectUser,
            'el-table': Table,
            'el-table-column': TableColumn,
            'el-input': Input,
            'el-dropdown': Dropdown,
            'el-dropdown-menu': DropdownMenu,
            'el-dropdown-item': DropdownItem,
            'el-date-picker': DatePicker,
            'el-button': Button
        },
        props: {
            appraiseData: {
                type: Object
            }
        },
        data () {
            return {
                tableApi: 'manageAppraise.getAppraiseTableDate',
                flexHeight: mh,
                columns: [],
                tableData: [],
                tableConfig: {
                    expandIconColumnIndex: 2
                },
                isListLoading: false, // 列表加载
                selectUserVisible: false,
                clickData: [],
                selectedData: {
                    resourceList: [],
                    userList: [],
                    appList: []
                },
                formData: {
                    id: null,
                    name: null,
                    indexNo: null,
                    sysuserIds: [],
                    appIds: [],
                    resourceIds: []
                }
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
                        label: '计划类别',
                        prop: 'name',
                        align: 'left',
                        width: '250'

                    },
                    {
                        label: '评审计划/任务',
                        prop: 'content',
                        width: '300',
                        align: 'left'
                    },
                    {
                        label: '责任人',
                        prop: 'dutyUserId',
                        width: '120',
                        align: 'center'
                    },
                    {
                        label: '输出要求',
                        prop: 'outputrequire',
                        align: 'center'
                    },
                    {
                        label: '计划开始时间',
                        prop: 'planBeginDate',
                        width: '190',
                        align: 'center'
                    },
                    {
                        label: '计划完成时间',
                        prop: 'planEndDate',
                        width: '190',
                        align: 'center'
                    },
                    {
                        label: '备注',
                        prop: 'remark',
                        width: '250',
                        align: 'center'
                    },
                    {
                        label: '状态',
                        prop: 'state',
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
                        that.$api[that.tableApi]({ id: this.appraiseData.id }).then(function (res) {
                            that.isListLoading = false

                            let data = generateTree(res.records ? res.records : res, 'parentid')

                            if (data && data.length > 0) {
                                data.forEach(function (item, idx) {
                                    that.setItemKey(item)
                                })
                                for (let i = 0; i < data.length; i++) {
                                    if (data[i].children && data[i].children.length > 0) {
                                        for (let j = 0; j < data[i].children.length; j++) {
                                            data[i].children[j].index = j + 1
                                            if (data[i].children[j] && data[i].children[j].children.length > 0) {
                                                for (let k = 0; k < data[i].children[j].children.length; k++) {
                                                    data[i].children[j].children[k].index = k + 1
                                                }
                                            }
                                        }
                                    }
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
            columnStyle ({ row, column, rowIndex, columnIndex }) {
                if (row.children && row.children.length > 0) {
                    return 'font-weight: 900;'
                }
            },
            isCanEdit () {
                return this.revenueStatus === '4506'
            },
            cellClick (row, column, cell, event) {
                this.clickData = row
                for (let i = 0; i < document.getElementsByClassName('current-cell').length; i++) {
                    document.getElementsByClassName('current-cell')[i].classList.remove('current-cell')
                }
                cell.classList.add('current-cell')
            },

            nameChange (prop, label, value, row) {
                let params = {}
                if (prop === 'content') {
                    params = {
                        content: value,
                        id: row.id
                    }
                } else if (prop === 'outputrequire') {
                    params = {
                        outputrequire: value,
                        id: row.id
                    }
                } else if (prop === 'remark') {
                    params = {
                        remark: value,
                        id: row.id
                    }
                } else if (prop === 'planBeginDate') {
                    params = {
                        planBeginDate: value,
                        id: row.id
                    }
                } else if (prop === 'planEndDate') {
                    params = {
                        planEndDate: value,
                        id: row.id
                    }
                } else if (prop === 'name') {
                    params = {
                        name: value,
                        id: row.id
                    }
                }
                this.updateBudgetData(params)
            },

            removeClass () {
                document.getElementsByClassName('current-cell')[0].classList.remove('current-cell')
            },

            createBudgetData (record, item) {
                let that = this
                let type = 'success'
                let msg = '保存成功！'
                that.$api['manageAppraise.createAppraisePlan']({
                    parentid: record.id,
                    systemtype: record.systemtype,
                    years: record.years,
                    planType: record.planType
                }).then(res => {
                    if (res && res === true) {
                        that.queryList(msg, type)
                    } else {
                        that.$message(
                            {
                                message: '保存失败！',
                                type: 'error'
                            }
                        )
                    }
                })
            },
            updateBudgetData (params) {
                let that = this
                let type = 'success'
                let msg = '保存成功！'
                that.$api['manageAppraise.updateAppraiseData'](params).then(res => {
                    if (res && res === true) {
                        that.queryList(msg, type)
                    }
                })
            },
            deleteBudgetData (record, item) {
                let type = 'success'
                let msg = '删除成功！'
                let that = this
                that.$confirm(`是否要删除该节点？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$api['manageAppraise.deleteAppraiseData']({ id: record.id }).then(res => {
                        if (res && res === true) {
                            that.queryList(msg, type)
                        } else {
                            that.$message(
                                {
                                    msg: '删除失败！',
                                    type: 'error'
                                }
                            )
                        }
                    })
                }).catch(() => {
                })
            },
            showModal () {
                this.selectUserVisible = true
            },
            closeModal (selectedRows) {
                this.selectUserVisible = false
                let params = {
                    dutyUserId: selectedRows[0].id,
                    id: this.clickData.id
                }
                this.updateBudgetData(params)
            },
            deleteUser () {
                if (this.clickData.state === '草稿') {
                    let params = {
                        dutyUserId: '',
                        id: this.clickData.id
                    }
                    this.updateBudgetData(params)
                }
            }
        }
    }
</script>

<style scoped>

    .tableDiv .el-input {
        display: none;
    }

    .current-cell .el-input {
        display: block;
    }

    .current-cell .el-input + span {
        display: none;
    }

    .userList {
        background: #ffffff;
        overflow: hidden;
    }

    /*.userList li {*/
    /*    float: left;*/
    /*    padding: 0px 10px;*/
    /*    margin: 5px;*/
    /*    border-radius: 3px;*/
    /*    !*border:1px solid #1890FF;*!*/
    /*    border: 1px solid #e8e8e8;*/
    /*}*/

    .el-icon-circle-close {
        font-size: 15px;
        margin-left: 10px;
        cursor: pointer;
    }

    .selectedBtn {
        padding-bottom: 7px;
        padding-top: 7px;
        border: 2px dashed #1890ff;
        height: 28px;
    }
</style>
