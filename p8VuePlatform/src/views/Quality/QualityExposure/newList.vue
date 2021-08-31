<template>
    <list-layout>
        <template #north>
            <el-button class="button" type="primary" v-on:click="maintain()">维护</el-button>
            <search-form-list ref="search" :dataSource="searchData"
                              @search="search"></search-form-list>
        </template>
        <template #center>
            <div class="tableDiv">
                <el-table ref="table" :border="true" :data="tableData">
                    <el-table-column type="index"
                                     label="序号"
                                     align="center"></el-table-column>
                    <el-table-column v-for="(item, index) in columns"
                                     :key="index"
                                     :prop="item.prop"
                                     :align='item.align'
                                     :type="item.type"
                                     :label="item.label"
                                     :width="item.width">
                        <template slot-scope="scope">
                            <template v-if="item.prop == 'flightUnitName'">
                                <span>{{ scope.row[item.prop] }}</span>
                            </template>
                            <template v-if="item.prop == 'star1'">
                                <div v-if="scope.row.star1 == 1" style="width: 100px; height: 40px">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px">
                                    <i class="el-icon-star-off el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'star2'">
                                <div v-if="scope.row.star2 == 1" style="width: 100px; height: 40px">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px">
                                    <i class="el-icon-star-off el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'star3'">
                                <div v-if="scope.row.star3 == 1" style="width: 100px; height: 40px">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px">
                                    <i class="el-icon-star-off el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'star4'">
                                <div v-if="scope.row.star4 == 1" style="width: 100px; height: 40px">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px">
                                    <i class="el-icon-star-off el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'star5'">
                                <div v-if="scope.row.star5 == 1" style="width: 100px; height: 40px">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px">
                                    <i class="el-icon-star-off el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'round1'">
                                <div v-if="scope.row.round1 == 1" style="width: 100px; height: 40px">
                                    <i class="el-icon-remove"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px">
                                    <i class="el-icon-remove el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'round2'">
                                <div v-if="scope.row.round2 == 1" style="width: 100px; height: 40px">
                                    <i class="el-icon-remove"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px">
                                    <i class="el-icon-remove el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'round3'">
                                <div v-if="scope.row.round3 == 1" style="width: 100px; height: 40px">
                                    <i class="el-icon-remove"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px">
                                    <i class="el-icon-remove el-i"></i>
                                </div>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
        <template #drawer-panel>
            <common-drawer :title="drawerTitle"
                           :visible="drawerVisible"
                           size="100%"
                           @close="onDrawerClose">
                <template #drawer>
                    <maintain-list></maintain-list>
                </template>
            </common-drawer>
        </template>
    </list-layout>
</template>

<script>
    import { Table, TableColumn, Button } from '~/index'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8Drawer as CommonDrawer } from '~/index'
    import maintainList from './Components/maintainList'
    import { P8Search as SearchFormList } from '~/index'
    export default {
        name: 'newList',
        components: {
            'el-button': Button,
            'el-table': Table,
            ListLayout,
            CommonDrawer,
            maintainList,
            SearchFormList,
            'el-table-column': TableColumn
        },
        data () {
            const searchData = [
                {
                    type: 'text', // 控件类型
                    labelText: '飞行试验', // 控件显示的文本
                    fieldName: 'flightTestId',
                    placeholder: '请输入飞行试验'
                }
            ]
            return {
                title: '查看',
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                },
                tableData: [],
                drawerTitle: '信息维护',
                drawerVisible: false,
                searchData
            }
        },
        created () {
            this.initColumns()
        },
        mounted () {
            this.queryList()
        },
        methods: {
            initColumns: function () {
                let that = this
                const columns = [
                    {
                        label: '单位',
                        prop: 'flightUnitName',
                        width: '150px',
                        align: 'center'
                    },
                    {
                        label: '五角星',
                        prop: 'star1',
                        align: 'center'
                    },
                    {
                        label: '',
                        prop: 'star2',
                        align: 'center'
                    },
                    {
                        label: '',
                        prop: 'star3',
                        align: 'center'
                    },
                    {
                        label: '',
                        prop: 'star4',
                        align: 'center'
                    },
                    {
                        label: '',
                        prop: 'star5',
                        align: 'center'
                    },
                    {
                        label: '黑色圆点',
                        prop: 'round1',
                        align: 'center'
                    },
                    {
                        label: '',
                        prop: 'round2',
                        align: 'center'
                    },
                    {
                        label: '',
                        prop: 'round3',
                        align: 'center'
                    }
                ]
                that.columns = columns
            },
            search (params) {
                this.queryParam = params
                this.$api['qualityExposure.getNewExposureInfo'](this.queryParam).then(res => {
                    this.tableData = res
                })
            },
            queryList () {
                this.$api['qualityExposure.getNewExposureInfo']({ id: '' }).then(res => {
                    this.tableData = res
                })
            },
            onDrawerClose () {
                this.drawerVisible = false
                this.queryList()
            },
            maintain () {
               this.drawerVisible = true
            }
        }
    }
</script>

<style scoped>
    .el-i {
        display: none;
    }
    .button{
        padding: 8px 20px;
        margin-right: 5px;
        background-color: #0070c5;
        border-color: #0070c5;
        border-radius: 20px;
    }
</style>
