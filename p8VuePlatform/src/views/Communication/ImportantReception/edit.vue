<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @saved="saved"
                   @rendered="rendered"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData">
            <template #mainObject>
                <el-input v-model="formData.mainObject" @click.native="visible=true">
                </el-input>
            </template>
            <template #user2>
                <el-input v-model="formData.leadersOfActivity" @click.native="visible2=true">
                </el-input>
            </template>
            <template #user3>
                <el-input :value="formData.otherParticipants" @click.native="visible3=true">
                </el-input>
            </template>
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
        <select-userSingle v-if="visible" :visible="visible" @close-dialog="closeModal"
                           :disabled-row="formData.sysuserIds"></select-userSingle>
        <select-user v-if="visible2" :visible="visible2" @close-dialog="closeModal2"
                     :disabled-row="formData.sysuserIds"></select-user>
        <select-user v-if="visible3" :visible="visible3" @close-dialog="closeModal3"
                     :disabled-row="formData.sysuserIds"></select-user>
        <select-project v-if='selectProjectVisible' :selected-row='selectedRow'
                        :visible='selectProjectVisible'
                        @close-modal='closeProjectModal'></select-project>
    </div>
</template>

<script>
    import { Input } from '~/index'
    import { P8Form as FormList } from '~/index'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectUserSingle from '@/views/Communication/ImportantReception/SelectUser'
    import SelectProject from '@/views/Product/Pm/Project/selectProject'

    export default {
        name: 'edit',
        components: {
            FormList,
            'el-input': Input,
            SelectUser,
            SelectUserSingle,
            SelectProject
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            return {
                saveApi: 'importantReception.save',
                visible: false,
                visible2: false,
                visible3: false,
                selectedRows: [],
                selectProjectVisible: false,
                selectedRow: {},
                formData: {
                    name: '',
                    receptionItem: '',
                    mainObject: '',
                    leadersOfActivity: '',
                    otherParticipants: '',
                    sysuserIds: [],
                    getFile: []
                },
                dataSource: [
                    {
                        type: 'datetime',
                        labelText: '接待时间',
                        fieldName: 'receptionTime',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
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
                        labelText: '接待地点',
                        fieldName: 'receptionLocation',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '接待原由',
                        fieldName: 'receptionReason',
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
                        labelText: '项目',
                        slotName: 'name',
                        fieldName: 'receptionItem',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'select',
                        labelText: '是否来过本单位',
                        fieldName: 'isToCompany',
                        colLayout: 'doubleCol',
                        placeholder: '',
                        options: [
                            {
                                label: '是',
                                value: '是'
                            },
                            {
                                label: '否',
                                value: '否'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '与领导是否相熟',
                        fieldName: 'isFamiliarLeader',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: '是',
                                value: '是'
                            },
                            {
                                label: '否',
                                value: '否'
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        labelText: '行程（接待活动）',
                        fieldName: 'trip',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '主对象',
                        slotName: 'mainObject',
                        fieldName: 'mainObject',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank', // 控件类型
                        labelText: '活动参与院领导', // 控件显示的文本
                        slotName: 'user2',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank', // 控件类型
                        labelText: '其他参与人员', // 控件显示的文本
                        slotName: 'user3',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '接待总结',
                        fieldName: 'receptionSummary',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '后续工作',
                        fieldName: 'followUpWork',
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
                if (this.record.id && this.record.id !== '') {
                    this.getProjectTeamSettingData(this.record.id)
                }
            },
            getProjectTeamSettingData (id) {
                let that = this
                that.$api['importantReception.getInfo']({
                    id: id
                }).then(function (res) {
                    that.formData.id = res.id
                    that.formData.receptionTime = res.receptionTime
                    that.formData.receptionLocation = res.receptionLocation
                    that.formData.receptionReason = res.receptionReason
                    that.formData.name = res.wholeDescribeName
                    that.formData.receptionItem = res.receptionItem
                    that.formData.isToCompany = res.isToCompany
                    that.formData.isFamiliarLeader = res.isFamiliarLeader
                    that.formData.trip = res.trip
                    that.formData.mainObject = res.mainObject
                    that.formData.leadersOfActivity = res.leadersOfActivity
                    that.formData.otherParticipants = res.otherParticipants
                    that.formData.receptionSummary = res.receptionSummary
                    that.formData.followUpWork = res.followUpWork
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
            closeModal (selectedRows) {
                this.visible = false
                this.formData.mainObject = selectedRows
            },
            closeModal2 (selectedRows) {
                this.visible2 = false
                this.formData.leadersOfActivity = ''
                let idArr = selectedRows.map(v => {
                    return v.id
                })
                this.formData.sysuserIds.push(...idArr)
                let realNames = selectedRows.map(v => {
                    return v.realName
                })
                for (let i = 0; i < realNames.length; i++) {
                    if (i === realNames.length - 1) {
                        this.formData.leadersOfActivity += realNames[i]
                    } else {
                        this.formData.leadersOfActivity += realNames[i] + ','
                    }
                }
            },
            closeModal3 (selectedRows) {
                this.visible3 = false
                this.formData.otherParticipants = ''
                let idArr = selectedRows.map(v => {
                    return v.id
                })
                this.formData.sysuserIds.push(...idArr)
                let realNames = selectedRows.map(v => {
                    return v.realName
                })
                for (let i = 0; i < realNames.length; i++) {
                    if (i === realNames.length - 1) {
                        this.formData.otherParticipants += realNames[i]
                    } else {
                        this.formData.otherParticipants += realNames[i] + ','
                    }
                }
            },
            closeProjectModal (selectedRow) {
                this.selectProjectVisible = false
                this.selectedRow = selectedRow
                if (this.selectedRow) {
                    let that = this
                    that.formData.receptionItem = selectedRow.id
                    that.formData.wholeDescribeName = selectedRow.name
                    that.formData = Object.assign({}, that.formData)
                }
            }
        }
    }
</script>

<style scoped>

</style>
