<template>
    <div>
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData">
            <template #qualityPeople>
                <el-input v-model="formData.qualityPeople"
                          @click.native="visibleQualityPeople=true">
                </el-input>
            </template>
            <template #reporter>
                <el-input v-model="formData.reporter" @click.native="visibleReporter=true">
                </el-input>
            </template>
            <template #approver>
                <el-input v-model="formData.approver"
                          @click.native="visibleApprover=true">
                </el-input>
            </template>
        </form-list>
        <select-user v-if="visibleQualityPeople" :visible="visibleQualityPeople"
                     :selectType="1" @close-dialog="closeQualityPeople"></select-user>
        <select-user v-if="visibleReporter" :visible="visibleReporter"
                     :selectType="1" @close-dialog="closeModalReporter"></select-user>
        <select-user v-if="visibleApprover" :visible="visibleApprover"
                     :selectType="1" @close-dialog="closeApprover"></select-user>
    </div>

</template>
<script>
    import { Input } from '~/index'
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'

    export default {
        name: 'ProblemEdit',
        components: {
            FormList,
            SelectUser,
            'el-input': Input
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            return {
                saveApi: 'QualityThesis.save',
                formData: {
                    reporter: '',
                    approver: '',
                    qualityPeople: ''
                },
                visibleQualityPeople: false,
                visibleReporter: false,
                visibleApprover: false,
                dataSource: [
                    {
                        type: 'datetime',
                        labelText: '领用日期',
                        fieldName: 'collectionDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'treeSelect',
                        labelText: '领用单位',
                        fieldName: 'collectionUnit',
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
                        type: 'blank',
                        labelText: '质量人员',
                        fieldName: 'qualityPeople',
                        slotName: 'qualityPeople',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '检验印章',
                        fieldName: 'inspectionSeal',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'select',
                        labelText: '审批状态',
                        fieldName: 'status',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: '自由态',
                                value: '自由态'
                            },
                            {
                                label: '不自由态',
                                value: '不自由态'
                            }
                        ],
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
                    },
                    {
                        type: 'text',
                        labelText: '单据号',
                        fieldName: 'documentNo',
                        colLayout: 'singleCol',
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
            rendered () {
                if (this.record && this.record.id) {
                    this.getProblem(this.record.id)
                }
            },
            getProblem (currEntityId) {
                let that = this
                this.$api['QualityThesis.getInfo']({ id: currEntityId }).then(res => {
                    that.formData = res
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('saveSuccess', res)
            },
            closeQualityPeople (selectedRows) {
                this.visibleQualityPeople = false
                this.formData.qualityPeople = selectedRows[0].realName
            },
            getUser () {
                this.formData.reporter = this.$store.getters.userName
            },
            closeApprover (selectedRows) {
                this.visibleApprover = false
                this.formData.approver = selectedRows[0].realName
            },
            closeModalReporter (selectedRows) {
                this.visibleReporter = false
                this.formData.reporter = selectedRows[0].realName
            }
        }
    }
</script>
<style>
</style>
