<template>
    <div>
        <form-list ref="form"
                   @saved="saved"
                   @rendered="rendered"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   @close="closeModal"
        >
        </form-list>
    </div>
</template>
<script>
    import { P8Form as FormList } from '~/index'
    export default {
        components: {
            FormList
            },
        props: {
            riskBaseId: {
                type: String,
                default: ''
            }

        },
        data () {
            return {
                saveApi: 'riskManager.saveRiskBase',
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
                        type: 'treeSelect',
                        multiple: false,
                        labelText: '项目类型',
                        fieldName: 'classifyId',
                        colLayout: 'singleCol',
                        defaultValue: [],
                        placeholder: '请选择项目类型',
                        optionUrl: {
                            api: 'ProjectApply.projectClassifyTree',
                            value: 'id'
                        },
                        treeData: []
                    },
                    {
                        labelText: '风险内容描述',
                        type: 'textarea',
                        fieldName: 'riskDesc',
                        placeholder: '请输入风险内容描述',
                        colLayout: 'singleCol',
                        rules: [
                            ]
                    },
                    {
                        labelText: '风险范围',
                        type: 'select',
                        fieldName: 'suit',
                        placeholder: '请选风险范围',
                        colLayout: 'singleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'SUIT' },
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
                        labelText: '风险类型',
                        type: 'select',
                        fieldName: 'riskType',
                        placeholder: '请选风险类型',
                        colLayout: 'singleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'RISK_TYPE' },
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
                        labelText: '影响KPI',
                        type: 'textarea',
                        fieldName: 'kpiEffrct',
                        placeholder: '请输入影响KPI',
                        colLayout: 'singleCol',
                        rules: [
                        ]
                    },
                    {
                        labelText: '风险应对措施',
                        type: 'textarea',
                        fieldName: 'riskMeasure',
                        placeholder: '请输入风险应对措施',
                        colLayout: 'singleCol',
                        rules: [
                        ]
                    }
                ],
                modify: {}

            }
        },
        mounted () {
            if (this.riskBaseId && this.riskBaseId !== '') {
                this.getClassifyData(this.riskBaseId)
            }
        },
        methods: {
            closeModal () {

            },
            rendered () {

            },
            getClassifyData (id) {
                let that = this
                that.$api['riskManager.getById']({ id: id }).then(function (res) {
                    let data = res
                    that.formData.id = data.id
                    that.formData.classifyId = data.classifyId
                    that.formData.riskDesc = data.riskDesc
                    that.formData.riskType = data.riskType
                    that.formData.kpiEffrct = data.kpiEffrct
                    that.formData.riskMeasure = data.riskMeasure
                    that.formData.suit = data.suit
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
