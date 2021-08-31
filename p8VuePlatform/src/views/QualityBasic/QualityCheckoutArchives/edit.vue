<template>
    <div>
        <form-list ref='form'
                   @rendered='rendered'
                   @saved='saved'
                   :form='formData'
                   :dataSource='dataSource'
                   :api='saveApi'>
            <template #creator>
                <el-input v-model="formData.creator" @click.native="visibleCreator=true">
                </el-input>
            </template>
            <template #borrowUnitName>
                <el-input v-model="formData.borrowUnitName" @click.native="visibleBorrowUnit=true">
                </el-input>
            </template>
            <template #memberName>
                <el-input v-model="formData.memberName" @click.native="visibleMemberName=true">
                </el-input>
            </template>
            <template #approver>
                <el-input v-model="formData.approver" @click.native="visibleApprover=true">
                </el-input>
            </template>
            <template #sealNum>
                <el-input v-model="formData.sealNum" @click.native="visibleSealNum=true">
                </el-input>
            </template>
        </form-list>
        <select-user v-if="visibleCreator" :visible="visibleCreator"
                     :selectType="selectType" @close-dialog="closeVisibleCreator"></select-user>
        <select-user v-if="visibleMemberName" :visible="visibleMemberName"
                     :selectType="selectType" @close-dialog="closeVisibleMemberName"></select-user>
        <select-user v-if="visibleApprover" :visible="visibleApprover"
                     :selectType="selectType" @close-dialog="closeVisibleApprover"></select-user>
        <select-dept v-if="visibleBorrowUnit" :visible="visibleBorrowUnit"
                     @close-dialog="closeDept"></select-dept>
        <select-seal v-if="visibleSealNum" :visible="visibleSealNum"
                     @close-dialog="closeSeal"></select-seal>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectDept from '../../QualitySystem/UncorrectionItems/SelectDept'
    import SelectSeal from './Components/SelectSeal'
    import { Input } from '~/index'
    export default {
        name: 'edit',
        components: {
            FormList,
            SelectUser,
            SelectSeal,
            SelectDept,
            'el-input': Input
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            const dataSource = [
                {
                    type: 'datetime',
                    labelText: '领用日期',
                    fieldName: 'borrowTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'datetime',
                    labelText: '注销日期',
                    fieldName: 'returnTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'blank',
                    labelText: '领用单位',
                    fieldName: 'borrowUnitName',
                    slotName: 'borrowUnitName',
                    placeholder: '请选择所属部门',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '质量人员',
                    fieldName: 'memberName',
                    slotName: 'memberName',
                    placeholder: '请选择所属部门',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '检验印章',
                    fieldName: 'sealNum',
                    slotName: 'sealNum',
                    placeholder: '请选择所属部门',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'radio',
                    labelText: '',
                    fieldName: 'brType',
                    options: [
                        { label: '领用', value: '0' },
                        { label: '归还', value: '1' }
                    ],
                    colLayout: 'doubleCol'
                },
                {
                    type: 'select',
                    labelText: '审批状态',
                    fieldName: 'approvalState',
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
                    ]
                },
                {
                    type: 'blank',
                    labelText: '制单人',
                    fieldName: 'creator',
                    slotName: 'creator',
                    placeholder: '请选择所属部门',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'datetime',
                    labelText: '制单日期',
                    fieldName: 'createTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'blank',
                    labelText: '审批人',
                    fieldName: 'name',
                    slotName: 'approver',
                    placeholder: '选择审批人',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'datetime',
                    labelText: '审批日期',
                    fieldName: 'approvalTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'text',
                    labelText: '审批意见',
                    fieldName: 'approvalSuggest',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '单据号',
                    fieldName: 'docNum',
                    colLayout: 'doubleCol'
                }
            ]
            return {
                saveApi: 'QualityCheckoutArchives.save',
                dataSource,
                formData: {},
                selectType: '1',
                visibleCreator: false,
                visibleBorrowUnit: false,
                visibleMemberName: false,
                visibleApprover: false,
                visibleSealNum: false
            }
        },
        mounted () {
            this.getUser()
        },
        methods: {
            getActivityReport (record) {
                this.$api['QualityCheckoutArchives.getInfo']({ id: record.id }).then(res => {
                    console.log(res, '111')
                    this.formData = res
                })
            },
            rendered () {
                if (this.record != null && this.record.id != null) {
                    this.getActivityReport(this.record)
                }
            },
            closeVisibleCreator (selectedRows) {
                this.visibleCreator = false
                this.formData.creator = selectedRows[0].realName
                this.formData = Object.assign({}, this.formData)
            },
            closeVisibleMemberName (selectedRows) {
                this.visibleMemberName = false
                this.formData.memberName = selectedRows[0].realName
                this.formData = Object.assign({}, this.formData)
            },
            closeVisibleApprover (selectedRows) {
                this.visibleApprover = false
                this.formData.approver = selectedRows[0].realName
                this.formData = Object.assign({}, this.formData)
            },
            closeDept (selectedRows) {
                this.visibleBorrowUnit = false
                let that = this
                that.formData.borrowUnit = selectedRows.id
                that.formData.borrowUnitName = selectedRows.name
                this.formData = Object.assign({}, this.formData)
            },
            closeSeal (selectedRows) {
                this.visibleSealNum = false
                let that = this
                that.formData.sealNum = selectedRows.sealNum
                this.formData = Object.assign({}, this.formData)
            },
            getUser () {
                this.formData.creator = this.$store.getters.userName
                this.formData = Object.assign({}, this.formData)

                let aData = new Date()
                let value = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate()
                this.formData.createTime = value
            },
            saved (res) {
                this.$emit('save-success', 'success')
            }
        }
    }
</script>

<style scoped>

</style>
