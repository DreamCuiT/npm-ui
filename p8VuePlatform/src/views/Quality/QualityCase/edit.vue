<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData">
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
            <template #reportUnit>
                <el-input v-model="formData.reportUnitName" @click.native="visibleDept=true">
                </el-input>
            </template>
        </form-list>
        <select-model v-if="visible" :visible="visible" @close-modal="closeModal"></select-model>
        <select-user v-if="visibleReporter" :visible="visibleReporter"
                     :selectType="1" @close-dialog="closeModalReporter"></select-user>
        <select-dept v-if="visibleDept" :visible="visibleDept"
                     @close-dialog="closeDept"></select-dept>
    </div>
</template>
<script>
    import { P8Form as FormList } from '~/index'
    import SelectModel from '@/views/Quality/QualityProblem/SelectModel'
    import { Tag, Input } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectDept from '@/views/QualitySystem/UncorrectionItems/SelectDept'

    export default {
        name: 'ProblemEdit',
        components: {
            FormList,
            SelectModel,
            'el-tag': Tag,
            'el-input': Input,
            SelectUser,
            SelectDept
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            return {
                saveApi: 'QualityCase.save',
                formData: {
                    reportTime: '',
                    reporter: '',
                    reportUnit: '',
                    modelCode: ''
                },
                visibleReporter: false,
                visibleDept: false,
                selectedRows: [],
                visible: false,
                dataSource: [
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
                        type: 'text',
                        labelText: '报告标题',
                        fieldName: 'title',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'datetime',
                        labelText: '发布时间',
                        fieldName: 'publishDate',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '填报单位',
                        fieldName: 'reportUnit',
                        slotName: 'reportUnit',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '制单人',
                        fieldName: 'reporter',
                        slotName: 'reporter',
                        colLayout: 'doubleCol',
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
                        type: 'textarea',
                        labelText: '备注',
                        fieldName: 'remark',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '问题概述',
                        fieldName: 'problemSummary',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'text',
                        labelText: '问题名称',
                        fieldName: 'problemName',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '管理原因分析',
                        fieldName: 'managementReasonAnalysis',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '警示',
                        fieldName: 'warning',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '所属型号',
                        slotName: 'modelInformationId',
                        fieldName: 'modelInformationId',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '型号相关信息',
                        slotName: 'other',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'datetime',
                        labelText: '问题发生时间',
                        fieldName: 'problemDate',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'select',
                        labelText: '问题发现阶段',
                        fieldName: 'problemStage',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'QUALITY_DEVELOPMENT_STAGE' }
                        }
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
            rendered () {
                if (this.record && this.record.id) {
                    this.getProblem(this.record.id)
                }
            },
            getProblem (currEntityId) {
                let that = this
                this.$api['QualityCase.getInfo']({ id: currEntityId }).then(res => {
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
            closeModal (selectedRow) {
                this.visible = false
                if (selectedRow) {
                    this.selectedRows[0] = selectedRow
                    this.disabledRow = this.selectedRows[0].id
                    if (this.selectedRows.length) {
                        this.formData.modelCode = this.selectedRows[0].modelCode
                        this.formData.modelInformationId = this.selectedRows[0].id
                    }
                }
            },
            getUser () {
                this.formData.reporter = this.$store.getters.userName
                this.formData.reportUnit = this.$store.getters.userInfo.departmentId
                this.formData.reportUnitName = this.$store.getters.userInfo.departmentName
                this.formData.reportTime = new Date()
            },
            closeModalReporter (selectedRows) {
                this.visibleReporter = false
                this.formData.reporter = selectedRows[0].realName
            },
            closeDept (selectedRows) {
                this.visibleDept = false
                this.formData.reportUnit = selectedRows.id
                this.formData.reportUnitName = selectedRows.name
            }
        }
    }
</script>
<style>
</style>
