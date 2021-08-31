<template>
        <form-list ref="form"
                   @saved="saved"
                   @rendered="rendered"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   @close="closeModal"
        >
        </form-list>
</template>
<script>
    import { Input } from '~/index'
    import { P8Form as FormList } from '~/index'
    export default {
        components: {
            FormList,
                // eslint-disable-next-line vue/no-unused-components
            'el-input': Input
        },
        props: {
            wholeId: {
                type: String,
                default: ''
            },
        rowId: {
                type: String,
                default: ''
        }
        },
        data () {
            return {
                saveApi: 'PaReport.saveReport',
                selectClassifyVisible: false,
                labelWidth: 'auto',
                formData: {
                    classifyId: '',
                    classify: '',
                    name: '',
                    getFile: [],
                    riskMeasure: ''
                },
                selectedRow: {},
                dataSource: [
                    {
                        labelText: '决策事项',
                        type: 'select',
                        fieldName: 'classifyId',
                        placeholder: '请选择决策事项',
                        colLayout: 'singleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'REPORT_CLASSIFY' },
                            label: 'label',
                            value: 'value'
                        },
                        options: [],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }]
                    },
                    {
                        type: 'upload',
                        labelText: '文件上传',
                        fieldName: 'getFile',
                        colLayout: 'singleCol',
                        uploadConfig: {
                                limit: 1
                        },
                        listType: 'secret' // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                    }
                ],
                modify: {}

            }
        },
        mounted () {
            this.formData.wholeId = this.wholeId
            if (this.rowId && this.rowId !== '') {
                this.getClassifyData(this.rowId)
            }
        },
        methods: {
            closeModal () {

            },
            rendered () {

            },
            getClassifyData (id) {
                let that = this
                that.$api['PaReport.getReport']({ id: id }).then(function (res) {
                    let data = res
                    that.formData.id = data.id
                    that.formData.wholeId = data.wholeId
                    that.formData.classifyId = data.classifyId
                    that.formData.name = data.name
                    that.formData.getFile = data.getFile
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('save-success')
            },
            showModal () {

            },
            handleChange (info) {
                console.log(info, 'info')
            }
        }
    }
</script>
