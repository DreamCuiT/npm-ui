<template>
    <div>
        <form-list ref='form'
                   @rendered='rendered'
                   @saved='saved'
                   :form='formData'
                   :dataSource='dataSource'
                   :api='saveApi'>
        </form-list>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    export default {
        name: 'edit',
        components: {
            FormList
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
                    labelText: '故障模式编码',
                    fieldName: 'faultCode',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'text',
                    labelText: '故障模式名称',
                    fieldName: 'faultName',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'text',
                    labelText: '故障模式说明',
                    fieldName: 'faultExplain',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'textarea',
                    labelText: '备注',
                    fieldName: 'remarks',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                }
            ]
            return {
                saveApi: 'QualityFaultPattern.save',
                dataSource,
                formData: {}
            }
        },
        methods: {
            getFaultPattern (record) {
                this.$api['QualityFaultPattern.getInfo']({ id: record.id }).then(res => {
                    this.formData = res
                })
            },
            rendered () {
                if (this.record != null && this.record.id != null) {
                    this.getFaultPattern(this.record)
                }
            },
            saved (res) {
                this.$emit('saveSuccess', 'success')
            }
        }
    }
</script>

<style scoped>

</style>
