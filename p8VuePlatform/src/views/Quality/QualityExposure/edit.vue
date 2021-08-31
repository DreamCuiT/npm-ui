<template>
    <common-dialog
            :title="title"
            :visible="visible"
            width="90%"
            :dialogHeight="700"
            @close="handleCancel"
            :showHandleBtn="false"
            :dialogConfig="dialogConfig"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
        <template #dialog>
            <div style="position:relative;padding-bottom:30px;">
                <form-list ref="form"
                           @rendered="rendered"
                           @saved="saved"
                           :dataSource="dataSource"
                           :api="saveApi"
                           :form="formData">
                    <template #testName>
                        <el-input v-model='formData["testName"]'
                                  v-on:click.native="showModal"
                                  readonly
                                  autosize
                                  placeholder="请选择项目">
                            <i v-if='selectedRow'
                               class='el-icon-link'
                               slot='suffix'
                               type='link'
                               :style='{ fontSize: "16px", color: "#08c" }'></i>
                        </el-input>
                    </template>
                    <template #fillingUnit>
                        <el-input v-model="formData.fillingUnitName" @click.native="visibleFillingUnit=true">
                        </el-input>
                    </template>
                </form-list>
                <template>
                    <div>
                        <exposure-edit ref="exposure"
                                       :renderHeight="renderHeight"
                                       :addRow="true"
                                       :params="params"
                                       :api="tableConfigDetailsApi"
                                       @getExposure="getExposure">
                        </exposure-edit>
                    </div>
                </template>
                <select-flight-test v-if='selectFlightVisible'
                                    :selected-row='selectedRow'
                                    :visible='selectFlightVisible'
                                    @close-modal='closeModal'></select-flight-test>

                <select-depart v-if="visibleFillingUnit" :visible="visibleFillingUnit"
                               @close-dialog="fillingUnitClose"></select-depart>
            </div>
        </template>
    </common-dialog>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import ExposureEdit from './Components/exposureEdit'
    import { P8Dialog as CommonDialog } from '~/index'
    import { Input } from '~/index'
    import SelectFlightTest from './Components/selectFlightTest'
    import SelectDepart from '../../QualitySystem/UncorrectionItems/SelectDept'
    export default {
        name: 'edit',
        components: {
            FormList,
            'el-input': Input,
            SelectFlightTest,
            CommonDialog,
            SelectDepart,
            ExposureEdit
        },
        props: {
            record: {
                type: Object
            },
            title: {
                type: String
            },
            visible: {
                type: Boolean
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            return {
                saveApi: 'qualityExposure.save',
                formData: {
                    infoList: []
                },
                visibleFillingUnit: false,
                dataSource: [
                    {
                        type: 'blank',
                        labelText: '飞行试验',
                        slotName: 'testName',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '请选择项目' }]
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
                        type: 'text',
                        labelText: '填报人',
                        fieldName: 'filler',
                        colLayout: 'doubleCol',
                        rules: [{ required: true, message: '请填写合同编号' }]
                    },
                    {
                        type: 'blank',
                        labelText: '填报单位',
                        fieldName: 'fillingUnitName',
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
                        type: 'textarea',
                        labelText: '具体情况分析',
                        fieldName: 'flightMatter',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '请填写具体情况分析' }]
                    }
                ],
                params: { id: this.record.id },
                renderHeight: height + 'px',
                tableConfigDetailsApi: '',
                disabledRow: [],
                valueFormat: 'yyyy-MM-dd',
                valueFormatTime: 'yyyy-MM-dd HH:mm:ss',
                selectFlightVisible: false,
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                },
                selectedRow: {}
            }
        },
        mounted () {
            this.getUser()
        },
        methods: {
            getExposure (exposureData) {
                this.formData.infoList = exposureData
            },
            saved () {
                console.log('saved')
                this.$emit('saveSuccess', 'success')
            },
            rendered () {
                if (this.record.record.id != null && this.record.record.id !== '') {
                    this.getData(this.record.record.id)
                }
            },
            getData (exposureId) {
                let that = this
                that.$api['qualityExposure.getExposure']({ id: exposureId }).then(res => {
                    console.log(res, 'rrrrs')
                    this.formData = res
                    this.$refs.exposure.setInfoList(res.infoList)
                })
            },
            showModal: function () {
                this.selectFlightVisible = true
            },
            closeModal (selectedRow) {
                this.selectFlightVisible = false
                this.selectedRow = selectedRow
                if (this.selectedRow) {
                    let that = this
                    that.$set(that.formData, 'testName', selectedRow.testName)
                    that.formData.flightTestId = selectedRow.id
                }
                this.dataSource[0].testName = selectedRow.testName
                console.log(selectedRow)
            },
            handleCancel (e) {
                this.$emit('close-modal')
            },
            getUser () {
                this.formData.filler = this.$store.getters.userName
                this.formData = Object.assign({}, this.formData)
            },
            fillingUnitClose  (selectedRows) {
                this.visibleFillingUnit = false
                if (selectedRows) {
                    this.formData.fillingUnit = selectedRows.id
                    this.formData.fillingUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            }
        }
    }
</script>
