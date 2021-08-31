<template>
    <el-dialog title='附件选择'
               :visible.sync='visible'
               width='800px'
               :before-close="cancel"
               :append-to-body='true'>
        <list-layout>
            <template #north>
                <el-button type="primary" @click="submit">确 定</el-button>
            </template>
            <template #center>
                <form-list
                        labelWidth="100px"
                        ref="form"
                        :dataSource="dataSource"
                        :form="formData"
                        :existDefaultBtn="false"
                        :existCustomBtn='true'
                >
                </form-list>
            </template>
        </list-layout>
    </el-dialog>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import { P8ListLayout as ListLayout } from '~/index'
    import { Dialog, Button } from '~/index'

    export default {
        name: 'ImportExcel',
        props: ['selectedRow', 'visible'],
        components: {
            FormList,
            'el-dialog': Dialog,
            ListLayout,
            'el-button': Button
        },
        data () {
            const dataSource = [
                {
                    type: 'upload',
                    labelText: '附件', // 控件显示的文本
                    fieldName: 'getFile',
                    defaultValue: [],
                    colLayout: 'singleCol',
                    uploadConfig: {
                        drag: true
                        // , // 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
                        // limit: 1
                    },
                    listType: 'secret' // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                }
            ]
            return {
                formData: {
                    getFile: []
                },
                dataSource,
                isCustomValidate: true
            }
        },
        methods: {
            cancel () {
                this.$emit('close-modal', {})
            },
            submit () {
                this.$emit('close-modal', this.formData.getFile)
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>
