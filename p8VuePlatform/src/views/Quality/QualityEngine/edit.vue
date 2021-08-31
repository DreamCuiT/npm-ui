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
            <template #fillinger>
                <el-input v-model="formData.fillinger" @click.native="visibleFillinger=true">
                </el-input>
            </template>
            <template #ratifier>
                <el-input v-model="formData.ratifier" @click.native="visibleRatifier=true">
                </el-input>
            </template>
            <template #fillingCardUnit>
                <el-input v-model="formData.fillingCardUnit" @click.native="visibleFillingCardUnit=true">
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
                        <el-input v-model="scope.row.catapultCode"
                                  @blur="saveParamData(data)"></el-input>
                    </template>
                    <template #trialDate="{scope, data}">
                        <el-date-picker v-model="scope.row.trialDate"
                                        type="date"
                                        :value-format="valueFormat"
                                        @change="saveParamData(data)"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </template>
                    <template #trialTime="{scope, data}">
                        <el-date-picker v-model="scope.row.trialTime"
                                        type="datetime"
                                        :value-format="valueFormatTime"
                                        @change="saveParamData(data)"
                                        placeholder="选择时间">
                        </el-date-picker>
                    </template>
                    <template #trialThrust="{scope, data}">
                        <el-input v-model="scope.row.trialThrust"
                                  @blur="saveParamData(data)"></el-input>
                    </template>
                    <template #trialAtmos="{scope, data}">
                        <el-input v-model="scope.row.trialAtmos"
                                  @blur="saveParamData(data)"></el-input>
                    </template>
                    <template #ambientTemperature="{scope, data}">
                        <el-input v-model="scope.row.ambientTemperature"
                                  @blur="saveParamData(data)"></el-input>
                    </template>
                    <template #ambientHumidity="{scope, data}">
                        <el-input v-model="scope.row.ambientHumidity"
                                  @blur="saveParamData(data)"></el-input>
                    </template>
                    <template #remark="{scope, data}">
                        <el-input v-model="scope.row.remark"
                                  @blur="saveParamData(data)"></el-input>
                    </template>
                </editable-table>
            </div>
        </template>

        <select-user v-if="visibleFillinger" :visible="visibleFillinger"
                     :selectType="selectType" @close-dialog="closeModalFillinger"></select-user>
        <select-user v-if="visibleRatifier" :visible="visibleRatifier"
                     :selectType="selectType" @close-dialog="closeModalRatifier"></select-user>

        <select-model v-if="visible" :visible="visible" @close-modal="closeModal"
                      :disabled-row="disabledRow"></select-model>

        <select-depart v-if="visibleFillingCardUnit" :visible="visibleFillingCardUnit"
                       @close-dialog="fillingCardUnitClose"></select-depart>
        <select-depart v-if="visibleFillingUnit" :visible="visibleFillingUnit"
                       @close-dialog="fillingUnitClose"></select-depart>
    </div>
</template>

<script>
    import SelectModel from '@/views/Quality/QualityProblem/SelectModel'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectDepart from '../../QualitySystem/UncorrectionItems/SelectDept'
    import { P8Form as FormList } from '~/index'
    import EditableTable from './editTable'
    import { Tag, Input, DatePicker } from '~/index'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/base16-dark.css'
    import 'codemirror/mode/sql/sql'

    export default {
        name: 'wholeDescribe',
        components: {
            FormList,
            SelectModel,
            SelectUser,
            SelectDepart,
            'el-tag': Tag,
            'el-input': Input,
            EditableTable,
            'el-date-picker': DatePicker
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            return {
                saveApi: 'engine.save',
                selectedRows: [],
                selectedRowKeys: [],
                visible: false,
                visibleFillinger: false,
                visibleRatifier: false,
                visibleFillingCardUnit: false,
                visibleFillingUnit: false,
                otherParam: {},
                formData: {
                    modelCode: '',
                    entityId: '',
                    fillinger: '',
                    ratifier: '',
                    infoList: []
                },
                selectType: '1',
                disabledRow: [],
                valueFormat: 'yyyy-MM-dd',
                valueFormatTime: 'yyyy-MM-dd HH:mm:ss',
                renderHeight: height + 'px',
                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'sql',
                    theme: 'base16-dark',
                    lineNumbers: true,
                    line: true
                    // more codemirror options, 更多 codemirror 的高级配置...
                },
                tableConfigDetailsApi: 'engine.detail',
                paramColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '试车日期',
                        dataIndex: 'trialDate',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '试车时间',
                        dataIndex: 'trialTime',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '试车推力',
                        dataIndex: 'trialThrust',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '试车大气压',
                        dataIndex: 'trialAtmos',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '环境温度',
                        dataIndex: 'ambientTemperature',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '环境湿度',
                        dataIndex: 'ambientHumidity',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    }
                ],
                params: { id: this.record.id },
                sqlParams: {},
                dataSource: [
                    {
                        type: 'text',
                        labelText: '采集卡号',
                        fieldName: 'acquisitionCard',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '入档编号',
                        fieldName: 'fileNumber',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '填卡单位',
                        fieldName: 'fillingCardUnit',
                        slotName: 'fillingCardUnit',
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
                        type: 'text',
                        labelText: '填卡单位编号',
                        fieldName: 'fillingCardUnitNum',
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
                        labelText: '是否返回作修改',
                        fieldName: 'isReturnData',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: '是',
                                value: '是'
                            },
                            {
                                label: '否',
                                value: '否'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '发动机名称',
                        fieldName: 'engineName',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '发动机代号',
                        fieldName: 'engineCodeName',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '发动机图号',
                        fieldName: 'engineDrawingNumber',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '发动机批次',
                        fieldName: 'engineBatch',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '发动机编号',
                        fieldName: 'engineCode',
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
                        type: 'text',
                        labelText: '试车代号',
                        fieldName: 'trialCodeName',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '试车台载',
                        fieldName: 'trialBenchLoad',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'select',
                        labelText: '试车状态',
                        fieldName: 'trialStatus',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: '状态一',
                                value: '状态一'
                            },
                            {
                                label: '状态二',
                                value: '状态二'
                            }
                        ],
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'text',
                        labelText: '试车地点',
                        fieldName: 'trialPlace',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'textarea',
                        labelText: '试车目的',
                        fieldName: 'trialPurpose',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'textarea',
                        labelText: '试车概况',
                        fieldName: 'trialSituation',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'textarea',
                        labelText: '试车结论',
                        fieldName: 'trialConclusion',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '必填' }]
                    },
                    {
                        type: 'blank',
                        labelText: '填报人',
                        fieldName: 'fillinger',
                        slotName: 'fillinger',
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
                        labelText: '填报日期',
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
                this.$api['engine.getEngineExperiment']({ id: currEntityId }).then(res => {
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
            closeModalFillinger (selectedRows) {
                this.visibleFillinger = false
                this.formData.fillinger = selectedRows[0].realName
                this.formData.fillingUnit = selectedRows[0].departmentId
                this.formData = Object.assign({}, this.formData)
            },
            closeModalRatifier (selectedRows) {
                this.visibleRatifier = false
                this.formData.ratifier = selectedRows[0].realName
            },
            fillingCardUnitClose  (selectedRows) {
                this.visibleFillingCardUnit = false
                if (selectedRows) {
                    this.formData.fillingCardUnit = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
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
