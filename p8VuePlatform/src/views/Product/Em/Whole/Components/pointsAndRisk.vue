<template>
  <div class="workKeyRisk">
    <form-list class="workKeyRiskForm" ref="form"
               :dataSource="dataSource"
               :form="formData"
               :api="saveApi"
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
                        :addRow="true"
                        :data="formData.tableData1"
                        @save-param-data="saveTableData">
          <template #name="{scope, data}">
            <el-input v-model="scope.row.name"
                      @blur="saveTableData(data)"></el-input>
          </template>
        </editable-table>
      </template>
      <template #tabelParam>
        <editable-table :columns="paramColumns"
                        :addRow="true"
                        :params="paramParams"
                        :data="formData.tableData2"
                        @save-param-data="saveParamData">
          <template #name="{scope, data}">
            <el-input v-model="scope.row.name"
                      @blur="saveParamData(data)"></el-input>
          </template>
        </editable-table>
      </template>
      <template #tabelButton>
        <editable-table :columns="buttonColumns"
                        :addRow="true"
                        :params="buttonParams"
                        :data="formData.tableData3"
                        @save-param-data="saveButtonData">
          <template #name="{scope, data}">
            <el-input v-model="scope.row.name"
                      @blur="saveButtonData(data)"></el-input>
          </template>
        </editable-table>
      </template>
    </common-tabs>
  </div>
</template>

<script>
import { Input } from '~/index'
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
    EditableTable,
 //   WholeView,
    'el-input': Input
  },
  props: {
    record: {
      type: Object,
      default: () => { }
    },
    whoData: {
      type: Object,
      default: () => { }
    },
    currEntityId: {
      type: String,
      default: ''
    },
    tableFlex: {
      type: Number,
      default: 210
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
    // const height = document.documentElement.clientHeight - 171
    return {
      saveApi: 'MainJobRisk.saveAll',
      dataSource: [
        {
          type: 'textarea',
          labelText: '前期技术储备情况',
          fieldName: 'content',
          placeholder: '请填写前期技术储备情况',
          colLayout: 'singleCol',
          rules: [
            {
              required: true
            }
          ]
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
      height: 0,
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
          default: '',
          scopedSlots: { customRender: 'custom' }
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
          default: '',
          scopedSlots: { customRender: 'custom' }
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
          default: '',
          scopedSlots: { customRender: 'custom' }
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
      thirdMenuParam: {
        id: this.currEntityId
      },
      oldSqlId: '',
      contentSave: ''
    }
  },
  created () {
    this.viewWholeMenu(this.whoData)
  },
  mounted () {
    this.initListData()
    window.addEventListener('resize', this._initTabsHeight)
  },
  destroyed () {
    window.removeEventListener('resize', this._initTableSize)
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
    viewWholeMenu (record) {
      this.thirdMenuParam.planInfoId = record.id
      this.thirdMenuParam.configId = record.configId
      this.thirdMenuParam.modifyOrView = 'view'
      this.thirdMenuParam.emData = {}
      this.thirdMenuParam.emData.configId = record.configId
      this.thirdMenuParam.emData.configName = record.configName
      this.thirdMenuParam.emData.filedId = record.filedId
      this.thirdMenuParam.emData.sourceId = record.sourceId
      this.thirdMenuParam.emData.classifyId = record.classifyId
      this.thirdMenuParam.emData.filedName = record.filedName
      this.thirdMenuParam.emData.sourceName = record.sourceName
      this.thirdMenuParam.emData.classifyName = record.classifyName
    },
    rendered () {
      this.getFormData()
    },
    getFormData () {
      let that = this

      let contentSave = that.formData.content

      this.$api['MainJobRisk.jboRiskList']({ wholeId: this.currEntityId }).then(function (res) {
        // let { content, mainjobDetailRequests1 = [], mainjobDetailRequests2 = [], mainjobDetailRequests3 = [] } = res
        // that.formData = { ...that.formData, content, mainjobDetailRequests1, mainjobDetailRequests2, mainjobDetailRequests3 }
        that.formData.id = res.id
         if (contentSave.length === 0) {
             that.formData.content = res.content
         } else {
             that.formData.content = contentSave
         }
        that.formData.tableData1 = res.mainjobDetailRequests1
        that.formData.tableData2 = res.mainjobDetailRequests2
        that.formData.tableData3 = res.mainjobDetailRequests3
        that.formData = Object.assign({}, that.formData)
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
          params = { ...saveParams, ...this.reportParams3 }
          break
      }
      this.$refs.form.submitForm(params, this.saveApi)
    },
    tabClick (target) {
      this.getFormData()
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
