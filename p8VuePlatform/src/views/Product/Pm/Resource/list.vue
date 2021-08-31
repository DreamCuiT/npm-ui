<template>
    <normal-layout>
        <template #north>
            <common-button :comp="comp"
                           :button-config="buttonConfig"
                           :select-records="selectedRows"></common-button>
        </template>
        <template #west>
            <common-tree ref="tree"
                         :treeApi="treeApi"
                         :treeParam="leftTreeParam"
                         @select="onSelect"></common-tree>
        </template>
        <template #center>
            <common-table ref="table"
                          :comp="comp"
                          :columns="columns"
                          :params="queryParams"
                          :api="tableApi"
                          :showSearchRow="true"
                          @open-third-menu="openThirdMenu"
                          :selectAllHidden="true"
                          @selection-change="select">
                <template #name="{scope,thirdMenuData}">
          <span class="underline"
                @click="drillCol(scope,thirdMenuData)">{{ scope.row.name }}</span>
                </template>
            </common-table>
        </template>
        <template #drawer-panel>
            <!--            <common-drawer v-if="visibleResourcesDrawer"-->
            <!--                           :visible="visibleResourcesDrawer"-->
            <!--                           :title="drawerTitle"-->
            <!--                           placement="top"-->
            <!--                           direction="ttb"-->
            <!--                           size="100%"-->
            <!--                           @close="onEditResourcesClose">-->
            <!--                <template #drawer>-->
            <!--                    <menu-layout :third-menu-param='thirdMenuParam'-->
            <!--                                 :default-menu="defaultMenu"></menu-layout>-->
            <!--                    &lt;!&ndash; <temp-menu></temp-menu>  v-if="drawerTitle"&ndash;&gt;-->
            <!--                    &lt;!&ndash; <team-manager :thirdMenuParam="thirdMenuParam"></team-manager>&ndash;&gt;-->
            <!--                </template>-->
            <!--            </common-drawer>-->

            <!-- 团队管理-->
            <common-drawer v-if="teamManagerDrawer" ref="drawer"
                           :visible="teamManagerDrawer"
                           :title="'团队成员编辑'"
                           :before-close="isSaveCheckHandle"
                           placement="top"
                           direction="ttb"
                           size="100%"
                           @close="onVisibleBpmViewClose"
                           >
                           <!-- @close="onVisibleBpmViewClose" -->
                <template #drawer>
                    <team-manager ref="teamManager" :third-menu-param='thirdMenuParam'></team-manager>
                </template>
            </common-drawer>
            <!-- 场所团队管理-->
            <common-drawer v-if="factoryTeamDrawer"
                           :visible="factoryTeamDrawer"
                           :title="drawerTitle"
                           placement="top"
                           direction="ttb"
                           size="100%"
                           @close="onVisibleBpmViewClose">
                <template #drawer>
                    <factory-team :third-menu-param='thirdMenuParam'></factory-team>
                </template>
            </common-drawer>
        </template>
    </normal-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8Tree as CommonTree } from '~/index'
    import { P8NormalLayout as NormalLayout } from '~/index'
    // import { P8MenuLayout as MenuLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    // import { P8Search as SearchFormList } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8Button as CommonButton } from '~/index'
    import TeamManager from './teamManager'
    import FactoryTeam from './factoryTeam'

    export default {
        name: 'resourceManagementr',
        data () {
            const dataSource = [
                {
                    type: 'multiple',
                    optionUrl: {
                        api: 'thirdPartInterface.getDic',
                        params: { dicType: 'STAND_PROJECT_STATUS' }
                    },
                    options: [],
                    labelText: '状态', // 控件显示的文本
                    fieldName: 'status',
                    placeholder: '选择状态'
                },
                {
                    type: 'text', // 控件类型
                    labelText: '项目名称', // 控件显示的文本
                    fieldName: 'productName',
                    placeholder: '请输入项目名称'
                },
                {
                    type: 'text', // 控件类型
                    labelText: '项目编号', // 控件显示的文本
                    fieldName: 'pjCode',
                    placeholder: '请输入项目编号', // 默认控件的空值文本
                    fieldEvent: {
                        click: 'clickEvent(this)'
                    }
                },
                // {
                //   type: 'multiple',
                //   optionUrl: {
                //     api: 'thirdPartInterface.getDic',
                //     params: { dicType: 'PROJECT_ORDER' }
                //   },
                //   options: [],
                //   labelText: '项目分级', // 控件显示的文本
                //   fieldName: 'projectOrderId',
                //   placeholder: '选择项目分级'
                // },

                {
                    type: 'treeSelect',
                    labelText: '项目类型',
                    fieldName: 'kprojectClassifyId',
                    placeholder: '选择项目类型',
                    multiple: true,
                    defaultExpandAll: true,
                    optionUrl: {
                        api: 'ProjectApply.projectClassifyTree',
                        params: {},
                        // label: 'name',
                        value: 'id'
                    },
                    treeData: []
                },
                {
                    type: 'multiple',
                    labelText: '所属型号',
                    fieldName: 'modelInformationId',
                    placeholder: '选择所属型号',
                    optionUrl: {
                        api: 'ProjectApply.getModelListData',
                        label: 'modelCode',
                        value: 'id',
                        params: {}
                    },
                    treeData: []
                }
                // },
                // {
                //   type: 'treeSelect',
                //   multiple: true,
                //   labelText: '管理部门',
                //   fieldName: 'departmentId',
                //   defaultValue: [],
                //   defaultExpandedKeys: ['1'],
                //   placeholder: '选择管理部门',
                //   optionUrl: {
                //     api: 'ProjectApply.deptTree',
                //     params: {}
                //   },
                //   treeData: []
                // }
            ]
            const columns = [
                {
                    title: '',
                    width: 35,
                    type: 'selection'
                },
                {
                    title: '序号',
                    type: 'index',
                    width: 55,
                    align: 'center'
                },
                // {
                //     title: '#',
                //     type: 'index',
                //     dataIndex: 'thirdMenu',
                //     scopedSlots: { customRender: 'thirdMenu' },
                //     width: 45,
                //     align: 'center'
                // },
                // {
                //     title: '业务范围',
                //     dataIndex: 'filedName',
                //     width: 100,
                //     align: 'center',
                //     filterable: true, // 列上增加输入框搜索
                //     iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                //     filter: {
                //         val: '',
                //         type: 'select',
                //         optionUrl: {
                //             api: 'thirdPartInterface.getDic',
                //             params: { dicType: 'FILED' }
                //         }
                //     }
                // },
                // {
                //     title: '业务来源',
                //     dataIndex: 'sourceName',
                //     width: 100,
                //     align: 'center',
                //     filterable: true, // 列上增加输入框搜索
                //     iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                //     filter: {
                //         val: '',
                //         type: 'select',
                //         optionUrl: {
                //             api: 'thirdPartInterface.getDic',
                //             params: { dicType: 'SOURCE' }
                //         }
                //     }
                // },
                // {
                //     title: '业务类型',
                //     dataIndex: 'classifyName',
                //     width: 200,
                //     align: 'center',
                //     filterable: true, // 列上增加输入框搜索
                //     iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                //     filter: {
                //         val: '',
                //         type: 'select',
                //         optionUrl: {
                //             api: 'thirdPartInterface.getDic',
                //             params: { dicType: 'CLASSFIY' }
                //         }
                //     }
                // },
                {
                    title: '型号代号',
                    dataIndex: 'modelCode',
                    width: 130,
                    align: 'center',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'multiple',
                        optionUrl: {
                            api: 'ProjectApply.getModelListData',
                            label: 'modelCode',
                            value: 'id',
                            params: {}
                        }
                    }
                },
                {
                    title: '产品代号',
                    dataIndex: 'productCode',
                    width: 130,
                    align: 'center',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'text'
                    }
                },
                // {
                //     title: '项目编号',
                //     dataIndex: 'pjCode',
                //     width: 120,
                //     align: 'center',
                //     filterable: true, // 列上增加输入框搜索
                //     iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                //     filter: {
                //         val: '',
                //         type: 'text'
                //     }
                // },
                {
                    title: '项目名称',
                    dataIndex: 'name',
                    minWidth: 300,
                    align: 'left',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'text'
                    }
                },
                {
                    title: '项目类型',
                    dataIndex: 'kprojectClassifyname',
                    width: 150,
                    align: 'center',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        defaultExpandAll: true,
                        type: 'treeSelect',
                        optionUrl: {
                            api: 'ProjectApply.projectClassifyTree',
                            params: {},
                            // label: 'name',
                            value: 'id'
                        }
                    }
                },
                {
                    title: '项目密级',
                    dataIndex: 'secretGradeDisplay',
                    width: 150,
                    align: 'center',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'select',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'TASK_SOURCE' }
                        }
                    }
                },
                {
                    title: '概算总额(万元)',
                    dataIndex: 'totalBudget',
                    minWidth: 150,
                    align: 'left',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'text'
                    }
                },
                {
                    title: '项目来源',
                    dataIndex: 'sourceDisplay',
                    width: 150,
                    align: 'center',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'select',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'TASK_SOURCE' }
                        }
                    }
                },
                {
                    title: '项目开始时间',
                    dataIndex: 'beginTime',
                    width: 150,
                    align: 'center',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'datetime',
                        fieldConfig: {
                            valueFormat: 'yyyy-MM-dd'
                        }
                    }
                },
                {
                    title: '项目完成时间',
                    dataIndex: 'endTime',
                    width: 150,
                    align: 'center',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'datetime',
                        fieldConfig: {
                            valueFormat: 'yyyy-MM-dd'
                        }
                    }
                },
                {
                    title: '创建人',
                    dataIndex: 'userName',
                    width: 120,
                    align: 'center',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'text'
                    }
                },
                {
                    title: '主承部门',
                    dataIndex: 'mainDeptName',
                    width: 150,
                    align: 'center',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        defaultExpandAll: true,
                        type: 'treeSelect',
                        optionUrl: {
                            api: 'ProjectApply.deptTree',
                            params: {},
                            // label: 'name',
                            value: 'id'
                        }
                    }
                },
                {
                    title: '主管所领导',
                    dataIndex: 'mainLeadUserName',
                    width: 150,
                    align: 'center',
                    filterable: true, // 列上增加输入框搜索
                    iconDisplay: false, // 表头点击搜索图标，出现搜索条件
                    filter: {
                        val: '',
                        type: 'text'
                    }
                },
                {
                    title: '申请日期',
                    dataIndex: 'applyTime',
                    width: 150,
                    align: 'center',
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
            ]
            return {
                comp: this,
                dataSource,
                columns,
                buttonConfig: {
                    icon: 'edit'
                },
                selectType: 'single',
                selectedRows: [],
                queryParams: {},
                layersParams: {},
                treeApi: 'commonProjectTree.projectTree',
                tableApi: 'ProjectApply.resourceManagerList',
                record: {},
                drawerTitle: '',
                visibleResourcesDrawer: false,
                teamManagerDrawer: false,
                factoryTeamDrawer: false,
                defaultMenu: {},
                leftTreeParam: { resources: [] },
                thirdMenuParam: {},
                currentRouterPath: '',
                isSaveCheck: false
            }
        },
        mounted () {
            this.currentRouterPath = this.$route.path
            this.leftTreeParam.resources.push(this.$route.meta.id)
        },
        methods: {
            isSaveCheckHandle () {
                let that = this
                if (!that.$refs.teamManager.changeCheak()) {
                    this.teamManagerDrawer = false
                } else {
                    this.$confirm('有修改项未保存，是否保存？', '提示', {
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'warning',
                        closeOnClickModal: false,
                        closeOnPressEscape: false,
                        closeOnHashChange: false,
                        distinguishCancelAndClose: true
                    }).then(() => {
                        if (that.$refs.teamManager.submit()) {
                            this.teamManagerDrawer = false
                        }
                    }).catch((e) => {
                        // if (e === 'cancel') {
                        //     this.teamManagerDrawer = false
                        // }
                        this.teamManagerDrawer = false
                    })
                }
            },
            // 点击项目/计划列钻取进入三级菜单-计划编制页面
            drillCol (scope, thirdMenuData) {
                if (thirdMenuData.length) {
                    let planManager = thirdMenuData.filter(o => o.name === 'teamManager')
                    this.openThirdMenu(scope.row, planManager[0])
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
                this.designFileName = '"' + this.selectedRows[0].name + '"项目，决策文件上传'
            },
            onSelect (node) {
                let me = node
                if (me.layersParams) {
                    this.layersParams = me.layersParams
                    this.queryParams.layersParams = Object.assign({}, me.layersParams)
                } else {
                    this.layersParams = {}
                }
                this.$refs.table.searchData()
            },
            search (param) {
                let newParams = { ...this.queryParams, ...param }
                this.queryParams = newParams
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reset () {
                let that = this
                Object.keys(that.queryParams).forEach(key => {
                    return (that.queryParams[key] = null)
                })
                this.queryParams.layersParams = Object.assign({}, this.layersParams)
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            openThirdMenu (record, item) {
                this.visibleResourcesDrawer = true
                this.defaultMenu = item
                this.thirdMenuParam.id = record.id
                this.thirdMenuParam.status = record.status
            },
            onEditResourcesClose () {
                this.visibleResourcesDrawer = false
                this.$router.push({ path: this.currentRouterPath })
            },
            teamManager (record) {
                record = this.selectedRow
                console.log(record, '11111111111111')
                this.thirdMenuParam.id = record.id
                this.thirdMenuParam.status = record.status
                this.teamManagerDrawer = true
            },
            factoryTeam (record) {
                record = this.selectedRow
                this.thirdMenuParam.id = record.id
                this.thirdMenuParam.status = record.status
                this.factoryTeamDrawer = true
            },
            onVisibleBpmViewClose () {
                this.teamManagerDrawer = false
                this.factoryTeamDrawer = false
                this.$refs.table.searchData()
            }
        },
        components: {
            NormalLayout,
            // MenuLayout,
            CommonTable,
            CommonTree,
            // SearchFormList,
            CommonDrawer,
            CommonButton,
            // TempMenu,
            TeamManager,
            FactoryTeam
        }
    }
</script>
<style lang="scss" scoped>
    i.el-icon-menu {
        color: #1890ff;
        font-size: 16px;
    }

    .three-menu {
        .menu-item {
            display: flex;
            align-items: center;
            padding: 5px;

            &:hover {
                background-color: #e6f7ff;
                cursor: pointer;
            }

            span {
                padding-left: 6px;
                font-size: 14px;
            }
        }
    }

    /deep/ .el-container .el-main > div > div {
        background: none;
    }

    /deep/ .custom-drawer {
        background-color: #fafbff;
    }
</style>
