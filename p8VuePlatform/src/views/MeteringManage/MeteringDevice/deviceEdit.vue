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
                    <template #deviceName="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.deviceName"
                                    :content="scope.row.deviceName">
                            <el-input v-model="scope.row.deviceName"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #deviceCode="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.deviceCode"
                                    :content="scope.row.deviceCode">
                            <el-input v-model="scope.row.deviceCode"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #reexaminationValidity="{scope, data}">
                        <el-date-picker v-model="scope.row.reexaminationValidity"
                                        type="date"
                                        :value-format="valueFormat"
                                        @change="saveParamData(data)"
                                        placeholder="选择时间">
                        </el-date-picker>
                    </template>
                    <template #certificateNumber="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.certificateNumber"
                                    :content="scope.row.certificateNumber">
                            <el-input v-model="scope.row.certificateNumber"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #constructionDate="{scope, data}">
                        <el-date-picker v-model="scope.row.constructionDate"
                                        type="date"
                                        :value-format="valueFormat"
                                        @change="saveParamData(data)"
                                        placeholder="选择时间">
                        </el-date-picker>
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
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import EditableTable from './editTable'
    import { Input, DatePicker, Tooltip } from '~/index'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/base16-dark.css'
    import 'codemirror/mode/sql/sql'
    import { P8SelectUser as SelectUser } from '~/index'

    export default {
        name: 'wholeDescribe',
        components: {
            FormList,
            'el-input': Input,
            EditableTable,
            'el-date-picker': DatePicker,
            'el-tooltip': Tooltip,
            SelectUser
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            return {
                saveApi: 'MeteringDevice.save',
                otherParam: {},
                formData: {
                    reporter: '',
                    reportUnit: '',
                    infoList: []
                },
                visibleReporter: false,
                valueFormat: 'yyyy-MM-dd',
                valueFormatTime: 'yyyy-MM-dd HH:mm:ss',
                renderHeight: height + 'px',
                tableConfigDetailsApi: 'MeteringDevice.detail',
                paramColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: '45px',
                        align: 'center'
                    },
                    {
                        title: '标准装置名称',
                        dataIndex: 'deviceName',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '标准装置编码',
                        dataIndex: 'deviceCode',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '复查有效期',
                        dataIndex: 'reexaminationValidity',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '证书号',
                        dataIndex: 'certificateNumber',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '建标日期',
                        dataIndex: 'constructionDate',
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
                params: { id: this.record.meteringDeviceId },
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
                if (this.record.meteringDeviceId != null && this.record.meteringDeviceId !== '') {
                    this.getProblem(this.record.meteringDeviceId)
                }
            },
            getProblem (currEntityId) {
                let that = this
                this.$api['MeteringDevice.getInfo']({ id: currEntityId }).then(res => {
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
            }
        }
    }
</script>

<style scoped>

</style>
