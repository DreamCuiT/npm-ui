<template>
    <common-dialog
            :title="title"
            :visible="visible"
            destroy-on-close
            @close="handleCancel"
            width="500px"
            dialogHeight="240"
            :showHandleBtn="false"
            :dialogConfig="dialogConfig"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
    >
        <template #dialog>
            <form-list ref="form" @rendered="rendered" :form="formData"
                       @saved="saved" :dataSource="dataSource" :api="saveApi">
            </form-list>
        </template>
    </common-dialog>
</template>
<script>

    import { P8Form as FormList } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'

    export default {
        name: 'TreeEdit',
        components: {
            FormList,
            CommonDialog
        },
        props: {
            record: {
                type: Object
            },
            visible: {
                type: Boolean
            },
            title: {
                type: String
            },
            clickedNodeData: {
                type: Object,
                default: () => {
                }
            }
        },
        data () {
            return {
                dataSource: [
                    {
                        type: 'text',
                        labelText: '名称',
                        fieldName: 'name',
                        placeholder: '名称',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '编号',
                        fieldName: 'code',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            },
                            {
                                pattern: '^[0-9.a-zA-Z_]{1,}$',
                                message: '只可输入数字，字母，小数点和下划线',
                                trigger: 'blur'
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (this.clickedNodeData) {
                                        this.$api['TypeSpectrum.repeatedCheck']({
                                            id: this.clickedNodeData.id,
                                            code: value
                                        }).then(response => {
                                            console.log(response, 'response')
                                            if (response.result) {
                                                callback(new Error('编号已存在！'))
                                            } else {
                                                callback()
                                            }
                                        })
                                    } else {
                                        this.$api['TypeSpectrum.repeatedCheck']({
                                            id: '',
                                            code: value
                                        }).then(response => {
                                            console.log(response, 'response')
                                            if (response.result) {
                                                callback(new Error('编号已存在！'))
                                            } else {
                                                callback()
                                            }
                                        })
                                    }
                                },
                                trigger: 'blur'
                            }
                        ]
                    },
                    {
                        type: 'treeSelect',
                        labelText: '父节点',
                        fieldName: 'parentId',
                        colLayout: 'singleCol',
                        optionUrl: {
                            api: 'TypeSpectrum.typeSpectrumTree',
                            label: 'name',
                            value: 'id'
                        }
                    }
                ],
                formData: {},
                saveApi: 'TypeSpectrum.typeSpectrumSave',
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                }
            }
        },
        created () {
            this.formTrigger()
        },
        methods: {
            formTrigger () {
                this.dataSource = Object.assign([], this.dataSource)
            },
            getNodeDetail (clickedNodeData) {
                console.log(clickedNodeData, 'clickedNodeData')
                let that = this
                let nodeId = clickedNodeData.id
                this.$api['TypeSpectrum.typeSpectrumGetNodeDetail']({ 'id': nodeId }).then(function (res) {
                    let data = res
                    that.formData.id = data.id
                    that.formData.name = data.name
                    that.formData.code = data.code
                    that.formData.parentId = data.parentId
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log(error)
                })
            },
            rendered () {
                if (this.clickedNodeData && this.clickedNodeData !== '') {
                    this.getNodeDetail(this.clickedNodeData)
                }
            },
            saved (res) {
                console.log('edit saved')
                this.$emit('save-success', res)
            },
            handleCancel (e) {
                this.$emit('close-modal')
            }
        }
    }
</script>

<style scoped>

</style>
