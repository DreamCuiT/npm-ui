<template>
    <div>
        <form-list ref='form'
                   @rendered='rendered'
                   @saved='saved'
                   :form='formData'
                   :dataSource='dataSource'
                   :api='saveApi'>
            <template #name>
                <el-input v-model="formData.name" @click.native="visibleCompany=true">
                </el-input>
            </template>
        </form-list>
        <select-dept v-if="visibleCompany" :visible="visibleCompany"
                     @close-dialog="closeDept"></select-dept>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import { Input } from '~/index'
    import SelectDept from '../../../../../../QualitySystem/UncorrectionItems/SelectDept'
    export default {
        name: 'edit',
        components: {
            FormList,
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
                    type: 'blank',
                    labelText: '公司',
                    fieldName: 'name',
                    slotName: 'name',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'text',
                    labelText: '一层原因',
                    fieldName: 'firstReason',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'text',
                    labelText: '二层原因',
                    fieldName: 'secondReason',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'datetime',
                    labelText: '登记日期',
                    fieldName: 'registerTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'text',
                    labelText: '单据号',
                    fieldName: 'docNum',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'textarea',
                    labelText: '备注',
                    fieldName: 'remarks',
                    colLayout: 'singleCol'
                },
                {
                    type: 'view',
                    labelText: '制单人',
                    fieldName: 'creator',
                    slotName: 'creator',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'textarea',
                    labelText: '审批批语',
                    fieldName: 'comments',
                    colLayout: 'singleCol'
                }
            ]
            return {
                saveApi: 'QualityReason.save',
                dataSource,
                formData: {},
                selectType: '1',
                visibleCompany: false
            }
        },
        mounted () {
            this.getUser()
        },
        methods: {
            getActivityReport (record) {
                this.$api['QualityReason.getInfo']({ id: record.id }).then(res => {
                    this.formData = res
                })
            },
            rendered () {
                if (this.record != null && this.record.id != null) {
                    this.getActivityReport(this.record)
                }
            },
            closeDept (selectedRows) {
                this.visibleCompany = false
                let that = this
                that.formData.company = selectedRows.id
                that.formData.name = selectedRows.name
                this.formData = Object.assign({}, this.formData)
            },
            getUser () {
                this.formData.creator = this.$store.getters.userName
                this.formData = Object.assign({}, this.formData)
            },
            saved (res) {
                this.$emit('saveSuccess', 'success')
            }
        }
    }
</script>

<style scoped>

</style>
