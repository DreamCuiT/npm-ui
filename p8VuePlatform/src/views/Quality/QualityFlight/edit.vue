<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   :other-param="otherParam">
            <template #enter-num>
                <el-input v-model="formData.modelCode" @click.native="visible=true">
                </el-input>
            </template>
            <template #other>
                <ul class="userList">
                    <li v-for="item in selectedRows" :key="item.modelCode">
                        <el-tag>型号名称：{{item.modelName}}</el-tag>
                        <el-tag>型号代号：{{item.modelCode}}</el-tag>
                        <el-tag>所属领域：{{item.classify}}</el-tag>
                    </li>
                </ul>
            </template>
            <template #cardFiller>
                <el-input v-model="formData.cardFiller" @click.native="visibleCardFiller=true">
                </el-input>
            </template>
            <template #ratifier>
                <el-input v-model="formData.ratifier" @click.native="visibleRatifier=true">
                </el-input>
            </template>
            <template #technicalDirector>
                <el-input v-model="formData.technicalDirector" @click.native="visibleTechnical=true">
                </el-input>
            </template>
            <template #testDirector>
                <el-input v-model="formData.testDirector" @click.native="visibleTest=true">
                </el-input>
            </template>
            <template #fillingUnit>
                <el-input v-model="formData.fillingUnit" @click.native="visibleFillingUnit=true">
                </el-input>
            </template>
        </form-list>

        <template>
            <div>
                <editable-table :columns="paramColumns"
                                :renderHeight="renderHeight"
                                :addRow="true"
                                :params="params"
                                :api="tableConfigDetailsApi"
                                @save-param-data="saveParamData">
                    <template #catapultCode="{scope, data}">
                        <el-col :span="18">
                            <el-input v-model="scope.row.catapultCode"
                                      @blur="saveParamData(data)"></el-input>
                        </el-col>
                    </template>
                    <template #launchSituation="{scope, data}">
                        <el-col :span="18">
                            <el-select v-model="scope.row.launchSituation" placeholder="请选择" @blur="saveParamData(data)">
                                <template v-for="(item,index) in launchSituationTypes">
                                    <el-option :label="item.label" :value="item.label" :key="index"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                    </template>
                    <template #launchTime="{scope, data}">
                        <el-col :span="18">
                            <el-date-picker v-model="scope.row.launchTime"
                                            type="datetime"
                                            :value-format="valueFormatTime"
                                            @change="saveParamData(data)"
                                            placeholder="选择时间">
                            </el-date-picker>
                        </el-col>
                    </template>
                    <template #testResult="{scope, data}">
                        <el-col :span="18">
                            <el-select v-model="scope.row.testResult" placeholder="请选择" @blur="saveParamData(data)">
                                <template v-for="(item,index) in testResultTypes">
                                    <el-option :label="item.label" :value="item.label" :key="index"></el-option>
                                </template>
                            </el-select>
                        </el-col>
                    </template>
                </editable-table>
            </div>
        </template>

        <select-user v-if="visibleTechnical" :visible="visibleTechnical"
                     :selectType="selectType" @close-dialog="closeModalTechnical"></select-user>
        <select-user v-if="visibleTest" :visible="visibleTest"
                     :selectType="selectType" @close-dialog="closeModalTest"></select-user>
        <select-user v-if="visibleCardFiller" :visible="visibleCardFiller"
                     :selectType="selectType" @close-dialog="closeModalCardFiller"></select-user>
        <select-user v-if="visibleRatifier" :visible="visibleRatifier"
                     :selectType="selectType" @close-dialog="closeModalRatifier"></select-user>

        <select-model v-if="visible" :visible="visible" @close-modal="closeModal"
                      :disabled-row="disabledRow"></select-model>

        <select-depart v-if="visibleFillingUnit" :visible="visibleFillingUnit"
                       @close-dialog="fillingUnitClose"></select-depart>
    </div>
</template>

<script>
    import SelectModel from '@/views/Quality/QualityProblem/SelectModel'
    import { P8SelectUser as SelectUser } from '~/index'
    import { P8Form as FormList } from '~/index'
    import EditableTable from './editTable'
    import { Tag, Input, DatePicker, Select, Option, Col } from '~/index'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/base16-dark.css'
    import 'codemirror/mode/sql/sql'
    import SelectDepart from '../../QualitySystem/UncorrectionItems/SelectDept'

    export default {
        name: 'wholeDescribe',
        components: {
            FormList,
            SelectModel,
            SelectUser,
            SelectDepart,
            'el-col': Col,
            'el-tag': Tag,
            'el-input': Input,
            EditableTable,
            'el-date-picker': DatePicker,
            'el-select': Select,
            'el-option': Option
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            return {
                saveApi: 'flight.save',
                selectedRows: [],
                selectedRowKeys: [],
                visible: false,
                visibleCardFiller: false,
                visibleRatifier: false,
                visibleTechnical: false,
                visibleTest: false,
                visibleFillingUnit: false,
                otherParam: {},
                formData: {
                    modelCode: '',
                    entityId: '',
                    cardFiller: '',
                    ratifier: '',
                    technicalDirector: '',
                    testDirector: '',
                    infoList: []
                },
                selectType: '1',
                launchSituationTypes: [
                    { label: '按时', value: '按时' },
                    { label: '延期', value: '延期' },
                    { label: '取消', value: '取消' }
                ],
                testResultTypes: [
                    { label: '成功', value: '成功' },
                    { label: '部分成功', value: '部分成功' },
                    { label: '失败', value: '失败' }
                ],
                disabledRow: [],
                valueFormat: 'yyyy-MM-dd',
                valueFormatTime: 'yyyy-MM-dd HH:mm:ss',
                renderHeight: height + 'px',
                // cmOptions: {
                //     // codemirror options
                //     tabSize: 4,
                //         mode: 'sql',
                //         theme: 'base16-dark',
                //         lineNumbers: true,
                //         line: true
                //     // more codemirror options, 更多 codemirror 的高级配置...
                // },
                tableConfigDetailsApi: 'flight.detail',
                paramColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: '45px',
                        align: 'center'
                    },
                    {
                        title: '弹箭星船编号',
                        dataIndex: 'catapultCode',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '发射情况',
                        dataIndex: 'launchSituation',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '发射时间',
                        dataIndex: 'launchTime',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    },
                    {
                        title: '试验结果',
                        dataIndex: 'testResult',
                        default: '',
                        scopedSlots: { customRender: 'custom' },
                        align: 'center'
                    }
                ],
                params: { id: this.record.id },
                sqlParams: {},
                dataSource: [
                    {
                        type: 'text',
                        labelText: '编号',
                        fieldName: 'code',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'datetime',
                        labelText: '制单日期',
                        fieldName: 'preparationDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'datetime',
                        labelText: '上报日期',
                        fieldName: 'reportingDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        },
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '填卡单位编号',
                        fieldName: 'cardFillingUnitCode',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '所属型号',
                        slotName: 'enter-num',
                        colLayout: 'doubleCol'
                        // ,
                        // rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '型号相关信息',
                        slotName: 'other',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '型号批次',
                        fieldName: 'modelBatch',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'select',
                        labelText: '密级',
                        fieldName: 'secretGrade',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'SECRET_LEVEL' }
                        },
                        options: [],
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '试验名称',
                        fieldName: 'testName',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'select',
                        labelText: '研制阶段',
                        fieldName: 'developmentStage',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'QUALITY_DEVELOPMENT_STAGE' }
                        },
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'select',
                        labelText: '试验基地',
                        fieldName: 'testBase',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'TEST_PLACE' }
                        },
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'select',
                        labelText: '试验性质',
                        fieldName: 'testNature',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: '性质一',
                                value: '性质一'
                            },
                            {
                                label: '性质二',
                                value: '性质二'
                            }
                        ],
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '技术负责人',
                        fieldName: 'technicalDirector',
                        slotName: 'technicalDirector',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '试验负责人',
                        fieldName: 'testDirector',
                        slotName: 'testDirector',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '飞行试验情况',
                        fieldName: 'flightTest',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '填卡人',
                        fieldName: 'cardFiller',
                        slotName: 'cardFiller',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '填报单位',
                        fieldName: 'fillingUnit',
                        slotName: 'fillingUnit',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '填卡日期',
                        fieldName: 'fillingDate',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }],
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'blank',
                        labelText: '批准人',
                        fieldName: 'ratifier',
                        slotName: 'ratifier',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'datetime',
                        labelText: '批准日期',
                        fieldName: 'ratifyDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    }
                ]
            }
        },
        mounted: function () {
        },
        methods: {
            saveParamData (data) {
                this.sqlParams['infoList'] = data
                this.formData.infoList = data
            },
            parseCheck (saveParams) {
                let params = { ...saveParams, ...this.sqlParams }
                let _this = this
                _this.$refs.form.submitForm(params, _this.saveApi)
            },
            rendered () {
                if (this.record.id != null && this.record.id !== '') {
                    this.getProblem(this.record.id)
                }
            },
            getProblem (currEntityId) {
                let that = this
                this.$api['flight.getFlightExperiment']({ id: currEntityId }).then(res => {
                    that.formData = res
                    that.selectedRows = []
                    that.selectedRows.push({
                        id: res.modelInformationId,
                        modelCode: res.modelCode,
                        modelName: res.modelName,
                        classify: res.modelClassifyDisplay
                    })
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('saveSuccess', res)
            },
            handleChange (info) {
                console.log(info, 'info')
            },
            showModal () {
                this.visible = true
            },
            closeModal (selectedRow) {
                this.visible = false
                if (selectedRow) {
                    this.selectedRows[0] = selectedRow
                    this.disabledRow = this.selectedRows[0].id
                    if (this.selectedRows.length) {
                        this.formData.modelCode = this.selectedRows[0].modelCode
                        this.formData.modelInformationId = this.selectedRows[0].id
                        /// this.otherParam = { 'modelCode': this.selectedRows[0].id }
                    }
                }
            },
            deleteModel () {
                this.disabledRow = []
                this.selectedRows = []
                this.$refs.form.setFields({ modelCode: '' })
            },
            closeModalCardFiller (selectedRows) {
                this.visibleCardFiller = false
                this.formData.cardFiller = selectedRows[0].realName
                this.formData.fillingUnit = selectedRows[0].departmentId
                this.formData = Object.assign({}, this.formData)
            },
            closeModalRatifier (selectedRows) {
                this.visibleRatifier = false
                this.formData.ratifier = selectedRows[0].realName
            },
            closeModalTechnical (selectedRows) {
                this.visibleTechnical = false
                this.formData.technicalDirector = selectedRows[0].realName
            },
            closeModalTest (selectedRows) {
                this.visibleTest = false
                this.formData.testDirector = selectedRows[0].realName
            },
            fillingUnitClose  (selectedRows) {
                this.visibleFillingUnit = false
                if (selectedRows) {
                    this.formData.fillingUnit = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            }
        }
    }
</script>

<style scoped>

</style>
