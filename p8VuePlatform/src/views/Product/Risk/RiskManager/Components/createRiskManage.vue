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
                    <template  #riskLaunchUser>
                        <el-input v-model='formData["riskLaunchUser"]' readonly autosize placeholder="请选择提出人">
                            <i
                                    v-if='selectedRow'
                                    class='el-icon-link'
                                    slot='suffix'
                                    type='link'
                                    @click='showModal1'
                                    :style='{ fontSize: "16px", color: "#08c" }'
                            ></i>
                        </el-input>
                        <select-user :dialogConfig="dialogConfig" v-if="visible1" :visible="visible1" :selected-row='selectedRow1' @close-dialog="closeModal1"></select-user>
                    </template>
                    <template  #riskDutyUser>
                        <el-input v-model='formData["riskDutyUser"]' readonly autosize placeholder="请选择指定处理人">
                            <i
                                    v-if='selectedRow'
                                    class='el-icon-link'
                                    slot='suffix'
                                    type='link'
                                    @click='showModal2'
                                    :style='{ fontSize: "16px", color: "#08c" }'
                            ></i>
                        </el-input>

                        <select-user :dialogConfig="dialogConfig" v-if="visible2" :visible="visible2" :selected-row='selectedRow2' @close-dialog="closeModal2"></select-user>
                    </template>
                    <template  #projectTaskName>
                        <el-input v-model='formData["projectTaskName"]' readonly autosize placeholder="请选择任务">
                            <i
                                    v-if='selectedRow'
                                    class='el-icon-link'
                                    slot='suffix'
                                    type='link'
                                    @click='showModal3'
                                    :style='{ fontSize: "16px", color: "#08c" }'
                            ></i>
                        </el-input>
                        <select-task v-if="visible3" :visible="visible3" :selected-row='selectedRow3' :wholeDescribeId="wholeDescribeId" @close="closeModal3"></select-task>
                    </template>
                    <template  #startProjectTaskName>
                        <el-input v-model='formData["startProjectTaskName"]' readonly autosize placeholder="请选择风险起点任务">
                            <i
                                    v-if='selectedRow'
                                    class='el-icon-link'
                                    slot='suffix'
                                    type='link'
                                    @click='showModal4'
                                    :style='{ fontSize: "16px", color: "#08c" }'
                            ></i>
                        </el-input>
                        <select-task v-if="visible4" :visible="visible4" :selected-row='selectedRow4' :wholeDescribeId="wholeDescribeId" @close="closeModal4"></select-task>
                    </template>
                    <template  #endProjectTaskName>
                        <el-input v-model='formData["endProjectTaskName"]' readonly autosize placeholder="请选择风险终点任务">
                            <i
                                    v-if='selectedRow'
                                    class='el-icon-link'
                                    slot='suffix'
                                    type='link'
                                    @click='showModal5'
                                    :style='{ fontSize: "16px", color: "#08c" }'
                            ></i>
                        </el-input>
                        <select-task v-if="visible5" :visible="visible5" :selected-row='selectedRow5' :wholeDescribeId="wholeDescribeId" @close="closeModal5"></select-task>
                    </template>
                    <template  #riskBase>
<!--                        <el-input v-model='formData["riskBase"]' readonly autosize placeholder="请选择风险库">-->
<!--                            <i-->
<!--                                    v-if='selectedRow6'-->
<!--                                    class='el-icon-link'-->
<!--                                    slot='suffix'-->
<!--                                    type='link'-->
<!--                                    @click='showModal6'-->
<!--                                    :style='{ fontSize: "16px", color: "#08c" }'-->
<!--                            ></i>-->
<!--                        </el-input>-->
                      <el-button type="primary"
                                 class="el-button el-button--primary el-button--small is-plain"
                                 plain
                                 @click="showModal6">选择风险库</el-button>
                        <select-risk v-if="visible6" :visible="visible6" :selected-row='selectedRow6' :wholeDescribeId="wholeDescribeId"  @close="closeModal6"></select-risk>
                    </template>

        </form-list>
    </div>
</template>
<script>
    import { Input, Button } from '~/index'
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectTask from './SelectTask'
    import SelectRisk from './RiskBaseList'
    export default {
        components: {
            FormList,
            SelectUser,
            SelectTask,
            SelectRisk,
            'el-input': Input,
            'el-button': Button
            },
        props: {
            riskBaseId: {
                type: String,
                default: ''
            },
            wholeId: {
              type: String,
              default: ''
            }

        },
        data () {
            return {
                    saveApi: 'riskManager.saveRiskManage',
                selectClassifyVisible: false,
                visible: false,
                visible1: false,
                visible2: false,
                visible3: false,
                visible4: false,
                visible5: false,
                visible6: false,
                labelWidth: 'auto',
                wholeDescribeId: '',
                title: '',
                dialogHeight: 600,
                formData: {
                        id: '',
                    wholeDescribeId: '',
                    riskDesc: '',
                    suit: '',
                    riskType: '',
                    riskLevel: '',
                    kpiEffrct: '',
                    projectTaskId: '',
                    taskName: '',
                    startTaskId: '',
                    status: '',
                    riskResult: '',
                    riskLaunchUser: '',
                    riskLaunchUserId: '',
                    riskDutyUser: '',
                    riskDutyUserId: '',
                    endTaskId: '',
                    processingTime: '',
                    riskMeasure: ''
                },
                dialogConfig: {
                    modal: false
                },
                selectedRow: {},
                selectedRow1: {},
                selectedRow2: {},
                selectedRow3: {},
                selectedRow4: {},
                selectedRow5: {},
                selectedRow6: {},
                dataSource: [
                    {
                        type: 'blank',
                        labelText: '风险任务',
                        fieldName: 'projectTaskName',
                        slotName: 'projectTaskName',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '必须选择风险任务' }]
                    },
                    {
                        type: 'blank',
                        labelText: '风险起点任务',
                        fieldName: 'startProjectTaskName',
                        slotName: 'startProjectTaskName',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必须选择风险起点任务' }]
                    },
                    {
                        type: 'blank',
                        labelText: '风险终点任务',
                        fieldName: 'endProjectTaskName',
                        slotName: 'endProjectTaskName',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必须选择风险终点任务' }]
                    },
                    {
                        type: 'blank',
                        labelText: '风险库',
                        fieldName: 'riskBase',
                        slotName: 'riskBase',
                        colLayout: 'doubleCol'
                    },
                    {
                        labelText: '风险类型',
                        type: 'select',
                        fieldName: 'riskType',
                        placeholder: '请选风险类型',
                        colLayout: 'doubleCol',
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
                        labelText: '风险描述',
                        type: 'textarea',
                        fieldName: 'riskDesc',
                        placeholder: '请输入风险内容描述',
                        colLayout: 'singleCol',
                        rules: [
                            ]
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
                        labelText: '风险措施',
                        type: 'textarea',
                        fieldName: 'riskMeasure',
                        placeholder: '请输入风险应对措施',
                        colLayout: 'singleCol',
                        rules: [
                        ]
                    },
                    {
                        labelText: '风险后果',
                        type: 'textarea',
                        fieldName: 'riskResult',
                        placeholder: '请输入风险风险后果',
                        colLayout: 'singleCol',
                        rules: [
                        ]
                    },
                    {
                        labelText: '风险等级',
                        type: 'select',
                        fieldName: 'riskLevel',
                        placeholder: '请选风险等级',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'RISK_LEVEL' },
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
                        type: 'blank',
                        labelText: '提出人',
                        fieldName: 'riskLaunchUser',
                        slotName: 'riskLaunchUser',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必须选择提出人' }]
                    },
                    {
                        type: 'datetime', // 控件类型
                        labelText: '提出时间', // 控件显示的文本
                        placeholder: '请选择提出时间',
                        colLayout: 'doubleCol',
                        fieldName: 'processingTime',
                        fieldConfig: {
                          valueFormat: 'yyyy-MM-dd'
                        },
                        rules: [{ required: true, message: '必须选择提出时间' }]
                    },
                    {
                        type: 'blank',
                        labelText: '指定处理人',
                        fieldName: 'riskDutyUser',
                        slotName: 'riskDutyUser',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必须指定处理人' }]
                    }
                ],
                modify: {}

            }
        },
        mounted () {
            if (this.riskBaseId && this.riskBaseId !== '') {
                this.getClassifyData(this.riskBaseId)
            }
            if (this.wholeId && this.wholeId !== '') {
              this.wholeDescribeId = this.wholeId
            }
        },
        methods: {
            rendered () {

            },
            getClassifyData (id) {
                let that = this
                that.$api['riskManager.getRiskManageById']({ id: id }).then(function (res) {
                    let data = res
                    console.log('data', data)
                    that.formData.id = data.id
                    that.formData.wholeDescribeId = data.wholeDescribeId
                    that.formData.riskDesc = data.riskDesc
                    that.formData.riskType = data.type
                    that.formData.riskResult = data.riskResult
                    that.formData.kpiEffrct = data.kpiEffrct
                    that.formData.riskMeasure = data.riskMeasure
                    that.formData.riskDutyUser = data.riskDutyUser
                    that.formData.riskLaunchUser = data.riskLaunchUser
                    that.formData.riskLevel = data.level
                    that.formData.suit = data.suit
                    that.formData.status = data.status
                    that.formData.projectTaskName = data.projectTaskName
                    that.formData.processingTime = data.processingTime
                    that.formData.endProjectTaskName = data.endProjectTaskName
                    that.formData.startProjectTaskName = data.startProjectTaskName
                    that.formData.riskLaunchUserId = data.riskLaunchUserId
                    that.formData.riskDutyUserId = data.riskDutyUserId
                    that.formData.projectTaskId = data.projectTaskId
                    that.formData.startTaskId = data.startTaskId
                    that.formData.endTaskId = data.endTaskId
                    that.formData.level = data.level
                    that.formData.type = data.type
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('save-success')
            },
            showModal1 () {
                this.visible1 = true
            },
            showModal2 () {
                this.visible2 = true
            },
            showModal3 () {
                this.visible3 = true
            },
            showModal4 () {
                this.visible4 = true
            },
            showModal5 () {
                this.visible5 = true
            },
            showModal6 () {
                this.visible6 = true
            },
            handleChange (info) {
                console.log(info, 'info')
            },
            handleCancel (e) {
                this.$emit('close-modal')
            },
            closeModal1 (selectedRow1) {
                this.visible1 = false
                this.selectedRow1 = selectedRow1
                if (this.selectedRow1) {
                    let that = this
                    that.formData.wholeDescribeId = this.wholeDescribeId
                    that.formData.riskLaunchUser = this.selectedRow1[0].realName
                    that.formData.riskLaunchUserId = this.selectedRow1[0].id
                    that.formData = Object.assign({}, that.formData)
                }
            },
            closeModal2 (selectedRow2) {
                this.visible2 = false
                this.selectedRow2 = selectedRow2
                if (this.selectedRow2) {
                    let that = this
                    that.formData.riskDutyUser = this.selectedRow2[0].realName
                    that.formData.riskDutyUserId = this.selectedRow2[0].id
                    that.formData = Object.assign({}, that.formData)
                }
            },

            closeModal3 (selectedRow3) {
                this.selectedRow3 = selectedRow3
                this.visible3 = false
                if (this.selectedRow3) {
                    let that = this
                    that.formData.projectTaskId = this.selectedRow3.id
                    that.formData.projectTaskName = this.selectedRow3.name
                    that.formData = Object.assign({}, that.formData)
                }
            },
            closeModal4 (selectedRow4) {
                this.selectedRow4 = selectedRow4
                this.visible4 = false
                if (this.selectedRow4) {
                    let that = this
                    that.formData.startTaskId = this.selectedRow4.id
                    that.formData.startProjectTaskName = this.selectedRow4.name
                    that.formData = Object.assign({}, that.formData)
                }
            },
            closeModal5 (selectedRow5) {
                this.selectedRow5 = selectedRow5
                this.visible5 = false
                if (this.selectedRow5) {
                    let that = this
                    that.formData.endTaskId = this.selectedRow5.id
                    that.formData.endProjectTaskName = this.selectedRow5.name
                    that.formData = Object.assign({}, that.formData)
                }
            },
            closeModal6 (selectedRow6) {
                this.selectedRow6 = selectedRow6
                this.visible6 = false
                if (this.selectedRow6) {
                    let that = this
                    that.formData.kpiEffrct = this.selectedRow6.kpiEffrct
                    that.formData.riskDesc = this.selectedRow6.riskDesc
                    that.formData.riskMeasure = this.selectedRow6.riskMeasure
                    that.formData.riskType = this.selectedRow6.riskType
                    that.formData.suit = this.selectedRow6.suit
                    that.formData.type = this.selectedRow6.type
                    that.formData = Object.assign({}, that.formData)
                }
            },
            closeModal () {
                this.visible = false
            }
        }
    }
</script>
