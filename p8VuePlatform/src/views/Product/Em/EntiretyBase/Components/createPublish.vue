<template>
        <normal-layout>
                <template #north>
                        <el-button type="primary"
                                   @click="createModelFlot">新建</el-button>
                        <el-button type="primary"
                                   @click="modifyModelFlot" >修改</el-button>
                        <el-button type="primary"
                                   @click="viewUpload" >查看</el-button>
                        <el-button type="primary"
                                   @click="handleDelete" >删除</el-button>
                  <!--  <el-button type="primary"
                               @click="riskAndpoint">必要信息维护</el-button>-->
<!--                        <search-form-list ref="search"-->
<!--                                          :dataSource="searchData"-->
<!--                                          @search="search"-->
<!--                                          @re-set="reSet"></search-form-list>-->
                </template>
                <template #west>
                        <common-tree :treeApi="treeApi"
                                     @select="onSelect"></common-tree>
                </template>
                <template #center>
                        <div id="table-contain">
                                <common-table ref="table"
                                              :comp="comp"
                                              :columns="columns"
                                              :params="queryParam"
                                              :api="tableApi"
                                              :table-Refresh="tableRefresh"
                                              :pagination="true"
                                              @selection-change="select">
                                        <template #tableSettings="{scope}">
                                                <el-button type="text"
                                                           @click="modifyModelFlot(scope.row)">修改&#12288;</el-button>
                                                <el-dropdown trigger="click">
                                                        <span class="el-dropdown-link">
                                                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                                                        </span>
                                                        <el-dropdown-menu slot="dropdown">
                                                                <el-dropdown-item>
                                                                        <el-button type="text"
                                                                                   @click="viewUpload(scope.row)">查看</el-button>
                                                                </el-dropdown-item>
                                                                <el-dropdown-item>
                                                                        <el-button type="text"
                                                                                   @click="handleDelete(scope.$index,scope.row)">删除</el-button>
                                                                </el-dropdown-item>

                                                        </el-dropdown-menu>
                                                </el-dropdown>

                                        </template>
                                </common-table>
                                <common-dialog :title="drawerTitle"
                                               width="50%"
                                               v-if="createDrawer"
                                               :visible="createDrawer"
                                               :dialogConfig="dialogConfig"
                                               :showHandleBtn="showHandleBtn"
                                               :dialogHeight="dialogHeight"
                                               @close="onPlanViewClose">
                                        <template #dialog>
                                                <create-model :wholeId="currEntityId"
                                                              :rowId="rowId"
                                                              @save-success='onPlanViewClose'></create-model>
                                        </template>
                                </common-dialog>
                                <common-dialog :title="drawerTitle"
                                               width="50%"
                                               v-if="risk"
                                               :visible="risk"
                                               :dialogConfig="dialogConfig"
                                               :showHandleBtn="showHandleBtn"
                                               :dialogHeight="dialogHeight"
                                               @close="onPlanViewClose">
                                    <template #dialog>
                                        <risk-and-point
                                                        :currEntityId="currEntityId"
                                                        :thirdMenuParam="thirdMenuParam"
                                                      @save-success='onPlanViewClose'></risk-and-point>
                                    </template>
                                </common-dialog>
                                <common-dialog :title="drawerTitle"
                                               width="50%"
                                               v-if="views"
                                               :visible="views"
                                               :dialogConfig="dialogConfig"
                                               :showHandleBtn="showHandleBtn"
                                               :dialogHeight="dialogHeight"
                                               @close="onPlanViewClose">
                                        <template #dialog>
                                                <show-model :wholeId="currEntityId"
                                                            :rowId="rowId"></show-model>
                                        </template>
                                </common-dialog>
                        </div>
                </template>
        </normal-layout>
</template>
<script>
        import Vue from 'vue'
        import { P8NormalLayout as NormalLayout } from '~/index'
        import { P8Table as CommonTable } from '~/index'
        import { P8Tree as CommonTree } from '~/index'
        // import { P8Search as SearchFormList } from '~/index'
        import { Button, Col, Dropdown, DropdownMenu, DropdownItem } from '~/index'
        import { P8Dialog as CommonDialog } from '~/index'
        import CreateModel from './createModel'
        import ShowModel from './showModel'
   //    import RiskAndPoint from '../../Whole/Components/createOrUpdate'
        export default {
                components: {
                        NormalLayout,
                        CommonTable,
                        CommonTree,
                        // SearchFormList,
                        ShowModel,
              //          RiskAndPoint,
                        // eslint-disable-next-line vue/no-unused-components
                        'el-col': Col,
                        CommonDialog,
                        CreateModel,
                        'el-button': Button,
                        'el-dropdown': Dropdown,
                        'el-dropdown-menu': DropdownMenu,
                        'el-dropdown-item': DropdownItem

                },
                props: {
                        currEntityId: {
                                type: String
                        },
                        wholeId: {
                            type: String
                        },
                        classifyId: {
                                type: String
                        },
                        thirdMenuParam: {
                            type: Object
                        },
                        columns: {
                                type: Array,
                                default: function () {
                                        return [
                                                {
                                                        title: '',
                                                        width: 35,
                                                        type: 'selection'
                                                },
                                                {
                                                        title: '序号',
                                                        type: 'index',
                                                        width: '60px',
                                                        align: 'center'
                                                },
                                                {
                                                        title: '决策文件类型',
                                                        dataIndex: 'classify',
                                                        align: 'center',
                                                        filterable: true, // 列上增加输入框搜索
                                                        iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                                                        filter: {
                                                                val: '',
                                                                type: 'select',
                                                                optionUrl: {
                                                                        api: 'thirdPartInterface.getDic',
                                                                        params: { dicType: 'REPORT_CLASSIFY' }
                                                                }
                                                        }
                                                },
                                                {
                                                        title: '文档名称',
                                                        dataIndex: 'name',
                                                        align: 'left',
                                                        filterable: true, // 列上增加输入框搜索
                                                        iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                                                        filter: {
                                                                val: '',
                                                                type: 'text'
                                                        }
                                                },
                                                {
                                                        title: '密级',
                                                        dataIndex: 'security',
                                                        align: 'left',
                                                        filterable: true, // 列上增加输入框搜索
                                                        iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                                                        filter: {
                                                                val: '',
                                                                type: 'select',
                                                                optionUrl: {
                                                                        api: 'thirdPartInterface.getDic',
                                                                        params: { dicType: 'SECRET_LEVEL' }
                                                                }
                                                        }
                                                },
                                                {
                                                        title: '上传时间',
                                                        dataIndex: 'createTime',
                                                        align: 'left',
                                                        filterable: true, // 列上增加输入框搜索
                                                        iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                                                        filter: {
                                                                val: '',
                                                                type: 'datetime',
                                                                fieldConfig: {
                                                                        valueFormat: 'yyyy-MM-dd'
                                                                }
                                                        }
                                                }
                                                // {
                                                //         title: '操作',
                                                //         align: 'center',
                                                //         scopedSlots: { customRender: 'custom' },
                                                //         dataIndex: 'tableSettings'
                                                // }
                                        ]
                                }
                        }
                },
                data () {
                        const searchData = [
                                {
                                        type: 'text', // 控件类型
                                        labelText: '文档名称', // 控件显示的文本
                                        fieldName: 'name',
                                        placeholder: '请输入文档名称'
                                },
                                {
                                        type: 'hidden',
                                        fieldName: 'wholeId'
                                }
                        ]
                        return {
                                comp: this,
                                searchData,
                                treeApi: 'ProjectApply.reportTree',
                                currentRouterPath: '',
                                drawerConfig: {
                                        modal: false
                                },
                                drawerTitle: '',
                                rowId: '',
                                createDrawer: false,
                                buttonVisable: false,
                                selectedRow: null,
                                selectedRows: [],
                                selectType: 'single',
                                risk: false,
                                showHandleBtn: false,
                                dialogHeight: 300,
                                dialogConfig: {
                                        'append-to-body': true
                                },
                                views: false,
                                queryParam: {
                                        wholeId: this.currEntityId
                                },
                                tableApi: 'PaReport.getReportList',
                                isView: null,
                                defaultMenu: {}
                        }
                },
                methods: {
                        mounted () {
                                this.formData.wholeId = this.currEntityId
                                this.queryParam.wholeId = this.currEntityId
                                // this.getClassifyData()
                        },
                        search (param) {
                                console.log('param', param)
                                this.queryParam = param
                                this.queryParam.wholeId = this.currEntityId
                                let that = this
                                that.queryParam.wholeId = this.currEntityId
                                Vue.nextTick(function () {
                                        that.$refs.table.queryList()
                                })
                        },
                        reSet () {
                                let this_ = this
                                Object.keys(this.queryParam).forEach(key => {
                                        let temp = this_.searchData.filter(item => item.fieldName === key)
                                        this.queryParam[key] = temp[0].defaultValue
                                })
                                this_.queryParam.wholeId = this.currEntityId
                                Vue.nextTick(function () {
                                        this_.$refs.table.searchData()
                                })
                        },
                        onSelect (node) {
                                this.queryParam.classifyId = node.id
                                this.queryParam.wholeId = this.currEntityId
                                this.$refs.table.searchData()
                        },
                        tableRefresh (param) {
                                param
                                        .then(() => {
                                                console.log('异步成功后端做的操作')
                                        })
                                        .catch(() => {
                                                console.log('异步失败的操作')
                                        })
                        },
                        createModelFlot () {
                                this.createDrawer = true
                                this.rowId = ''
                                this.drawerTitle = '新建项目决策文档'
                        },
                      /*  riskAndpoint () {
                            this.risk = true
                            this.rowId = ''
                            this.drawerTitle = '维护信息'
                        }, */
                        modifyModelFlot (record) {
                                if (this.selectedRows.length > 0) {
                                        this.createDrawer = true
                                        this.rowId = this.selectedRows[0].id
                                        this.drawerTitle = '修改项目决策文档'
                                }
                        },
                        onPlanViewClose () {
                                this.createDrawer = false
                                this.views = false
                                this.risk = false
                                this.drawerTitle = ''
                                let this_ = this
                                this_.$refs.table.searchData()
                        },
                        viewUpload (record) {
                                if (this.selectedRows.length > 0) {
                                        this.drawerTitle = '查看项目决策文档'
                                        this.rowId = this.selectedRows[0].id
                                        this.views = true
                                }
                        },
                        handleDelete (index, row) {
                                let that = this
                                if (this.selectedRows.length > 0) {
                                        let name = ''
                                        if (this.selectedRows[0].name != null) {
                                                name = that.selectedRows[0].name
                                        }
                                        that.$confirm(`是否确定要删除文件` + name + '?', '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                        }).then(() => {
                                                // that.$refs.table.tableData.splice(index, 1)
                                                that.$api['PaReport.deleteById']({ id: this.selectedRows[0].id }).then(function (res) {
                                                        that.$message({
                                                                type: 'success',
                                                                message: '删除成功！'
                                                        })
                                                        that.$refs.table.searchData()
                                                }).catch(function (error) {
                                                        console.log('error' + error)
                                                })
                                        }).catch(() => { })
                                }
                        },
                        select (val) {
                                if (this.selectType === 'single') {
                                        if (val.length >= 2) {
                                                // 删除索引为0的
                                                // console.log(val.splice(0,val.length-1),'被删除的')
                                                let arrays = val.splice(0, val.length - 1)
                                                arrays.forEach(row => {
                                                        this.$refs.table.$refs.table.toggleRowSelection(row) // 除了当前点击的，其他的全部取消选中
                                                })
                                        }
                                }
                                this.selectedRows = val
                                this.selectedRow = val[0]
                        }

                }

        }
</script>
<style lang="scss">
        .el-dropdown-link {
                color: $base-light-color;
                font-size: 12px;
                cursor: pointer;
        }
</style>
