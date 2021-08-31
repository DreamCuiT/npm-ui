<template>
    <form-list ref="form"
               @rendered="rendered"
               @saved="saved"
               :dataSource="dataSource"
               :api="saveApi"
               :form="formData">
    </form-list>
</template>
<script>
    import { P8Form as FormList } from '~/index'

    export default {
        name: 'ProblemEdit',
        components: {
            FormList
        },
        props: {
            reportType: {
                type: String
            },
            record: {
                type: Object
            }
        },
        data () {
            return {
                saveApi: 'QualityProject.uploadReport',
                formData: {
                    reportType: '',
                    getFile: []
                },
                dataSource: [
                    {
                        type: 'upload', // 控件类型
                        labelText: '选择文件', // 控件显示的文本
                        fieldName: 'getFile',
                        colLayout: 'singleCol',
                        uploadConfig: {
                            drag: true
                        },
                        listType: 'secret'// 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                    }
                ],
                modify: {}
            }
        },
        mounted () {
            if (this.record && this.record.id && this.reportType) {
                this.formData.reportType = this.reportType
                this.getProblem(this.record.id)
            }
        },
        methods: {
            rendered () {
            },
            getProblem (currEntityId) {
                let that = this
                this.$api['QualityProject.getInfo']({ id: currEntityId, reportType: this.reportType }).then(res => {
                    console.log(res, 'res')
                    that.formData.id = res.id
                    that.formData.getFile = res.getFile
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('saveSuccess', res)
            }
        }
    }
</script>
<style>
</style>
