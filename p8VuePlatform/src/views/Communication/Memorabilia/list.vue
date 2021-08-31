<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData"
                              @search="search" @re-set="reSet">>
            </search-form-list>
        </template>
        <template #center>
            <el-timeline>
                <el-timeline-item
                        v-for="(activity, index) in items"
                        :key="index"
                        :color="'#0bbd87'"
                        :timestamp="activity.time"
                        :class="index % 2 !=0 ? 'el-timeline-item-live-out': ''"
                        placement="top">
                    <span class="el-icon-edit" @click="showInfo(activity)"
                          style='cursor:pointer;'></span>
                    <div class="dd">
                        <span class="yuan"></span>{{activity.content}}
                    </div>
                </el-timeline-item>
            </el-timeline>
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
                    <edit @saveSuccess="saveCallback"></edit>
                </template>
            </common-drawer>
            <common-drawer v-if="excelDrawer" :title="drawerTitle" :visible="excelDrawer"
                           @close="onExcelClose">
                <template #drawer>
                    <import-excel @saveSuccess="importExcelClosed" :task-id="selectTaskId"
                                  :output-request="excelImportData"></import-excel>
                </template>
            </common-drawer>
            <common-drawer v-if="infoDrawer" :title="drawerTitle"
                           :visible="infoDrawer" @close="onInfoClose" size="50%">
                <template #drawer>
                    <info @saveSuccess="saveCallback" :id="id"></info>
                </template>
            </common-drawer>
        </template>
        <template #name>
            <el-input v-model='formData["name"]'
                      readonly
                      autosize
                      placeholder="请选择项目"
                      v-on:click.native="showModal()">
                <i v-if='selectedRow'
                   class='el-icon-link'
                   slot='suffix'
                   type='link'
                   :style='{cursor: "pointer", fontSize: "16px", color: "#08c" }'></i>
            </el-input>

            <select-project v-if='selectProjectVisible' :selected-row='selectedRow'
                            :visible='selectProjectVisible'
                            @close-modal='closeProjectModal'></select-project>
        </template>
    </list-layout>
</template>
<script>
    import Edit from './edit'
    import Info from './info'
    import { Timeline, TimelineItem } from '~/index'
    import ImportExcel from './importExcel'
    import { P8Button as CommonButton } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import SelectProject from '@/views/Product/Pm/Project/selectProject'

    const columns = [
        {
            title: '序号',
            dataIndex: 'indexNo'
        },
        {
            title: '内容',
            dataIndex: 'content'
        },
        {
            title: '时间',
            dataIndex: 'time'
        },
        {
            title: '部门',
            dataIndex: 'deptName'
        },
        {
            title: '项目',
            dataIndex: 'wholeDescribeName'
        },
        {
            title: '备注',
            dataIndex: 'remark'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' }
        }
    ]
    export default {
        name: 'ProjectTeamSettingsList',
        components: {
            Edit,
            Info,
            CommonDrawer,
            ListLayout,
            SearchFormList,
            CommonButton,
            ImportExcel,
            'el-timeline': Timeline,
            'el-timeline-item': TimelineItem,
            SelectProject
        },
        data () {
            return {
                reverse: true,
                items: [],
                excelDrawer: false,
                excelImportData: [
                    {
                        attId: '9',
                        attFilePath: 'Excel大事记导入模板.xlsx',
                        attFileName: 'Excel大事记导入模板',
                        descriptionStr: '序号、内容、时间必填，部门可填，如果不填写，默认是八院'
                    }
                ],
                infoDrawer: false,
                id: '',
                selectTaskId: '',
                comp: this,
                drawerTitle: '',
                visibleEditDrawer: false,
                selectedRow: {},
                queryParam: {
                    time: ''
                },
                columns: columns,
                selectProjectVisible: false,
                searchData: [
                    {
                        type: 'datetimeRange',
                        labelText: '日期',
                        fieldName: 'time',
                        placeholder: ['开始日期', '结束日期'],
                        fieldConfig: {
                            format: 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'treeSelect', // 控件类型
                        defaultValue: [],
                        labelText: '部门', // 控件显示的文本
                        fieldName: 'deptId',
                        defaultExpandAll: true,
                        placeholder: '请选部门',
                        optionUrl: {
                            api: 'userManager.deptTree'
                        }
                    },
                    {
                        type: 'select', // 控件类型
                        labelText: '类型', // 控件显示的文本
                        fieldName: 'types',
                        placeholder: '请选择类型',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'QUALITY_DEVELOPMENT_STAGE' }
                        },
                        fieldConfig: {
                            multiple: true
                        }
                    },
                    {
                        type: 'text',
                        labelText: '项目名称',
                        fieldName: 'wholeDescribeName',
                        placeholder: '请输入项目名称'
                    }
                ]
            }
        },
        mounted () {
            this.getItems()
        },
        methods: {
            getItems () {
                let that = this
                this.$api['memorabilia.list'](that.queryParam).then(res => {
                    that.items = res
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            search (param) {
                if (param) {
                    if (param.time && param.time.length === 2) {
                        param.fromDate = param.time[0]
                        param.toDate = param.time[1]
                    } else {
                        param.fromDate = ''
                    }
                    this.queryParam = param
                }
                this.getItems()
            },
            reSet () {
                let that = this
                Object.keys(that.queryParam).forEach(key => {
                    that.queryParam[key] = ''
                })
            },
            createMemorabilia () {
                this.drawerTitle = '维护大事记'
                this.visibleEditDrawer = true
            },
            importExcel () {
                this.drawerTitle = '大事记Excel导入'
                this.excelDrawer = true
            },
            onExcelClose () {
                this.excelDrawer = false
            },
            importExcelClosed () {
                this.excelDrawer = false
                console.log('收到保存回调！！！')
                this.getItems()
            },
            exportExcel () {
                console.log(this.queryParam, 'this.queryParam')
                this.$api['memorabilia.exportExcel'](this.queryParam, { responseType: 'blob' }).then(data => {
                    let date = new Date()
                    // eslint-disable-next-line camelcase
                    let file_name = '大事记导出' + date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate()
                    // eslint-disable-next-line camelcase
                    let file_type = 'xls'
                    let blob = new Blob([data.data], { type: 'application/vnd.ms-excel' })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    // eslint-disable-next-line camelcase
                    link.download = `${file_name}.${file_type}`
                    document.body.appendChild(link)
                    link.click()
                }).catch((error) => {
                    console.log(error)
                })
            },
            saveCallback () {
                this.visibleEditDrawer = false
                this.infoDrawer = false
                this.getItems()
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
            showModal () {
                this.selectProjectVisible = true
            },
            closeProjectModal (selectedRow) {
                this.selectProjectVisible = false
                this.selectedRow = selectedRow
                let that = this
                that.queryParam.wholeDescribeId = selectedRow.id
            },
            showInfo (row) {
                console.log(row, 'row')
                this.drawerTitle = '编辑大事记'
                this.id = row.id
                this.infoDrawer = true
            },
            onInfoClose () {
                this.infoDrawer = false
                this.id = ''
            }
        }
    }
</script>
<style lang="scss" scoped>
    .el-timeline {
        padding-left: 45%;
    }

    .el-timeline-item-live-out :nth-child(3) {
        left: -200px;
    }

    .dd {
        border: 2px;
        border-radius: 5px;
        width: 150px;
        max-height: 100px;
        word-wrap: break-word;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        -webkit-line-clamp: 5;
        line-clamp: 5;
    }

    .yuan {
        width: 7px;
        height: 7px;
        border-radius: 0px;
        background: #FF6633;
        display: block;
        float: left;
        margin: 6px;
    }

    .aa {
        padding-top: 7px;
        right: 10px;
    }

    .selectedBtn {
        padding-bottom: 7px;
        padding-top: 7px;
        border: 2px dashed #1890ff;
        height: 28px;
    }
</style>
