<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list
                labelWidth="100px"
                ref="form"
                :dataSource="dataSource"
                :form="formData"
                :api="saveApi"
                @saved="saved"
        >
            <template #dutyUnitName>
                <el-input v-model="formData.dutyUnitName" @click.native="visibleDutyUnitName=true">
                </el-input>
            </template>
            <template #dutyDepartmentName>
                <el-input v-model="formData.dutyDepartmentName" @click.native="visibleDutyDepartmentName=true">
                </el-input>
            </template>
            <template #signDepartmentName>
                <el-input v-model="formData.signDepartmentName" @click.native="visibleSignDepartmentName=true">
                </el-input>
            </template>
            <template #dutyPeople>
                <el-input v-model="formData.dutyPeople" @click.native="visibleDutyPeopleName=true">
                </el-input>
            </template>
            <template #signer>
                <el-input v-model="formData.signer" @click.native="visibleSigner=true">
                </el-input>
            </template>
        </form-list>
        <select-depart v-if="visibleDutyUnitName" :visible="visibleDutyUnitName"
                       @close-dialog="closeVisibleDutyUnitName"></select-depart>
        <select-depart v-if="visibleDutyDepartmentName" :visible="visibleDutyDepartmentName"
                       @close-dialog="closeVisibleDutyDepartmentName"></select-depart>
        <select-depart v-if="visibleSignDepartmentName" :visible="visibleSignDepartmentName"
                       @close-dialog="closeVisibleSignDepartmentName"></select-depart>
        <select-user v-if="visibleDutyPeopleName" :visible="visibleDutyPeopleName"
                     :selectType="selectType" @close-dialog="closeDutyPeopleName"></select-user>
        <select-user v-if="visibleSigner" :visible="visibleSigner"
                     :selectType="selectType" @close-dialog="closeVisibleSigner"></select-user>
    </div>

</template>

<script>
    import { P8Form as FormList } from '~/index'
    import SelectDepart from '../UncorrectionItems/SelectDept'
    import { P8SelectUser as SelectUser } from '~/index'
    import { Input } from '~/index'
    export default {
        name: 'edit',
        components: {
            FormList,
            SelectDepart,
            SelectUser,
            'el-input': Input
        },
        props: {
            clickedNodeData: {
                type: Object
            },
            record: {
                type: Object
            }
        },
        data () {
            const dataSource = [
                {
                    type: 'select',
                    labelText: '密级',
                    fieldName: 'secretFile',
                    colLayout: 'doubleCol',
                    optionUrl: {
                        api: 'thirdPartInterface.getDic',
                        params: { dicType: 'SECRET_LEVEL' }
                    },
                    options: [],
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'select',
                    labelText: '文件类型',
                    fieldName: 'fileType',
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
                    type: 'text',
                    labelText: '文件名称',
                    fieldName: 'fileName',
                    colLayout: 'doubleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'text',
                    labelText: '文件编号',
                    fieldName: 'fileCode',
                    colLayout: 'doubleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'blank',
                    labelText: '责任单位',
                    fieldName: 'dutyUnitName',
                    slotName: 'dutyUnitName',
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
                    type: 'blank',
                    labelText: '责任部门',
                    fieldName: 'dutyDepartmentName',
                    slotName: 'dutyDepartmentName',
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
                    type: 'blank',
                    labelText: '责任人',
                    fieldName: 'dutyPeople',
                    slotName: 'dutyPeople',
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
                    labelText: '计划完成时间',
                    fieldName: 'planEndTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    },
                    rules: [
                        {
                            required: true,
                            message: '必填'
                        }
                    ]
                },
                {
                    type: 'blank',
                    labelText: '会签部门',
                    fieldName: 'signDepartmentName',
                    slotName: 'signDepartmentName',
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
                    type: 'blank',
                    labelText: '会签人员',
                    fieldName: 'signer',
                    slotName: 'signer',
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
                    labelText: '修订建议',
                    fieldName: 'reviseAdvised',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'textarea',
                    labelText: '文件更改原因',
                    fieldName: 'changeReason',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'datetime',
                    labelText: '实施日期',
                    fieldName: 'todoTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    },
                    rules: [
                        {
                            required: true,
                            message: '必填'
                        }
                    ]
                },
                {
                    type: 'text',
                    labelText: '更改单号',
                    fieldName: 'changeNum',
                    colLayout: 'doubleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    labelText: '更改前内容',
                    type: 'addField', // 控件类型--增删行
                    colLayout: 'doubleCol',
                    fieldName: 'beforeList', // 保存时格式，类似detailList[0].roleName
                    addFieldLayout: 'vertical',
                    children: [
                        {
                            type: 'textarea', // 控件类型
                            fieldName: 'beforeData',
                            colLayout: 'singleCol',
                            placeholder: '请输入更改前内容' // 默认控件的空值文本
                        }
                    ]
                },
                {
                    labelText: '更改后内容',
                    type: 'addField', // 控件类型--增删行
                    colLayout: 'doubleCol',
                    fieldName: 'afterList', // 保存时格式，类似detailList[0].roleName
                    addFieldLayout: 'vertical',
                    children: [
                        {
                            type: 'textarea', // 控件类型
                            fieldName: 'afterData',
                            colLayout: 'singleCol',
                            placeholder: '请输入更改后内容' // 默认控件的空值文本
                        }
                    ]
                },
                {
                    type: 'view',
                    labelText: '校对意见',
                    fieldName: 'proofOpinion',
                    colLayout: 'singleCol'
                },
                {
                    type: 'view',
                    labelText: '会签意见',
                    fieldName: 'signOpinion',
                    colLayout: 'singleCol'
                },
                {
                    type: 'view',
                    labelText: '审核意见',
                    fieldName: 'verifyOpinion',
                    colLayout: 'singleCol'
                },
                {
                    type: 'view',
                    labelText: '批准意见',
                    fieldName: 'approvalOpinion',
                    colLayout: 'singleCol'
                },
                {
                    type: 'textarea',
                    labelText: '备注',
                    fieldName: 'remarks',
                    colLayout: 'singleCol'
                },
                {
                    type: 'upload',
                    labelText: '', // 控件显示的文本
                    fieldName: 'getFile',
                    defaultValue: [],
                    colLayout: 'singleCol',
                    uploadConfig: {
                        drag: true,
                        // 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
                        limit: 1
                    },
                    listType: 'secret'
                    // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                }
            ]
            return {
                saveApi: 'qualitySystem.upload',
                dataSource,
                formData: {
                    getFile: [],
                    qualitySystemId: this.clickedNodeData.id
                },
                beforeChangeList: [
                    { beforeChange: '' }
                ],
                visibleDutyUnitName: false,
                visibleDutyDepartmentName: false,
                visibleDutyPeopleName: false,
                visibleSignDepartmentName: false,
                visibleSigner: false,
                selectType: '1',
                disabledRow: []
            }
        },
        mounted () {
            this.getTempData()
        },
        methods: {
            getTempData () {
                const _this = this
                let beforeList = [
                    {
                        beforeData: ''
                    }
                ]
                let afterList = [
                    {
                        aftreData: ''
                    }
                ]
                let Obj = {
                    beforeList: beforeList,
                    afterList: afterList
                }
                _this.formData = { ..._this.formData, ...Obj }
                console.log('form-rendered', _this.record)
                if (_this.record.id) {
                    this.$api['qualitySystem.getInfo']({ id: _this.record.id }).then(res => {
                        _this.formData = res
                    })
                }
            },
            saved () {
                console.log('附件保存回调！')
                this.$emit('save-success', 'success')
            },
            closeVisibleDutyUnitName (selectedRows) {
                this.visibleDutyUnitName = false
                if (selectedRows) {
                    this.formData.dutyUnit = selectedRows.id
                    this.formData.dutyUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleDutyDepartmentName (selectedRows) {
                this.visibleDutyDepartmentName = false
                if (selectedRows) {
                    this.formData.dutyDepartment = selectedRows.id
                    this.formData.dutyDepartmentName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleSignDepartmentName (selectedRows) {
                this.visibleSignDepartmentName = false
                if (selectedRows) {
                    this.formData.signDepartment = selectedRows.id
                    this.formData.signDepartmentName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeDutyPeopleName (selectedRows) {
                this.visibleDutyPeopleName = false
                this.formData.dutyPeople = selectedRows[0].realName
                this.formData = Object.assign({}, this.formData)
            },
            closeVisibleSigner (selectedRows) {
                this.visibleSigner = false
                this.formData.signer = selectedRows[0].realName
                this.formData = Object.assign({}, this.formData)
            }
        }
    }
</script>

<style scoped>

</style>
