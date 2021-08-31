<template>
  <div class="workKeyRisk">
    <form-list class="workKeyRiskForm"
               ref="form"
               :dataSource="dataSource"
               :form="formData"
               :api="saveApi"
               :existDefaultBtn="false"
               @saved="saved"
               labelWidth="130px"
               :isCustomValidate="true"
               @custom-validate="customValidate"
               @rendered="rendered">
    </form-list>
    <common-tabs :tabsData="tabsData"
                 :height="height"
                 @tab-click="tabClick"
                 :activeTabs="activeTabs"
                 style="margin-top: -50px">
      <template #projectBasicInfo>
        <index-whole :third-menu-param="thirdMenuParam" ></index-whole>
      </template>
      <template #tableConfigDetails>
        <editable-table :columns="columns"
                        :params="tableParams"
                        :data="formData.tableData1"
                        @save-param-data="saveTableData">
        </editable-table>
      </template>
      <template #tabelParam>
        <editable-table :columns="paramColumns"
                        :params="paramParams"
                        :data="formData.tableData2"
                        @save-param-data="saveParamData">
        </editable-table>
      </template>
      <template #tabelButton>
        <editable-table :columns="buttonColumns"
                        :params="buttonParams"
                        :data="formData.tableData3"
                        @save-param-data="saveButtonData">
        </editable-table>
      </template>
    </common-tabs>
  </div>
</template>

<script>
import { P8Form as FormList } from '~/index'
import { P8Tabs as CommonTabs } from '~/index'
import { P8EditTable as EditableTable } from '~/index'
import indexWhole from '../../../Em/EntiretyBase/indexWholeDescribeEntry'
export default {
  name: 'TableEdit',
  components: {
    indexWhole,
    FormList,
    CommonTabs,
   /* WholeView, */
    EditableTable
  },
  props: {
    record: {
      type: Object,
      default: () => { }
    },
    currEntityId: {
      type: String,
      default: ''
    },
    tableFlex: {
      type: Number,
      default: 171
    }
  },
  watch: {
    tableFlex: {
      handler (val) {
        this.setTabsHeight()
      },
      immediate: true
    }
  },
  data () {
    const height = document.documentElement.clientHeight - 211
    return {
      visibleResearchViewDrawer: false,
      visibleIntegrationViewDrawer: false,
      visibleTechInnovationViewDrawer: false,
      saveApi: 'MainJobRisk.saveAll',
      dataSource: [
        {
          type: 'view',
          labelText: '前期技术储备情况',
          fieldName: 'content',
          colLayout: 'singleCol'
        }
      ],
      formData: {
        id: '',
        wholeId: '',
        content: '',
        tableData1: [],
        tableData2: [],
        tableData3: [],
        type: ''

      },
      height: height + 'px',
      tabsData: [
        // {
        //   label: '项目基础信息',
        //   name: 'projectBasicInfo',
        //   icon: 'icon-multi-project-manage'
        // },
        // {
        //   label: '关键技术',
        //   name: 'tableConfigDetails',
        //   icon: 'icon-multi-project-manage'
        // },
        // {
        //   label: '工作重点',
        //   name: 'tabelParam',
        //   icon: 'icon-business-execution'
        // },
        // {
        //   label: '主要风险',
        //   name: 'tabelButton',
        //   icon: 'icon-process-template'
        // }
      ],
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '技术内容',
          dataIndex: 'name',
          minWidth: 140,
          default: ''
        }

      ],
      paramColumns: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '工作内容',
          dataIndex: 'name',
          minWidth: 140,
          default: ''
        }

      ],
      buttonColumns: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '风险内容',
          dataIndex: 'name',
          minWidth: 120,
          default: ''
        }
      ],
      tableParams: { wholeId: this.currEntityId, type: '1' },
      paramParams: { wholeId: this.currEntityId, type: '2' },
      buttonParams: { wholeId: this.currEntityId, type: '3' },
      activeTabs: 'projectBasicInfo',
      reportParams1: {
        wholeId: this.currEntityId
      },
      reportParams2: {
        wholeId: this.currEntityId
      },
      reportParams3: {
        wholeId: this.currEntityId
      },
      reportParams4: {
        wholeId: this.currEntityId
      },
      thirdMenuParam: {
        id: this.currEntityId
      },
      oldSqlId: ''
    }
  },
  created () {
    this.viewWholeMenu()
  },
  mounted () {
    this.initListData()
    window.addEventListener('resize', this._initTabsHeight)
  },
  methods: {
    _initTabsHeight () {
      const vm = this
      let timer = null
      if (timer) return
      timer = setTimeout(() => {
        vm.setTabsHeight()
        timer = null
      }, 300)
    },
    setTabsHeight () {
      this.height = document.documentElement.clientHeight - this.tableFlex + 'px'
    },
    initListData () {
      let _this = this
      _this.$api['ProjectApply.functionMenuList']({ type: 'BUTTON', productId: this.currEntityId, parentid: 'YLB01' }).then(function (res) {
        _this.tabsData = res
      })
    },
    viewWholeMenu () {
       let _this = this
      _this.$api['ProjectApply.getOne']({ wholeDescribeId: _this.currEntityId }).then(function (record) {
          _this.thirdMenuParam.planInfoId = record.id
          _this.thirdMenuParam.configId = record.configId
          _this.thirdMenuParam.modifyOrView = 'view'
          _this.thirdMenuParam.emData = {}
          _this.thirdMenuParam.emData.configId = record.configId
          _this.thirdMenuParam.emData.configName = record.configName
          _this.thirdMenuParam.emData.filedId = record.filedId
          _this.thirdMenuParam.emData.sourceId = record.sourceId
          _this.thirdMenuParam.emData.classifyId = record.classifyId
          _this.thirdMenuParam.emData.filedName = record.filedName
          _this.thirdMenuParam.emData.sourceName = record.sourceName
          _this.thirdMenuParam.emData.classifyName = record.classifyName
      })
    },
    rendered () {
      this.getFormData()
    },
    getFormData () {
      let that = this
      this.$api['MainJobRisk.jboRiskList']({ wholeId: this.currEntityId }).then(function (res) {
        let { id, whole, content, mainjobDetailRequests1 = [], mainjobDetailRequests2 = [], mainjobDetailRequests3 = [] } = res
        that.formData = { ...that.formData, id, whole, content, mainjobDetailRequests1, mainjobDetailRequests2, mainjobDetailRequests3 }
        that.formData.tableData1 = mainjobDetailRequests1
        that.formData.tableData2 = mainjobDetailRequests2
        that.formData.tableData3 = mainjobDetailRequests3
      }).catch(function (error) {
        console.log(error)
      })
      this.formData = Object.assign({}, this.record)
    },
    saved (res) {
      this.$emit('saveSuccess', res)
    },
    saveTableData (data) {
      this.reportParams1['mainjobDetailRequests'] = data
    },
    saveParamData (data) {
      this.reportParams2['mainjobDetailRequests'] = data
    },
    saveButtonData (data) {
      this.reportParams3['mainjobDetailRequests'] = data
    },
    customValidate (saveParams) {
      let params = {}
      switch (this.activeTabs) {
        case 'tableConfigDetails':
          params = { ...saveParams, ...this.reportParams1 }
          params.type = '1'
          break
        case 'tabelParam':
          params = { ...saveParams, ...this.reportParams2 }
          params.type = '2'
          break
        case 'tabelButton':
          params = { ...saveParams, ...this.reportParams3 }
          params.type = '3'
          break
        case 'projectBasicInfo':
          params = { ...saveParams, ...this.currEntityId }
          break
      }
      this.$refs.form.submitForm(params, this.saveApi)
    },
    tabClick (target) {
      this.activeTabs = target.name
    }
  }
}
</script>
<style lang="scss" scoped>
  .workKeyRisk{
    height:calc(100% - 50px);
    .workKeyRiskForm.formList.el-form {
      height:110px!important;
      > .el-row.existBtn:first-child{
        height:100%;
      }
    }
    .el-tabs--top{
      height:calc(100% - 88px)!important;
    }
  }
</style>
