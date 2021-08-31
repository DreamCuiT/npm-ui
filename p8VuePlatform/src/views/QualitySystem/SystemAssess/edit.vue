<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref='form'
                   @rendered='rendered'
                   @saved='saved'
                   :form='formData'
                   :dataSource='dataSource'
                   :api='saveApi'>
            <template #dutyUnitName>
                <el-input v-model="formData.dutyUnitName" @click.native="visibleDutyUnitName=true">
                </el-input>
            </template>
            <template #dutyPeople>
                <el-input v-model="formData.dutyPeople" @click.native="visibleDutyPeopleName=true">
                </el-input>
            </template>
        </form-list>
        <template>
            <div>
                <rectify-edit ref="rectify"
                               :renderHeight="renderHeight"
                               :addRow="true"
                               :params="params"
                               @getInfoData="getRectify"
                               @openImport="openImport">
                </rectify-edit>
            </div>
        </template>
        <select-depart v-if="visibleDutyUnitName" :visible="visibleDutyUnitName"
                       @close-dialog="closeVisibleDutyUnitName"></select-depart>
        <select-user v-if="visibleDutyPeopleName" :visible="visibleDutyPeopleName"
                     :selectType="selectType" @close-dialog="closeDutyPeopleName"></select-user>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import SelectDepart from '../UncorrectionItems/SelectDept'
    import RectifyEdit from './Components/RectifyEdit'
    import { P8SelectUser as SelectUser } from '~/index'
    import { Input } from '~/index'
    export default {
        name: 'edit',
        components: {
            FormList,
            SelectDepart,
            SelectUser,
            RectifyEdit,
            'el-input': Input
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            const dataSource = [
                {
                    type: 'text',
                    labelText: '表单编号',
                    fieldName: 'formCode',
                    colLayout: 'doubleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'select',
                    labelText: '密级',
                    fieldName: 'formSecret',
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
                    labelText: '评估要素',
                    fieldName: 'assessFactor',
                    colLayout: 'doubleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'text',
                    labelText: '评估要素编号',
                    fieldName: 'assessFactorCode',
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
                    type: 'view',
                    labelText: '纠正措施有效验证',
                    fieldName: 'correctiveAction',
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
                    labelText: '相关附件', // 控件显示的文本
                    fieldName: 'getFiles',
                    defaultValue: [],
                    colLayout: 'singleCol',
                    uploadConfig: {
                        // 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
                        limit: 1
                    },
                    listType: 'secret'
                    // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                }
            ]
            return {
                saveApi: 'qualitySystemAssess.save',
                dataSource,
                formData: {
                    getFiles: [],
                    infoList: []
                },
                disabledRow: [],
                selectType: '1',
                visibleDutyUnitName: false,
                visibleDutyPeopleName: false,
                exposureImportVisible: false,
                // 增删行
                renderHeight: height + 'px',
                params: { id: this.record.id }
            }
        },
        methods: {
            getRectify (rectifyData) {
                console.log(rectifyData, 'eeee')
                this.formData.infoList = []
                this.formData.infoList.push(...rectifyData)
                console.log(this.formData, 'eeee')
            },
            getAssess (record) {
                this.$api['qualitySystemAssess.getAssess']({ id: record.id }).then(res => {
                    console.log(res, 'rrrr')
                    this.formData.id = res.id
                    this.formData.formCode = res.formCode
                    this.formData.formSecret = res.formSecret
                    this.formData.assessFactor = res.assessFactor
                    this.formData.assessFactorCode = res.assessFactorCode
                    this.formData.dutyUnitName = res.dutyUnitName
                    this.formData.dutyPeople = res.dutyPeople
                    this.formData.dutyUnit = res.dutyUnit
                    this.formData.remarks = res.remarks
                    this.formData.correctiveAction = res.correctiveAction
                    if (res.getFiles) {
                        this.formData.getFiles = res.getFiles
                    }
                    this.formData.infoList = res.infoList
                    this.$refs.rectify.setInfoList(res.infoList)
                    this.formData = Object.assign({}, this.formData)
                })
            },
            rendered () {
                if (this.record.id != null && this.record.id !== '') {
                    this.getAssess(this.record)
                }
            },
            openImport () {
                console.log('open')
                this.exposureImportVisible = true
            },
            saved () {
                console.log('附件保存回调！')
                this.$emit('saveSuccess', 'success')
            },
            closeVisibleDutyUnitName (selectedRows) {
                this.visibleDutyUnitName = false
                if (selectedRows) {
                    this.formData.dutyUnit = selectedRows.id
                    this.formData.dutyUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeDutyPeopleName (selectedRows) {
                this.visibleDutyPeopleName = false
                this.formData.dutyPeople = selectedRows[0].realName
                this.formData = Object.assign({}, this.formData)
            }
        }
    }
</script>

<style scoped>

</style>
