<template >
    <div class="project-con" style="height: 100%">
        <div class="form-con">
            <form-list ref="form"
                       @rendered="rendered"
                       @saved="()=>{}"
                       :dataSource="dataSource"
                       :api="saveApi"
                       :form="modify"
                       labelWidth='150px'
                       :view="modify"
                       :existDefaultBtn="false"
                       :existCustomBtn="true"
                       :other-param="otherParam">
                <template #other>
                    <ul class="userList">
                        <li v-for="item in selectedRows"
                            :key="item.modelCode">
                            <el-tag>型号名称：{{item.modelName}}</el-tag>
                            <el-tag>型号简称：{{item.abbreviation}}</el-tag>
                            <el-tag>所属领域：{{item.classify}}</el-tag>
                        </li>
                    </ul>
                </template>
                <template #other1>
                    <ul class="userList">
                        <li v-for="item1 in selectedRows"
                            :key="item1.configId">
                            <el-tag>{{item1.filedName}}->{{item1.sourceName}}->{{item1.classifyName}}</el-tag>
                        </li>
                    </ul>
                </template>
                <template #others>
                    <ul class="userList">
                        <li v-for="item1 in selectedRows"
                            :key="item1.configId">
                            <el-tag v-if='item1.decisionForm==0'>审核制</el-tag>  <el-tag v-if='item1.decisionForm==1'>备案制</el-tag>
                        </li>
                    </ul>
                </template>
            </form-list>
        </div>
    </div>
</template>项目信息
<script>
    import { P8Form as FormList } from '~/index'
    import { Tag } from '~/index'
    export default {
        name: 'indexWholeDescribe',
        components: {
            'el-tag': Tag,
            FormList
        },
        props: {
            currEntityId: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                projectRoles: [],
                deptIds: [],
                selectedRows: [],
                visible: false,
                copyProjectIndexVisible: false,
                otherParam: {},
                modify: {},
                saveApi: '',
                selectedRowKeys: [],
                selectedCopyRows: [],
                selectedCopyRowKeys: [],
                disabledRow: [],
                dataSource: [
                    {
                        type: 'hidden',
                        labelText: 'entityId',
                        fieldName: 'entityId',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'hidden',
                        labelText: 'configId',
                        fieldName: 'configId',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '业务范围/来源/类型:',
                        slotName: 'other1',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '决策形式',
                        slotName: 'others',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '型号代号',
                        fieldName: 'modelCode',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'hidden',
                        labelText: '型号相关信息',
                        slotName: 'other',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '型号名称',
                        fieldName: 'modelName',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '型号简称',
                        fieldName: 'abbreviation',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '所属领域',
                        fieldName: 'classify',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '产品代号',
                        fieldName: 'productCode',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '产品名称',
                        fieldName: 'productName',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '项目名称', // 控件显示的文本
                        fieldName: 'name',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '项目编号',
                        fieldName: 'pjCode',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '项目来源',
                        fieldName: 'sourceDisplay',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '项目类型',
                        fieldName: 'kprojectClassifyname',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '客户名称',
                        fieldName: 'sysDept',
                        colLayout: 'doubleCol'
                    },
                    // {
                    //     type: 'view',
                    //     labelText: '项目分级',
                    //     fieldName: 'projectOrderDisplay',
                    //     colLayout: 'doubleCol'
                    // },
                    {
                        type: 'view',
                        labelText: '项目密级',
                        fieldName: 'secretGradeDisplay',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '经费来源',
                        fieldName: 'fundsSource',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '项目开始时间',
                        fieldName: 'beginTime',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '项目完成时间',
                        fieldName: 'endTime',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '主承部门',
                        fieldName: 'mainDeptName',
                        colLayout: 'doubleCol'
                    },
                    // {
                    //     type: 'view',
                    //     labelText: '主管所领导',
                    //     fieldName: 'mainLeadUser',
                    //     colLayout: 'doubleCol'
                    // },
                    {
                        type: 'view',
                        labelText: '国拨金额(万元)',
                        fieldName: 'appropriationBudget',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '地配金额(万元)',
                        fieldName: 'localBudaget',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '自筹金额预估(万元)',
                        fieldName: 'raiseBudget',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '横向合同金额(万元)',
                        fieldName: 'crossBudaget',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '概算金额(万元)',
                        fieldName: 'customItem1',
                        colLayout: 'doubleCol'
                    },
                     {
                         type: 'view',
                         labelText: '领域主管所领导',
                         fieldName: 'mainLeadUser',
                         colLayout: 'doubleCol'
                     },
                    {
                        type: 'view',
                        labelText: '申请时间',
                        fieldName: 'createTime',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'view',
                        labelText: '项目概述',
                        fieldName: 'backdrop',
                        colLayout: 'singleCol'
                    }
                ],
                dicData: []
            }
        },
        mounted () {
        },
        methods: {
            rendered () {
                let that = this
                that.$api['ProjectApply.getDicAPIByTypes']({ dicTypes: 'USERNAME,FUNDS_SOURCE,SECRET_LEVEL,CONTROL_SCOPE,PROJECT_ORDER' }).then(res => {
                    that.dicData = res
                    if (that.snapshoot && Object.keys(that.snapshoot).length > 0) {
                        that.fillData(that.snapshoot)
                    } else if (that.currEntityId && that.currEntityId !== '') {
                        that.getProjectData(that.currEntityId)
                    }
                })
            },
            getProjectData (currEntityId) {
                let that = this
                that.$api['ProjectApply.wholeDescribeData']({ entityId: currEntityId, dataType: 'update' }).then(res => {
                    that.fillData(res)
                })
            },
            fillData (res) {
                if (!res || Object.keys(res).length === 0) {
                    return
                }
                let data = res
                let that = this
                that.$emit('copy-data', Object.assign({}, res))
                that.modify = data
                that.modify.name = data.name
                that.modify.beginEndTime = data.beginTime + '   至   ' + data.endTime
                that.modify.realBeginEndTime = data.realBeginTime + '   至   ' + data.realEndTime
                that.selectedRows.push({
                    id: data.modelInformationId,
                    modelCode: data.modelCode,
                    modelName: data.modelName,
                    abbreviation: data.abbreviation,
                    classify: data.classify,
                    filedName: data.filedName,
                    sourceName: data.sourceName,
                    classifyName: data.classifyName,
                    decisionForm: data.decisionForm
                })
                that.modify.modelCode = data.modelCode
                that.modify.modelInformationId = data.modelInformationId
                that.modify.tempArray = []
                for (let item of data.leadDeptIds) {
                    that.modify.tempArray.push(item.departmentName)
                }
                that.modify.leadDept = that.modify.tempArray.join(',')
                that.modify.source = this.dicLabel('USERNAME', that.modify.source)
                //   that.modify.fundsSourceDisplay = this.dicLabel('FUNDS_SOURCE', that.modify.fundsSource)
                that.modify.secretGrade = this.dicLabel('SECRET_LEVEL', that.modify.secretGrade)
                that.modify.projectOrder = this.dicLabel('PROJECT_ORDER', that.modify.projectOrder)
                that.modify = Object.assign({}, that.modify)
                that.$refs.form.setViewFields(that.modify)
            },
            selectCurrent () {
                this.$emit('select-current')
            },
            dicLabel (type, val) {
                if (type && val) {
                    if (this.dicData[type][val] && this.dicData[type][val].label) {
                        return this.dicData[type][val].label
                    }
                    return undefined
                } else {
                    return undefined
                }
            }
        },
        watch: {
            currEntityId: function (val, oldVal) {
                // alert(this.currEntityId)
                if (val !== oldVal) {
                    this.getProjectData(this.currEntityId)
                    this.selectedRows = []
                }
            }
        }
    }
</script>
<style scoped>
</style>
