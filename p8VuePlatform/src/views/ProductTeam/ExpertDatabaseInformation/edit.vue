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
            type: 'select',
            labelText: '所属产品队伍',
            fieldName: 'productTeamId',
            colLayout: 'singleCol',
            placeholder: '请选择所属产品队伍',
            defaultExpandAll: true,
            optionUrl: {
                api: 'ExpertDatabaseInformation.productTeamSelect'
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
            type: 'radio',
            labelText: '性别',
            fieldName: 'sex',
            options: [
                { label: '男', value: '男' },
                { label: '女', value: '女' }
            ],
            colLayout: 'singleCol',
            rules: [
                {
                    required: true,
                    message: '必填'
                }
            ]
        },
        {
            type: 'treeSelect',
            labelText: '所属单位',
            fieldName: 'unit',
            colLayout: 'singleCol',
            placeholder: '请选择所属单位',
            defaultExpandAll: true,
            optionUrl: {
                api: 'userManager.deptTree'
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
            labelText: '专业',
            fieldName: 'major',
            colLayout: 'singleCol'
        },
        {
            type: 'text',
            labelText: '专家描述',
            fieldName: 'expertDescription',
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
            expertId: {
                type: String,
                default: ''
            },
            teamId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                saveApi: 'ExpertDatabaseInformation.save',
                dataSource: dataSource,
                formData: {}
            }
        },
        mounted () {
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
                if (this.expertId != null && this.expertId !== '') {
                    this.getData(this.expertId)
                }
                if (this.teamId != null && this.teamId !== '') {
                    this.formData.productTeamId = this.teamId
                    this.formData = Object.assign({}, this.formData)
                }
            },
            getData (expertId) {
                let that = this
                that.$api['ExpertDatabaseInformation.getExpert']({
                    id: expertId
                }).then(function (res) {
                    let data = res
                    that.formData.id = data.id
                    that.formData.productTeamId = data.productTeamId
                    that.formData.name = data.name
                    that.formData.sex = data.sex
                    that.formData.unit = data.unit
                    that.formData.major = data.major
                    that.formData.expertDescription = data.expertDescription
                    that.formData.remark = data.remark
                    that.formData.creater = data.creater
                    that.formData.createTime = data.createTime
                    that.formData.createUnit = data.createUnitName
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
