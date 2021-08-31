<template>
    <normal-layout>
        <template #north>
            <el-tag style="width:80px" size="medium">统计周期:</el-tag>
            <span>{{startTime}}</span>
            <el-tag style="width:30px" size="medium">~</el-tag>
            <span>{{endTime}}</span>
            <span style="width:20px"></span>
            <el-button type="primary" round>上一周</el-button>
            <el-button type="primary" round>本周</el-button>
            <el-button type="primary" round>下一周</el-button>
            <search-form-list ref="search"
                              :dataSource="dataSource"
                              @search="search"
                              @re-set="reset"></search-form-list>
        </template>
        <template #west>
            <form-list ref="form" :dataSource="westDataSource" :form="formData" :existDefaultBtn="false" labelWidth="auto" @rendered="rendered">
            </form-list>
        </template>
        <template #center>
            <common-table ref="table"
                          :comp="comp"
                          :columns="columns"
                          :params="queryParams"
                          :api="tableApi"
                          @open-third-menu="openThirdMenu">
                <template #name="{scope,thirdMenuData}">
          <span class="underline"
                @click="drillCol(scope,thirdMenuData)">{{ scope.row.name }}</span>
                </template>
            </common-table>
        </template>
        <template #drawer-panel>
            <!--         <common-drawer v-if="visibleResourcesDrawer"-->
            <!--                        :visible="visibleResourcesDrawer"-->
            <!--                        :title="drawerTitle"-->
            <!--                        placement="top"-->
            <!--                        direction="ttb"-->
            <!--                        size="100%"-->
            <!--                        @close="onEditResourcesClose">-->
            <!--             <template #drawer>-->
            <!--                 <menu-layout :third-menu-param='thirdMenuParam'-->
            <!--                              :default-menu="defaultMenu"></menu-layout>-->
            <!--             </template>-->
            <!--         </common-drawer>-->
        </template>
    </normal-layout>
</template>
<script>
    // import Vue from 'vue'
    import { P8NormalLayout as NormalLayout } from '~/index'
    // import { P8MenuLayout as MenuLayout } from '~/index'
    import { P8Table as CommonTable } from '~/index'
    import { P8Form as FormList } from '~/index'
    import { P8Search as SearchFormList } from '~/index'
    import { Tag, Button } from '~/index'
    import Vue from 'vue'
    // import { P8Drawer as CommonDrawer } from '~/index'
    export default {
        name: 'MultiplePlanBoard',
        data () {
            const dataSource = [
                {
                    type: 'datetimeRange',
                    labelText: '统计周期',
                    defaultValue: [],
                    fieldName: 'recordingTime',
                    placeholder: ['开始日期', '结束日期'],
                    fieldConfig: {
                        format: 'yyyy-MM-dd'
                    }
                },
                {
                    type: 'text', // 控件类型
                    labelText: '项目名称', // 控件显示的文本
                    fieldName: 'productName',
                    placeholder: '请输入项目名称'
                },
                {
                    type: 'text', // 控件类型
                    labelText: '项目类型', // 控件显示的文本
                    fieldName: 'pjCode',
                    placeholder: '请输入项目编号', // 默认控件的空值文本
                    fieldEvent: {
                        click: 'clickEvent(this)'
                    }
                },
                {
                    type: 'switch',
                    labelText: '包含产前',
                    fieldName: 'include',
                    defaultValue: '1',
                    colLayout: 'doubleCol'
                },
                {
                    type: 'switch',
                    labelText: '叶子节点',
                    fieldName: 'treeType',
                    defaultValue: '1',
                    colLayout: 'doubleCol'
                }
                // {
                //     type: 'multiple',
                //     optionUrl: {
                //         api: 'thirdPartInterface.getDic',
                //         params: { dicType: 'PROJECT_ORDER' }
                //     },
                //     options: [],
                //     labelText: '项目分级', // 控件显示的文本
                //     fieldName: 'projectOrderId',
                //     placeholder: '选择项目分级'
                // }
            ]
            const columns = [
                {
                    title: '序号',
                    type: 'index',
                    width: 55,
                    align: 'center'
                },
                {
                    title: '#',
                    type: 'index',
                    dataIndex: 'thirdMenu',
                    scopedSlots: { customRender: 'thirdMenu' },
                    width: 45,
                    align: 'center'
                },
                {
                    title: '项目名称',
                    width: 120,
                    align: 'center',
                    dataIndex: 'modelCode'
                },
                {
                    title: '是否有风险',
                    dataIndex: 'pjCode',
                    minWidth: 150,
                    align: 'center'
                },
                {
                    title: '交付进度',
                    dataIndex: 'name',
                    minWidth: 300,
                    align: 'left',
                    scopedSlots: { customRender: 'custom' }
                },
                {
                    title: '项目成本',
                    width: 180,
                    align: 'center',
                    dataIndex: 'kprojectClassifyname'
                },
                {
                    title: '策划阶段',
                    width: 120,
                    align: 'center',
                    dataIndex: 'projectOrderDisplay'
                },
                {
                    title: '方案阶段',
                    minWidth: 180,
                    align: 'center',
                    dataIndex: 'departmentName'
                },
                {
                    title: '工程设计阶段',
                    width: 120,
                    align: 'center',
                    dataIndex: 'statusDisplay'
                }
            ]
            const westDataSource = [
                {
                    type: 'view',
                    labelText: '项目个数:',
                    fieldName: 'numOfPro',
                    colLayout: 'singleCol'
                },
                {
                    type: 'view',
                    labelText: '本月计划完成任务数:',
                    fieldName: 'numOfPlanTask',
                    colLayout: 'singleCol'
                },
                {
                    type: 'view',
                    labelText: '本月实际完成任务数:',
                    fieldName: 'numOfFinishTask',
                    colLayout: 'singleCol'
                },
                {
                    type: 'blank',
                    labelText: '上周完成率:',
                    slotName: 'status',
                    colLayout: 'singleCol'
                },
                {
                    type: 'view',
                    labelText: '本月完成率:',
                    fieldName: 'duration',
                    colLayout: 'singleCol'
                },
                {
                    type: 'blank',
                    labelText: '累计完成率:',
                    slotName: 'durationDay',
                    colLayout: 'singleCol'
                }
            ]
            return {
                api: '',
                comp: this,
                columns,
                dataSource,
                westDataSource,
                queryParams: {},
                tableApi: 'ProjectApply.resourceManagerList',
                visibleResourcesDrawer: false,
                defaultMenu: {},
                thirdMenuParam: {},
                startTime: '2020-11-16',
                endTime: '2020-11-22',
                formData: {}
            }
        },
        components: {
            NormalLayout,
            SearchFormList,
            // MenuLayout,
            CommonTable,
            FormList,
            'el-tag': Tag,
            'el-button': Button
            // CommonDrawer
        },
        methods: {
            rendered () {
                if (this.api) {
                    this.getTaskInfo()
                }
            },
            getTaskInfo () {
                let _this = this
                this.$api[this.api]({ taskId: _this.getPlanInfo().taskId }).then(res => {
                    _this.rendFormData(res)
                })
            },
            rendFormData (res) {
                Object.keys(this.formData).forEach(key => {
                    if (key === 'forecastDate') {
                        this.formData.forecastDate = res.forecastBeginDate + '~' + res.forecastEndDate
                        this.formData.forecastBeginDate = res.forecastBeginDate
                        this.formData.forecastEndDate = res.forecastEndDate
                    } else if (key === 'planDate') {
                        this.formData.planDate = res.planBeginDate + '~' + res.planEndDate
                        this.formData.planBeginDate = res.planBeginDate
                        this.formData.planEndDate = res.planEndDate
                    } else if (key === 'realDate') {
                        this.formData.realDate = `${res.realBeginDate || ''}~${res.realEndDate || ''}`
                        this.formData.realBeginDate = res.realBeginDate
                        this.formData.realEndDate = res.realEndDate
                    } else if (key === 'dateline') {
                        this.$set(this.formData, 'dateline', this.datelineHandle())
                    } else if (key === 'progress') {
                        this.formData[key] = Number((res[key] * 100).toFixed(0))
                    } else {
                        this.formData[key] = res[key]
                    }
                })
            },
            openThirdMenu (record, item) {
                this.visibleResourcesDrawer = true
                this.defaultMenu = item
                this.thirdMenuParam.id = record.id
            },
            search (param) {
                let newParams = { ...this.queryParams, ...param }
                this.queryParams = newParams
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            },
            reset () {
                let that = this
                Object.keys(that.queryParams).forEach(key => {
                    return (that.queryParams[key] = null)
                })
                this.queryParams.layersParams = Object.assign({}, this.layersParams)
                Vue.nextTick(function () {
                    that.$refs.table.searchData()
                })
            }
        }
    }
</script>

<style scoped>

</style>
