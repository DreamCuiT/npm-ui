<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   :other-param="otherParam">
            <template #enter-num>
                <el-input v-model="formData.modelCode" @click.native="visible=true">
                </el-input>
            </template>
            <template #other>
                <ul class="userList">
                    <li v-for="item in selectedRows" :key="item.modelCode">
                        <el-tag>型号名称：{{item.modelName}}</el-tag>
                        <el-tag>型号代号：{{item.modelCode}}</el-tag>
                        <el-tag>所属领域：{{item.classify}}</el-tag>
                    </li>
                </ul>
            </template>
            <template #responsiblePerson>
                <el-input v-model="formData.responsiblePerson"
                          @click.native="visibleResponsiblePerson=true">
                </el-input>
            </template>
            <template #responsibleUnit>
                <el-input v-model="formData.responsibleUnitName" @click.native="visibleDept=true">
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
                    <template #problemCategory="{scope, data}">
                        <el-select v-model="scope.row.problemCategory" placeholder="请选择"
                                   @blur="saveParamData(data)">
                            <template v-for="(item,index) in problemCategoryTypes">
                                <el-option :label="item.label" :value="item.label"
                                           :key="index"></el-option>
                            </template>
                        </el-select>
                    </template>
                    <template #problemSubclass="{scope, data}">
                        <el-select v-model="scope.row.problemSubclass" placeholder="请选择"
                                   @blur="saveParamData(data)">
                            <template v-for="(item,index) in problemSubclassTypes">
                                <el-option :label="item.label" :value="item.label"
                                           :key="index"></el-option>
                            </template>
                        </el-select>
                    </template>
                    <template #problemDescribe="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.problemDescribe"
                                    :content="scope.row.problemDescribe">
                            <el-input v-model="scope.row.problemDescribe"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #unstandardTerms="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.unstandardTerms"
                                    :content="scope.row.unstandardTerms">
                            <el-input v-model="scope.row.unstandardTerms"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #planCompletionTime="{scope, data}">
                        <el-date-picker v-model="scope.row.planCompletionTime"
                                        type="date"
                                        :value-format="valueFormat"
                                        @change="saveParamData(data)"
                                        placeholder="选择时间">
                        </el-date-picker>
                    </template>
                    <template #causeAnalysis="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.causeAnalysis"
                                    :content="scope.row.causeAnalysis">
                            <el-input v-model="scope.row.causeAnalysis"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #correctSituation="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.correctSituation"
                                    :content="scope.row.correctSituation">
                            <el-input v-model="scope.row.correctSituation"
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
                    <template #qualityVerification="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.qualityVerification"
                                    :content="scope.row.qualityVerification">
                            <el-input v-model="scope.row.qualityVerification"
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

        <select-model v-if="visible" :visible="visible" @close-modal="closeModal"
                      :disabled-row="disabledRow"></select-model>

        <select-file v-if='selectFileVisible' :selected-row='selectedRowFile'
                     :visible='selectFileVisible'
                     @close-modal='closeFileModal'></select-file>
        <select-dept v-if="visibleDept" :visible="visibleDept"
                     @close-dialog="closeDept"></select-dept>
    </div>
</template>

<script>
    import SelectModel from '@/views/Quality/QualityProblem/SelectModel'
    import { P8SelectUser as SelectUser } from '~/index'
    import { P8Form as FormList } from '~/index'
    import EditableTable from './editTable'
    import { Tag, Input, DatePicker, Select, Option, Button, Tooltip } from '~/index'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/base16-dark.css'
    import 'codemirror/mode/sql/sql'
    import SelectFile from './selectFile'
    import SelectDept from '@/views/QualitySystem/UncorrectionItems/SelectDept'

    export default {
        name: 'wholeDescribe',
        components: {
            FormList,
            SelectModel,
            SelectUser,
            SelectFile,
            'el-tooltip': Tooltip,
            'el-tag': Tag,
            'el-input': Input,
            EditableTable,
            'el-date-picker': DatePicker,
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
                saveApi: 'QualitySupervision.save',
                selectedRows: [],
                selectedRowKeys: [],
                selectedRowFile: {},
                scopeValue: {},
                selectFileVisible: false,
                visible: false,
                visibleResponsiblePerson: false,
                visibleDept: false,
                otherParam: {},
                formData: {
                    modelCode: '',
                    entityId: '',
                    responsiblePerson: '',
                    responsibleUnit: '',
                    infoList: []
                },
                selectType: '1',
                problemCategoryTypes: [
                    { label: '大类一', value: '大类一' },
                    { label: '大类二', value: '大类二' },
                    { label: '大类三', value: '大类三' }
                ],
                problemSubclassTypes: [
                    { label: '子类一', value: '子类一' },
                    { label: '子类二', value: '子类二' },
                    { label: '子类三', value: '子类三' }
                ],
                disabledRow: [],
                valueFormat: 'yyyy-MM-dd',
                renderHeight: height + 'px',
                tableConfigDetailsApi: 'QualitySupervision.detail',
                paramColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: '45px',
                        align: 'center'
                    },
                    {
                        title: '问题大类',
                        dataIndex: 'problemCategory',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '问题小类',
                        dataIndex: 'problemSubclass',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '问题描述',
                        dataIndex: 'problemDescribe',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '不符合标准条款',
                        dataIndex: 'unstandardTerms',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '计划完成时间',
                        dataIndex: 'planCompletionTime',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '原因分析',
                        dataIndex: 'causeAnalysis',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '纠正情况',
                        dataIndex: 'correctSituation',
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
                        title: '质量验证情况',
                        dataIndex: 'qualityVerification',
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
                        type: 'text',
                        labelText: '编号',
                        fieldName: 'code',
                        colLayout: 'doubleCol',
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
                        type: 'radio',
                        labelText: '监督性质',
                        fieldName: 'nature',
                        options: [
                            { label: '院对单位质量监督', value: '院对单位质量监督' },
                            { label: '质量监督代表监督', value: '质量监督代表监督' }
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
                        type: 'blank',
                        labelText: '责任人',
                        fieldName: 'responsiblePerson',
                        slotName: 'responsiblePerson',
                        colLayout: 'doubleCol',
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
                        labelText: '所属型号',
                        slotName: 'enter-num',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '型号相关信息',
                        slotName: 'other',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '产品名称',
                        fieldName: 'productName',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '备注',
                        fieldName: 'remark',
                        colLayout: 'singleCol'
                    }
                ]
            }
        },
        mounted: function () {
        },
        methods: {
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
                this.$api['QualitySupervision.getInfo']({ id: id }).then(res => {
                    that.formData = res
                    that.selectedRows = []
                    that.selectedRows.push({
                        id: res.modelInformationId,
                        modelCode: res.modelCode,
                        modelName: res.modelName,
                        classify: res.modelClassifyDisplay
                    })
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
            showModal () {
                this.visible = true
            },
            closeModal (selectedRow) {
                this.visible = false
                if (selectedRow) {
                    this.selectedRows[0] = selectedRow
                    this.disabledRow = this.selectedRows[0].id
                    if (this.selectedRows.length) {
                        this.formData.modelCode = this.selectedRows[0].modelCode
                        this.formData.modelInformationId = this.selectedRows[0].id
                        /// this.otherParam = { 'modelCode': this.selectedRows[0].id }
                    }
                }
            },
            deleteModel () {
                this.disabledRow = []
                this.selectedRows = []
                this.$refs.form.setFields({ modelCode: '' })
            },
            closeModalResponsiblePerson (selectedRows) {
                this.visibleResponsiblePerson = false
                this.formData.responsiblePerson = selectedRows[0].realName
                this.formData.responsibleUnit = selectedRows[0].departmentId
                this.formData = Object.assign({}, this.formData)
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
            },
            closeDept (selectedRows) {
                this.visibleDept = false
                this.formData.responsibleUnit = selectedRows.id
                this.formData.responsibleUnitName = selectedRows.name
            }
        }
    }
</script>

<style scoped>

</style>
