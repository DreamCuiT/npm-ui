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
            <template #auditer>
                <el-input v-model="formData.auditer"
                          @click.native="visibleAuditer=true">
                </el-input>
            </template>
            <template #entourage>
                <el-input v-model="formData.entourage"
                          @click.native="visibleEntourage=true">
                </el-input>
            </template>
            <template #responsibleUnit>
                <el-input v-model="formData.responsibleUnitName" @click.native="visibleDept1=true">
                </el-input>
            </template>
            <template #responsibleDepartment>
                <el-input v-model="formData.responsibleDepartmentName" @click.native="visibleDept2=true">
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
                    <template #secretGrade="{scope, data}">
                        <el-select v-model="scope.row.secretGrade" placeholder="请选择"
                                   @blur="saveParamData(data)">
                            <template v-for="(item,index) in secretGradeTypes">
                                <el-option :label="item.label" :value="item.label"
                                           :key="index"></el-option>
                            </template>
                        </el-select>
                    </template>
                    <template #code="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.code"
                                    :content="scope.row.code">
                            <el-input v-model="scope.row.code"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #drawInferencesDeptName="{scope, data}">
                        <el-input v-model="scope.row.drawInferencesDeptName"
                                  readonly
                                  autosize
                                  placeholder="请选择部门"
                                  v-on:click.native="showDept(scope)"
                                  @blur="saveParamData(data)">
                        </el-input>
                    </template>
                    <template #drawInferencesDeptPeople="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.drawInferencesDeptPeople"
                                    :content="scope.row.drawInferencesDeptPeople">
                            <el-input v-model="scope.row.drawInferencesDeptPeople"
                                      readonly
                                      autosize
                                      placeholder="请选择人员"
                                      v-on:click.native="showDrawInferencesDeptPeople(scope)"
                                      @blur="saveParamData(data)">
                            </el-input>
                        </el-tooltip>
                    </template>
                    <template #responsiblePerson="{scope, data}">
                        <el-input v-model="scope.row.responsiblePerson"
                                  readonly
                                  autosize
                                  placeholder="请选择人员"
                                  v-on:click.native="showDrawInferencesDeptPeople2(scope)"
                                  @blur="saveParamData(data)">
                        </el-input>
                    </template>
                    <template #inconformityDescription="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.inconformityDescription"
                                    :content="scope.row.inconformityDescription">
                            <el-input v-model="scope.row.inconformityDescription"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #drawInferencesSituation="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.drawInferencesSituation"
                                    :content="scope.row.drawInferencesSituation">
                            <el-input v-model="scope.row.drawInferencesSituation"
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
                    <template #getFile="{scope, data}">
                        <li v-for="(item, index) in scope.row.getFile" :key="index"
                            @click="downloadFile(item)">
                            <span style='cursor:pointer;'>{{ item.fileName }}</span>
                        </li>
                    </template>
                    <template #handle="{scope, data}">
                        <el-button type="primary" @click="saveParamData(data),showFile(scope)"
                        >上传附件
                        </el-button>
                    </template>
                </editable-table>
            </div>
        </template>

        <select-user v-if="visibleResponsiblePerson" :visible="visibleResponsiblePerson"
                     :selectType="selectType"
                     @close-dialog="closeModalResponsiblePerson"></select-user>
        <select-user v-if="visibleAuditer" :visible="visibleAuditer"
                     :selectType="selectType" @close-dialog="closeModalAuditer"></select-user>
        <select-user v-if="visibleEntourage" :visible="visibleEntourage"
                     @close-dialog="closeModalEntourage"></select-user>

        <select-user v-if="visible" :visible="visible"
                     @close-dialog="closeDrawInferencesDeptPeople"></select-user>
        <select-user v-if="visible2" :visible="visible2" :selectType="selectType"
                     @close-dialog="closeDrawInferencesDeptPeople2"></select-user>

        <select-file v-if='selectFileVisible' :selected-row='selectedRowFile'
                     :visible='selectFileVisible' @close-modal='closeFileModal'></select-file>

        <select-dept v-if="visibleDept" :visible="visibleDept"
                     @close-dialog="closeDept"></select-dept>
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
    import { Input, Select, Option, Button, Tooltip } from '~/index'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/base16-dark.css'
    import 'codemirror/mode/sql/sql'
    import SelectFile from './selectFile'
    import SelectDept from './SelectDept'

    export default {
        name: 'wholeDescribe',
        components: {
            FormList,
            SelectUser,
            SelectFile,
            'el-tooltip': Tooltip,
            'el-input': Input,
            EditableTable,
            'el-select': Select,
            'el-option': Option,
            'el-button': Button,
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
                saveApi: 'UncorrectionItems.save',
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
                visibleDept: false,
                visibleDept1: false,
                visibleDept2: false,
                otherParam: {},
                formData: {
                    responsiblePerson: '',
                    responsibleUnit: '',
                    responsibleDepartment: '',
                    auditer: '',
                    entourage: '',
                    infoList: [],
                    getFile: []
                },
                selectType: '1',
                secretGradeTypes: [],
                disabledRow: [],
                valueFormat: 'yyyy-MM-dd',
                renderHeight: height + 'px',
                tableConfigDetailsApi: 'UncorrectionItems.detail',
                paramColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: '45px',
                        align: 'center'
                    },
                    {
                        title: '表单密级',
                        dataIndex: 'secretGrade',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '编号',
                        dataIndex: 'code',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '举一反三部门',
                        dataIndex: 'drawInferencesDeptName',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '举一反三部门员工',
                        dataIndex: 'drawInferencesDeptPeople',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '责任人',
                        dataIndex: 'responsiblePerson',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '不符合事实描述',
                        dataIndex: 'inconformityDescription',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '举一反三情况',
                        dataIndex: 'drawInferencesSituation',
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
                    },
                    {
                        title: '附件',
                        dataIndex: 'getFile',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '操作',
                        dataIndex: 'handle',
                        default: '',
                        width: 70,
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    }
                ],
                params: { id: this.record.id },
                sqlParams: {
                    getFile: []
                },
                dataSource: [
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
                        type: 'datetime',
                        labelText: '审核日期',
                        fieldName: 'auditDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'text',
                        labelText: '编号',
                        fieldName: 'code',
                        colLayout: 'doubleCol'
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
                        fieldName: 'responsibleDepartment',
                        slotName: 'responsibleDepartment',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '审核员',
                        fieldName: 'auditer',
                        slotName: 'auditer',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '陪同人员',
                        fieldName: 'entourage',
                        slotName: 'entourage',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '审核依据',
                        fieldName: 'auditBasis',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '不符合标准',
                        fieldName: 'unstandard',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '条款',
                        fieldName: 'terms',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'radio',
                        labelText: '严重程度',
                        fieldName: 'severity',
                        options: [
                            { label: '严重', value: '严重' },
                            { label: '一般', value: '一般' }
                        ],
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        labelText: '不符合事实描述',
                        fieldName: 'inconformityDescription',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '纠正情况',
                        fieldName: 'correctSituation',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'text',
                        labelText: '原因分析',
                        fieldName: 'causeAnalysis',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'text',
                        labelText: '纠正措施',
                        fieldName: 'correctMeasures',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'text',
                        labelText: '完成情况',
                        fieldName: 'completionSituation',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'text',
                        labelText: '有效性验证结果',
                        fieldName: 'validationResults',
                        colLayout: 'singleCol'
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
            this.getSecretGradeTypes()
        },
        methods: {
            getSecretGradeTypes () {
                let that = this
                this.$api['thirdPartInterface.getDic']({ dicType: 'SECRET_LEVEL' }).then(res => {
                    that.secretGradeTypes = res
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saveParamData (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].getFile === '') {
                        data[i].getFile = []
                    }
                }
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
                this.$api['UncorrectionItems.getInfo']({ id: id }).then(res => {
                    that.formData = res
                    that.formData.id = res.id
                    that.formData.secretGrade = res.secretGrade
                    that.formData.auditDate = res.auditDate
                    that.formData.code = res.code
                    that.formData.responsibleUnit = res.responsibleUnit
                    that.formData.responsibleDepartment = res.responsibleDepartment
                    that.formData.responsiblePerson = res.responsiblePerson
                    that.formData.auditer = res.auditer
                    that.formData.entourage = res.entourage
                    that.formData.auditBasis = res.auditBasis
                    that.formData.unstandard = res.unstandard
                    that.formData.terms = res.terms
                    that.formData.severity = res.severity
                    that.formData.inconformityDescription = res.inconformityDescription
                    that.formData.correctSituation = res.correctSituation
                    that.formData.causeAnalysis = res.causeAnalysis
                    that.formData.correctMeasures = res.correctMeasures
                    that.formData.completionSituation = res.completionSituation
                    that.formData.validationResults = res.validationResults
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
            showDrawInferencesDeptPeople (scope) {
                this.scopeValue = scope
                this.visible = true
            },
            closeDrawInferencesDeptPeople (selectedRows) {
                this.visible = false
                let that = this
                let drawInferencesDeptPeople = ''
                for (let i = 0; i < selectedRows.length; i++) {
                    if (i === selectedRows.length - 1) {
                        drawInferencesDeptPeople += selectedRows[i].realName
                    } else {
                        drawInferencesDeptPeople += selectedRows[i].realName + ','
                    }
                }
                that.sqlParams.infoList[that.scopeValue.$index].drawInferencesDeptPeople = drawInferencesDeptPeople
            },
            showDrawInferencesDeptPeople2 (scope) {
                this.scopeValue = scope
                this.visible2 = true
            },
            closeDrawInferencesDeptPeople2 (selectedRows) {
                this.visible2 = false
                let that = this
                that.sqlParams.infoList[that.scopeValue.$index].responsiblePerson = selectedRows[0].realName
            },
            closeModalResponsiblePerson (selectedRows) {
                this.visibleResponsiblePerson = false
                this.formData.responsiblePerson = selectedRows[0].realName
            },
            closeModalAuditer (selectedRows) {
                this.visibleAuditer = false
                this.formData.auditer = selectedRows[0].realName
            },
            closeModalEntourage (selectedRows) {
                this.visibleEntourage = false
                let entourage = ''
                for (let i = 0; i < selectedRows.length; i++) {
                    if (i === selectedRows.length - 1) {
                        entourage += selectedRows[i].realName
                    } else {
                        entourage += selectedRows[i].realName + ','
                    }
                }
                this.formData.entourage = entourage
            },
            showDept (scope) {
                this.scopeValue = scope
                this.visibleDept = true
            },
            closeDept (selectedRows) {
                this.visibleDept = false
                let that = this
                that.sqlParams.infoList[that.scopeValue.$index].drawInferencesDept = selectedRows.id
                that.sqlParams.infoList[that.scopeValue.$index].drawInferencesDeptName = selectedRows.name
            },
            closeDept1 (selectedRows) {
                this.visibleDept1 = false
                this.formData.responsibleUnit = selectedRows.id
                this.formData.responsibleUnitName = selectedRows.name
            },
            closeDept2 (selectedRows) {
                this.visibleDept2 = false
                this.formData.responsibleDepartment = selectedRows.id
                this.formData.responsibleDepartmentName = selectedRows.name
            },
            showFile (scope) {
                this.scopeValue = scope
                this.selectFileVisible = true
            },
            closeFileModal (row) {
                this.selectFileVisible = false
                let that = this
                for (let i = 0; i < row.length; i++) {
                    that.sqlParams.infoList[that.scopeValue.$index].getFile.push(row[i])
                }
            },
            downloadFile (item) { // 输出要求-文件下载
                if (item.id) {
                    this.$api['SystemSettings.getFileUrl']({ attachmentId: item.id }, { responseType: 'blob' }).then(backJson => {
                        console.log(backJson, '附件下载')
                        let link = document.createElement('a')
                        link.href = window.URL.createObjectURL(new Blob([backJson.data]))
                        link.download = item.fileName
                        document.body.appendChild(link)
                        link.click()
                        window.URL.revokeObjectURL(link.href)
                        document.body.removeChild(link)
                    }).finally(() => {
                        // this.search.exportLoading = false
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
