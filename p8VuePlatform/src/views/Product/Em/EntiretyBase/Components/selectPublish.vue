<template>
        <normal-layout :headerVisible="headerVisible">
                <template #north>
                        <search-form-list ref="search"
                                          :dataSource="searchData"
                                          @search="search"
                                          @re-set="reSet"></search-form-list>
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
                                              :flex="tableFlex">
                                        <template #tableSettings="{scope}">
                                                <el-button type="text"
                                                        @click="viewUpload(scope.row)">查看</el-button>
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
        import { P8Search as SearchFormList } from '~/index'
        import { Button, Col } from '~/index'
        import { P8Dialog as CommonDialog } from '~/index'
        import CreateModel from './createModel'
        import ShowModel from './showModel'
   //    import RiskAndPoint from '../../Whole/Components/createOrUpdate'
        export default {
                components: {
                        NormalLayout,
                        CommonTable,
                        CommonTree,
                        SearchFormList,
                        ShowModel,
              //          RiskAndPoint,
                        // eslint-disable-next-line vue/no-unused-components
                        'el-col': Col,
                        CommonDialog,
                        CreateModel,
                        'el-button': Button

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
                        businessKey: {
                                type: String
                        },
                        columns: {
                                type: Array,
                                default: function () {
                                        return [
                                                {
                                                        title: '序号',
                                                        type: 'index',
                                                        width: '60px',
                                                        align: 'center'
                                                },
                                                {
                                                        title: '文档名称',
                                                        dataIndex: 'name',
                                                        align: 'left'
                                                },
                                                {
                                                        title: '决策文件类型',
                                                        dataIndex: 'classify',
                                                        align: 'center'
                                                },
                                                {
                                                        title: '操作',
                                                        align: 'center',
                                                        scopedSlots: { customRender: 'custom' },
                                                        dataIndex: 'tableSettings'
                                                }
                                        ]
                                }
                        },
                        headerVisible: {
                                type: Boolean,
                                default: true
                        },
                        tableFlex: {
                                type: Number,
                                default: 160
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
                                risk: false,
                                showHandleBtn: false,
                                dialogHeight: 600,
                                dialogConfig: {
                                        'append-to-body': true
                                },
                                views: false,
                                queryParam: {
                                        wholeId: this.currEntityId ? this.currEntityId : this.businessKey
                                },
                                tableApi: 'PaReport.getReportList',
                                isView: null,
                                defaultMenu: {}
                        }
                },
                methods: {
                        mounted () {
                                this.formData.wholeId = this.currEntityId ? this.currEntityId : this.businessKey
                                this.queryParam.wholeId = this.currEntityId ? this.currEntityId : this.businessKey
                                // this.getClassifyData()
                        },
                        search (param) {
                                console.log('param', param)
                                this.queryParam = param
                                this.queryParam.wholeId = this.currEntityId ? this.currEntityId : this.businessKey
                                let that = this
                                that.queryParam.wholeId = this.currEntityId ? this.currEntityId : this.businessKey
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
                                this_.queryParam.wholeId = this.currEntityId ? this.currEntityId : this.businessKey
                                Vue.nextTick(function () {
                                        this_.$refs.table.searchData()
                                })
                        },
                        onSelect (node) {
                                this.queryParam.classifyId = node.id
                                this.queryParam.wholeId = this.currEntityId ? this.currEntityId : this.businessKey
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
                                this.createDrawer = true
                                this.rowId = record.id
                                this.drawerTitle = '修改项目决策文档'
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
                                this.drawerTitle = '查看项目决策文档'
                                this.rowId = record.id
                                this.views = true
                        },
                        handleDelete (index, row) {
                                let that = this
                                that.$confirm(`是否确定要删除该数据？`, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                }).then(() => {
                                        that.$refs.table.tableData.splice(index, 1)
                                        that.$api['PaReport.deleteById']({ id: row.id }).then(function (res) {
                                                that.$message({
                                                        type: 'success',
                                                        message: '删除成功！'
                                                })
                                        }).catch(function (error) {
                                                console.log('error' + error)
                                        })
                                }).catch(() => { })
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
