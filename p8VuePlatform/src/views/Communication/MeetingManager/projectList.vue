<template>
  <normal-layout>
        <template #west>
          <common-tree ref="tree"
                       :treeApi="treeApi"
                       height="auto"
                       :treeParam="leftTreeParam"
                       @select="onSelect" style="height: 500px"></common-tree>
        </template>
        <template #center>
            <div id="table-contain">
                <common-table
                        ref="table"
                        :comp="comp"
                        :table-config="tableConfig"
                        :columns="columns"
                        height="auto"
                        :tree="treeParams"
                        :params="queryParam"
                        :api="tableApi"
                        :table-Refresh="tableRefresh"
                        :pagination="true"
                        @row-click="openMeetingManager"
                ></common-table>
            </div>
        </template>
        <template #drawer-panel>
            <common-drawer
                    v-if="visibleEditDrawer"
                    :title="drawerTitle"
                    :visible="visibleEditDrawer"
                    @close="onEditClose"
                    size="100%"
            >
                <template #drawer>
                    <meeting-manager-list @save-success="saveCallback" :wholeDescribe="wholeDescribe"></meeting-manager-list>
                </template>
            </common-drawer>
        </template>
    </normal-layout>
</template>

<script>
    import meetingManagerList from './projectMeetingManagerList'
    import { P8Table as CommonTable } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8NormalLayout as NormalLayout } from '~/index'
    import { P8Tree as CommonTree } from '~/index'

    const columns = [
        {
            title: '序号',
            type: 'index',
            width: 45,
            align: 'center'
        },
        {
            title: '型号代号',
            width: '110px',
            align: 'center',
            dataIndex: 'modelCode'
        },
        {
            title: '项目编号',
            dataIndex: 'pjCode',
            width: '200px',
            align: 'center'
        },
        {
            title: '项目名称',
            dataIndex: 'name',
            minWidth: 400,
            align: 'left'
        },
        {
            title: '项目类型',
            width: '100px',
            align: 'center',
            dataIndex: 'kprojectClassifyname'
        },
        // {
        //     title: '责任部门',
        //     width: '110px',
        //     align: 'center',
        //     dataIndex: 'departmentName',
        //     formatter: function (row) {
        //         if (row.pdepartmentName) {
        //             return row.pdepartmentName + '-' + row.departmentName
        //         } else {
        //             return row.departmentName
        //         }
        //     }
        // },
        {
            title: '状态',
            width: '110px',
            align: 'center',
            dataIndex: 'statusDisplay'
        }
    ]
    export default {
        name: 'list',
        components: {
            meetingManagerList,
            CommonTable,
            CommonDrawer,
            NormalLayout,
            CommonTree
        },
        data () {
            return {
                leftTreeParam: { resources: [] },
                treeApi: 'commonProjectTree.projectTreeByPlan',
                comp: this,
                drawerTitle: '',
                visibleEditDrawer: false,
                visibleDetailsDrawer: false,
                queryParam: {},
                treeParams: {},
                tableApi: 'ProjectApply.projectList',
                advanced: false,
                columns: columns,
                wholeDescribe: {},
                scroll: {},
                tableConfig: {
                    // bordered: true,
                    // size:'middle'
                    defaultExpandAllRows: true
                },
                searchData: [],
                buttonConfig: {
                    icon: 'edit'
                }
            }
        },
        mounted () {

        },
        methods: {
            openMeetingManager (wholeDescribe) {
                this.wholeDescribe = wholeDescribe
                this.drawerTitle = '会议列表'
                this.visibleEditDrawer = true
            },
            saveCallback () {
                console.log('修改页面关闭时的回调方法')
                this.$refs.table.searchData()
                this.onEditClose()
            },
            onEditClose () {
                this.visibleEditDrawer = false
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
            onSelect (node) {
              console.log(11111111111111111111111111)
              let me = node
              if (me.layersParams) {
                this.layersParams = me.layersParams
                this.queryParam.layersParams = Object.assign({}, me.layersParams)
              } else {
                this.layersParams = {}
              }
              this.$refs.table.searchData()
            }
        }
    }
</script>
