<template>
    <div>
        <common-dialog
                :visible="visible"
                width="70%"
                :dialogHeight="500"
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
                        :form="formData"
                        :api="saveApi"
                        @saved="saved"
                        @rendered="rendered"
                >
                    <template #handler>
                        <el-input v-model="formData.handler" @click.native="visibleHandlerName=true">
                        </el-input>
                    </template>
                </form-list>
            </template>
        </common-dialog>
        <select-user v-if="visibleHandlerName" :visible="visibleHandlerName"
                     :selectType="selectType" @close-dialog="closeHandlerName"></select-user>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import { Input } from '~/index'
    export default {
        name: 'AddInfo',
        components: {
            SelectUser,
            FormList,
            CommonDialog,
            'el-input': Input
        },
        props: {
            visible: {
                type: Boolean
            },
            record: {
                type: Object
            }
        },
        data () {
            const dataSource = [
                {
                    type: 'text',
                    labelText: '改进项目名称',
                    fieldName: 'improveName',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'datetime',
                    labelText: '计划完成时间',
                    fieldName: 'planEndTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    },
                    rules: [
                        {
                            required: true,
                            message: '必填'
                        }
                    ]
                },
                {
                    type: 'text',
                    labelText: '完成形式',
                    fieldName: 'finishForm',
                    colLayout: 'doubleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'textarea',
                    labelText: '整改措施',
                    fieldName: 'rectifyMeasures',
                    colLayout: 'singleCol'
                },
                {
                    type: 'textarea',
                    labelText: '完成情况',
                    fieldName: 'finishSituation',
                    colLayout: 'singleCol'
                },
                {
                    type: 'blank',
                    labelText: '办理责任人',
                    fieldName: 'handler',
                    slotName: 'handler',
                    placeholder: '请选择',
                    colLayout: 'doubleCol',
                    rules: [
                        {
                            required: true,
                            message: '必填'
                        }
                    ]
                },
                {
                    type: 'datetime',
                    labelText: '实际完成时间',
                    fieldName: 'realEndTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    },
                    rules: [
                        {
                            required: true,
                            message: '必填'
                        }
                    ]
                },
                {
                    type: 'textarea',
                    labelText: '备注',
                    fieldName: 'remarks',
                    colLayout: 'singleCol'
                },
                {
                    type: 'upload',
                    labelText: '', // 控件显示的文本
                    fieldName: 'getFiles',
                    defaultValue: [],
                    colLayout: 'singleCol',
                    uploadConfig: {
                        drag: true,
                        // 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
                        limit: 1
                    },
                    listType: 'secret'
                    // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                }
            ]
            return {
                saveApi: 'manageImproveTract.saveInfo',
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                },
                isCustomValidate: true,
                dataSource,
                formData: {
                    getFiles: []
                },
                visibleHandlerName: false,
                selectType: '1'
            }
        },
        methods: {
            rendered () {},
            saved (res) {
                this.formData.id = res
                this.$emit('saveInfo', this.formData)
                this.handleCancel(res)
            },
            closeHandlerName (selectedRows) {
                this.visibleHandlerName = false
                this.formData.handler = selectedRows[0].realName
                this.formData = Object.assign({}, this.formData)
            },
            handleCancel (e) {
                this.$emit('close-info')
            }
        }
    }
</script>

<style scoped>

</style>
