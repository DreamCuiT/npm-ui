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
                    labelText: '工作状态代号',
                    fieldName: 'workStatusCode',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'text',
                    labelText: '名称',
                    fieldName: 'workStatus',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                },
                {
                    type: 'text',
                    labelText: '工作状态说明',
                    fieldName: 'workStatusExplain',
                    colLayout: 'singleCol',
                    rules: [{ required: true, message: '必填' }]
                }
            ]
            return {
                saveApi: 'QualityWorkStatus.save',
                dataSource,
                formData: {},
                selectType: '1',
                visibleCreator: false,
                visibleReleaseUnit: false
            }
        },
        methods: {
            getActivityReport (record) {
                this.$api['QualityWorkStatus.getInfo']({ id: record.id }).then(res => {
                    this.formData = res
                })
            },
            rendered () {
                if (this.record != null && this.record.id != null) {
                    this.getActivityReport(this.record)
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
