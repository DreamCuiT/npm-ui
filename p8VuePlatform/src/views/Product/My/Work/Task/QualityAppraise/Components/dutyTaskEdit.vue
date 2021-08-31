<template>
    <form-list
            labelWidth="100px"
            ref="form"
            :dataSource="dataSource"
            :form="formData"
            :api="saveApi"
            @saved="saved"
            @rendered="rendered"
    >
    </form-list>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    export default {
        name: 'dutyTaskEdit',
        components: {
            FormList
        },
        props: {
            dutyTaskId: {
                type: String
            }
        },
        data () {
            return {
                saveApi: 'manageAppraise.implementTask',
                dataSource: [
                    {
                        type: 'view',
                        labelText: '体系类型',
                        fieldName: 'systemtype',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'view',
                        labelText: '责任人',
                        fieldName: 'dutyUserId',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'view',
                        labelText: '计划开始时间',
                        fieldName: 'planBeginDate',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '计划完成时间',
                        fieldName: 'planEndDate',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '创建人',
                        fieldName: 'createUserid',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '任务执行',
                        slotName: 'task',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'select',
                        labelText: '状态',
                        fieldName: 'state',
                        placeholder: '选择状态',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ],
                        options: [
                            {
                                label: '进行中',
                                value: 'Q1002'
                            },
                            {
                                label: '提交审核',
                                value: 'Q1006'
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        labelText: '评审描述',
                        fieldName: 'reviewdescription',
                        colLayout: 'singleCol',
                        placeholder: '请输入文本内容',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '实际开始时间',
                        fieldName: 'realBeginDate',
                        colLayout: 'doubleCol',
                        placeholder: '选择日期'
                    },
                    {
                        type: 'datetime',
                        labelText: '实际完成时间',
                        fieldName: 'realEndDate',
                        colLayout: 'doubleCol',
                        placeholder: '选择日期'
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
                formData: {
                    getFile: []
                },
                modify: {}
            }
        },
        methods: {
            setItemKey (item) {
                item.key = item.id
                let that = this
                if (item.children && item.children.length > 0) {
                    item.children.map(function (subItem, idx) {
                        that.setItemKey(subItem)
                    })
                }
            },
            getDutyTask () {
                let that = this
                this.$api['manageAppraise.dutyTaskInfo']({ id: this.dutyTaskId }).then(function (res) {
                    let data = res
                    that.formData.id = data.id
                    that.formData.systemtype = data.systemtype
                    that.formData.dutyUserId = data.dutyUserId
                    that.formData.planBeginDate = data.planBeginDate
                    that.formData.planEndDate = data.planEndDate
                    that.formData.createUserid = data.createUserid
                    that.formData.reviewdescription = data.reviewdescription
                    that.formData.realBeginDate = data.realBeginDate
                    that.formData.realEndDate = data.realEndDate
                    if (data.getFile != null) {
                        that.formData.getFile = data.getFile
                    }
                    that.formData = Object.assign({}, that.formData)
                })
            },
            rendered () {
                if (this.dutyTaskId && this.dutyTaskId !== '') {
                    this.getDutyTask()
                }
            },
            saved () {
                this.$emit('save-success', 'success')
            }
        }
    }
</script>

<style scoped>

</style>
