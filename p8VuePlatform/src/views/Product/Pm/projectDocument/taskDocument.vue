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
                      :default-expand-all="true">
                <el-table-column v-for="(item, index) in columns"
                                 :key="index"
                                 :prop="item.prop"
                                 :align='item.align'
                                 :type="item.type"
                                 :label="item.label"
                                 :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.prop == 'getFile' && scope.row.getFile != null && scope.row.getFile.length > 0">
                            <div @click="getAttachment(scope.row,item)">
                                <i class="el-icon-paperclip"></i>
                            </div>
                        </template>
                        <template v-else>
                            <span>{{ scope.row[item.prop] }}</span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </list-layout>
</template>

<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import { Table, TableColumn } from '~/index'

    const mh = document.documentElement.clientHeight - 165
    export default {
        name: 'taskDocument',
        props: {
            record: {
                type: Object
            }
        },
        components: {
            ListLayout,
            SearchFormList,
            'el-table': Table,
            'el-table-column': TableColumn
        },
        data () {
            const searchData = [
                {
                    type: 'text', // 控件类型
                    labelText: '输出件',
                    fieldName: 'name',
                    placeholder: '请输入输出件'
                },
                {
                    type: 'text', // 控件类型
                    labelText: '输出人',
                    fieldName: 'taskUserId',
                    placeholder: '请输入输出人'
                },
                {
                    type: 'text', // 控件类型
                    labelText: '任务名称',
                    fieldName: 'taskName',
                    placeholder: '请输入任务名称'
                },
                {
                    type: 'select',
                    defaultValue: '',
                    optionUrl: {
                        api: 'thirdPartInterface.getDic',
                        params: { dicType: 'TASK_STATUS' }
                    },
                    options: [],
                    labelText: '状态', // 控件显示的文本
                    fieldName: 'status',
                    placeholder: '选择状态',
                    fieldConfig: {
                        multiple: true
                    }
                }
            ]
            return {
                tableApi: 'projectDocument.proDocOResult',
                flexHeight: mh,
                tableData: [],
                searchData,
                tableConfig: {
                    expandIconColumnIndex: 2
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
                        prop: 'id',
                        align: 'center'
                    },
                    {
                        label: '输出件',
                        prop: 'name',
                        width: '150',
                        align: 'center'
                    },
                    {
                        label: '输出人',
                        prop: 'taskUserId',
                        align: 'center'
                    },
                    {
                        label: '提交时间',
                        prop: 'itemCreateTime',
                        align: 'center'
                    },
                    {
                        label: '任务名称',
                        prop: 'taskName',
                        align: 'center'
                    },
                    {
                        label: '责任人',
                        prop: 'taskUserId',
                        align: 'center'
                    },
                    {
                        label: '责任人部门',
                        prop: 'departId',
                        align: 'center'
                    },
                    {
                        label: '计划开始时间',
                        prop: 'planBeginDate',
                        align: 'center'
                    },
                    {
                        label: '计划结束时间',
                        prop: 'planEndDate',
                        align: 'center'
                    },
                    {
                        label: '状态',
                        prop: 'status',
                        align: 'center'
                    },
                    {
                        label: '附件',
                        prop: 'getFile',
                        align: 'center'
                    }
                ]
                this.columns = columns
            },
            search (param) {
                console.log(param, 'pppppppppp')
                let req = {
                    projectId: this.record.projectId,
                    name: param.name,
                    taskUserId: param.taskUserId,
                    taskName: param.taskName,
                    status: param.status.toString()
                }
                if (param) {
                    this.$api[this.tableApi](req).then(res => {
                        let data = res

                        if (data && data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                data[i].id = i + 1
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
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            queryList () {
                const that = this
                this.tableRefresh(new Promise((resolve, reject) => {
                    if (that.tableApi) {
                        that.$api[that.tableApi]({ projectId: this.record.projectId }).then(function (res) {
                            let data = res
                            if (data && data.length > 0) {
                                for (let i = 0; i < data.length; i++) {
                                    data[i].id = i + 1
                                }
                            }

                            // if (data && data.length > 0) {
                            //     data.forEach(function (item, idx) {
                            //         that.setItemKey(item)
                            //     })
                            // }
                            that.tableData = data
                            resolve()// 调用列表接口成功后的回调方法
                        }).catch(function (error) {
                            reject(error) // 调用列表接口失败后的回调方法
                        })
                    }
                }))
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
