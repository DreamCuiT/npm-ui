<template>
    <div>
        <form-list
                labelWidth="100px"
                ref="form"
                @rendered="rendered"
                :dataSource="dataSource"
                :form="formData"
                :api="saveApi"
                @saved="saved"
                @custom-validate="parseCheck"
        >
            <template #teamLeader>
                <el-input v-model="formData.teamLeaderName" @click.native="visible=true"
                          readonly
                          autosize>
                    <i class='el-icon-link'
                       slot='suffix'
                       type='link'
                       :style='{ fontSize: "16px", color: "#08c" }'></i>
                </el-input>
            </template>
        </form-list>
        <select-user v-if="visible" :visible="visible" :selected-row='selectedRows'
                     @close-dialog="closeModal" selectType="1"></select-user>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'

    export default {
        name: 'ImportExcel',
        props: {
            planTypeParam: {
                type: Object,
                default: null
            }
        },
        components: {
            FormList,
            SelectUser
        },
        data () {
            const dataSource = [
                {
                    type: 'view',
                    labelText: '型号名称',
                    fieldName: 'modelName',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'view',
                    labelText: '领域',
                    fieldName: 'classifyName',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'view',
                    labelText: '项目名称',
                    fieldName: 'wholeDescribeName',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'view',
                    labelText: '目前状态',
                    fieldName: 'planStatus',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'view',
                    labelText: '计划开始时间',
                    fieldName: 'planBeginTime',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'view',
                    labelText: '计划结束时间',
                    fieldName: 'planEndTime',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'view',
                    labelText: '项目类型',
                    fieldName: 'wholeDescribeType',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '队长',
                    fieldName: 'teamLeader',
                    slotName: 'teamLeader',
                    colLayout: 'doubleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'select',
                    labelText: '试验地点',
                    fieldName: 'place',
                    colLayout: 'doubleCol',
                    optionUrl: {
                        api: 'thirdPartInterface.getDic',
                        params: { dicType: 'TEST_PLACE' }
                    },
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'text',
                    labelText: '试验名称',
                    fieldName: 'name',
                    colLayout: 'doubleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'number',
                    labelText: '试验最小数',
                    fieldName: 'minCount',
                    maxName: 'maxCount',
                    colLayout: 'doubleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'number',
                    labelText: '试验最大数',
                    fieldName: 'maxCount',
                    minName: 'minCount',
                    colLayout: 'doubleCol',
                    rules: [{ required: true, message: '必填' }]
                }
            ]
            return {
                saveApi: 'planFlight.save',
                visible: false,
                selectedRows: [],
                formData: {
                    teamLeaderName: ''
                },
                dataSource,
                isCustomValidate: true
            }
        },
        methods: {
            saved () {
                this.$emit('saveSuccess', null)
            },
            rendered () {
                // alert(this.planTypeParam.taskId)
                console.log(this.planTypeParam, 'planTypeParam')
                if (this.planTypeParam.taskId && this.planTypeParam.taskId !== '') {
                    this.searchByTaskId(this.planTypeParam.taskId)
                }
            },
            searchByTaskId (id) {
                let that = this
                that.$api['planFlight.searchByTaskId']({
                    projectTasksId: id
                }).then(function (res) {
                    console.log(res, '查看数       据')
                    that.formData = res
                    that.formData.id = res.id
                    that.formData.teamLeaderName = res.teamLeaderName
                    that.formData.projectTasksId = that.planTypeParam.taskId
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            closeModal (selectedRows) {
                this.visible = false
                this.formData.teamLeader = selectedRows[0].id
                this.formData.teamLeaderName = selectedRows[0].realName
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
                this.$refs.form.submitForm(params, this.saveApi)
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>
