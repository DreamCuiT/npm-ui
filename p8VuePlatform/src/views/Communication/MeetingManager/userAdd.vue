<template>
    <el-dialog title="添加人员" :visible="visible"
               append-to-body destroy-on-close @close="handleCancel">
        <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="realName">
                <el-input v-model="form.realName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门" :label-width="formLabelWidth" prop="departmentName">
                <el-input v-model="form.departmentName" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleOk('form')">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { Dialog, Input, Button, Form, FormItem } from '~/index'

    export default {
        name: 'Edit',
        components: {
            'el-dialog': Dialog,
            'el-input': Input,
            'el-button': Button,
            'el-form': Form,
            'el-form-item': FormItem
        },
        props: {
            visible: {
                type: Boolean
            }
        },
        data () {
            return {
                form: {
                    realName: '',
                    departmentName: ''
                },
                rules: {
                    realName: [{ required: true, message: '必填' }],
                    departmentName: [{ required: true, message: '必填' }]
                },
                formLabelWidth: '60px'
            }
        },
        mounted () {
            // this.refresh()
        },
        methods: {
            handleOk (formData) {
                this.$refs[formData].validate((valid) => {
                    if (valid) {
                        this.visible = false
                        let selectedRows = []
                        selectedRows.push(this.form)
                        this.$emit('close-dialog', selectedRows)
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            handleCancel (e) {
                this.visible = false
                this.$emit('close-dialog', e)
            }
        }
    }
</script>
