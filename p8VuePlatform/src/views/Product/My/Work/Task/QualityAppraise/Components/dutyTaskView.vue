<template>
    <common-dialog
            :title="title"
            :visible="visible"
            width="60%"
            :dialogHeight="600"
            @close="handleCancel"
            :showHandleBtn="false"
            :dialogConfig="dialogConfig"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
        <template #dialog>
            <form-list
                    labelWidth="100px"
                    ref="form"
                    :dataSource="dataSource"
                    :form="modify"
                    @rendered="rendered">

            </form-list>
        </template>
    </common-dialog>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'
    export default {
        name: 'dutyTaskView',
        components: {
            FormList,
            CommonDialog
        },
        props: {
            dutyTaskId: {
                type: String
            },
            visible: {
                type: Boolean
            },
            title: {
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
                        fieldName: 'sysReviewersId',
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
                        type: 'view',
                        labelText: '状态',
                        fieldName: 'state',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'view',
                        labelText: '评审描述',
                        fieldName: 'reviewdescription',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'view',
                        labelText: '实际开始时间',
                        fieldName: 'realBeginDate',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'view',
                        labelText: '实际完成时间',
                        fieldName: 'realEndDate',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'uploadView', // 增删行中附件查看
                        filesLayout: 'card', // 附件展示类型[row / card; 默认card]
                        labelText: '附件查看',
                        fieldName: 'uploadFiles',
                        colLayout: 'singleCol'
                    }
                ],
                modify: {},
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                }
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
                this.$api['manageAppraise.getAppraiseTableDate']({ id: this.dutyTaskId }).then(function (res) {
                    let data = res
                    that.modify = data[0]
                })
            },
            rendered () {
                if (this.dutyTaskId && this.dutyTaskId !== '') {
                    this.getDutyTask()
                }
            },
            handleCancel (e) {
                this.$emit('close-modal')
            }
        }
    }
</script>
