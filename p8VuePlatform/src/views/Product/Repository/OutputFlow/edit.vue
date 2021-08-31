<template>
    <div>
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData">
            <template #activityClassifyId>
                <tree-select
                        v-model="formData.activityClassifyId"
                        placeholder="请选择"
                        @change="onChangeStripe"
                        :data="projectClassify"
                        style="width: 100%"
                        :default-expand-all="true"
                >
                </tree-select>
            </template>
            <template #index>
                <el-input-number v-model="formData.indexNo" style="width: 100%"/>
            </template>
        </form-list>
    </div>
</template>
<style scoped>
</style>
<script>
    import { InputNumber } from '~/index'
    import { P8Form as FormList } from '~/index'
    import TreeSelect from './Components/TreeSelect'

    export default {
        name: 'FlowEdit',
        components: {
            FormList,
            TreeSelect,
            'el-input-number': InputNumber
        },
        props: {
            activityInfoId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                saveApi: 'OutputFlow.saveActivityInfo',
                classifyDisabledTree: [],
                userRoles: [],
                projectClassify: [],
                index: '',
                formData: {}
            }
        },
        created: function () {
            let that = this
            that.$api['ProjectApply.projectClassifyTree']({ dataType: '' }).then(res => {
                if (res) {
                    res.forEach(node => {
                        if (node.id === '0' || node.pId === '0') {
                            that.classifyDisabledTree.push(node.id)
                        }
                    })
                }
            })
            let dataSourceTemp = [
                {
                    type: 'text',
                    labelText: '流程名称',
                    fieldName: 'name',
                    placeholder: '请输入流程名称',
                    colLayout: 'singleCol',
                    rules: [
                        {
                            required: true,
                            message: '必填'
                        },
                        {
                            validator: (rule, value, callback) => {
                                let that = this
                                that.$api['OutputFlow.editRepeatedNameCheck']({
                                    activityInfoId: that.activityInfoId,
                                    name: value
                                }).then(res => {
                                    if (res === 'false') {
                                        callback(new Error('流程名称已被使用'))
                                        return
                                    }
                                    callback()
                                })
                            },
                            trigger: 'blur'
                        }
                    ]
                },
                {
                    type: 'hidden',
                    fieldName: 'activityInfoId',
                    urlParam: true
                },
                {
                    // type: 'treeSelect',
                    // labelText: '项目类型',
                    // defaultValue: [],
                    // defaultExpandAll: true,
                    // disabledValues: this.classifyDisabledTree,
                    // fieldName: 'activityClassifyId',
                    // placeholder: '请选择项目类型',
                    // colLayout: 'singleCol',
                    // optionUrl: {
                    //     api: 'baseData.classifyTreeData',
                    //     label: 'name',
                    //     value: 'id',
                    //     params: {}
                    // },
                    // rules: [
                    //     {
                    //         required: true,
                    //         message: '项目分类不能为空'
                    //     }
                    // ],
                    // treeData: []
                    type: 'blank',
                    labelText: '项目类型',
                    slotName: 'activityClassifyId',
                    // fieldName: 'activityClassifyId',
                    colLayout: 'singleCol',
                    rules: [
                        {
                            type: 'string',
                            required: true,
                            message: '项目类型不能为空',
                            trigger: 'change'
                        }
                    ]
                },
                {
                    type: 'select',
                    labelText: '企业标准团队',
                    fieldName: 'kteamId',
                    placeholder: '请选企业标准团队',
                    colLayout: 'singleCol',
                    optionUrl: {
                        api: 'OutputFlow.editGetKTeamData',
                        params: { activityInfoId: '' },
                        label: 'label',
                        value: 'value'
                    },
                    // rules: [
                    //   {
                    //     required: true,
                    //     message: '企业标准团队不能为空'
                    //   },
                    //   {
                    //     validator: (rule, value, callback) => {
                    //       let that = this
                    //       that.$api['OutputFlow.editGetInfo']({ id: that.activityInfoId }).then(res => {
                    //         if (res === 'false') {
                    //           callback(new Error('团队角色已被使用'))
                    //           return
                    //         }
                    //         callback()
                    //       })
                    //     },
                    //     trigger: 'blur'
                    //   }
                    // ],
                    options: []
                },
                {
                    labelText: '排序号',
                    type: 'blank',
                    fieldName: 'indexNo',
                    slotName: 'index',
                    colLayout: 'singleCol'
                }
            ]

            this.dataSource = dataSourceTemp
        },
        mounted () {
            this.getProjectClassify()
        },
        methods: {
            getProjectClassify () {
                let that = this
                this.$api['baseData.classifyTreeData']().then(res => {
                    that.projectClassify = res
                    console.log(that.projectClassify, 'that.projectClassify')
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            onChangeStripe (e) {
                console.log(e, 'e')
                this.$api['OutputFlow.getByActivityClassifyId']({ activityClassifyId: e }).then(res => {
                    console.log(res, 'res')
                    this.index = res.length + 1
                    this.formData.indexNo = this.index
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            rendered () {
                if (this.activityInfoId && this.activityInfoId !== '') {
                    this.getFlowData(this.activityInfoId)
                } else {
                    this.formData.flClassify = 'flow'
                    this.formData = Object.assign({}, this.formData)
                }
            },
            clickEvent () {
                console.log('click')
            },
            getFlowData (activityInfoId) {
                let that = this
                that.$api['OutputFlow.editGetInfo']({ id: activityInfoId }).then(function (res) {
                    let data = res
                    that.formData.activityInfoId = data.id
                    that.formData.name = data.name
                    that.formData.activityClassifyId = data.activityClassifyId
                    that.formData.kteamId = data.kteamId
                    that.formData.indexNo = data.indexNo
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
            }
        }

    }

</script>
