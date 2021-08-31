<template>
    <div>
        <form-list
                labelWidth="100px"
                ref="form"
                @rendered="rendered"
                :dataSource="dataSource"
                :form="formData"
                @saved="saved"
                :api="saveApi"
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
                },
                {
                    type: 'textarea',
                    labelText: '备注',
                    fieldName: 'remark',
                    colLayout: 'singleCol'
                }
            ]
            return {
                saveApi: 'planLarge.save',
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
            rendered () {
                console.log(this.planTypeParam, 'planTypeParam')
                if (this.planTypeParam.taskId && this.planTypeParam.taskId !== '') {
                    this.searchByTaskId(this.planTypeParam.taskId)
                }
            },
            searchByTaskId (id) {
                let that = this
                that.$api['planLarge.searchByTaskId']({
                    projectTasksId: id
                }).then(function (res) {
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
            cancel () {
                this.$emit('close-modal', {})
            },
            submit () {
                this.$emit('close-modal', this.formData.getFile)
            },
            saved () {
                this.$emit('saveSuccess', null)
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>
