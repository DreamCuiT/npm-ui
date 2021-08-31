<template>
    <div class="project-con">
        <div class="title">
        </div>
        <div class="form-con">
            <form-list ref="form" :dataSource="dataSource" :form="formData" :existDefaultBtn="false"></form-list>
        </div>
    </div>
</template>
<script>
    import { P8Form as FormList } from '~/index'
    export default {
        name: 'ProjectFormView',
        props: {
            riskBaseId: {
                type: String
            }
        },
        data () {
            const dataSource = [
                {
                    type: 'view',
                    multiple: false,
                    labelText: '项目类型',
                    fieldName: 'classifyIdDisplay',
                    colLayout: 'singleCol'

                },
                {
                    labelText: '风险内容描述',
                    type: 'view',
                    fieldName: 'riskDesc',
                    placeholder: '请输入风险内容描述',
                    colLayout: 'singleCol'

                },
                {
                    labelText: '风险范围',
                    type: 'view',
                    fieldName: 'suitDisplay',
                    placeholder: '请选风险范围',
                    colLayout: 'singleCol'

                },
                {
                    labelText: '风险类型',
                    type: 'view',
                    fieldName: 'riskTypeDisplay',
                    placeholder: '请选风险类型',
                    colLayout: 'singleCol'

                },
                {
                    labelText: '影响KPI',
                    type: 'view',
                    fieldName: 'kpiEffrct',
                    placeholder: '请输入影响KPI',
                    colLayout: 'singleCol'

                },
                {
                    labelText: '风险应对措施',
                    type: 'view',
                    fieldName: 'riskMeasure',
                    placeholder: '请输入风险应对措施',
                    colLayout: 'singleCol'

                }

            ]
            return {
                dataSource,
                formData: Object.assign({}, {
                    hiddenId: '',
                    checkboxGroup: [],
                    detailList: [
                        // {
                        //   roleName: '',
                        //   sysName: ''
                        // }
                    ],
                    confidentialiteList: []
                })
            }
        },
        watch: {

        },
        mounted () {
            if (this.riskBaseId && this.riskBaseId !== '') {
                this.getClassifyData(this.riskBaseId)
            }
        },
        methods: {
            getClassifyData (id) {
                let _this = this
                this.$api['riskManager.getById']({ id: id }).then(res => {
                    _this.formData = res
                })
            }
        },
        components: {
            FormList
        }
    }
</script>
<style lang="scss">
    .project-con{
        .title {
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            padding-left: 6px;
            border-bottom: 1px solid #f2f2f2;
            box-sizing: border-box;
        }
        box-sizing: border-box;
        height: 90vh;
        overflow-y: auto;
        padding: 0 8px;
        .form-con {
            height: calc(100% - 50px);
        }
    }
</style>
