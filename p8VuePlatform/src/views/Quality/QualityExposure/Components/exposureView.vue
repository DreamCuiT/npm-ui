<template>
    <common-dialog
            :title="title"
            :visible="visible"
            width="90%"
            :dialogHeight="700"
            @close="handleCancel"
            :showHandleBtn="false"
            :dialogConfig="dialogConfig"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
        <template #dialog>
            <el-table ref="table" :border="true" height="100%" :data="tableData">
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
        </template>
    </common-dialog>
</template>

<script>
    import { Table, TableColumn } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'
    export default {
        name: 'exposureView',
        components: {
            'el-table': Table,
            'el-table-column': TableColumn,
            CommonDialog
        },
        props: {
            record: {
                type: Object
            },
            visible: {
                type: Boolean
            }
        },
        data () {
            const mh = document.documentElement.clientHeight - 260
            return {
                title: '查看',
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                },
                flexHeight: mh,
                tableData: []
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
            queryList () {
                this.$api['qualityExposure.getExposureInfo']({ id: this.record.record.id }).then(res => {
                    this.tableData = res
                })
            },
            handleCancel (e) {
                this.$emit('close-modal')
            }
        }
    }
</script>

<style scoped>
    .el-i {
        display: none;
    }
</style>
