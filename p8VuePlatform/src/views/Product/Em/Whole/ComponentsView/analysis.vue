<template>
    <div>
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   @custom-validate = "customValidate"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="modify">

        </form-list>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    export default {
        name: 'wholeDescribe',
        components: {
            // selectModel,
            FormList
        },
        props: {
            currEntityId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                saveApi: 'ProjectApply.wholeDescribeSave',
                projectRoles: [],
                deptIds: [],
                modify: {
                    modelCode: '',
                    mainLeadUser: '',
                    mainLeadUserId: '',
                    entityId: ''
                },
                disabledRow: [],
                dataSource: [
                    {
                        type: 'textarea',
                        labelText: '项目客户方名称',
                        fieldName: 'projectTarget',
                        colLayout: 'singleCol',
                        rules: [{ message: '项目客户方名称' }]
                    },
                    {
                        type: 'select',
                        labelText: '客户重要性',
                        fieldName: 'source',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'USERNAME' }
                        },
                        options: [],
                        rules: [{ message: '客户重要性' }]
                    },
                    {
                        type: 'select',
                        labelText: '项目重要性',
                        fieldName: 'source',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'USERNAME' }
                        },
                        options: [],
                        rules: [{ message: '项目重要性' }]
                    },
                    {
                        type: 'select',
                        labelText: '项目紧急度',
                        fieldName: 'source',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'USERNAME' }
                        },
                        options: [],
                        rules: [{ message: '项目紧急度' }]
                    },
                    // {
                    //     type: 'view',
                    //     labelText: '项目分级',
                    //     fieldName: 'projectOrder',
                    //     colLayout: 'doubleCol'
                    // },
                    {
                        type: 'textarea',
                        labelText: '竞争对手',
                        fieldName: 'particular',
                        colLayout: 'singleCol'
                    }
                ],
                sourceTaskBookId: '',
                sourceCopyData: {}
            }
        },
        mounted: function () {
        },
        methods: {
            customValidate (saveParams) {
                let beginEndTime = saveParams.beginEndTime
                if (beginEndTime.length === 2) {
                    saveParams.beginTime = beginEndTime[0]
                    saveParams.endTime = beginEndTime[1]
                    this.$refs.form.submitForm(saveParams, this.saveApi)
                } else {
                    console.log('save error ')
                }
            },
            rendered () {
                if (this.currEntityId && this.currEntityId !== '') {
                    this.getProjectData(this.currEntityId, 'update')
                }
            },
            openTable () {
                this.visible1 = true
            },
            getProjectData (currEntityId, dataType) {
                let that = this
                if (dataType === 'update') {
                    that.$api['ProjectApply.wholeDescribeData']({ entityId: currEntityId, dataType: dataType }).then(res => {
                        that.fillData(that, res, dataType)
                    })
                }
            },
            fillData (that, data, dataType) {
                data.leadDepts = Object.assign([], data.leadDeptIds)
                that.modify = data
                if (dataType === 'update') {
                    that.modify.entityId = data.id
                }
                that.modify.beginEndTime = [data.beginTime, data.endTime]
                that.modify.realBeginEndTime = [data.realBeginTime, data.realEndTime]
                that.selectedRows = []
                that.selectedRows.push({
                    id: data.modelInformationId,
                    modelCode: data.modelCode,
                    modelName: data.modelName,
                    classify: data.classify
                })
                that.modify.modelCode = data.modelCode
                that.modify.modelInformationId = data.modelInformationId
                that.modify.leadDeptIds = []
                data.leadDepts.map(function (item) {
                    that.modify.leadDeptIds.push(item.departmentId)
                })
                that.modify = Object.assign({}, that.modify)
            },
            saved (res) {
                if (!this.modify.entityId && res.id) {
                    this.modify.entityId = res.id
                }
                this.$emit('save-success', res)
            },
            handleChange (info) {
                console.log(info, 'info')
            }

        }
    }
</script>

<style scoped>

</style>
