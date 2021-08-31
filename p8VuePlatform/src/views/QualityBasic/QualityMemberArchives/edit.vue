<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref='form'
                   @rendered='rendered'
                   @saved='saved'
                   :form='formData'
                   :dataSource='dataSource'
                   :api='saveApi'>
            <template #belongToUnitName>
                <el-input v-model="formData.belongToUnitName" @click.native="visiblebelongToUnitName=true">
                </el-input>
            </template>
            <template #memberName>
                <el-input v-model="formData.memberName" @click.native="visiblememberNameName=true">
                </el-input>
            </template>
            <template #memberClassify>
                <el-input v-model="formData.memberClassify" @click.native="memberClassifyOpen">
                </el-input>
            </template>
            <template #positionalTitles>
                <el-input v-model="formData.positionalTitles" @click.native="positionalTitlesOpen">
                </el-input>
            </template>
            <template #positional>
                <el-input v-model="formData.positional" @click.native="positionalOpen">
                </el-input>
            </template>
            <template #station>
                <el-input v-model="formData.station" @click.native="stationOpen">
                </el-input>
            </template>
            <template #expertType>
                <el-input v-model="formData.expertType" @click.native="expertTypeOpen">
                </el-input>
            </template>
        </form-list>
        <template>
            <common-tabs :tabsData="tabsData"
                         height="auto"
                         :activeTabs="activeTabs">
                <template #borrow>
                    <borrow-list ref="borrow"
                                  :renderHeight="renderHeight"
                                  :addRow="true"
                                  :params="params"
                                  @getInfoData="getInfoData"
                                  @openImport="openImport">
                    </borrow-list>
                </template>
                <template #return>
                    <return-list ref="ret"
                                 :renderHeight="renderHeight"
                                 :addRow="true"
                                 :params="params"
                                 @getInfoData="getInfoData"
                                 @openImport="openImport">
                    </return-list>
                </template>
            </common-tabs>
        </template>
        <select-depart v-if="visiblebelongToUnitName" :visible="visiblebelongToUnitName"
                       @close-dialog="closeVisiblebelongToUnit"></select-depart>
        <select-user v-if="visiblememberNameName" :visible="visiblememberNameName"
                     :selectType="selectType" @close-dialog="closememberNameName"></select-user>
        <select-quality-dic v-if="visibleQualityDic" :visible="visibleQualityDic"
                            @close-dialog="memberClose" :QualityType="QualityType"></select-quality-dic>
    </div>
</template>

<script>
    import { P8Form as FormList } from '~/index'
    import SelectDepart from '../../QualitySystem/UncorrectionItems/SelectDept'
    import BorrowList from './Components/borrowList'
    import ReturnList from './Components/returnList'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectQualityDic from './Components/SelectQualityDic'
    import { P8Tabs as CommonTabs } from '~/index'
    import { Input } from '~/index'
    export default {
        name: 'edit',
        components: {
            FormList,
            SelectDepart,
            SelectUser,
            BorrowList,
            ReturnList,
            CommonTabs,
            SelectQualityDic,
            'el-input': Input
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            const dataSource = [
                {
                    type: 'blank',
                    labelText: '所属单位',
                    fieldName: 'belongToUnitName',
                    slotName: 'belongToUnitName',
                    placeholder: '请选择所属部门',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '人员名称',
                    fieldName: 'memberName',
                    slotName: 'memberName',
                    placeholder: '请选择所属部门',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'datetime',
                    labelText: '发证日期',
                    fieldName: 'certificationDate',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'text',
                    labelText: '检验章号',
                    fieldName: 'sealNum',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '人员类别',
                    fieldName: 'memberClassify',
                    slotName: 'memberClassify',
                    placeholder: '请选择人员类别',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '主管型号',
                    fieldName: 'manageModel',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '职称',
                    fieldName: 'positionalTitles',
                    slotName: 'positionalTitles',
                    placeholder: '请选择职称',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '职务',
                    fieldName: 'positional',
                    slotName: 'positional',
                    colLayout: 'doubleCol',
                    placeholder: '请选择职务'
                },
                {
                    type: 'text',
                    labelText: '学历',
                    fieldName: 'eduction',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '岗位',
                    fieldName: 'station',
                    slotName: 'station',
                    colLayout: 'doubleCol',
                    placeholder: '请选择岗位'
                },
                {
                    type: 'text',
                    labelText: '岗位资格证书号',
                    fieldName: 'stationQualification',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '工种',
                    fieldName: 'workType',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '获荣誉奖励情况',
                    fieldName: 'rewardSituation',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '任职文件',
                    fieldName: 'appointmentDoc',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '上岗证书',
                    fieldName: 'jobCertificate',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'text',
                    labelText: '专业',
                    fieldName: 'major',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'radio',
                    labelText: '',
                    fieldName: 'propertyClassification',
                    options: [
                        { label: '是否专家标识', value: '1' }
                    ],
                    colLayout: 'doubleCol'
                },
                {
                    type: 'blank',
                    labelText: '专家类型',
                    fieldName: 'expertType',
                    slotName: 'expertType',
                    colLayout: 'doubleCol',
                    placeholder: '请选择专家类型'
                },
                {
                    type: 'view',
                    labelText: '制单人',
                    fieldName: 'creator',
                    slotName: 'creator',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'view',
                    labelText: '制单日期',
                    fieldName: 'createTime',
                    colLayout: 'doubleCol',
                    fieldConfig: {
                        'value-format': 'yyyy-MM-dd'
                    }
                }
            ]
            return {
                saveApi: 'MemberArchives.save',
                dataSource,
                formData: {
                    getFiles: [],
                    borrowList: [],
                    returnList: []
                },
                disabledRow: [],
                selectType: '1',
                visiblebelongToUnitName: false,
                visiblememberNameName: false,
                exposureImportVisible: false,
                visibleQualityDic: false,
                QualityType: '',
                // 增删行
                renderHeight: height + 'px',
                params: { id: this.record.id },
                activeTabs: 'borrow',
                tabsData: [
                    {
                        label: '领用记录',
                        name: 'borrow',
                        value: 0
                    },
                    {
                        label: '归还记录',
                        name: 'return',
                        value: 1
                    }
                ]
            }
        },
        mounted () {
            this.getUser()
        },
        methods: {
            getInfoData (data) {
                if (data.type === '0') {
                    this.formData.borrowList = []
                    this.formData.borrowList.push(...data)
                    console.log(this.formData, 'eeee')
                }
                if (data.type === '1') {
                    this.formData.returnList = []
                    this.formData.returnList.push(...data)
                    console.log(this.formData, 'eeee')
                }
            },
            getAssess (record) {
                this.$api['MemberArchives.getArchives']({ id: record.id }).then(res => {
                    console.log(res, 'rrrr')
                    this.formData = res
                    if (res.borrowList != null) {
                        this.$refs.borrow.setInfoList(res.borrowList)
                    }
                    if (res.returnList != null) {
                        this.$refs.ret.setInfoList(res.returnList)
                    }
                    this.formData = Object.assign({}, this.formData)
                })
            },
            rendered () {
                if (this.record.id != null && this.record.id !== '') {
                    this.getAssess(this.record)
                }
            },
            openImport () {
                console.log('open')
                this.exposureImportVisible = true
            },
            saved () {
                console.log('附件保存回调！')
                this.$emit('save-success', 'success')
            },
            closeVisiblebelongToUnit (selectedRows) {
                this.visiblebelongToUnitName = false
                if (selectedRows) {
                    this.formData.belongToUnit = selectedRows.id
                    this.formData.belongToUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closememberNameName (selectedRows) {
                this.visiblememberNameName = false
                this.formData.memberName = selectedRows[0].realName
                this.formData = Object.assign({}, this.formData)
            },
            memberClassifyOpen () {
                this.visibleQualityDic = true
                this.QualityType = 'QualityMemberClassify'
            },
            memberClose (selectedRows) {
                this.visibleQualityDic = false
                if (this.QualityType === 'QualityMemberClassify') {
                    this.formData.memberClassify = selectedRows.name
                } else if (this.QualityType === 'QualityPositionalTitles') {
                    this.formData.positionalTitles = selectedRows.name
                } else if (this.QualityType === 'QualityPositional') {
                    this.formData.positional = selectedRows.name
                } else if (this.QualityType === 'QualityStation') {
                    this.formData.station = selectedRows.name
                } else if (this.QualityType === 'QualityExpertType') {
                    this.formData.expertType = selectedRows.name
                }
                this.formData = Object.assign({}, this.formData)
            },
            positionalTitlesOpen () {
                this.visibleQualityDic = true
                this.QualityType = 'QualityPositionalTitles'
            },
            positionalOpen () {
                this.visibleQualityDic = true
                this.QualityType = 'QualityPositional'
            },
            stationOpen () {
                this.visibleQualityDic = true
                this.QualityType = 'QualityStation'
            },
            expertTypeOpen () {
                this.visibleQualityDic = true
                this.QualityType = 'QualityExpertType'
            },
            getUser () {
                this.formData.creator = this.$store.getters.userName
                this.formData = Object.assign({}, this.formData)

                let aData = new Date()
                let value = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate()
                this.formData.createTime = value
            }
        }
    }
</script>

<style scoped>

</style>
