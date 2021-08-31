<template>
  <div style="height: 100%;">
    <div class='couerDivClass'
         id='couerDiv'>
      <div class='top' :style="{height:changeInfoHeight}">
        <form-list
            ref='form'
            @rendered='rendered'
            :form='formData'
            :dataSource='dataSource'
            :api='saveApi'
            :exist-default-btn="existDefaultBtn"
            :exist-custom-btn="existCustomBtn"
            :other-param='otherParam'
        >
          <template #weatherChange>
            <el-select v-model="formData.weatherChange" placeholder="请选择是否产生变更记录" @change="selectChange">
              <el-option
                  v-for="item in optionsW"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </template>
        </form-list>
      </div>
      <div class='bottom' :class="{'expandBottom':changeInfoHeight === '40px'}">
        <impact-analysis v-if="hasPlanInfoId" :plan-info-id="planInfoId" :create-page="createPage" :read-only="readOnlyVisible" :change-id="approveContentView.changeId"></impact-analysis>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .couerDivClass{
    height: calc(100% - 2px)!important;
    padding-top:1px;
    box-sizing: border-box;
    overflow:scroll;
    overflow-x:hidden;
    overflow-y:hidden;
    z-index:2!important;
  }
  .top {
    position: relative;
    margin-bottom:8px;
    background:$base-white-color;
    border:1px solid $base-line-color;
    border-radius: 6px;
    overflow:hidden;
  }
  .bottom {
    height:calc(100% - 250px);
    position: relative;
    border:1px solid $base-line-color;
    border-radius:6px;
    box-shadow:5px 5px 13px $base-bg-shadow;
    background:$base-white-color;
    overflow:hidden;
  }
</style>
<script>
import { Select, Option } from '~/index'
import { P8Form as FormList } from '~/index'
import ImpactAnalysis from './impactAnalysis'
export default {
  name: 'submitChange',
  components: {
    FormList,
    'el-select': Select,
    'el-option': Option,
    ImpactAnalysis
  },
  props: {
    approveContentView: {
      type: Object,
      default: null
    }
    // ,
    // planInfoId: {
    //   type: String,
    //   default: null
    // },
    // createPage: {
    //   type: String,
    //   default: null
    // }
  },
  data () {
    return {
      saveApi: 'planChange.changeRecordInfoUpdateType',
      isCustomValidate: true,
      title: '计划变更提交',
      readOnlyVisible: true,
      existDefaultBtn: false,
      hasPlanInfoId: false,
      createPage: 'planChange',
      planInfoId: '',
      changeInfoHeight: '250px',
      existCustomBtn: true,
      dialogConfig: {
        modal: false
      },
      optionsW: [
        { 'label': '是', 'value': '0' },
        { 'label': '否', 'value': '1' }
      ],
      dataSource: [
        {
          type: 'view',
          labelText: '变更原因分类',
          fieldName: 'changeType',
          colLayout: 'singleCol',
          placeholder: '选择变更原因分类',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'ADJUST_ClASSIFY' },
            label: 'label',
            value: 'value'
          },
          rules: [
            {
              required: true,
              message: '必填'
            }
          ],
          options: []
        },
        {
          labelText: '变更原因',
          type: 'view',
          fieldName: 'reason',
          placeholder: '请输入活动描述',
          colLayout: 'singleCol',
          fieldConfig: {
            rows: '6'
          },
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          labelText: '影响分析',
          type: 'view',
          fieldName: 'measure',
          placeholder: '请输入活动描述',
          colLayout: 'singleCol',
          fieldConfig: {
            rows: '6'
          }
        },
        {
          labelText: '产生变更记录',
          type: 'blank',
          slotName: 'weatherChange',
          colLayout: 'singleCol'
        }
      ],
      modify: {},
      otherParam: {
        id: ''
      },
      formData: {}
    }
  },
  watch: {
    planInfoId: function (newVal) {
      if (newVal) {
        this.hasPlanInfoId = true
      }
    }
  },
  methods: {
    rendered () {
      let that = this
      console.log(that.approveContentView.changeId, '22222222222222')
      if (that.approveContentView.changeId) {
        this.$api['planChange.changeRecordInfo']({ id: that.approveContentView.changeId }).then(function (res) {
          if (res) {
            that.formData.changeType = res.changeType
            that.formData.reason = res.reason
            that.formData.measure = res.measure
            that.formData.id = that.approveContentView.changeId
            that.formData.weatherChange = res.weatherChange
            that.formData.planInfoId = res.planInfoId
            that.planInfoId = res.planInfoId
            that.formData = Object.assign({}, that.formData)
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    selectChange () {
      this.$refs.form.submitForm(this.formData, this.saveApi)
    }
  }
}
</script>
