<template>
    <div>
        <common-dialog
                :visible="visible"
                width="70%"
                :dialogHeight="500"
                @close="handleCancel"
                :showHandleBtn="false"
                :dialogConfig="dialogConfig"
                :close-on-click-modal="false"
                :close-on-press-escape="false">
            <template #dialog>
                <form-list
                        labelWidth="100px"
                        ref="form"
                        :dataSource="dataSource"
                        :form="formData"
                        :api="saveApi"
                        @saved="saved"
                        @rendered="rendered"
                >
                    <template #memberName>
                        <el-input v-model="formData.memberName" @click.native="visiblememberNameName=true">
                        </el-input>
                    </template>
                    <template #positionalTitles>
                        <el-input v-model="formData.positionalTitles" @click.native="positionalTitlesOpen">
                        </el-input>
                    </template>
                    <template #positional>
                        <el-input v-model="formData.positional" @click.native="positionalOpen">
                        </el-input>
                    </template>
                    <template #station>
                        <el-input v-model="formData.station" @click.native="stationOpen">
                        </el-input>
                    </template>
                    <template #workUnitName>
                        <el-input v-model="formData.workUnitName" @click.native="visibleWorkUnit=true">
                        </el-input>
                    </template>
                </form-list>
            </template>
        </common-dialog>
        <select-user v-if="visiblememberNameName" :visible="visiblememberNameName"
                     :selectType="selectType" @close-dialog="closememberNameName"></select-user>
        <select-quality-dic v-if="visibleQualityDic" :visible="visibleQualityDic"
                            @close-dialog="memberClose" :QualityType="QualityType"></select-quality-dic>
        <select-depart v-if="visibleWorkUnit" :visible="visibleWorkUnit"
                       @close-dialog="closeVisibleWorkUnit"></select-depart>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectQualityDic from './SelectQualityDic'
    import SelectDepart from '../../../QualitySystem/UncorrectionItems/SelectDept'
    import { Input } from '~/index'
    export default {
        name: 'AddInfo',
        components: {
            SelectUser,
            SelectQualityDic,
            FormList,
            SelectDepart,
            CommonDialog,
            'el-input': Input
        },
        props: {
            visible: {
                type: Boolean
            },
            record: {
                type: Object
            },
            whether: {
                type: String
            }
        },
        data () {
            const dataSource = [
                {
                    type: 'select',
                    labelText: '人员类型',
                    fieldName: 'memberType',
                    colLayout: 'doubleCol',
                    optionUrl: {
                        api: 'thirdPartInterface.getDic',
                        params: { dicType: 'SECRET_LEVEL' }
                    },
                    options: []
                },
                {
                    type: 'select',
                    labelText: '密级',
                    fieldName: 'secret',
                    colLayout: 'doubleCol',
                    optionUrl: {
                        api: 'thirdPartInterface.getDic',
                        params: { dicType: 'SECRET_LEVEL' }
                    },
                    options: []
                },
                {
                    type: 'text',
                    labelText: '编号',
                    fieldName: 'code',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '姓名',
                    fieldName: 'memberName',
                    slotName: 'memberName',
                    placeholder: '请选择',
                    colLayout: 'doubleCol',
                    rules: [
                        {
                            required: true,
                            message: '必填'
                        }
                    ]
                },
                {
                    type: 'select',
                    labelText: '性别',
                    fieldName: 'sex',
                    placeholder: '',
                    colLayout: 'doubleCol',
                    options: [
                        {
                            label: '男',
                            value: '男'
                        },
                        {
                            label: '女',
                            value: '女'
                        }
                    ]
                },
                {
                    type: 'datetime',
                    labelText: '出生日期',
                    fieldName: 'birthday',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'blank',
                    labelText: '工作单位',
                    fieldName: 'workUnitName',
                    slotName: 'workUnitName',
                    placeholder: '请选择所属部门',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'select',
                    labelText: '政治面貌',
                    fieldName: 'political',
                    placeholder: '',
                    colLayout: 'doubleCol',
                    options: [
                        {
                            label: '党员',
                            value: '党员'
                        },
                        {
                            label: '团员',
                            value: '团员'
                        },
                        {
                            label: '群众',
                            value: '群众'
                        },
                        {
                            label: '其他',
                            value: '其他'
                        }
                    ]
                },
                {
                    type: 'text',
                    labelText: '行政职务',
                    fieldName: 'administrative',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '职称',
                    fieldName: 'positionalTitles',
                    slotName: 'positionalTitles',
                    placeholder: '请选择职称',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'select',
                    labelText: '学历',
                    fieldName: 'eduction',
                    colLayout: 'doubleCol',
                    optionUrl: {
                        api: 'thirdPartInterface.getDic',
                        params: { dicType: 'SECRET_LEVEL' }
                    },
                    options: []
                },
                {
                    type: 'text',
                    labelText: '所学专业',
                    fieldName: 'studyMajor',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '现专业',
                    fieldName: 'nowMajor',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '现主管业务',
                    fieldName: 'nowManageBusiness',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '职别',
                    fieldName: 'rank',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '办公电话',
                    fieldName: 'officeTel',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '住宅电话',
                    fieldName: 'houseTel',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '手机号码',
                    fieldName: 'mobilePhone',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '资格证书',
                    fieldName: 'qualification',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'datetime',
                    labelText: '取证日期',
                    fieldName: 'certificationDate',
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
                    labelText: '岗位',
                    fieldName: 'station',
                    slotName: 'station',
                    colLayout: 'doubleCol',
                    placeholder: '请选择岗位'
                },
                {
                    type: 'blank',
                    labelText: '职务',
                    fieldName: 'positional',
                    slotName: 'positional',
                    colLayout: 'doubleCol',
                    placeholder: '请选择职务'
                },
                {
                    type: 'text',
                    labelText: '主管型号',
                    fieldName: 'manageModel',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'upload',
                    labelText: '', // 控件显示的文本
                    fieldName: 'getFiles',
                    defaultValue: [],
                    colLayout: 'doubleCol',
                    uploadConfig: {
                        // 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
                        limit: 1
                    },
                    listType: 'text'
                    // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                }
            ]
            return {
                saveApi: 'MemberArchives.saveInfo',
                dialogConfig: {
                    modal: true,
                    appendToBody: true,
                    modalAppendToBody: true
                },
                isCustomValidate: true,
                dataSource,
                formData: {
                    getFiles: []
                },
                visiblememberNameName: false,
                visibleQualityDic: false,
                visibleWorkUnit: false,
                QualityType: '',
                selectType: '1'
            }
        },
        mounted () {
            this.setBrType()
        },
        methods: {
            rendered () {
                if (this.record != null && this.record.id != null) {
                    this.getBRInfoData(this.record)
                }
            },
            getBRInfoData (record) {
                this.$api['MemberArchives.getBRInfoData']({ id: record.id }).then(res => {
                    console.log(res, 'rrrr')
                    this.formData = res
                    this.formData = Object.assign({}, this.formData)
                })
            },
            setBrType () {
                this.formData.brType = this.whether
            },
            saved (res) {
                if (this.record != null && this.record.id != null) {
                    this.formData.id = res
                    this.$emit('removeInfoData', this.record)
                    this.$emit('saveInfo', this.formData)
                    this.handleCancel(res)
                } else {
                    this.formData.id = res
                    this.$emit('saveInfo', this.formData)
                    this.handleCancel(res)
                }
            },
            closememberNameName (selectedRows) {
                console.log(selectedRows, 'sss')
                this.visiblememberNameName = false
                this.formData.memberName = selectedRows[0].realName
                this.formData.birthday = selectedRows[0].birthdate
                if (selectedRows[0].gender && selectedRows[0].gender === '1401') {
                    this.formData.sex = '男'
                } else if (selectedRows[0].gender && selectedRows[0].gender === '1401') {
                    this.formData.sex = '女'
                }
                this.formData.administrative = selectedRows[0].workpost
                this.formData = Object.assign({}, this.formData)
            },
            positionalTitlesOpen () {
                this.visibleQualityDic = true
                this.QualityType = 'QualityPositionalTitles'
            },
            positionalOpen () {
                this.visibleQualityDic = true
                this.QualityType = 'QualityPositional'
            },
            stationOpen () {
                this.visibleQualityDic = true
                this.QualityType = 'QualityStation'
            },
            memberClose (selectedRows) {
                this.visibleQualityDic = false
                if (this.QualityType === 'QualityPositionalTitles') {
                    this.formData.positionalTitles = selectedRows.name
                } else if (this.QualityType === 'QualityPositional') {
                    this.formData.positional = selectedRows.name
                } else if (this.QualityType === 'QualityStation') {
                    this.formData.station = selectedRows.name
                }
                this.formData = Object.assign({}, this.formData)
            },
            closeVisibleWorkUnit (selectedRows) {
                this.visibleWorkUnit = false
                if (selectedRows) {
                    this.formData.workUnit = selectedRows.id
                    this.formData.workUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            handleCancel (e) {
                this.$emit('close-info')
            }
        }
    }
</script>

<style scoped>

</style>
