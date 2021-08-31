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
            record: {
                type: Object
            }
        },
        data () {
            return {
                saveApi: 'QualityProject.save',
                formData: {
                    getFile: []
                },
                dataSource: [
                    {
                        type: 'upload', // 控件类型
                        labelText: '选择文件', // 控件显示的文本
                        fieldName: 'getFile',
                        colLayout: 'singleCol',
                        uploadConfig: {
                            drag: true,
                            limit: 1
                        },
                        listType: 'secret'// 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                    }
                ],
                modify: {}
            }
        },
        mounted () {},
        methods: {
            rendered () {}
        }
    }
</script>
<style>
</style>
