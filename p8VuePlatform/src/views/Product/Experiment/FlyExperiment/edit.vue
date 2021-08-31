<template>
    <common-dialog
            :title="title"
            :visible="visible"
            destroy-on-close
            @close="handleCancel"
            width="70%"
            :dialogHeight="dialogHeight"
            :showHandleBtn="false"
            :dialogConfig="dialogConfig"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
    >
        <template #dialog>
            <form-list ref="form"
                       @rendered="rendered"
                       style="height:60%"
                       :form="formData"
                       @saved="saved"
                       :dataSource="dataSource"
                       :api="saveApi"
                       :isCustomValidate="true"
                       @custom-validate="parseCheck">
                <template #captainName>
                    <el-input v-model='formData["captainName"]' readonly autosize
                              placeholder="请选择队长"
                              @click.native="visible1=true">
                        <i
                                v-if='selectedRow'
                                class='el-icon-link'
                                slot='suffix'
                                type='link'
                                @click='showModal'
                                :style='{ fontSize: "16px", color: "#08c" }'
                        ></i>
                    </el-input>
                </template>
                <template #projectName>
                    <el-input v-model='formData["projectName"]' readonly autosize
                              placeholder="请选择计划任务"
                              @click.native="visible3=true">
                        <i
                                v-if='selectedRow2'
                                class='el-icon-link'
                                slot='suffix'
                                type='link'
                                @click='showModal2'
                                :style='{ fontSize: "16px", color: "#08c" }'
                        ></i>
                    </el-input>
                </template>
            </form-list>
            <editable-table :columns="paramColumns" :addRow="true" :data="tableData"
                            style="height:40%;margin-top: -65px;" @save-param-data="saveParamData">

                <template #missileNo="{scope, data}">
                    <el-input v-model="scope.row.missileNo" placeholder="输入试验序号" style="width:100%"
                              @blur="saveParamData(data)"></el-input>
                </template>
                <template #shootTime="{scope, data}">
                    <el-date-picker v-model="scope.row.shootTime" type="date" placeholder="选择发射日期"
                                    style="width:100%" @blur="saveParamData(data)"></el-date-picker>
                </template>
                <template #flightDetail="{scope, data}">
                    <el-select v-model="scope.row.flightDetail" style="width:100%"
                               @change="saveParamData(data)">
                        <el-option label="成功" value="11901"></el-option>
                        <el-option label="失败" value="11902"></el-option>
                        <el-option label="剔除" value="11903"></el-option>
                        <el-option label="待定" value="11904"></el-option>
                    </el-select>
                </template>
            </editable-table>
            <select-user v-if="visible1" :visible="visible1" :selected-row='selectedRow'
                         @close-dialog="closeModal" :selectType='1'></select-user>
            <select-task v-if="visible3" :visible="visible3" :selected-row='selectedRow2'
                         @close-modal="closeModal2"></select-task>
        </template>
    </common-dialog>
</template>

<style scoped>

</style>

<script>
    import { Input, DatePicker, Select, Option } from '~/index'
    import { P8Form as FormList } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectTask from '@/views/Product/Pm/Project/selectProject.vue'
    import { P8EditTable as EditableTable } from '~/index'

    let dataSource = [
        {
            type: 'blank',
            labelText: '选择项目',
            fieldName: 'projectName',
            slotName: 'projectName',
            colLayout: 'doubleCol',
            rules: [{ required: true, message: '必须选择项目信息' }]
        },
        {
            type: 'select',
            labelText: '目前状态',
            fieldName: 'currentStatus',
            placeholder: '请选择当前的状态',
            colLayout: 'doubleCol',
            optionUrl: {
                api: 'thirdPartInterface.getDic',
                params: { dicType: 'TASK_STATUS' }
            },
            options: [],
            rules: [{ required: true, message: '必须选择状态' }]
        },
        {
            type: 'view',
            labelText: '领域',
            fieldName: 'classifyDisplay',
            colLayout: 'doubleCol'
        },
        {
            type: 'view',
            labelText: '项目类型',
            fieldName: 'projectType',
            colLayout: 'doubleCol'
        },
        {
            type: 'view',
            labelText: '型号名称',
            fieldName: 'modelName',
            colLayout: 'doubleCol'
        },
        {
            type: 'blank',
            labelText: '队长',
            fieldName: 'captainName',
            slotName: 'captainName',
            colLayout: 'doubleCol',
            rules: [{ required: true, message: '必须选择队长' }],
            placeholder: '请选择队长'
        },
        {
            type: 'datetime', // 控件类型
            labelText: '开始时间', // 控件显示的文本
            placeholder: '请选择开始时间',
            fieldName: 'realBeginTime',
            colLayout: 'doubleCol',
            fieldConfig: {
                size: 'small'
            },
            rules: [{ required: true, message: '必须选择开始时间' }]
        },
        {
            type: 'datetime', // 控件类型
            labelText: '结束时间', // 控件显示的文本
            placeholder: '请选择结束时间',
            fieldName: 'realEndTime',
            colLayout: 'doubleCol',
            fieldConfig: {
                size: 'small'
            },
            rules: [{ required: true, message: '必须选择结束时间' }]
        },
        {
            type: 'select',
            labelText: '试验地点',
            fieldName: 'testPlace',
            placeholder: '请选择试验地点',
            colLayout: 'doubleCol',
            optionUrl: {
                api: 'thirdPartInterface.getDic',
                params: { dicType: 'TEST_PLACE' }
            },
            options: [],
            rules: [{ required: true, message: '必须选择试验地点' }]
        },
        {
            type: 'text',
            labelText: '试验名称',
            fieldName: 'testName',
            colLayout: 'doubleCol',
            rules: [{ required: true, message: '必须输入试验名称' }]
        },
        {
            type: 'number',
            labelText: '试验最小数',
            fieldName: 'minNum',
            colLayout: 'doubleCol',
            rules: [{ required: true, message: '必须输入试验最小数' }]
        },
        {
            type: 'number',
            labelText: '试验最大数',
            fieldName: 'maxNum',
            colLayout: 'doubleCol',
            rules: [{ required: true, message: '必须输入试验最大数' }]
        },
        {
            type: 'textarea',
            labelText: '备注',
            fieldName: 'note',
            placeholder: '请输入备注信息',
            colLayout: 'singleCol'
        },
        {
            type: 'hidden',
            fieldName: 'status',
            defaultValue: ''
        }
    ]

    export default {
        name: 'KteamsEdit',
        components: {
            'el-input': Input,
            'el-date-picker': DatePicker,
            'el-select': Select,
            'el-option': Option,
            FormList,
            CommonDialog,
            SelectUser,
            SelectTask,
            EditableTable
        },
        props: {
            record: {
                type: Object
            },
            visible: {
                type: Boolean
            },
            title: {
                type: String
            },
            rowId: {
                type: String
            },
            experimentId: {
                type: String
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 715
            return {
                renderHeight: height + 'px',
                confirmLoading: false,
                saveApi: 'experimentManager.flyExperimentSave',
                visible1: false,
                visible3: false,
                selectedRow: {},
                selectedRow2: {},
                dialogHeight: 760,
                dataSource: [],
                tableData: [],
                formData: {
                    id: null,
                    problemDescribe: null,
                    problemType: null,
                    captainName: null,
                    captain: null,
                    customItem2: null,
                    realBeginTime: null,
                    realEndTime: null,
                    projectName: null,
                    pmProjectTasks: null,
                    editType: null,
                    status: null,
                    classifyDisplay: null,
                    projectType: null,
                    modelName: null,
                    currentStatus: null,
                    currentStatusDisplay: null,
                    testName: null,
                    testPlace: null,
                    testPlaceDisplay: null,
                    minNum: null,
                    maxNum: null,
                    note: null,
                    flightTestDetailList: []
                },
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                },
                paramColumns: [
                    {
                        title: '试验序号',
                        dataIndex: 'missileNo',
                        maxWidth: 70,
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '发射日期',
                        dataIndex: 'shootTime',
                        maxWidth: 70,
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '试验结果',
                        dataIndex: 'flightDetail',
                        maxWidth: 70,
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    }
                ],
                sqlParams: {}
            }
        },
        created () {
            this.formTrigger()
        },
        mounted () {
        },
        methods: {
            formTrigger () {
                this.dataSource = Object.assign([], dataSource)
            },
            showMessage (obj, message, type) {
                obj.$message({
                    message: message,
                    type: type
                })
            },
            rendered () {
                if (this.experimentId && this.experimentId !== '') {
                    this.getExperimentDetail(this.experimentId)
                }
            },
            getExperimentDetail (experimentId) {
                let that = this
                this.$api['experimentManager.getFlyExperimentInfo']({ id: experimentId }).then(function (res) {
                    let data = res
                    console.log(res, 'res')
                    that.formData.id = data.id
                    that.formData.problemDescribe = data.problemDescribe
                    that.formData.problemType = data.problemType
                    that.formData.captainName = data.captainName
                    that.formData.captain = data.captain
                    that.formData.customItem2 = data.customItem2
                    that.formData.realEndTime = data.realEndTime
                    that.formData.realBeginTime = data.realBeginTime
                    that.formData.projectName = data.projectName
                    that.formData.pmProjectTasks = data.wtxxId
                    that.formData.classifyDisplay = data.classifyDisplay
                    that.formData.projectType = data.projectType
                    that.formData.modelName = data.modelName
                    that.formData.currentStatus = data.currentStatus
                    that.formData.currentStatusDisplay = data.currentStatusDisplay
                    that.formData.testName = data.testName
                    that.formData.testPlace = data.testPlace
                    that.formData.testPlaceDisplay = data.testPlaceDisplay
                    that.formData.minNum = data.minNum
                    that.formData.maxNum = data.maxNum
                    that.formData.note = data.note
                    that.tableData = data.flightTestDetailList || []
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log(error)
                })
            },
            saved (res) {
                console.log('edit saved')
                this.$emit('save-success', res)
            },
            handleOk (e) {
                this.$emit('close-modal')
            },
            handleCancel (e) {
                this.$emit('close-modal')
            },
            showModal () {
                this.visible1 = true
            },
            showModal2 () {
                this.visible3 = true
            },
            closeModal (selectedRow) {
                this.visible1 = false
                this.selectedRow = selectedRow
                console.log(this.selectedRow)
                if (this.selectedRow) {
                    let that = this
                    that.formData.captainName = this.selectedRow[0].realName
                    that.formData.captain = this.selectedRow[0].id
                    that.formData = Object.assign({}, that.formData)
                }
            },
            closeModal2 (selectedRow2) {
                this.visible3 = false
                this.selectedRow2 = selectedRow2
                if (this.selectedRow2) {
                    let that = this
                    that.formData.pmProjectTasks = this.selectedRow2.id
                    that.formData.projectName = this.selectedRow2.name
                    that.formData.classifyDisplay = this.selectedRow2.filedName
                    that.formData.projectType = this.selectedRow2.kprojectClassifyname
                    that.formData.modelName = this.selectedRow2.modelCode
                    that.formData = Object.assign({}, that.formData)
                }
            },
            saveParamData (data) {
                console.log(data, '新建保存信息')
                // this.tableData = data
                this.sqlParams['flightTestDetailList'] = data
            },
            parseCheck (saveParams) {
                let params = { ...saveParams, ...this.sqlParams }
                if (params.realBeginTime > params.realEndTime) {
                    this.$alert('开始时间不能大于结束时间，不可执行此操作', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    })
                    return false
                }

                for (let i in params.flightTestDetailList) {
                    if (params.flightTestDetailList[i].missileNo === '') {
                        this.$alert('未输入序号，不可执行此操作', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                        return false
                    }
                    if (params.flightTestDetailList[i].shootTime === '') {
                        this.$alert('未选择发射时间，不可执行此操作', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                        return false
                    }
                    if (params.flightTestDetailList[i].flightDetail === '') {
                        this.$alert('未选择试验结果，不可执行此操作', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                        return false
                    }
                }
                this.$refs.form.submitForm(params, this.saveApi)
            }
        }
    }
</script>
