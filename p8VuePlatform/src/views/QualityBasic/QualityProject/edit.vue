<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData">
            <template #approver>
                <el-input v-model="formData.approver"
                          @click.native="visibleApprover=true">
                </el-input>
            </template>
            <template #reporter>
                <el-input v-model="formData.reporter" @click.native="visibleReporter=true">
                </el-input>
            </template>
            <template #unit>
                <el-input v-model="formData.unitName" @click.native="visibleDept=true">
                </el-input>
            </template>
            <template #wholeDescribeId>
                <el-input v-model='formData["wholeDescribeName"]'
                          readonly
                          autosize
                          placeholder="请选择项目"
                          v-on:click.native="selectProjectVisible = true">
                    <i v-if='selectedRow'
                       class='el-icon-link'
                       slot='suffix'
                       type='link'
                       :style='{cursor: "pointer", fontSize: "16px", color: "#08c" }'></i>
                </el-input>
            </template>
        </form-list>
        <select-user v-if="visibleReporter" :visible="visibleReporter"
                     :selectType="1" @close-dialog="closeModalReporter"></select-user>
        <select-user v-if="visibleApprover" :visible="visibleApprover"
                     :selectType="1" @close-dialog="closeApprover"></select-user>
        <select-project v-if='selectProjectVisible' :selected-row='selectedRow'
                        :visible='selectProjectVisible'
                        @close-modal='closeProjectModal'></select-project>
        <select-dept v-if="visibleDept" :visible="visibleDept"
                     @close-dialog="closeDept"></select-dept>
    </div>

</template>
<script>
    import { Input } from '~/index'
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectProject from '@/views/Product/Pm/Project/selectProject'
    import SelectDept from '@/views/QualitySystem/UncorrectionItems/SelectDept'

    export default {
        name: 'ProblemEdit',
        components: {
            FormList,
            SelectUser,
            SelectProject,
            'el-input': Input,
            SelectDept
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            return {
                saveApi: 'QualityProject.save',
                visibleApprover: false,
                selectedRow: {},
                selectProjectVisible: false,
                visibleReporter: false,
                visibleDept: false,
                formData: {
                    reportTime: '',
                    reporter: '',
                    approver: '',
                    unitName: '',
                    wholeDescribeId: '',
                    wholeDescribeName: '',
                    wholeDescribeType: '',
                    wholeDescribeResponsibler: ''
                },
                dataSource: [
                    {
                        type: 'text',
                        labelText: '单据号',
                        fieldName: 'documentNo',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '单位',
                        fieldName: 'unit',
                        slotName: 'unit',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'select',
                        labelText: '级别',
                        fieldName: 'projectLevel',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'QUALITY_PROJECT_LEVEL' },
                            label: 'label',
                            value: 'label'
                        },
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '项目',
                        slotName: 'wholeDescribeId',
                        fieldName: 'wholeDescribeId',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '项目类别',
                        fieldName: 'wholeDescribeType',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '项目负责人',
                        fieldName: 'wholeDescribeResponsibler',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '研究内容',
                        fieldName: 'researchContents',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'text',
                        labelText: '完成形式',
                        fieldName: 'completeForm',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'number',
                        labelText: '院拨经费(万)',
                        fieldName: 'yardFunds',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }],
                        min: 0
                    },
                    {
                        type: 'number',
                        labelText: '自筹经费(万)',
                        fieldName: 'raiseIndependentlyFunds',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }],
                        min: 0
                    },
                    {
                        type: 'number',
                        labelText: '总经费(万)',
                        fieldName: 'totalFunds',
                        colLayout: 'doubleCol',
                        min: 0
                    },
                    {
                        type: 'datetime',
                        labelText: '项目完成日期',
                        fieldName: 'completionDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'textarea',
                        labelText: '申请说明',
                        fieldName: 'applicationDescription',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '备注',
                        fieldName: 'remark',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '制单人',
                        fieldName: 'reporter',
                        slotName: 'reporter',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'datetime',
                        labelText: '制单日期',
                        fieldName: 'reportTime',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '审批人',
                        fieldName: 'approver',
                        slotName: 'approver',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'datetime',
                        labelText: '审批日期',
                        fieldName: 'approveTime',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'textarea',
                        labelText: '审批内容',
                        fieldName: 'approveContent',
                        colLayout: 'singleCol'
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
                this.$api['QualityProject.getInfo']({ id: currEntityId }).then(res => {
                    that.formData = res
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('saveSuccess', res)
            },
            closeApprover (selectedRows) {
                this.visibleApprover = false
                this.formData.approver = selectedRows[0].realName
            },
            closeProjectModal (selectedRow) {
                this.selectProjectVisible = false
                this.selectedRow = selectedRow
                console.log(selectedRow, 'selectedRow')
                let that = this
                that.formData.wholeDescribeId = selectedRow.id
                that.formData.wholeDescribeName = selectedRow.name
                that.formData.wholeDescribeType = selectedRow.kprojectClassifyname
                that.formData.wholeDescribeResponsibler = selectedRow.userName
                that.formData = Object.assign({}, that.formData)
            },
            getUser () {
                this.formData.reporter = this.$store.getters.userName
                this.formData.reportTime = new Date()
            },
            closeModalReporter (selectedRows) {
                this.visibleReporter = false
                this.formData.reporter = selectedRows[0].realName
            },
            closeDept (selectedRows) {
                this.visibleDept = false
                this.formData.unit = selectedRows.id
                this.formData.unitName = selectedRows.name
            }
        }
    }
</script>
<style>
</style>
