<template>
    <div>
        <list-layout :headerVisible="addRow">
            <template #north>
                <el-button type="primary" :disabled="disabled" round @click="add">添加整改计划</el-button>
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
                                <template v-if="item.prop == 'getFiles'">
                                    <i class="el-icon-paperclip" :class="{'is-disabled': disabled}" @click="upload(scope.row)"></i>
                                </template>
                                <template v-else-if="item.prop == 'delete'">
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
        <add-info v-if="visibleInfo" :visible="visibleInfo" @saveInfo="getInfoData"
                  :record="record" @close-info="closeInfo"></add-info>
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
                    infoList: []
                },
                itemArr: [{
                    content: ''
                }],
                selectType: '1',
                visibleDutyPeopleName: false,
                visibleInfo: false,
                record: {}
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
                        label: '不符合现象描述',
                        prop: 'noConformity',
                        align: 'left'
                    },
                    {
                        label: '整改措施及举一反三要求',
                        prop: 'drawInferences',
                        align: 'left'
                    },
                    {
                        label: '责任人',
                        prop: 'dutyPeople',
                        align: 'center'
                    },
                    {
                        label: '完成形式',
                        prop: 'finishForm',
                        align: 'center'
                    },
                    {
                        label: '计划完成时间',
                        prop: 'planEndTime',
                        align: 'center'
                    },
                    {
                        label: '完成情况',
                        prop: 'finishSituation',
                        align: 'center'
                    },
                    {
                        label: '相关附件',
                        prop: 'getFiles',
                        width: '60',
                        align: 'center'
                    },
                    {
                        label: '删除',
                        prop: 'delete',
                        width: '60',
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
            setInfoList (value) {
                this.tableData = value
            },
            closeDutyPeopleName (selectedRows) {
                this.visibleDutyPeopleName = false
                this.formData.dutyPeople = selectedRows[0].realName
                this.formData = Object.assign({}, this.formData)
            },
            getInfoData (data) {
                let infoData = {
                    id: data.id,
                    noConformity: data.noConformity,
                    finishForm: data.finishForm,
                    dutyPeople: data.dutyPeople,
                    planEndTime: data.planEndTime,
                    drawInferences: data.drawInferences,
                    finishSituation: data.finishSituation,
                    getFiles: data.getFiles
                }
                this.tableData.push(infoData)
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
