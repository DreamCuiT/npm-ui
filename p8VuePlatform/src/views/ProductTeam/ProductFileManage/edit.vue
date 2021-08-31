<template>
    <form-list
            labelWidth="100px"
            ref="form"
            :dataSource="dataSource"
            :form="formData"
            :api="saveApi"
            @saved="saved"
    >
    </form-list>

</template>

<script>
    import { P8Form as FormList } from '~/index'
    export default {
        name: 'edit',
        components: {
            FormList
        },
        props: {
            clickedNodeData: {
                type: Object
            }
        },
        data () {
            const dataSource = [
                {
                    type: 'upload',
                    labelText: '', // 控件显示的文本
                    fieldName: 'getFile',
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
                saveApi: 'productFileManage.upload',
                dataSource,
                formData: {
                    getFile: [],
                    productFileId: this.clickedNodeData.id
                }
            }
        },
        methods: {
            saved () {
                console.log(this.clickedNodeData, '=============')
                console.log('附件保存回调！')
                this.$emit('save-success', 'success')
            }
        }
    }
</script>

<style scoped>

</style>
