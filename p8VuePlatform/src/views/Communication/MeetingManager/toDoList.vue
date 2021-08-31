<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   :dataSource="dataSource"
                   :form="formData"
                   :api="saveApi"
                   @saved="saved"
                   labelWidth="90px"
                   @rendered="rendered"
                   :isCustomValidate="true"
                   @custom-validate="parseCheck">
        </form-list>
        <template>
            <div>
                <editable-table :columns="paramColumns"
                                :renderHeight="renderHeight"
                                :addRow="true"
                                :params="params"
                                :api="tableConfigDetailsApi"
                                @save-param-data="saveParamData">
                    <template #personLiable="{scope, data}">
                        <!-- <el-input v-model="scope.row.personLiable"
                                  @blur="saveParamData(data)"></el-input> -->

                        <el-input v-model='scope.row.personLiable' readonly autosize placeholder="请选择责任人" @blur="saveParamData(data)">
                            <i
                                    v-if='selectedRow'
                                    class='el-icon-link'
                                    slot='suffix'
                                    type='link'
                                    @click='showModal1(scope)'
                                    :style='{ fontSize: "16px", color: "#08c" }'
                            ></i>
                        </el-input>
                        <select-user :dialogConfig="dialogConfig" v-if="visible1" :visible="visible1" :selected-row='selectedRow1' @close-dialog="closeModal"></select-user>
                    </template>
                    <template #confirmer="{scope, data}">
                        <el-input v-model="scope.row.confirmer"
                                  @blur="saveParamData(data)"></el-input>
                    </template>
                    <template #planStartTime="{scope, data}">
                        <el-date-picker v-model="scope.row.planStartTime"
                                        type="date"
                                        :value-format="valueFormat"
                                        @change="saveParamData(data)"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </template>
                    <template #planFinishTime="{scope, data}">
                        <el-date-picker v-model="scope.row.planFinishTime"
                                        type="date"
                                        :value-format="valueFormat"
                                        @change="saveParamData(data)"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </template>
                    <template #matter="{scope, data}">
                        <el-input v-model="scope.row.matter"
                                  @blur="saveParamData(data)"></el-input>
                    </template>
                    <template #remark="{scope, data}">
                        <el-input v-model="scope.row.remark"
                                  @blur="saveParamData(data)"></el-input>
                    </template>

                </editable-table>
            </div>

        </template>
    </div>
</template>

<script>
    import { Input, DatePicker } from '~/index'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/base16-dark.css'
    import 'codemirror/mode/sql/sql'
    import { P8Form as FormList } from '~/index'
    import { P8EditTable as EditableTable } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'

    export default {
        name: 'SqlEdit',
        components: {
            SelectUser,
            FormList,
            EditableTable,
            'el-date-picker': DatePicker,
            'el-input': Input
        },
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            return {
                renderHeight: height + 'px',
                valueFormat: 'yyyy-MM-dd',
                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'sql',
                    theme: 'base16-dark',
                    lineNumbers: true,
                    line: true
                    // more codemirror options, 更多 codemirror 的高级配置...
                },
                saveApi: 'meetingManager.TodolistSave',
                tableConfigDetailsApi: 'meetingManager.TodolistDetail',
                visible4: false,
                selectedRow3: {},
                visible1: false,
                visible2: false,
                selectedRow: {},
                selectedRow1: {},
                selectedRow2: {},
                dialogConfig: {
                    modal: false
                },
                dataSource: [

                ],
                formData: {
                    meetingId: this.id
                },
                paramColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '责任人',
                        dataIndex: 'personLiable',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '确认人',
                        dataIndex: 'confirmer',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '计划开始时间',
                        dataIndex: 'planStartTime',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '计划完成时间',
                        dataIndex: 'planFinishTime',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '事项',
                        dataIndex: 'matter',
                        default: undefined,
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                        default: undefined,
                        scopedSlots: { customRender: 'custom' }
                    }
                ],
                params: {},
                sqlParams: {},
                scopeValue: {}
            }
        },
        mounted () {
            this.params = { meetingId: this.id }
        },
        methods: {
            rendered () {
            },
            saveParamData (data) {
                console.log(data, 'data--param')
                this.sqlParams['meetingTodolistRequests'] = data
            },
            saved (res) {
                console.log('修改页面关闭时的回调方法')
                this.$emit('saveSuccess', res)
            },
            parseCheck (saveParams) {
                let params = { ...saveParams, ...this.sqlParams }
                let _this = this
                _this.$refs.form.submitForm(params, _this.saveApi)
            },
             showModal1 (scope) {
                this.scopeValue = scope
                this.visible1 = true
            },
             showModal2 (scope) {
                this.scopeValue = scope
                this.visible2 = true
            },
            closeModal (selectedRow1) {
                this.visible1 = false
                this.selectedRow1 = selectedRow1
                this.sqlParams.meetingTodolistRequests[this.scopeValue.$index].personLiable = this.selectedRow1[0].realName
            },
            closeModal2 (selectedRow2) {
                this.visible2 = false
                this.selectedRow2 = selectedRow2
                this.sqlParams.meetingTodolistRequests[this.scopeValue.$index].confirmer = this.selectedRow2[ 0 ].realName
            }
        }
    }
</script>
<style lang="scss">
    .milestoneMirror {
        .el-table {
            height: 95% !important;
        }
    }
</style>
