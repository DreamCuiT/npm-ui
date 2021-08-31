<template>
    <div class="emconfig-wrap">
        <form-list ref="form"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   :existDefaultBtn="false"
                   :existCustomBtn='true'
                   @close="closeModal"
        >
            <template #processDefinationOneName>
                <el-input v-model='formData["processDefinationOneName"]'
                          readonly
                          autosize
                          placeholder="请选择">
                    <i v-if='selectedRows'
                       class='el-icon-link'
                       slot='suffix'
                       type='link'
                       @click='openTable'
                       :style='{ fontSize: "16px", color: "#08c" }'></i>
                </el-input>
                <select-model v-if="visible"
                             :visible="visible"
                             :selected-row='selectedRows'
                             @close-dialog="closeModal"></select-model>
            </template>
            <template #processDefinationTwoName>
                <el-input v-model='formData["processDefinationTwoName"]'
                          readonly
                          autosize
                          placeholder="请选择">
                    <i v-if='selectedRows2'
                       class='el-icon-link'
                       slot='suffix'
                       type='link'
                       @click='openTable2'
                       :style='{ fontSize: "16px", color: "#08c" }'></i>
                </el-input>
                <select-model v-if="visible2"
                              :visible="visible2"
                              :selected-row='selectedRows2'
                              @close-dialog="closeModal2"></select-model>
            </template>
            <template #processDefinationThreeName>
                <el-input v-model='formData["processDefinationThreeName"]'
                          readonly
                          autosize
                          placeholder="请选择">
                    <i v-if='selectedRows3'
                       class='el-icon-link'
                       slot='suffix'
                       type='link'
                       @click='openTable3'
                       :style='{ fontSize: "16px", color: "#08c" }'></i>
                </el-input>
                <select-model v-if="visible3"
                              :visible="visible3"
                              :selected-row='selectedRows3'
                              @close-dialog="closeModal3"></select-model>
            </template>
            <template #customBtn>
                <el-button type="primary" size="mini" @click="handleSubmit">保存</el-button>
            </template>
        </form-list>
        <template>
            <el-tabs type="card" v-model="activePane">
                <el-tab-pane label="设置功能" name="setLimit" key="1">
                    <select-btn @btn-select-change="btnSelectChange" :buttonSelected="functionIds"></select-btn>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>
<script>
    import { P8Form as FormList } from '~/index'
    import SelectModel from './selectModel'
    import { Input, Tabs, TabPane, Button } from '~/index'
    import SelectBtn from './SelectButtons.vue'
    export default {
        components: {
            FormList,
            'el-tabs': Tabs,
            'el-tab-pane': TabPane,
            'el-input': Input,
            'select-btn': SelectBtn,
            'el-button': Button,
            SelectModel
            },
        props: {
            configId: {
                type: String,
                default: ''
            }

        },
        data () {
            return {
                saveApi: 'emConfig.save',
                selectClassifyVisible: false,
                labelWidth: 'auto',
                visible: false,
                visible2: false,
                visible3: false,
                disabledRow: [],
                selectedRows: [],
                selectedRows2: [],
                selectedRows3: [],
                functionIds: [],
                formData: {
                    classifyId: '',
                    configName: '',
                    decisionForm: '',
                    filedId: '',
                    sourceId: '',
                    processDefinationOne: '',
                    processDefinationOneName: '',
                    processDefinationTwoName: '',
                    processDefinationThreeName: '',
                    processDefinationTwo: '',
                    processDefinationThree: '',
                    functionIds: []
                },
                selectedData: {
                    functionIdList: []
                },
                activePane: 'setLimit',
                selectedRow: {},
                isCustomValidate: false,
                loadingVisible: '',
                isDisable: false,
                otherParam: {},
                dataSource: [
                    {
                        labelText: '业务来源',
                        type: 'select',
                        fieldName: 'sourceId',
                        placeholder: '请选择业务来源',
                        colLayout: 'singleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'SOURCE' },
                            label: 'label',
                            value: 'value'
                        },
                        options: [],
                        rules: [
                        ]
                    },
                    {
                        labelText: '业务范围',
                        type: 'select',
                        fieldName: 'filedId',
                        placeholder: '请选业务范围',
                        colLayout: 'singleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'FILED' },
                            label: 'label',
                            value: 'value'
                        },
                        options: [],
                        rules: [
                            ]
                    },
                    {
                        labelText: '类型',
                        type: 'select',
                        fieldName: 'classifyId',
                        placeholder: '请选类型',
                        colLayout: 'singleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'CLASSFIY' },
                            label: 'label',
                            value: 'value'
                        },
                        options: [],
                        rules: [
                           ]
                    },
                    {
                        labelText: '名称',
                        type: 'text',
                        fieldName: 'configName',
                        placeholder: '请输名称',
                        colLayout: 'singleCol',
                        rules: [
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '决策形式',
                        fieldName: 'decisionForm',
                        placeholder: '请选择决策形式',
                        colLayout: this.colLayoutClassify,
                        // rules: [{ required: true, message: '该项为必填项' }],
                        options: [
                            { 'value': '0', 'label': '审核制' },
                            { 'value': '1', 'label': '备案制' }
                        ]
                    },
                    {
                        type: 'blank',
                        labelText: '决策形式确认流程',
                        slotName: 'processDefinationOneName',
                        fieldName: 'processDefinationOneName',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '该项为必填项' }]
                    },
                    {
                        type: 'blank',
                        labelText: '立项决策发布流程',
                        slotName: 'processDefinationTwoName',
                        fieldName: 'processDefinationTwoName',
                        colLayout: 'singleCol',
                        rules: [{ }]
                    },
                    {
                        type: 'blank',
                        labelText: '立项实施发布流程',
                        slotName: 'processDefinationThreeName',
                        fieldName: 'processDefinationThreeName',
                        colLayout: 'singleCol',
                        rules: [{ required: true, message: '该项为必填项' }]
                    }
                ],
                modify: {}

            }
        },
        mounted () {
            if (this.configId && this.configId !== '') {
                this.getClassifyData(this.configId)
            }
        },
        methods: {
            openTable () {
                this.visible = true
            },
            openTable2 () {
                this.visible2 = true
            },
            openTable3 () {
                this.visible3 = true
            },
            closeModal (selectedRow) {
                this.visible = false
                if (selectedRow) {
                    this.selectedRows[0] = selectedRow
                    this.disabledRow = this.selectedRows[0].id
                    if (this.selectedRows.length) {
                        this.formData.processDefinationOne = this.selectedRows[0].id
                        this.formData.processDefinationOneName = this.selectedRows[0].name
                    }
                }
            },
            closeModal2 (selectedRow) {
                this.visible2 = false
                if (selectedRow) {
                    this.selectedRows2[0] = selectedRow
                    this.disabledRow = this.selectedRows2[0].id
                    if (this.selectedRows2.length) {
                        this.formData.processDefinationTwo = this.selectedRows2[0].id
                        this.formData.processDefinationTwoName = this.selectedRows2[0].name
                    }
                }
            },
            closeModal3 (selectedRow) {
                this.visible3 = false
                if (selectedRow) {
                    this.selectedRows3[0] = selectedRow
                    this.disabledRow = this.selectedRows3[0].id
                    if (this.selectedRows3.length) {
                        this.formData.processDefinationThree = this.selectedRows3[0].id
                        this.formData.processDefinationThreeName = this.selectedRows3[0].name
                    }
                }
            },
            getClassifyData (id) {
                let that = this
                that.$api['emConfig.getById']({ id: id }).then(function (res) {
                    let data = res
                    that.formData.id = data.id
                    that.formData.classifyId = data.classifyId
                    that.formData.sourceId = data.sourceId
                    that.formData.filedId = data.filedId
                    that.formData.configName = data.configName
                    that.formData.decisionForm = data.decisionForm
                    that.formData.processDefinationOne = data.processDefinationOne
                    that.formData.processDefinationTwo = data.processDefinationTwo
                    that.formData.processDefinationThree = data.processDefinationThree
                    that.formData.processDefinationOneName = data.processDefinationOneName
                    that.formData.processDefinationTwoName = data.processDefinationTwoName
                    that.formData.processDefinationThreeName = data.processDefinationThreeName
                    that.formData.suit = data.suit
                    that.functionIds = data.functionIds
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            handleSubmit (e) {
                let that = this
                that.$api[that.saveApi](that.formData).then(res => {
                    that.saved(res)
                })
            },
            validate () {
                return new Promise((resolve, reject) => {
                    this.$refs.form.validate(isValid => {
                        if (isValid) {
                            let params = Object.assign({}, this.formData)
                            const queryParams = this.handleParams(params)
                            console.log('处理后的表单数据', queryParams)
                            resolve(queryParams)
                        }
                    })
                })
            },
            submitForm (params, api) {
                this.loadingVisible = true
                this.saveForm(api, params).then((res) => {
                    this.successSave(res)
                }).catch(function (e) {
                    console.log(e, '异步失败的操作')
                })
            },
            saveForm (api, params, urlParam) {
                let that = this
                return new Promise((resolve, reject) => {
                    that.$api[api](params, urlParam).then(function (res) {
                        resolve(res)
                    }).catch(function (error) {
                        reject(error)
                    })
                })
            },
            successSave (res) {
                this.saved(res)
                this.loadingVisible = ''
                this.isDisable = false
            },
            saved (res) {
                console.log(res, 'ddd')
                if (res === 'false') {
                    this.showMessage('业务范围+来源+类型重复，无法保存！', 'warning')
                } else {
                    this.$emit('save-success', res)
                }
            },
            showMessage (msg, type) {
                this.$message(
                    {
                        message: msg,
                        type: type
                    }
                )
            },
            handleChange (info) {
                console.log(info, 'info')
            },
            btnSelectChange (selectedRes) {
                this.$set(this.formData, 'functionIds', selectedRes)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .emconfig-wrap {
        position: relative;
        & /deep/ .formList.el-form > .el-row.formBtn {
            position: fixed;
            right: 0;
            left: auto;
            z-index: 10;
            background: #ffffff;
            width: 50%;
        }
    }
</style>
