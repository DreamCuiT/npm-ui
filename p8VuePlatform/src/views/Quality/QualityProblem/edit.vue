<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   :other-param="otherParam">
            <template #modelInformationId>
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
            <template #reporter>
                <el-input v-model="formData.reporter" @click.native="visibleReporter=true">
                </el-input>
            </template>
            <template #reportUnitName>
                <el-input v-model="formData.reportUnitName" @click.native="visibleReportUnitName=true">
                </el-input>
            </template>
            <template #fillinger>
                <el-input v-model="formData.fillinger" @click.native="visibleFillinger=true">
                </el-input>
            </template>
            <template #fillingUnitName>
                <el-input v-model="formData.fillingUnitName" v-on:click.native="showDepart">
                </el-input>
            </template>
            <template #ratifier>
                <el-input v-model="formData.ratifier" @click.native="visibleRatifier=true">
                </el-input>
            </template>
            <template #approvalUnitName>
                <el-input v-model="formData.approvalUnitName" @click.native="visibleApprovalUnitName=true">
                </el-input>
            </template>
            <template #reviewer>
                <el-input v-model="formData.reviewer" @click.native="visibleReviewer=true">
                </el-input>
            </template>
            <template #designUnitName>
                <el-input v-model="formData.designUnitName" @click.native="visibleDesignUnitName=true">
                </el-input>
            </template>
            <template #productionUnitName>
                <el-input v-model="formData.productionUnitName" @click.native="visibleProductionUnitName=true">
                </el-input>
            </template>
            <template #takeStepsUnitName>
                <el-input v-model="formData.takeStepsUnitName" @click.native="visibleTakeStepsUnitName=true">
                </el-input>
            </template>
        </form-list>
        <select-user v-if="visibleReporter" :visible="visibleReporter"
                     :selectType="selectType" @close-dialog="closeModalReporter"></select-user>
        <select-user v-if="visibleFillinger" :visible="visibleFillinger"
                     :selectType="selectType" @close-dialog="closeModalFillinger"></select-user>
        <select-user v-if="visibleRatifier" :visible="visibleRatifier"
                     :selectType="selectType" @close-dialog="closeModalRatifier"></select-user>
        <select-user v-if="visibleReviewer" :visible="visibleReviewer"
                     :selectType="selectType" @close-dialog="closeModalReviewer"></select-user>
        <select-model v-if="visible" :visible="visible" @close-modal="closeModal"
                      :disabled-row="disabledRow"></select-model>
        <select-depart v-if="visibleDepart" :visible="visibleDepart"
                       @close-dialog="closeDepart"></select-depart>
        <select-depart v-if="visibleApprovalUnitName" :visible="visibleApprovalUnitName"
                       @close-dialog="closeVisibleApprovalUnitName"></select-depart>
        <select-depart v-if="visibleReportUnitName" :visible="visibleReportUnitName"
                       @close-dialog="closeVisibleReportUnitName"></select-depart>
        <select-depart v-if="visibleDesignUnitName" :visible="visibleDesignUnitName"
                       @close-dialog="closeVisibleDesignUnitName"></select-depart>
        <select-depart v-if="visibleProductionUnitName" :visible="visibleProductionUnitName"
                       @close-dialog="closeVisibleProductionUnitName"></select-depart>
        <select-depart v-if="visibleTakeStepsUnitName" :visible="visibleTakeStepsUnitName"
                       @close-dialog="closeVisibleTakeStepsUnitName"></select-depart>
    </div>
</template>

<script>
    import SelectModel from '@/views/Quality/QualityProblem/SelectModel'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectDepart from '../../QualitySystem/UncorrectionItems/SelectDept'
    import { P8Form as FormList } from '~/index'
    import { Tag, Input } from '~/index'

    export default {
        name: 'wholeDescribe',
        components: {
            FormList,
            SelectModel,
            SelectUser,
            SelectDepart,
            'el-tag': Tag,
            'el-input': Input
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            return {
                saveApi: 'quality.save',
                selectedRows: [],
                selectedRowKeys: [],
                visible: false,
                visibleReporter: false,
                visibleFillinger: false,
                visibleRatifier: false,
                visibleReviewer: false,
                visibleDepart: false,
                visibleApprovalUnitName: false,
                visibleReportUnitName: false,
                visibleDesignUnitName: false,
                visibleProductionUnitName: false,
                visibleTakeStepsUnitName: false,
                selectType: '1',
                otherParam: {},
                formData: {
                    modelCode: '',
                    entityId: '',
                    getFile: [],
                    reviewer: '',
                    fillinger: '',
                    fillingUnit: '',
                    ratifier: '',
                    approvalUnit: '',
                    reporter: '',
                    productionUnit: '',
                    designUnit: ''
                },
                disabledRow: [],
                dataSource: [
                    {
                        type: 'blank',
                        labelText: '基本概况'
                    },
                    {
                        type: 'blank',
                        labelText: '填表人 ',
                        fieldName: 'fillinger',
                        slotName: 'fillinger',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank',
                        labelText: '填表人单位',
                        fieldName: 'fillingUnitName',
                        slotName: 'fillingUnitName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '填表日期',
                        fieldName: 'fillingDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank',
                        labelText: '上报人 ',
                        fieldName: 'reporter',
                        slotName: 'reporter',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank',
                        labelText: '上报人单位',
                        fieldName: 'reportUnitName',
                        slotName: 'reportUnitName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '上报时间',
                        fieldName: 'reportTime',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank',
                        labelText: '批准人 ',
                        fieldName: 'ratifier',
                        slotName: 'ratifier',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '批准人单位',
                        fieldName: 'approvalUnitName',
                        slotName: 'approvalUnitName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'datetime',
                        labelText: '批准日期',
                        fieldName: 'approvalDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'blank',
                        labelText: '审核人',
                        fieldName: 'reviewer',
                        slotName: 'reviewer',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '型号属性'
                    },
                    {
                        type: 'blank',
                        labelText: '所属型号',
                        slotName: 'modelInformationId',
                        fieldName: 'modelInformationId',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank',
                        labelText: '型号相关信息',
                        slotName: 'other',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'select',
                        labelText: '批次',
                        fieldName: 'modelBatch',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'label',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '所属分系统',
                        fieldName: 'subSystem',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        labelText: '涉及其他型号情况',
                        fieldName: 'otherInformation',
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
                        labelText: '问题产品'
                    },
                    {
                        type: 'text',
                        labelText: '产品名称',
                        fieldName: 'productName',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '产品代号',
                        fieldName: 'productCode',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '产品编号',
                        fieldName: 'productNum',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '设计单位',
                        fieldName: 'designUnitName',
                        slotName: 'designUnitName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '生产单位',
                        fieldName: 'productionUnitName',
                        slotName: 'productionUnitName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'datetime',
                        labelText: '发现时间',
                        fieldName: 'detectedDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '发现地点',
                        fieldName: 'detectedPlace',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '发生阶段',
                        fieldName: 'happenPhase',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'label',
                                value: 'text1'
                            },
                            {
                                label: 'text2',
                                value: 'text2'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '研制阶段',
                        fieldName: 'developmentStage',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'QUALITY_DEVELOPMENT_STAGE' }
                        },
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank',
                        labelText: '问题处理'
                    },
                    {
                        type: 'textarea',
                        labelText: '问题描述',
                        fieldName: 'questionDescribe',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '原因分析',
                        fieldName: 'causeAnalysis',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '纠正措施',
                        fieldName: 'correctiveMeasures',
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
                        labelText: '采取措施单位',
                        fieldName: 'takeStepsUnitName',
                        slotName: 'takeStepsUnitName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '归零评审时间',
                        fieldName: 'toZeroReviewDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '纠正效果',
                        fieldName: 'correctionEffect',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        labelText: '快报备注',
                        fieldName: 'bulletinRemarks',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '“举一反三”建议',
                        fieldName: 'drawInferencesExplain',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
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
            this.editUI()
            this.getUser()
        },
        methods: {
            rendered () {
                if (this.record.id != null && this.record.id !== '') {
                    this.getProblem(this.record.id)
                }
            },
            getProblem (currEntityId) {
                let that = this
                this.$api['quality.getQuality']({ id: currEntityId }).then(res => {
                    that.fillData(that, res)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            fillData (that, data) {
                that.formData = data
                that.selectedRows = []
                that.selectedRows.push({
                    id: data.modelInformationId,
                    modelCode: data.modelCode,
                    modelName: data.modelName,
                    classify: data.modelClassifyDisplay
                })
                that.formData.getFile = data.getFile
                that.formData = Object.assign({}, that.formData)
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
            closeModalReporter (selectedRows) {
                this.visibleReporter = false
                this.formData.reporter = selectedRows[0].realName
                this.formData.reportUnit = selectedRows[0].departmentId
                this.formData.reportUnitName = selectedRows[0].departmentName
                this.formData = Object.assign({}, this.formData)
            },
            closeVisibleReportUnitName (selectedRows) {
                this.visibleReportUnitName = false
                if (selectedRows) {
                    this.formData.reportUnit = selectedRows.id
                    this.formData.reportUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeModalFillinger (selectedRows) {
                this.visibleFillinger = false
                this.formData.fillinger = selectedRows[0].realName
                this.formData.fillingUnit = selectedRows[0].departmentId
                this.formData.fillingUnitName = selectedRows[0].departmentName
                this.formData = Object.assign({}, this.formData)
            },
            showDepart () {
                this.visibleDepart = true
            },
            closeDepart (selectedRows) {
                this.visibleDepart = false
                if (selectedRows) {
                    this.formData.fillingUnitName = selectedRows.name
                    this.formData.fillingUnit = selectedRows.id
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeModalRatifier (selectedRows) {
                this.visibleRatifier = false
                this.formData.ratifier = selectedRows[0].realName
                this.formData.approvalUnit = selectedRows[0].departmentId
                this.formData.approvalUnitName = selectedRows[0].departmentName
                this.formData = Object.assign({}, this.formData)
            },
            closeVisibleApprovalUnitName (selectedRows) {
                this.visibleApprovalUnitName = false
                if (selectedRows) {
                    this.formData.approvalUnit = selectedRows.id
                    this.formData.approvalUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeModalReviewer (selectedRows) {
                this.visibleReviewer = false
                this.formData.reviewer = selectedRows[0].realName
            },
            closeVisibleDesignUnitName (selectedRows) {
                this.visibleDesignUnitName = false
                if (selectedRows) {
                    this.formData.designUnit = selectedRows.id
                    this.formData.designUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleProductionUnitName (selectedRows) {
                this.visibleProductionUnitName = false
                if (selectedRows) {
                    this.formData.productionUnit = selectedRows.id
                    this.formData.productionUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleTakeStepsUnitName (selectedRows) {
                this.visibleTakeStepsUnitName = false
                if (selectedRows) {
                    this.formData.takeStepsUnit = selectedRows.id
                    this.formData.takeStepsUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            getUser () {
                this.formData.fillinger = this.$store.getters.userName
                this.formData.fillingUnit = this.$store.getters.userInfo.departmentId
                this.formData.fillingUnitName = this.$store.getters.userInfo.departmentName
            },
            editUI () {
                document.getElementsByClassName('el-form-item__blank')[0].classList.add('el-labelColor')
                document.getElementsByClassName('el-form-item__blank')[8].classList.add('el-labelColor')
                document.getElementsByClassName('el-form-item__blank')[11].classList.add('el-labelColor')
                document.getElementsByClassName('el-form-item__blank')[14].classList.add('el-labelColor')
            }
        }
    }
</script>

<style>
    .el-labelColor{
        background-color: #0070c5;
        color: white;
    }
    .el-labelColor :first-child{
        color: white;
    }
    /*div.el-form-item__label{*/
    /*    background-color: #0070c5;*/
    /*    color: white;*/
    /*}*/
</style>
