<template>
    <common-dialog :title="title"
                   :visible="visible"
                   destroy-on-close
                   @close="handleCancel"
                   width="70%"
                   :dialogHeight="dialogHeight"
                   :showHandleBtn="false"
                   :dialogConfig="dialogConfig"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
        <template #dialog>
            <form-list ref="form"
                       @rendered="rendered"
                       :form="formData"
                       @saved="saved"
                       :dataSource="dataSource"
                       :api="saveApi"
                       :labelWidth="labelWidth"
                       :isCustomValidate="true"
                       @custom-validate="parseCheck">
                <template #captainName>
                    <el-input v-model='formData["captainName"]'
                              readonly
                              autosize
                              placeholder="请选择队长"
                              @click.native="visible1=true">
                        <i v-if='selectedRow'
                           class='el-icon-link'
                           slot='suffix'
                           type='link'
                           @click='showModal'
                           :style='{ fontSize: "16px", color: "#08c" }'></i>
                    </el-input>
                </template>
                <template #projectName>
                    <el-input v-model='formData["projectName"]'
                              readonly
                              autosize
                              placeholder="请选择项目"
                              @click.native="visible3=true">
                        <i v-if='selectedRow2'
                           class='el-icon-link'
                           slot='suffix'
                           type='link'
                           @click='showModal2'
                           :style='{ fontSize: "16px", color: "#08c" }'></i>
                    </el-input>
                </template>
            </form-list>
            <select-user v-if="visible1"
                         :visible="visible1"
                         :selected-row='selectedRow'
                         @close-dialog="closeModal"
                         :selectType="selectType"></select-user>
            <select-task v-if="visible3"
                         :visible="visible3"
                         :selected-row='selectedRow2'
                         :dialogHeight='dialogHeight'
                         @close-modal="closeModal2"></select-task>
        </template>
    </common-dialog>
</template>

<style scoped>
</style>

<script>
    import { Input } from '~/index'
    import { P8Form as FormList } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectTask from '@/views/Product/Pm/Project/selectProject.vue'

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
            options: [
                {
                    label: '未开始',
                    value: '6020'
                },
                {
                    label: '进行中',
                    value: '6050'
                },
                {
                    label: '已完成',
                    value: '6070'
                }
            ],
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
                'value-format': 'yyyy-MM-dd',
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
                'value-format': 'yyyy-MM-dd',
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
            maxName: 'maxNum',
            colLayout: 'doubleCol',
            rules: [{ required: true, message: '必须输入试验最小数' }]
        },
        {
            type: 'number',
            labelText: '试验最大数',
            fieldName: 'maxNum',
            minName: 'minNum',
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
            FormList,
            CommonDialog,
            SelectUser,
            SelectTask
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
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 282
            return {
                confirmLoading: false,
                saveApi: 'experimentManager.experimentSave',
                visible1: false,
                visible3: false,
                selectedRow: {},
                selectedRow2: {},
                selectType: '1',
                dialogHeight: height,
                labelWidth: '120px',
                dataSource: [],
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
                    note: null
                },
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                }
            }
        },
        created () {
            console.log(this.dialogHeight, 'this.dialogHeight')
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
                if (this.rowId && this.rowId !== '') {
                    this.getExperimentDetail(this.rowId)
                }
            },
            getExperimentDetail (rowId) {
                let that = this
                this.$api['experimentManager.getExperimentInfo']({ id: rowId }).then(function (res) {
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
                if (this.selectedRow[0]) {
                    let that = this
                    that.formData.captainName = this.selectedRow[0].realName
                    that.formData.captain = this.selectedRow[0].id
                    that.formData = Object.assign({}, that.formData)
                }
            },
            closeModal2 (selectedRow2) {
                this.visible3 = false
                this.selectedRow2 = selectedRow2
              console.log(selectedRow2, 'selectedRow2')
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
            parseCheck (saveParams) {
                let params = { ...saveParams }
                if (saveParams.realBeginTime > saveParams.realEndTime) {
                    this.$alert('开始时间不能大于结束时间，不可执行此操作', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    })
                    return false
                }
                this.$refs.form.submitForm(params, this.saveApi)
            }
        }
    }
</script>
