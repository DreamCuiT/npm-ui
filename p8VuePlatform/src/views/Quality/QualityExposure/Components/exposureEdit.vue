<template>
    <list-layout :headerVisible="addRow">
        <template #north>
            <el-button type="primary" :disabled="disabled" round @click="add">添加曝光情况</el-button>
        </template>
        <template #center>
            <div class="common-table" :style="{height: flexHeight }">
                <el-table ref="table" height="100%" :data="tableData">
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
                            <template v-if="item.prop == 'flightUnit'">
                                <el-input v-model="scope.row[item.prop]" @click.native="clickDepart($event, item.prop, scope.row)">
                                </el-input>
                            </template>
                            <template v-if="item.prop == 'star1'">
                                <div v-if="scope.row.star1 == 1" style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-star-off el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'star2'">
                                <div v-if="scope.row.star2 == 1" style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-star-off el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'star3'">
                                <div v-if="scope.row.star3 == 1" style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-star-off el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'star4'">
                                <div v-if="scope.row.star4 == 1" style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-star-off el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'star5'">
                                <div v-if="scope.row.star5 == 1" style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-star-off"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-star-off el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'round1'">
                                <div v-if="scope.row.round1 == 1" style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-remove"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-remove el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'round2'">
                                <div v-if="scope.row.round2 == 1" style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-remove"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-remove el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'round3'">
                                <div v-if="scope.row.round3 == 1" style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-remove"></i>
                                </div>
                                <div v-else style="width: 100px; height: 40px"
                                     @click="clickFun($event, item.prop, scope.row)">
                                    <i class="el-icon-remove el-i"></i>
                                </div>
                            </template>
                            <template v-if="item.prop == 'delete'">
                                <i class="el-icon-delete" :class="{'is-disabled': disabled}" @click="remove(scope)"></i>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <select-depart v-if="visibleFlightUnit" :visible="visibleFlightUnit"
                               @close-dialog="flightUnitClose"></select-depart>
            </div>
        </template>
    </list-layout>

</template>
<script>
    import { Button, Table, Input, TableColumn } from '~/index'
    import { P8ListLayout as ListLayout } from '~/index'
    import SelectDepart from '../../../QualitySystem/UncorrectionItems/SelectDept'
    export default {
        name: 'EditableTable',
        components: {
            'el-button': Button,
            'el-table': Table,
            'el-input': Input,
            'el-table-column': TableColumn,
            SelectDepart,
            ListLayout
        },
        props: {
            addRow: {
                type: Boolean,
                default: false
            },
            /**
             * disabled: 禁用: 传参为true: 新建按钮和行删除按钮禁用, 剩余编辑的单元格在当前页面做禁用处理
             */
            disabled: {
                type: Boolean,
                default: false
            },
            params: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            renderHeight: {
                type: String,
                default: '100%'
            }
        },
        data () {
            return {
                flexHeight: this.renderHeight,
                columns: [],
                tableData: [],
                departments: [],
                clickIndex: '',
                clickProp: '',
                sqlParams: {},
                formData: {
                    infoList: []
                },
                visibleFlightUnit: false,
                itemArr: [{
                    content: ''
                }],
                tableIndex: '0'
            }
        },
        created () {
            this.initColumns()
        },
        mounted () {
            this.getDepartments()
        },
        methods: {
            initColumns: function () {
                let that = this
                const columns = [
                    {
                        label: '单位',
                        prop: 'flightUnit',
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
                    },
                    {
                        label: '删除',
                        prop: 'delete',
                        align: 'center'
                    }
                ]
                that.columns = columns
            },
            _initTableSize () {
                const vm = this
                let timer = null
                // 这里增加一个延迟保证不会触发频次不会太高,减少开销
                if (timer) return
                timer = setTimeout(() => {
                    vm.flexHeight = '100%'
                    timer = null
                }, 300)
            },
            add () {
                let index
                if (this.tableData == null) {
                    index = 0
                    let newValue = [{
                        index: index,
                        flightUnit: '',
                        star1: '0',
                        star2: '0',
                        star3: '0',
                        star4: '0',
                        star5: '0',
                        round1: '0',
                        round2: '0',
                        round3: '0'
                    }]
                    this.tableData = newValue
                } else {
                    index = this.tableData.length
                    let newValue = {
                        index: index,
                        flightUnit: '',
                        star1: '',
                        star2: '',
                        star3: '',
                        star4: '',
                        star5: '',
                        round1: '',
                        round2: '',
                        round3: ''
                    }
                    this.tableData.push(newValue)
                }
                this.$emit('getExposure', this.tableData)
            },
            remove (scope) {
                if (this.disabled) {
                    return
                }
                let index = this.tableData.indexOf(scope.row)
                this.tableData.splice(index, 1)
                this.$emit('getExposure', this.tableData)
            },
            getDepartments () {
                let that = this
                this.$api['userManager.deptTree']().then(res => {
                    that.departments = res
                })
            },
            saveParamData (value) {
                this.sqlParams['infoList'] = value
                this.formData.infoList = value
            },
            setInfoList (value) {
                this.tableData = value
            },
            dataToTable (index, prop, value) {
                if (prop === 'star1') {
                    this.tableData[index].star1 = value
                }
                if (prop === 'star2') {
                    this.tableData[index].star2 = value
                }
                if (prop === 'star3') {
                    this.tableData[index].star3 = value
                }
                if (prop === 'star4') {
                    this.tableData[index].star4 = value
                }
                if (prop === 'star5') {
                    this.tableData[index].star5 = value
                }
                if (prop === 'round1') {
                    this.tableData[index].round1 = value
                }
                if (prop === 'round2') {
                    this.tableData[index].round2 = value
                }
                if (prop === 'round3') {
                    this.tableData[index].round3 = value
                }
                this.$emit('getExposure', this.tableData)
            },

            clickFun (e, prop, row) {
                if (e.currentTarget.firstElementChild.classList.contains('el-i')) {
                    e.currentTarget.firstElementChild.classList.remove('el-i')
                    this.dataToTable(row.index, prop, 1)
                } else {
                    e.currentTarget.firstElementChild.classList.add('el-i')
                    this.dataToTable(row.index, prop, 0)
                }
            },
            clickDepart (e, prop, row) {
                this.tableIndex = row.index
                this.visibleFlightUnit = true
            },
            flightUnitClose (selectedRows) {
                this.visibleFlightUnit = false
                if (selectedRows) {
                    let index = this.tableIndex
                    this.tableData[index].flightUnit = selectedRows.name
                    this.$emit('getExposure', this.tableData)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .el-icon-delete{
        font-size:20px;
        line-height:24px;
        cursor:pointer;

        &:hover{
            color: $base-light-color;
        }

        &.is-disabled {
            cursor: not-allowed;
            color: #999;
            &:hover {
                color: #999
            }
        }
    }
    /*#centerHead{*/
    /*    height: 71px;*/
    /*}*/

    .el-i {
        display: none;
    }
    .tableDiv .div {
        display: none;
    }
    .current-cell .div {
        display: block;
    }
    .current-cell .div + span {
        display: none;
    }
    .tableDiv .div {
        display: none;
    }
    .current-cell .div {
        display: block;
    }
    .current-cell .div + span {
        display: none;
    }
</style>
