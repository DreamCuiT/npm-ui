<template>
    <list-layout>
      <template #north>
                  <el-button type="primary" @click="setTaskRules">设置规则</el-button>
        <search-form-list ref="search"
                          :dataSource="searchData"
                          @search="search"
                          @re-set="reSet"></search-form-list>
      </template>
        <template #center>
          <div id="table-contain">
            <common-table ref="table"
                          :flex="214"
                          :columns="columns"
                          :table-Refresh="tableRefresh"
                          :params="queryParam"
                          :api="tableApi"
                          :comp="comp"
                          :pagination="true">

              <template #planCount="{scope}">
                <span :class="classSettings(scope.row.planCount)"
                      @click="test(scope.row,'planCount' ,'计划项')">{{ scope.row.planCount }}</span>
              </template>
              <template #planOnTimeFinishedCount="{scope}">
                <span :class="classSettings(scope.row.planOnTimeFinishedCount)"
                      @click="test(scope.row,'normalFinish', '按时完成数')">{{ scope.row.planOnTimeFinishedCount }}</span>
              </template>
              <template #planUnFinishedOnTimeCount="{scope}">
                              <span :class="classSettings(scope.row.planUnFinishedOnTimeCount)"
                                    @click="test(scope.row,'planUnFinishedCount', '未按时完成数')">{{ scope.row.planUnFinishedOnTimeCount }}</span>
               </template>
                <template #finishRangeCount="{scope}">
                              <span :class="classSettings(scope.row.finishRangeCount)"
                                    @click="test(scope.row,'finishRangeCount', '统计周期内计划完成数')">{{ scope.row.finishRangeCount }}</span>
               </template>
                <template #unFinishRangeCount="{scope}">
                              <span :class="classSettings(scope.row.unFinishRangeCount)"
                                    @click="test(scope.row,'unFinishedCount', '统计周期内计划未完成数')">{{ scope.row.unFinishRangeCount }}</span>
               </template>
                <template #firstDeviation1Plan="{scope}">
                              <span  :class="classSettings(scope.row.firstDeviation1Plan)"
                                    @click="test(scope.row,'firstDeviation1Plan', '超期1个月之内未完成计划数')">{{ scope.row.firstDeviation1Plan }}</span>
               </template>
                <template #twoDeviation2Plan="{scope}">
                              <span :class="classSettings(scope.row.twoDeviation2Plan)"
                                    @click="test(scope.row,'twoDeviation2Plan', '超期1～2个月未完成计划数')">{{ scope.row.twoDeviation2Plan }}</span>
               </template>
               <template #threeDeviation3Plan="{scope}">
                              <span :class="classSettings(scope.row.threeDeviation3Plan)"
                                    @click="test(scope.row,'threeDeviation3Plan', '超期2～3个月未完成计划数')">{{ scope.row.threeDeviation3Plan }}</span>
               </template>
                <template #fourDeviation4Plan="{scope}">
                              <span :class="classSettings(scope.row.fourDeviation4Plan)"
                                    @click="test(scope.row,'fourDeviation4Plan', '超期3个月以上未完成计划数')">{{ scope.row.fourDeviation4Plan }}</span>
               </template>
            </common-table>
          </div>
              <completionSub v-if="visibleRules" :visibleRules="visibleRules"   @close="onRulesClose" :rulesTitle="rulesTitle"></completionSub>
        </template>
    </list-layout>
</template>
<script>
import Vue from 'vue'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import completionSub from './completionSub'
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import { Button } from '~/index'
const columns = [
  {
    title: '序号',
    type: 'index',
    width: 50,
    align: 'center'
  },
  {
    title: '部门名称',
    dataIndex: 'deptName',
    align: 'center',
    width: 200
  },
  {
    title: '1月-11月计划数',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'planCount',
    align: 'left',
    minWidth: 200

  },
  {
    title: '1月-11月按时完成数',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'planOnTimeFinishedCount',
    align: 'left',
    minWidth: 200
  },
  {
    title: '1月-11月未按时完成数',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'planUnFinishedOnTimeCount',
    align: 'left',
    minWidth: 200
  },
   {
    title: '1月-11月按时完成率（%）',
    dataIndex: 'fulFillMent',
    align: 'left',
    minWidth: 200
  },

   {
    title: '1月-11月统计周期内计划完成数',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'finishRangeCount',
    align: 'left',
    minWidth: 200
  },
   {
    title: '1月-11月统计周期内计划未完成数',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'unFinishRangeCount',
    align: 'left',
    minWidth: 200
  },
   {
    title: '超期1个月之内未完成计划数',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'firstDeviation1Plan',
    align: 'left',
    minWidth: 200
  },
  {
    title: '超期1～2个月未完成计划数',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'twoDeviation2Plan',
    align: 'left',
    minWidth: 200
  },
  {
    title: '超期2～3个月未完成计划数',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'threeDeviation3Plan',
    align: 'left',
    minWidth: 200
  },
   {
    title: '超期3个月以上未完成计划数',
    scopedSlots: { customRender: 'custom' },
    dataIndex: 'fourDeviation4Plan',
    align: 'left',
    minWidth: 200
  }

]
export default {
  name: 'deptCompletionRate',
  components: {
    ListLayout,
    CommonTable,
      // eslint-disable-next-line vue/no-unused-components
    CommonButton,
    SearchFormList,
      // eslint-disable-next-line vue/no-unused-components
    CommonDrawer,
    'el-button': Button,
    completionSub

  },
  created: function () {
    // this.$api['planCompletionRate.getDefaultRangeTime']().then(function (res) {
    //         console.log(res, 'res222222222222')
    //         if (res) {
    //         }
    //       })

  },
    data () {
    return {
      rulesTitle: '',
      comp: this,
      visibleRules: false,
      queryParam: {},
      tableApi: 'planCompletionRate.planCompletionRateList',
      columns: columns,
      tableHeight: 1,
      searchData: [
        {
                  type: 'datetimeRange',
                  labelText: '计划完成时间',
                  fieldName: 'beginEndTime',
                  defaultValue: [],
                  placeholder: ['开始日期', '结束日期'],
                  fieldConfig: {
                      'value-format': 'yyyy-MM-dd',
                      format: 'YYYY-MM-dd'
                  }
       },
        {
          type: 'select',
          defaultValue: [],
          labelText: '计划标识',
          fieldName: 'isMonitorPointList',
          placeholder: '选择计划标识',
          optionUrl: {
          api: 'planCompletionRate.baseMointPointList',
          label: 'name',
          value: 'id',
          params: {}
          },
          treeData: [],
          fieldConfig: {
          multiple: true
          }
        },
        {
          type: 'text',
          labelText: '项目名称',
          fieldName: 'productName',
          defaultValue: '',
          placeholder: '请输入项目名称'
         },
         {
          type: 'text',
          labelText: '计划名称',
          fieldName: 'planName',
          defaultValue: '',
          placeholder: '请输入计划名称'
         },
            {
          type: 'select',
          labelText: '是否院所计划',
          fieldName: 'isInstitution',
          placeholder: '选择是否院所计划',
          multiple: false,
          // defaultValue:'0',
          optionUrl: {
            api: 'planCompletionRate.hospitalLevelList',
            label: 'name',
            value: 'id',
            params: {},
            defaultValue: '0'
          },
          treeData: []
        },
        {
                type: 'select',
                defaultValue: [],
                labelText: '计划类型',
                fieldName: 'planTypeList',
                placeholder: '选择计划类型',
                optionUrl: {
                api: 'baseData.filterListData',
                 label: 'meaning',
                 value: 'id',
                params: {
                    dicType: 'ACTIVITY_TYPE'
                }
                },
                treeData: [],
                fieldConfig: {
                multiple: true
                }
        },

        {
                type: 'select',
                defaultValue: [],
                labelText: '领域',
                fieldName: 'classifyList',
                placeholder: '选择领域',
                optionUrl: {
                api: 'baseData.filterListData',
                 label: 'meaning',
                 value: 'id',
                params: {
                      dicType: 'OWNER_TYPE'
                }
                },
                treeData: [],
                fieldConfig: {
                multiple: true
                }
          },
         {
          type: 'treeSelect',
          labelText: '项目类型',
          fieldName: 'projectClassifyIdList',
          placeholder: '请选择项目类型',
          multiple: true,
           defaultValue: [],
          optionUrl: {
            api: 'ProjectApply.projectClassifyTree',
            params: {},
            label: 'label',
            value: 'id'
          },
          treeData: []
        },
        // {
        //   type: 'multiple', // 控件类型
        //   labelText: '项目分级', // 控件显示的文本
        //   fieldName: 'projectOrderIdList',
        //   placeholder: '请选择项目分级',
        //    defaultValue: [],
        //   optionUrl: {
        //     api: 'thirdPartInterface.getDic',
        //     params: { dicType: 'PROJECT_ORDER' }
        //   },
        //   options: []
        // },
        {
          type: 'select',
          labelText: '所属型号',
          fieldName: 'modelCodeList',
          placeholder: '选择所属型号',
           defaultValue: [],
          optionUrl: {
            api: 'ProjectApply.getModelListData',
            label: 'modelName',
            value: 'id',
            params: {}
          },
          treeData: [],
          fieldConfig: {
              multiple: true
            }
        }
      ]
    }
  },
    mounted () {

  },
    methods: {
      classSettings (val) { // 下滑线样式设置
        let result = ''
        if (val > 0) {
            result = 'number-click'
        }
        // console.log(result,'-------------我的值')
        return result
      },

    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    search (param) {
      let newParams = { ...param }
      this.queryParam = newParams
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reSet () {
      let that = this
      Object.keys(that.queryParam).forEach(key => {
        console.log(key, '--------我的key值')
          // eslint-disable-next-line eqeqeq
        if (key == 'beginEndTime') {
          that.queryParam[key] = []
        } else {
           that.queryParam[key] = ''
        }
        })
      // console.log(that.queryParam,'-----------我的参数')
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    test (row, type, title) {
      this.rulesTitle = '查看' + row.deptName + title
      // this.deptId = row.unitId ? row.unitId : ''
      // let types = []
      // console.log(type, '查看type的构建参数')
      // if (type) {
      //   types.push(type)
      // } else {
      //   types.push('')
      // }
      // this.planType = types
      // console.log(this.rulesTitle, this.deptId, this.planType, '构建请求参数！')
    },
     setTaskRules () { // 规则设置项
        this.rulesTitle = '新建统计规则'
        this.visibleRules = true
        console.log(this.visibleRules, '--------我的值')
    },
    onRulesClose () {
      this.visibleRules = false
    }
  }
}
</script>
<style scoped>
.number-click {
  text-decoration: underline;
  cursor: pointer;
}
</style>
