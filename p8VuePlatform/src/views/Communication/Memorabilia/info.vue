<template>
    <div>
        <form-list ref="form"
                   @saved="saved"
                   @rendered="rendered"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData">
            <template #name>
                <el-input v-model='formData["wholeDescribeName"]'
                          readonly
                          autosize
                          placeholder="请选择项目"
                          v-on:click.native="showModal()">
                    <i v-if='selectedRow'
                       class='el-icon-link'
                       slot='suffix'
                       type='link'
                       :style='{cursor: "pointer", fontSize: "16px", color: "#08c" }'></i>
                </el-input>
            </template>
        </form-list>
        <select-project v-if='selectProjectVisible' :selected-row='selectedRow'
                        :visible='selectProjectVisible'
                        @close-modal='closeProjectModal'></select-project>
    </div>
</template>

<script>
    import { Input } from '~/index'
    import { P8Form as FormList } from '~/index'
    import SelectProject from '@/views/Product/Pm/Project/selectProject'

    export default {
        name: 'edit',
        components: {
            FormList,
            'el-input': Input,
            SelectProject
        },
        props: {
            id: {
                type: String
            }
        },
        data () {
            return {
                saveApi: 'memorabilia.saveInfo',
                selectProjectVisible: false,
                selectedRow: {},
                formData: {
                    getFile: []
                },
                dataSource: [
                    {
                        type: 'textarea',
                        labelText: '内容',
                        fieldName: 'content',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '日期',
                        fieldName: 'time',
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
                        labelText: '部门',
                        fieldName: 'deptId',
                        colLayout: 'singleCol',
                        optionUrl: {
                            api: 'userManager.deptTree'
                        }
                    },
                    {
                        type: 'blank',
                        labelText: '项目',
                        slotName: 'name',
                        fieldName: 'wholeDescribeId',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'select',
                        labelText: '类型',
                        fieldName: 'type',
                        colLayout: 'singleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'QUALITY_DEVELOPMENT_STAGE' }
                        }
                    },
                    {
                        type: 'textarea',
                        labelText: '备注',
                        fieldName: 'remark',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'upload', // 控件类型
                        labelText: '附件', // 控件显示的文本
                        fieldName: 'getFile',
                        colLayout: 'singleCol',
                        uploadConfig: {
                            // drag: true// 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
                        },
                        listType: 'secret'// 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                    }
                ],
                modify: {}
            }
        },
        methods: {
            rendered () {
                if (this.id && this.id !== '') {
                    this.getData(this.id)
                }
            },
            getData (id) {
                let that = this
                that.$api['memorabilia.detail']({
                    id: id
                }).then(function (res) {
                    console.log(res, 'res')
                    that.formData.id = res.id
                    that.formData.content = res.content
                    that.formData.receptionLocation = res.receptionLocation
                    that.formData.time = res.time
                    that.formData.remark = res.remark
                    that.formData.wholeDescribeId = res.wholeDescribeId
                    that.formData.wholeDescribeName = res.wholeDescribeName
                    that.formData.deptId = res.deptId
                    that.formData.type = res.type
                    that.formData.getFile = res.getFile
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saved (res) {
                this.$emit('saveSuccess', res)
            },
            handleChange (info) {
                console.log(info, 'info')
            },
            showModal () {
                this.selectProjectVisible = true
            },
            closeProjectModal (selectedRow) {
                this.selectProjectVisible = false
                this.selectedRow = selectedRow
                if (this.selectedRow) {
                    let that = this
                    that.formData.wholeDescribeId = selectedRow.id
                    that.formData.wholeDescribeName = selectedRow.name
                    that.formData = Object.assign({}, that.formData)
                }
            }
        }
    }
</script>

<style scoped>

</style>
