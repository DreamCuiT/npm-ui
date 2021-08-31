<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData">
            <template #siteResponsibler>
                <el-input v-model="formData.siteResponsibler" @click.native="visibleSiteResponsibler=true">
                </el-input>
            </template>
            <template #reportUnit>
                <el-input v-model="formData.reportUnitName" @click.native="visibleDept=true">
                </el-input>
            </template>
        </form-list>
        <select-user v-if="visibleSiteResponsibler" :visible="visibleSiteResponsibler"
                     :selectType="1" @close-dialog="closeSiteResponsibler"></select-user>
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
            FormList,
            SelectUser,
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
                saveApi: 'ScientificResearchSite.save',
                visibleSiteResponsibler: false,
                formData: {
                    siteResponsibler: '',
                    reportTime: '',
                    reportUnit: ''
                },
                visibleDept: false,
                dataSource: [
                    {
                        type: 'blank',
                        labelText: '申报单位',
                        fieldName: 'reportUnit',
                        slotName: 'reportUnit',
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
                        type: 'text',
                        labelText: '申报现场名称',
                        fieldName: 'declareSite',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'datetime',
                        labelText: '申报时间',
                        fieldName: 'reportTime',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '现场负责人',
                        fieldName: 'siteResponsibler',
                        slotName: 'siteResponsibler',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'select',
                        labelText: '拟申报星级',
                        fieldName: 'declareStar',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: '一星',
                                value: '一星'
                            },
                            {
                                label: '二星',
                                value: '二星'
                            }
                        ],
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'textarea',
                        labelText: '生产现场自查情况',
                        fieldName: 'siteSituation',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'textarea',
                        labelText: '单位推荐意见',
                        fieldName: 'unitRecommendation',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'textarea',
                        labelText: '评审组意见',
                        fieldName: 'reviewComments',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '评审组长',
                        fieldName: 'reviewTeamLeader',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '院主管部门意见',
                        fieldName: 'competentDepartmentComments',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'text',
                        labelText: '达标等级',
                        fieldName: 'standardLevel',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'datetime',
                        labelText: '达标时间',
                        fieldName: 'standardTime',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'text',
                        labelText: '任务/专业',
                        fieldName: 'major',
                        colLayout: 'doubleCol'
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
                this.$api['ScientificResearchSite.getInfo']({ id: currEntityId }).then(res => {
                    that.formData = res
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('saveSuccess', res)
            },
            closeSiteResponsibler (selectedRows) {
                this.visibleSiteResponsibler = false
                this.formData.siteResponsibler = selectedRows[0].realName
            },
            getUser () {
                this.formData.reportUnit = this.$store.getters.userInfo.departmentId
                this.formData.reportUnitName = this.$store.getters.userInfo.departmentName
                this.formData.reportTime = new Date()
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
