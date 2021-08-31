<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   :other-param="otherParam">
            <template #responsiblePerson>
                <el-input v-model="formData.responsiblePerson"
                          @click.native="visibleResponsiblePerson=true">
                </el-input>
            </template>
            <template #responsibleUnit>
                <el-input v-model="formData.responsibleUnitName" @click.native="visibleDept1=true">
                </el-input>
            </template>
            <template #responsibleDept>
                <el-input v-model="formData.responsibleDeptName" @click.native="visibleDept2=true">
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
                    <template #opinionProponent="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.opinionProponent"
                                    :content="scope.row.opinionProponent">
                            <el-input v-model="scope.row.opinionProponent"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #completionTime="{scope, data}">
                        <el-date-picker v-model="scope.row.completionTime"
                                        type="date"
                                        :value-format="valueFormat"
                                        @change="saveParamData(data)"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </template>
                    <template #opinion="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.opinion"
                                    :content="scope.row.opinion">
                            <el-input v-model="scope.row.opinion"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #measures="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.measures"
                                    :content="scope.row.measures">
                            <el-input v-model="scope.row.measures"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #completionSituation="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.completionSituation"
                                    :content="scope.row.completionSituation">
                            <el-input v-model="scope.row.completionSituation"
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

        <select-user v-if="visibleResponsiblePerson" :visible="visibleResponsiblePerson"
                     :selectType="selectType" @close-dialog="closeModalResponsiblePerson"></select-user>
        <select-dept v-if="visibleDept1" :visible="visibleDept1"
                     @close-dialog="closeDept1"></select-dept>
        <select-dept v-if="visibleDept2" :visible="visibleDept2"
                     @close-dialog="closeDept2"></select-dept>
    </div>
</template>

<script>
    import { P8SelectUser as SelectUser } from '~/index'
    import { P8Form as FormList } from '~/index'
    import EditableTable from './editTable'
    import { Input, Tooltip, DatePicker } from '~/index'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/base16-dark.css'
    import 'codemirror/mode/sql/sql'
    import SelectDept from '@/views/QualitySystem/UncorrectionItems/SelectDept'

    export default {
        name: 'wholeDescribe',
        components: {
            FormList,
            SelectUser,
            'el-tooltip': Tooltip,
            'el-input': Input,
            EditableTable,
            'el-date-picker': DatePicker,
            SelectDept
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            return {
                saveApi: 'CustomerOpinion.save',
                selectedRow: {},
                selectedRows: [],
                selectedRowKeys: [],
                selectedRowFile: {},
                scopeValue: {},
                selectFileVisible: false,
                visible: false,
                visible2: false,
                visibleResponsiblePerson: false,
                visibleAuditer: false,
                visibleEntourage: false,
                visibleDept1: false,
                visibleDept2: false,
                otherParam: {},
                formData: {
                    responsiblePerson: '',
                    responsibleUnit: '',
                    responsibleDept: '',
                    auditer: '',
                    entourage: '',
                    infoList: [],
                    getFile: []
                },
                selectType: '1',
                secretGradeTypes: [],
                drawInferencesDeptTypes: [],
                disabledRow: [],
                valueFormat: 'yyyy-MM-dd',
                renderHeight: height + 'px',
                tableConfigDetailsApi: 'CustomerOpinion.detail',
                paramColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: '45px',
                        align: 'center'
                    },
                    {
                        title: '意见提出方',
                        dataIndex: 'opinionProponent',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '完成时间',
                        dataIndex: 'completionTime',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '意见',
                        dataIndex: 'opinion',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '措施',
                        dataIndex: 'measures',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '完成情况',
                        dataIndex: 'completionSituation',
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
                params: { id: this.record.id },
                sqlParams: {},
                dataSource: [
                    {
                        type: 'text',
                        labelText: '编号',
                        fieldName: 'code',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'select',
                        labelText: '表单密级',
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
                        type: 'blank',
                        labelText: '责任单位',
                        fieldName: 'responsibleUnit',
                        slotName: 'responsibleUnit',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '责任人',
                        fieldName: 'responsiblePerson',
                        slotName: 'responsiblePerson',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '责任部门',
                        fieldName: 'responsibleDept',
                        slotName: 'responsibleDept',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'datetime',
                        labelText: '完成时间',
                        fieldName: 'completionTime',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'upload', // 控件类型
                        labelText: '附件', // 控件显示的文本
                        fieldName: 'getFile',
                        colLayout: 'singleCol',
                        uploadConfig: {
                            // drag: true// 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
                        },
                        listType: 'secret'// 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                    }
                ],
                modify: {}
            }
        },
        mounted () {
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
                if (this.record.id != null && this.record.id !== '') {
                    this.getProblem(this.record.id)
                }
            },
            getProblem (id) {
                let that = this
                this.$api['CustomerOpinion.getInfo']({ id: id }).then(res => {
                    that.formData = res
                    that.formData.id = res.id
                    that.formData.code = res.code
                    that.formData.secretGrade = res.secretGrade
                    that.formData.responsibleUnit = res.responsibleUnit
                    that.formData.responsibleDept = res.responsibleDept
                    that.formData.responsiblePerson = res.responsiblePerson
                    that.formData.completionTime = res.completionTime
                    that.formData.getFile = res.getFile
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
            closeModalResponsiblePerson (selectedRows) {
                this.visibleResponsiblePerson = false
                this.formData.responsiblePerson = selectedRows[0].realName
                // this.formData.responsibleUnit = selectedRows[0].departmentId
                // this.formData = Object.assign({}, this.formData)
            },
            closeDept1 (selectedRows) {
                this.visibleDept1 = false
                this.formData.responsibleUnit = selectedRows.id
                this.formData.responsibleUnitName = selectedRows.name
            },
            closeDept2 (selectedRows) {
                this.visibleDept2 = false
                this.formData.responsibleDept = selectedRows.id
                this.formData.responsibleDeptName = selectedRows.name
            }
        }
    }
</script>

<style scoped>

</style>
