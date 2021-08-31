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
            <template #fillingUnitName>
                <el-input v-model="formData.name" @click.native="visibleFillingUnit=true">
                </el-input>
            </template>
        </form-list>
        <select-user v-if="visibleCreator" :visible="visibleCreator"
                     :selectType="selectType" @close-dialog="closeVisibleCreator"></select-user>
        <select-dept v-if="visibleFillingUnit" :visible="visibleFillingUnit"
                     @close-dialog="closeDept"></select-dept>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectDept from './Components/SelectDept'
    import { Input } from '~/index'
    export default {
        name: 'edit',
        components: {
            FormList,
            SelectUser,
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
                    type: 'text',
                    labelText: '报告标题',
                    fieldName: 'reportTitle',
                    colLayout: 'doubleCol'
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
                    options: []
                },
                {
                    type: 'select',
                    labelText: '类型',
                    fieldName: 'type',
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
                    labelText: '填报单位',
                    fieldName: 'name',
                    slotName: 'fillingUnitName',
                    placeholder: '请选择所属部门',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'datetime',
                    labelText: '发布时间',
                    fieldName: 'releaseTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'textarea',
                    labelText: '备注',
                    fieldName: 'remarks',
                    colLayout: 'singleCol'
                },
                {
                    type: 'view',
                    labelText: '制单日期',
                    fieldName: 'createTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'blank',
                    labelText: '制单人',
                    fieldName: 'creator',
                    slotName: 'creator',
                    placeholder: '请选择制单人',
                    colLayout: 'doubleCol'
                }
            ]
            return {
                saveApi: 'activityReport.save',
                dataSource,
                formData: {},
                selectType: '1',
                visibleCreator: false,
                visibleFillingUnit: false
            }
        },
        mounted () {
            this.getUser()
        },
        methods: {
            getActivityReport (record) {
                this.$api['activityReport.getInfo']({ id: record.id }).then(res => {
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
            closeDept (selectedRows) {
                this.visibleFillingUnit = false
                let that = this
                that.formData.fillingUnit = selectedRows.id
                that.formData.name = selectedRows.name
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
