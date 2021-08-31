<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   @rendered="rendered"
                   @saved="saved"
                   :dataSource="dataSource"
                   :api="saveApi"
                   :form="formData"
                   :other-param="otherParam">
            <template #enter-num>
                <el-input v-model="formData.modelCode" @click.native="visible=true">
                </el-input>
            </template>
            <template #other>
                <ul class="userList">
                    <li v-for="item in selectedRows" :key="item.modelCode">
                        <el-tag>型号名称：{{item.modelName}}</el-tag>
                        <el-tag>型号代号：{{item.modelCode}}</el-tag>
                        <el-tag>所属领域：{{item.classify}}</el-tag>
                    </li>
                </ul>
            </template>
            <template #cardFiller>
                <el-input v-model="formData.cardFiller" @click.native="visibleCardFiller=true">
                </el-input>
            </template>
            <template #approvalBy>
                <el-input v-model="formData.approvalBy" @click.native="visibleApprovalBy=true">
                </el-input>
            </template>
            <template #coSigner>
                <el-input v-model="formData.coSigner" @click.native="visibleCoSigner=true">
                </el-input>
            </template>
            <template #cardFillingUnitName>
                <el-input v-model="formData.cardFillingUnitName" @click.native="visibleCardFillingUnitName=true">
                </el-input>
            </template>
            <template #questionDesignUnitName>
                <el-input v-model="formData.questionDesignUnitName" @click.native="visibleQuestionDesignUnitName=true">
                </el-input>
            </template>
            <template #questionProductionUnitName>
                <el-input v-model="formData.questionProductionUnitName" @click.native="visibleQuestionProductionUnitName=true">
                </el-input>
            </template>
            <template #discoveryUnitName>
                <el-input v-model="formData.discoveryUnitName" @click.native="visibleDiscoveryUnitName=true">
                </el-input>
            </template>
            <template #responsibleUnitName>
                <el-input v-model="formData.responsibleUnitName" @click.native="visibleResponsibleUnit=true">
                </el-input>
            </template>
            <template #affiliatedUnitName>
                <el-input v-model="formData.affiliatedUnitName" @click.native="visibleAffiliatedUnitName=true">
                </el-input>
            </template>
            <template #contractorName>
                <el-input v-model="formData.contractorName" @click.native="visibleContractorName=true">
                </el-input>
            </template>
            <template #takeStepsUnitName>
                <el-input v-model="formData.takeStepsUnitName" @click.native="visibleTakeStepsUnitName=true">
                </el-input>
            </template>
            <template #technologyReportUnitName>
                <el-input v-model="formData.technologyReportUnitName" @click.native="visibleTechnologyReportUnitName=true">
                </el-input>
            </template>
            <template #manageReportUnitName>
                <el-input v-model="formData.manageReportUnitName" @click.native="visibleManageReportUnitName=true">
                </el-input>
            </template>
        </form-list>
        <select-user v-if="visibleCardFiller" :visible="visibleCardFiller"
                     :selectType="selectType" @close-dialog="closeModalCardFiller"></select-user>
        <select-user v-if="visibleApprovalBy" :visible="visibleApprovalBy"
                     :selectType="selectType" @close-dialog="closeModalApprovalBy"></select-user>
        <select-user v-if="visibleCoSigner" :visible="visibleCoSigner"
                     :selectType="selectType" @close-dialog="closeModalCoSigner"></select-user>
        <select-model v-if="visible" :visible="visible" @close-modal="closeModal"
                      :disabled-row="disabledRow"></select-model>
        <select-depart v-if="visibleCardFillingUnitName" :visible="visibleCardFillingUnitName"
                       @close-dialog="closeVisibleCardFillingUnitName"></select-depart>
        <select-depart v-if="visibleQuestionDesignUnitName" :visible="visibleQuestionDesignUnitName"
                       @close-dialog="closeVisibleQuestionDesignUnitName"></select-depart>
        <select-depart v-if="visibleQuestionProductionUnitName" :visible="visibleQuestionProductionUnitName"
                       @close-dialog="closeVisibleQuestionProductionUnitName"></select-depart>
        <select-depart v-if="visibleDiscoveryUnitName" :visible="visibleDiscoveryUnitName"
                       @close-dialog="closeVisibleDiscoveryUnitName"></select-depart>
        <select-depart v-if="visibleResponsibleUnit" :visible="visibleResponsibleUnit"
                       @close-dialog="closeVisibleResponsibleUnit"></select-depart>
        <select-depart v-if="visibleAffiliatedUnitName" :visible="visibleAffiliatedUnitName"
                       @close-dialog="closeVisibleAffiliatedUnitName"></select-depart>
        <select-depart v-if="visibleContractorName" :visible="visibleContractorName"
                       @close-dialog="closeVisibleContractorName"></select-depart>
        <select-depart v-if="visibleTakeStepsUnitName" :visible="visibleTakeStepsUnitName"
                       @close-dialog="closeVisibleTakeStepsUnitName"></select-depart>
        <select-depart v-if="visibleTechnologyReportUnitName" :visible="visibleTechnologyReportUnitName"
                       @close-dialog="closeVisibleTechnologyReportUnitName"></select-depart>
        <select-depart v-if="visibleManageReportUnitName" :visible="visibleManageReportUnitName"
                       @close-dialog="closeVisibleManageReportUnitName"></select-depart>
    </div>
</template>
<script>
    import { P8Form as FormList } from '~/index'
    import SelectModel from '@/views/Quality/QualityProblem/SelectModel'
    import { P8SelectUser as SelectUser } from '~/index'
    import SelectDepart from '../../QualitySystem/UncorrectionItems/SelectDept'
    import { Tag, Input } from '~/index'

    export default {
        name: 'ProblemEdit',
        components: {
            FormList,
            SelectModel,
            SelectUser,
            SelectDepart,
            'el-tag': Tag,
            'el-input': Input
        },
        props: {
            record: {
                type: Object
            }
        },
        data () {
            return {
                saveApi: 'tozero.save',
                dataSource: [
                    {
                        type: 'blank',
                        labelText: '基本概况'
                    },
                    {
                        type: 'text',
                        labelText: '质量问题名称',
                        fieldName: 'qualityProblemName',
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
                        labelText: '质量信息快报编号',
                        fieldName: 'qualityProblemBulletin',
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
                        labelText: '采集卡号',
                        fieldName: 'acquisitionCard',
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
                        labelText: '填卡单位代码',
                        fieldName: 'cardFillingUnitCode',
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
                        labelText: '入档编号',
                        fieldName: 'fileNumber',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '录入日期',
                        fieldName: 'entryDate',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ],
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'select',
                        labelText: '数据级别',
                        fieldName: 'dataLevel',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: 'text2',
                                value: 'text2'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '数据上报日期',
                        fieldName: 'dataReportingDate',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ],
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'select',
                        labelText: '是否返回作修改的数据',
                        fieldName: 'isreturnModifiedData',
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
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank',
                        labelText: '填卡人 ',
                        fieldName: 'cardFiller',
                        slotName: 'cardFiller',
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
                        labelText: '填卡单位',
                        fieldName: 'cardFillingUnitName',
                        slotName: 'cardFillingUnitName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '填卡日期',
                        fieldName: 'cardFilleDate',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ],
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'blank',
                        labelText: '批准人',
                        fieldName: 'approvalBy',
                        slotName: 'approvalBy',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'datetime',
                        labelText: '批准日期',
                        fieldName: 'approvalDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'blank',
                        labelText: '会签人',
                        fieldName: 'coSigner',
                        slotName: 'coSigner',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '问题产品'
                    },
                    {
                        type: 'text',
                        labelText: '产品名称',
                        fieldName: 'questionQualityName',
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
                        labelText: '产品图（代）号',
                        fieldName: 'questionFigureNumber',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '产品编号',
                        fieldName: 'questionQualityNumber',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '设计单位',
                        fieldName: 'questionDesignUnitName',
                        slotName: 'questionDesignUnitName',
                        placeholder: '请选择所属部门',
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
                        labelText: '生产单位',
                        fieldName: 'questionProductionUnitName',
                        slotName: 'questionProductionUnitName',
                        placeholder: '请选择所属部门',
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
                        labelText: '问题产品分类',
                        fieldName: 'questionProductClassifi',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '研制阶段',
                        fieldName: 'questionDevelopmentStage',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        optionUrl: {
                            api: 'thirdPartInterface.getDic',
                            params: { dicType: 'QUALITY_DEVELOPMENT_STAGE' }
                        },
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '出厂日期',
                        fieldName: 'questionProductionDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'blank',
                        labelText: '所属产品'
                    },
                    {
                        type: 'text',
                        labelText: '产品名称',
                        fieldName: 'belongingQualityName',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '产品图号',
                        fieldName: 'belongingFigureNumber',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '产品代号',
                        fieldName: 'belongingQualityCode',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '批次',
                        fieldName: 'belongingBatch',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '产品编号',
                        fieldName: 'belongingQualityNumber',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'select',
                        labelText: '隶属分类',
                        fieldName: 'belongingSubClassification',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: 'text2',
                                value: 'text2'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '所属分系统',
                        fieldName: 'belongingSubSystem',
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
                        labelText: '最终产品'
                    },
                    {
                        type: 'text',
                        labelText: '产品名称',
                        fieldName: 'finalQualityName',
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
                        labelText: '产品图（代）号',
                        fieldName: 'finalFigureNumber',
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
                        labelText: '所属型号',
                        slotName: 'enter-num',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '型号相关信息',
                        slotName: 'other',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '批次',
                        fieldName: 'finalBatch',
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
                        labelText: '产品编号',
                        fieldName: 'finalQualityNumber',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'datetime',
                        labelText: '发现日期',
                        fieldName: 'discoveryDate',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ],
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'blank',
                        labelText: '发现单位',
                        fieldName: 'discoveryUnitName',
                        slotName: 'discoveryUnitName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'number',
                        labelText: '数量',
                        fieldName: 'quantity',
                        colLayout: 'doubleCol',
                        min: 0
                    },
                    {
                        type: 'number',
                        labelText: '损失',
                        fieldName: 'loss',
                        colLayout: 'doubleCol',
                        min: 0
                    },
                    {
                        type: 'number',
                        labelText: '工时（万元）',
                        fieldName: 'workingHours',
                        colLayout: 'doubleCol',
                        min: 0
                    },
                    {
                        type: 'blank',
                        labelText: '责任单位',
                        fieldName: 'responsibleUnitName',
                        slotName: 'responsibleUnitName',
                        placeholder: '请选择所属部门',
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
                        labelText: '院属单位',
                        fieldName: 'affiliatedUnitName',
                        slotName: 'affiliatedUnitName',
                        placeholder: '请选择所属部门',
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
                        labelText: '承制单位',
                        fieldName: 'contractorName',
                        slotName: 'contractorName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'treeSelect',
                        labelText: ' ',
                        fieldName: '',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol',
                        defaultValue: [],
                        disabledValues: ['1'],
                        defaultExpandedKeys: ['1'],
                        treeData: [],
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
                        type: 'select',
                        labelText: '集团内或外配套',
                        fieldName: 'insideOrOutsideGroup',
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
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '发现地点',
                        fieldName: 'detectedPlace',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '故障程度',
                        fieldName: 'faultDegree',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '缺陷程度',
                        fieldName: 'defectDegree',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'radio',
                        labelText: '性质分类',
                        fieldName: 'propertyClassification',
                        options: [
                            { label: '批次', value: '批次' },
                            { label: '非批次', value: '非批次' },
                            { label: '重复', value: '重复' },
                            { label: '初次', value: '初次' },
                            { label: '关联', value: '关联' },
                            { label: '非关联 ', value: '非关联' },
                            { label: '系统', value: '系统' },
                            { label: '偶然', value: '偶然' }
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
                        type: 'select',
                        labelText: '工作状态',
                        fieldName: 'workingCondition',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '问题部位',
                        fieldName: 'problemLocation',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '设计值',
                        fieldName: 'designValue',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'text',
                        labelText: '实测值',
                        fieldName: 'measuredValue',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '质量问题概况',
                        fieldName: 'questionSurvey',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        labelText: '原因分析',
                        fieldName: 'causeAnalysis',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '故障模式',
                        fieldName: 'failureMode',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank',
                        labelText: '原因分类'
                    },
                    {
                        type: 'select',
                        labelText: '一层原因',
                        fieldName: 'causeMainFirst',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '二层原因',
                        fieldName: 'causeMainSecond',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '管理因素分析',
                        fieldName: 'causeMainManage',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '其他主要原因',
                        fieldName: 'causeMainOther',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '次要原因',
                        fieldName: 'causeSecondary',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '其他次要原因',
                        fieldName: 'causeSecondaryOther',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '有效期限',
                        fieldName: 'validityTerm',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'select',
                        labelText: '技术归零',
                        fieldName: 'technologyZero',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '归零报告号',
                        fieldName: 'technologyReportNo',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '归零报告归档单位',
                        fieldName: 'technologyReportUnitName',
                        slotName: 'technologyReportUnitName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        labelText: '管理归零',
                        fieldName: 'manageZero',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'text',
                        labelText: '归零报告号',
                        fieldName: 'manageReportNo',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'blank',
                        labelText: '归零报告归档单位',
                        fieldName: 'manageReportUnitName',
                        slotName: 'manageReportUnitName',
                        placeholder: '请选择所属部门',
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
                        labelText: '问题处理'
                    },
                    {
                        type: 'text',
                        labelText: '处理单号',
                        fieldName: 'processingOrder',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'select',
                        labelText: '问题产品处理方式',
                        fieldName: 'questionTreatmentMethod',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        labelText: '质量问题概况',
                        fieldName: 'questionSurvey',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        labelText: '原因分析',
                        fieldName: 'causeAnalysis',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '纠正措施',
                        fieldName: 'correctiveMeasures',
                        colLayout: 'singleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'blank',
                        labelText: '采取措施单位',
                        fieldName: 'takeStepsUnitName',
                        slotName: 'takeStepsUnitName',
                        placeholder: '请选择所属部门',
                        colLayout: 'doubleCol',
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'datetime',
                        labelText: '归零评审时间',
                        fieldName: 'toZeroReviewDate',
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
                        type: 'select',
                        labelText: '纠正效果',
                        fieldName: 'correctionEffect',
                        placeholder: '',
                        colLayout: 'doubleCol',
                        options: [
                            {
                                label: 'text1',
                                value: 'text1'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ],
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        labelText: '快报备注',
                        fieldName: 'bulletinRemarks',
                        colLayout: 'singleCol'
                    },
                    {
                        type: 'textarea',
                        labelText: '“举一反三”建议',
                        fieldName: 'drawInferencesExplain',
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
                        labelText: '归零状态',
                        fieldName: 'tozeroStatus',
                        options: [
                            { label: '首次发生', value: '首次发生' },
                            { label: '已定位', value: '已定位' },
                            { label: '原因已查清', value: '原因已查清' },
                            { label: '措施已确定', value: '措施已确定' },
                            { label: '已归零', value: '已归零' },
                            { label: '不作问题', value: '不作问题' },
                            { label: '转其他院', value: '转其他院' }
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
                        type: 'text',
                        labelText: '归零情况',
                        fieldName: 'tozeroState',
                        colLayout: 'doubleCol'
                    },
                    {
                        type: 'datetime',
                        labelText: '归零日期',
                        fieldName: 'tozeroDate',
                        colLayout: 'doubleCol',
                        fieldConfig: {
                            'value-format': 'yyyy-MM-dd'
                        }
                    },
                    {
                        type: 'textarea',
                        labelText: '归零进展情况',
                        fieldName: 'tozeroProgress',
                        colLayout: 'singleCol'
                    }
                ],
                formData: {
                    modelCode: '',
                    entityId: '',
                    reviewer: '',
                    approvalBy: '',
                    coSigner: ''
                },
                selectedRows: [],
                selectedRowKeys: [],
                selectType: '1',
                visible: false,
                visibleCardFiller: false,
                visibleApprovalBy: false,
                visibleCoSigner: false,
                visibleCardFillingUnitName: false,
                visibleQuestionDesignUnitName: false,
                visibleQuestionProductionUnitName: false,
                visibleDiscoveryUnitName: false,
                visibleResponsibleUnit: false,
                visibleAffiliatedUnitName: false,
                visibleContractorName: false,
                visibleTakeStepsUnitName: false,
                visibleTechnologyReportUnitName: false,
                visibleManageReportUnitName: false,
                otherParam: {},
                disabledRow: []
            }
        },
        mounted () {
            this.editUI()
            this.getUser()
        },
        methods: {
            rendered () {
                if (this.record && this.record.id) {
                  this.getProblem(this.record.id)
                }
            },
            getProblem (currEntityId) {
                let that = this
                this.$api['tozero.getTozero']({ id: currEntityId }).then(res => {
                    that.fillData(that, res)
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            fillData (that, data) {
                that.formData = data
                that.selectedRows = []
                that.selectedRows.push({
                    id: data.modelInformationId,
                    modelCode: data.modelCode,
                    modelName: data.modelName,
                    classify: data.modelClassifyDisplay
                })
                that.formData = Object.assign({}, that.formData)
            },
            saved (res) {
                this.$emit('saveSuccess', res)
            },
            handleChange (info) {
                console.log(info, 'info')
            },
            showModal () {
                this.visible = true
            },
            closeModal (selectedRow) {
                this.visible = false
                if (selectedRow) {
                    this.selectedRows[0] = selectedRow
                    this.disabledRow = this.selectedRows[0].id
                    if (this.selectedRows.length) {
                        this.formData.modelCode = this.selectedRows[0].modelCode
                        this.formData.modelInformationId = this.selectedRows[0].id
                        /// this.otherParam = { 'modelCode': this.selectedRows[0].id }
                    }
                }
            },
            deleteModel () {
                this.disabledRow = []
                this.selectedRows = []
                this.$refs.form.setFields({ modelCode: '' })
            },
            closeModalCardFiller (selectedRows) {
                this.visibleCardFiller = false
                this.formData.cardFiller = selectedRows[0].realName
                this.formData.cardFillingUnit = selectedRows[0].departmentId
                this.formData = Object.assign({}, this.formData)
            },
            closeModalApprovalBy (selectedRows) {
                this.visibleApprovalBy = false
                this.formData.approvalBy = selectedRows[0].realName
            },
            closeModalCoSigner (selectedRows) {
                this.visibleCoSigner = false
                this.formData.coSigner = selectedRows[0].realName
            },
            getUser () {
                this.formData.cardFiller = this.$store.getters.userName
                this.formData.cardFillingUnit = this.$store.getters.userInfo.departmentId
                this.formData.cardFillingUnitName = this.$store.getters.userInfo.departmentName
            },
            closeVisibleCardFillingUnitName (selectedRows) {
                this.visibleCardFillingUnitName = false
                if (selectedRows) {
                    this.formData.cardFillingUnit = selectedRows.id
                    this.formData.cardFillingUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleQuestionDesignUnitName (selectedRows) {
                this.visibleQuestionDesignUnitName = false
                if (selectedRows) {
                    this.formData.questionDesignUnit = selectedRows.id
                    this.formData.questionDesignUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleQuestionProductionUnitName (selectedRows) {
                this.visibleQuestionProductionUnitName = false
                if (selectedRows) {
                    this.formData.questionProductionUnit = selectedRows.id
                    this.formData.questionProductionUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleDiscoveryUnitName (selectedRows) {
                this.visibleDiscoveryUnitName = false
                if (selectedRows) {
                    this.formData.discoveryUnit = selectedRows.id
                    this.formData.discoveryUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleResponsibleUnit (selectedRows) {
                this.visibleResponsibleUnit = false
                if (selectedRows) {
                    this.formData.responsibleUnit = selectedRows.id
                    this.formData.responsibleUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleAffiliatedUnitName (selectedRows) {
                this.visibleAffiliatedUnitName = false
                if (selectedRows) {
                    this.formData.affiliatedUnit = selectedRows.id
                    this.formData.affiliatedUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleContractorName (selectedRows) {
                this.visibleContractorName = false
                if (selectedRows) {
                    this.formData.contractor = selectedRows.id
                    this.formData.contractorName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleTakeStepsUnitName (selectedRows) {
                this.visibleTakeStepsUnitName = false
                if (selectedRows) {
                    this.formData.takeStepsUnit = selectedRows.id
                    this.formData.takeStepsUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleTechnologyReportUnitName (selectedRows) {
                this.visibleTechnologyReportUnitName = false
                if (selectedRows) {
                    this.formData.technologyReportUnit = selectedRows.id
                    this.formData.technologyReportUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            closeVisibleManageReportUnitName (selectedRows) {
                this.visibleManageReportUnitName = false
                if (selectedRows) {
                    this.formData.manageReportUnit = selectedRows.id
                    this.formData.manageReportUnitName = selectedRows.name
                    this.formData = Object.assign({}, this.formData)
                }
            },
            editUI () {
                document.getElementsByClassName('el-form-item__blank')[0].classList.add('el-labelColor')
                document.getElementsByClassName('el-form-item__blank')[5].classList.add('el-labelColor')
                document.getElementsByClassName('el-form-item__blank')[8].classList.add('el-labelColor')
                document.getElementsByClassName('el-form-item__blank')[9].classList.add('el-labelColor')
                document.getElementsByClassName('el-form-item__blank')[16].classList.add('el-labelColor')
                document.getElementsByClassName('el-form-item__blank')[19].classList.add('el-labelColor')
            }
        }
    }
</script>
<style>
    .el-labelColor{
        background-color: #0070c5;
        color: white;
    }
    .el-labelColor :first-child{
        color: white;
    }
</style>
