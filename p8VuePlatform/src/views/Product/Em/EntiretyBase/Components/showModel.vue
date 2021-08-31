<template>
        <form-list ref="form"
                   @saved="saved"
                   @rendered="rendered"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   @close="closeModal"
                   :existDefaultBtn="false"
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
            rowId: {
                type: String,
                default: ''
            }

        },
        data () {
            return {
                saveApi: 'PaModelFlot.savePaModelFlot',
                selectClassifyVisible: false,
                labelWidth: 'auto',
                formData: {
                    classifyId: '',
                    riskDesc: '',
                    suit: '',
                    riskType: '',
                    kpiEffrct: '',
                    riskMeasure: ''
                },
                selectedRow: {},
                dataSource: [
                        {
                                labelText: '决策文件类型',
                                type: 'view',
                                fieldName: 'classify'
                        },
                        {
                                labelText: '文件名称',
                                type: 'view',
                                fieldName: 'name'
                        },
                    {
                        type: 'uploadView',
                        labelText: '附件',
                        fieldName: 'getFile',
                        colLayout: 'singleCol',
                        uploadConfig: {
                        },
                        listType: 'secret' // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                    }
                ],
                modify: {}

            }
        },
        mounted () {
          this.getClassifyData(this.rowId)
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
                        that.formData.classify = data.classify
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
