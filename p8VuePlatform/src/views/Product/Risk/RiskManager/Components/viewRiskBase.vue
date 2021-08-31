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
                    labelText: '风险任务',
                    fieldName: 'projectTaskName',
                    slotName: 'projectTaskName',
                    colLayout: 'singleCol'

                },
                {
                    type: 'view',
                    labelText: '风险起点任务',
                    fieldName: 'startProjectTaskName',
                    slotName: 'startProjectTaskName',
                    colLayout: 'doubleCol'

                },
                {
                    type: 'view',
                    labelText: '风险终点任务',
                    fieldName: 'endProjectTaskName',
                    slotName: 'endProjectTaskName',
                    colLayout: 'doubleCol'

                },

                {
                    labelText: '风险类型',
                    type: 'view',
                    fieldName: 'riskType',
                    placeholder: '请选风险类型',
                    colLayout: 'doubleCol'

                },
                {
                    labelText: '风险描述',
                    type: 'view',
                    fieldName: 'riskDesc',
                    placeholder: '请输入风险内容描述',
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
                    labelText: '风险措施',
                    type: 'view',
                    fieldName: 'riskMeasure',
                    placeholder: '请输入风险应对措施',
                    colLayout: 'singleCol'

                },
                {
                    labelText: '风险后果',
                    type: 'view',
                    fieldName: 'riskResult',
                    placeholder: '请输入风险风险后果',
                    colLayout: 'singleCol'

                },
                {
                    labelText: '风险等级',
                    type: 'view',
                    fieldName: 'riskLevel',
                    placeholder: '请选风险等级',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'view',
                    labelText: '提出人',
                    fieldName: 'riskLaunchUser',
                    slotName: 'riskLaunchUser',
                    colLayout: 'doubleCol'

                },
                {
                    type: 'view', // 控件类型
                    labelText: '提出时间', // 控件显示的文本
                    placeholder: '请选择提出时间',
                    colLayout: 'doubleCol',
                    fieldName: 'processingTime',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'view',
                    labelText: '指定处理人',
                    fieldName: 'riskDutyUser',
                    slotName: 'riskDutyUser',
                    colLayout: 'doubleCol'

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
                    this.$api['riskManager.getRiskManageById']({ id: id }).then(res => {
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
{
type: 'view',riskManager.getById
multiple: false,
labelText: '项目类型',
fieldName: 'classifyId',
colLayout: 'singleCol'

},
{
labelText: '风险内容描述',
type: 'view',
fieldName: 'riskDesc',
placeholder: '请输入风险内容描述',
colLayout: 'singleCol',

},
{
labelText: '风险种类',
type: 'view',
fieldName: 'suit',
placeholder: '请选风险种类',
colLayout: 'singleCol'

},
{
labelText: '风险类型',
type: 'view',
fieldName: 'riskType',
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
