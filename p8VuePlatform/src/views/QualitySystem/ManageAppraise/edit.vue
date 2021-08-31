<template>
    <common-dialog
            :title="title"
            :visible="visible"
            destroy-on-close
            @close="handleCancel"
            width="500px"
            dialogHeight="265"
            :showHandleBtn="false"
            :dialogConfig="dialogConfig"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
    >
        <template #dialog>
            <el-form  label-width="80px" :model="formLabelAlign"
                     style="margin-top: 30px;
                            border-bottom: 1px solid #e1e1e1;">
                <el-form-item label="体系类型">
                    <el-input v-model="formLabelAlign.systemtype"  readonly="readonly" style="width: 400px;"></el-input>
                </el-form-item>
                <el-form-item label="年度">
                    <el-date-picker
                            v-model="formLabelAlign.years"
                            type="year"
                            placeholder="选择年"
                            style="width: 400px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="管理评审计划名称">
                    <el-input v-model="formLabelAlign.name" style="width: 400px;"></el-input>
                </el-form-item>
            </el-form>
            <div style="position: absolute;bottom: 0;left: 0;width: 475px; padding: 10px;">
                <el-button type="primary" style="float: right" v-on:click="save()">保存</el-button>
            </div>
        </template>
    </common-dialog>
</template>

<script>

    import { P8Dialog as CommonDialog } from '~/index'
    import { Form, FormItem, DatePicker, Input, Button } from '~/index'

    export default {
        name: 'TreeEdit',
        components: {
            CommonDialog,
            'el-form': Form,
            'el-input': Input,
            'el-date-picker': DatePicker,
            'el-form-item': FormItem,
            'el-button': Button
        },
        props: {
            nodeData: {
                type: Object
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
                dataSource: [],
                formData: {},
                saveApi: 'qualitySystem.save',
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                },
                formLabelAlign: {
                    systemtype: '',
                    years: '',
                    name: ''
                },
                appraiseData: []
            }
        },
        created () {
            this.getNodeDetail()
        },
        methods: {
            save () {
                let req = {
                    name: '',
                    years: '',
                    systemtype: ''
                }
                req.name = this.formLabelAlign.name
                req.systemtype = this.formLabelAlign.systemtype
                req.years = this.formLabelAlign.years
                this.$api['manageAppraise.saveManageAppraise'](req).then(res => {
                    this.appraiseData = res
                    this.saved('true')
                })
            },

            getNodeDetail () {
                let that = this
                console.log(that.nodeData, 'nodeData')
                that.formLabelAlign.systemtype = that.nodeData.id
            },

            saved (res) {
                this.$emit('save-success', res)
            },

            handleCancel (e) {
                this.$emit('close-modal')
            }
        }
    }
</script>

<style scoped>
    .el-dialog__header {
        height: 43px;
    }

</style>
