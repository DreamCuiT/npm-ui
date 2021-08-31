<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   :other-param="otherParam">
            <template #reporter>
                <el-input v-model="formData.reporter" @click.native="visibleReporter=true">
                </el-input>
            </template>
        </form-list>

        <template>
            <div>
                <editable-table :columns="paramColumns"
                                :renderHeight="renderHeight"
                                :addRow="true"
                                :params="params"
                                :api="tableConfigDetailsApi"
                                @save-param-data="saveParamData">
                    <template #equipmentCode="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.equipmentCode"
                                    :content="scope.row.equipmentCode">
                            <el-input v-model="scope.row.equipmentCode"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #equipmentName="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.equipmentName"
                                    :content="scope.row.equipmentName">
                            <el-input v-model="scope.row.equipmentName"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #modelName="{scope, data}">
                        <el-input v-model="scope.row.modelName"
                                  readonly
                                  autosize
                                  placeholder="请选择型号"
                                  v-on:click.native="showModal(scope)"
                                  @blur="saveParamData(data)">
                        </el-input>
                    </template>
                    <template #centralizedManagement="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.centralizedManagement"
                                    :content="scope.row.centralizedManagement">
                            <el-input v-model="scope.row.centralizedManagement"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #remark="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.remark"
                                    :content="scope.row.remark">
                            <el-input v-model="scope.row.remark"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                </editable-table>
            </div>
        </template>

        <select-user v-if="visibleReporter" :visible="visibleReporter"
                     :selectType="1" @close-dialog="closeModalReporter"></select-user>
        <select-model v-if='selectModelVisible' :selected-row='selectedRow'
                     :visible='selectModelVisible'
                        @close-modal='closeProjectModal'></select-model>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import EditableTable from './editTable'
    import { Input, Tooltip } from '~/index'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/base16-dark.css'
    import 'codemirror/mode/sql/sql'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectModel from '@/views/Quality/QualityProblem/SelectModel'

    export default {
        name: 'wholeDescribe',
        components: {
            FormList,
            'el-input': Input,
            EditableTable,
            'el-tooltip': Tooltip,
            SelectUser,
            SelectModel
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            return {
                saveApi: 'MeteringTest.save',
                otherParam: {},
                formData: {
                    reporter: '',
                    reportUnit: '',
                    infoList: []
                },
                visibleReporter: false,
                selectedRow: {},
                selectModelVisible: false,
                scopeValue: {},
                valueFormat: 'yyyy-MM-dd',
                valueFormatTime: 'yyyy-MM-dd HH:mm:ss',
                renderHeight: height + 'px',
                tableConfigDetailsApi: 'MeteringTest.detail',
                paramColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: '45px',
                        align: 'center'
                    },
                    {
                        title: '设备编号',
                        dataIndex: 'equipmentCode',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '设备名称',
                        dataIndex: 'equipmentName',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '所属型号',
                        dataIndex: 'modelName',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '归口管理',
                        dataIndex: 'centralizedManagement',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    }
                ],
                params: { id: this.record.meteringTestId },
                sqlParams: {},
                dataSource: [
                    {
                        type: 'treeSelect',
                        labelText: '填报单位',
                        fieldName: 'reportUnit',
                        placeholder: '请选择所属单位',
                        defaultExpandAll: true,
                        colLayout: 'doubleCol',
                        disabledValues: ['1'],
                        defaultExpandedKeys: ['1'],
                        optionUrl: {
                            api: 'userManager.deptTree'
                        },
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'select',
                        labelText: '密级',
                        fieldName: 'secretGrade',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'SECRET_LEVEL' }
                        },
                        options: [],
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'datetime',
                        labelText: '制单日期',
                        fieldName: 'reportTime',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'select',
                        labelText: '类型',
                        fieldName: 'type',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: '集团质量通报',
                                value: '集团质量通报'
                            },
                            {
                                label: '场所质量通报',
                                value: '场所质量通报'
                            }
                        ],
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'textarea',
                        labelText: '备注',
                        fieldName: 'remark',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '填表人',
                        fieldName: 'reporter',
                        slotName: 'reporter',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    }
                ]
            }
        },
        mounted () {
            if (this.record.id == null) {
                this.getUser()
            }
        },
        methods: {
            saveParamData (data) {
                this.sqlParams['infoList'] = data
                this.formData.infoList = data
            },
            parseCheck (saveParams) {
                let params = { ...saveParams, ...this.sqlParams }
                let _this = this
                _this.$refs.form.submitForm(params, _this.saveApi)
            },
            rendered () {
                if (this.record.meteringTestId != null && this.record.meteringTestId !== '') {
                    this.getProblem(this.record.meteringTestId)
                }
            },
            getProblem (currEntityId) {
                let that = this
                this.$api['MeteringTest.getInfo']({ id: currEntityId }).then(res => {
                    that.formData = res
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('saveSuccess', res)
            },
            handleChange (info) {
                console.log(info, 'info')
            },
            getUser () {
                this.formData.reporter = this.$store.getters.userName
                this.formData.reportUnit = this.$store.getters.userInfo.departmentId
            },
            closeModalReporter (selectedRows) {
                this.visibleReporter = false
                this.formData.reporter = selectedRows[0].realName
            },
            showModal (scope) {
                this.scopeValue = scope
                this.selectModelVisible = true
            },
            closeProjectModal (selectedRow) {
                this.selectModelVisible = false
                this.selectedRow = selectedRow
                if (this.selectedRow) {
                    let that = this
                    that.sqlParams.infoList[that.scopeValue.$index].modelInformationId = selectedRow.id
                    that.sqlParams.infoList[that.scopeValue.$index].modelName = selectedRow.modelName
                }
            }
        }
    }
</script>

<style scoped>

</style>
