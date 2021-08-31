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
                              @getInfoData="getInfoData"
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
                    labelText: '改进意见编号',
                    fieldName: 'improveSuggestCode',
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
                    type: 'textarea',
                    labelText: '跟踪验证结果',
                    fieldName: 'trackResult',
                    colLayout: 'singleCol'
                }
            ]
            return {
                saveApi: 'manageImproveTract.save',
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
            getInfoData (data) {
                this.formData.infoList = []
                this.formData.infoList.push(...data)
                console.log(this.formData, 'eeee')
            },
            getAssess (record) {
                this.$api['manageImproveTract.getImproveTractData']({ id: record.id }).then(res => {
                    console.log(res, 'rrrr')
                    this.formData.id = res.id
                    this.formData.improveSuggestCode = res.improveSuggestCode
                    this.formData.formSecret = res.formSecret
                    this.formData.dutyPeople = res.dutyPeople
                    this.formData.dutyUnit = res.dutyUnit
                    this.formData.dutyUnitName = res.dutyUnitName
                    this.formData.trackResult = res.trackResult
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
