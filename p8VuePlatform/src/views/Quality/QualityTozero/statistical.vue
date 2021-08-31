<template>
    <list-layout>
        <template #north>
            <common-button :comp="comp"></common-button>
            <search-form-list ref="search" :dataSource="searchData" @search="search" @re-set="reSet"></search-form-list>
        </template>
        <template #center>
            <common-table ref="table" :columns="columns" :params="queryParam"
                          :api="tableApi" :table-Refresh="tableRefresh" :pagination="true">
            </common-table>
        </template>
    </list-layout>
</template>
<script>
    import Vue from 'vue'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import { P8Button as CommonButton } from '~/index'

    export default {
        name: 'list',
        data () {
            const columns = [
                {
                    title: '序号',
                    type: 'index',
                    width: 45,
                    align: 'center'
                },
                {
                    title: '型号代号',
                    dataIndex: 'modelName',
                    width: 300,
                    align: 'center'
                },
                {
                    title: '单位',
                    dataIndex: 'unitName',
                    formatter: function (row) {
                        if (row.punitName) {
                            return row.punitName + '-' + row.unitName
                        } else {
                            return row.unitName
                        }
                    },
                    width: 450,
                    align: 'center'
                },
                {
                    title: '总数',
                    dataIndex: 'total',
                    width: 230,
                    align: 'center'
                },
                {
                    title: '1个月以下',
                    dataIndex: 'oneMonth',
                    width: 230,
                    align: 'center'
                },
                {
                    title: '2~3个月',
                    dataIndex: 'twoMonth',
                    width: 230,
                    align: 'center'
                },
                {
                    title: '3个月以上',
                    dataIndex: 'month',
                    width: 230,
                    align: 'center'
                }
            ]
            return {
                columns: columns,
                tableApi: 'tozero.statistical',
                queryParam: {
                    entryDate: ''
                },
                searchData: [
                    {
                        type: 'datetimeRange',
                        labelText: '创建日期',
                        fieldName: 'entryDate',
                        placeholder: ['开始日期', '结束日期'],
                        fieldConfig: {
                            format: 'yyyy-MM-dd'
                        }
                    }
                ],
                comp: this,
                drawerTitle: null,
                drawerVisible: false,
                record: {}
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
                    if (param.entryDate && param.entryDate.length === 2) {
                        param.beginDate = param.entryDate[0]
                        param.endDate = param.entryDate[1]
                    }
                    this.queryParam = param
                }
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reSet () {
                let that = this
                Object.keys(that.queryParam).forEach(key => { that.queryParam[key] = '' })
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            exportExcel () {
                this.$api['tozero.exportExcelStatistical'](this.queryParam, { responseType: 'blob' }).then(function (data) {
                    let date = new Date()
                    // eslint-disable-next-line camelcase
                    let file_name = '质量归零数据导出' + date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate()
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
            }
        },
        components: {
            ListLayout,
            CommonTable,
            CommonButton,
            SearchFormList
        }
    }
</script>

<style scoped>

</style>
