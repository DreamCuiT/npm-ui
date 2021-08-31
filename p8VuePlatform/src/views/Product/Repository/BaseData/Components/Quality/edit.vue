<template>
    <div>
        <form-list ref="form"
                   :form="formData"
                   @rendered="rendered" @saved="saved" :dataSource="dataSource" :api="saveApi">
        </form-list>
    </div>
</template>
<style scoped>
</style>
<script>
    import { P8Form as FormList } from '~/index'

    let dataSource = [
        {
            type: 'text',
            labelText: '名称',
            fieldName: 'name',
            colLayout: 'singleCol',
            rules: [
                {
                    required: true,
                    message: '必填'
                }
            ]
        },
        {
            type: 'text',
            labelText: '产品队伍描述',
            fieldName: 'describe',
            colLayout: 'singleCol'
        },
        {
            type: 'text',
            labelText: '备注',
            fieldName: 'remark',
            colLayout: 'singleCol'
        }
    ]

    export default {
        name: 'EditResource',
        components: {
            FormList
        },
        props: {
            resId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                saveApi: 'baseData.productTeamSave',
                dataSource: dataSource,
                formData: {}
            }
        },
        methods: {
            showMessage (obj, message, type) {
                obj.$message({
                    message: message,
                    type: type
                })
            },
            clickEvent () {
                console.log('click')
            },
            rendered () {
                this.getData(this.resId)
            },
            getData (resId) {
                let that = this
                that.$api['baseData.getProductTeamInfo']({
                    id: resId
                }).then(function (res) {
                    let data = res
                    that.formData.id = data.id
                    that.formData.name = data.name
                    that.formData.describe = data.describe
                    that.formData.remark = data.remark
                    that.formData.creater = data.creater
                    that.formData.createTime = data.createTime
                    that.formData.createUnit = data.deptName
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                console.log('edit saved')
                this.$emit('saveSuccess', res)
            },
            handleChange (info) {
                console.log(info, 'info')
            }
        }

    }

</script>
