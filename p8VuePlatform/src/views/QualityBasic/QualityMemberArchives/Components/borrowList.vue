<template>
    <div>
        <list-layout :headerVisible="addRow">
            <template #north>
                <el-button type="primary" :disabled="disabled" round @click="add">添加领用记录</el-button>
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
                                <template v-if="item.prop == 'delete'">
                                    <i class="el-icon-s-tools" :class="{'is-disabled': disabled}" @click="updateInfo(scope)"></i>
                                    <i class="el-icon-delete" :class="{'is-disabled': disabled}" @click="remove(scope)"></i>
                                </template>
                                <template v-else>
                                    <span>{{ scope.row[item.prop] }}</span>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
        </list-layout>
        <select-user v-if="visibleDutyPeopleName" :visible="visibleDutyPeopleName"
                     :selectType="selectType" @close-dialog="closeDutyPeopleName"></select-user>
        <add-info v-if="visibleInfo" :visible="visibleInfo" @saveInfo="getInfoData" @removeInfoData="removeInfoData"
                  :record="record" :whether="whether" @close-info="closeInfo"></add-info>
    </div>
</template>
<script>
    import { Button, Table, TableColumn } from '~/index'
    import { P8ListLayout as ListLayout } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import AddInfo from './AddInfo'
    export default {
        name: 'EditableTable',
        components: {
            AddInfo,
            'el-button': Button,
            'el-table': Table,
            'el-table-column': TableColumn,
            ListLayout,
            SelectUser
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
                valueFormatTime: 'yyyy-MM-dd',
                flexHeight: this.renderHeight,
                columns: [],
                tableData: [],
                departments: [],
                clickIndex: '',
                clickProp: '',
                sqlParams: {},
                formData: {
                    borrowList: []
                },
                itemArr: [{
                    content: ''
                }],
                selectType: '1',
                visibleDutyPeopleName: false,
                visibleInfo: false,
                record: {},
                whether: ''
            }
        },
        created () {
            this.initColumns()
        },
        methods: {
            initColumns: function () {
                let that = this
                const columns = [
                    {
                        label: '单据号',
                        prop: 'code',
                        align: 'left'
                    },
                    {
                        label: '领用日期',
                        prop: 'borrowTime',
                        align: 'center'
                    },
                    {
                        label: '制单人',
                        prop: 'creator',
                        align: 'center'
                    },
                    {
                        label: '制单日期',
                        prop: 'createTime',
                        align: 'center'
                    },
                    {
                        label: '审批人',
                        prop: 'approver',
                        align: 'center'
                    },
                    {
                        label: '审批日期',
                        prop: 'approvalTime',
                        align: 'center'
                    },
                    {
                        label: '审批意见',
                        prop: 'approvalSuggest',
                        align: 'center'
                    },
                    {
                        label: '检验印章号',
                        prop: 'sealNum',
                        align: 'center'
                    },
                    {
                        label: '印章名称',
                        prop: 'sealName',
                        width: '80',
                        align: 'center'
                    },
                    {
                        label: '修改/删除',
                        prop: 'delete',
                        width: '100',
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
                this.whether = '0'.toString()
                this.record = {}
                this.visibleInfo = true
            },
            upload (row) {
                this.importIndex = row.index.toString()
                if (this.tableData[row.index].getFiles) {
                    this.file = this.tableData[row.index].getFiles
                }
                this.exposureImportVisible = true
            },
            remove (scope) {
                if (this.disabled) {
                    return
                }
                let index = this.tableData.indexOf(scope.row)
                this.tableData.splice(index, 1)
                this.$emit('getExposure', this.tableData)
            },
            removeInfoData (data) {
                let index = this.tableData.indexOf(data)
                this.tableData.splice(index, 1)
                this.$emit('getExposure', this.tableData)
            },
            updateInfo (scope) {
                console.log(scope.row)
                this.whether = '0'.toString()
                this.record = scope.row
                this.visibleInfo = true
            },
            setInfoList (value) {
                this.tableData = value
            },
            closeDutyPeopleName (selectedRows) {
                this.visibleDutyPeopleName = false
                this.formData.dutyPeople = selectedRows[0].realName
                this.formData = Object.assign({}, this.formData)
            },
            getInfoData (data) {
                this.tableData.push(data)
                this.tableData.type = '0'
                this.$emit('getInfoData', this.tableData)
            },
            closeInfo () {
                this.visibleInfo = false
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>
