<template>
    <div>
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData">
            <template #reporter>
                <el-input v-model="formData.reporter" @click.native="visibleReporter=true">
                </el-input>
            </template>
            <template #reportUnit>
                <el-input v-model="formData.reportUnitName" @click.native="visibleDept=true">
                </el-input>
            </template>
        </form-list>
        <select-user v-if="visibleReporter" :visible="visibleReporter"
                     :selectType="1" @close-dialog="closeModalReporter"></select-user>
        <select-dept v-if="visibleDept" :visible="visibleDept"
                     @close-dialog="closeDept"></select-dept>
    </div>
</template>
<script>
    import { Input } from '~/index'
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectDept from '@/views/QualitySystem/UncorrectionItems/SelectDept'

    export default {
        name: 'ProblemEdit',
        components: {
            'el-input': Input,
            FormList,
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
                saveApi: 'QualityEvaluation.save',
                formData: {
                    reportTime: '',
                    reporter: '',
                    reportUnit: ''
                },
                visibleReporter: false,
                visibleDept: false,
                dataSource: [
                    {
                        type: 'text',
                        labelText: '标题',
                        fieldName: 'title',
                        colLayout: 'singleCol',
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
                        labelText: '上报时间',
                        fieldName: 'reportTime',
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
                        type: 'textarea',
                        labelText: '备注',
                        fieldName: 'remark',
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
                this.$api['QualityEvaluation.getInfo']({ id: currEntityId }).then(res => {
                    that.formData = res
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('saveSuccess', res)
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
