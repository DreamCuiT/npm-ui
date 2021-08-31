<template>
  <div>
    <form-list
      ref='form'
      @rendered='rendered'
      @saved='saved'
      :form='formData'
      :dataSource='dataSource'
      :is-custom-validate='isCustomValidate'
      @custom-validate='customValidate'
      :api='saveApi'
      :other-param='otherParam'
    >
<!--      <template #projectName>-->
<!--        <el-input v-model='formData["projectName"]'-->
<!--                  readonly-->
<!--                  autosize-->
<!--                  placeholder="请选择项目"-->
<!--                  v-on:click.native="showModal()">-->
<!--          <i v-if='selectedRow'-->
<!--             class='el-icon-link'-->
<!--             slot='suffix'-->
<!--             type='link'-->
<!--             :style='{cursor: "pointer", fontSize: "16px", color: "#08c" }'></i>-->
<!--        </el-input>-->
<!--      </template>-->
      <template #projectName>
        <div :style="{height:setUserHeight, overflowY: 'auto'}">
          <ul class="userList">
            <li>
              <el-button class="selectedBtn" type="link" size="small" icon="user-add" @click="showModal()">请选择项目</el-button>
            </li>
            <li v-for="item in selectedData.userList" :key="item.id">
              <span>{{item.name}} [ {{item.pjCode}} ]</span>
              <i class="el-icon-circle-close" @click="deleteUser(item.id)"></i>
            </li>
          </ul>
        </div>
      </template>
    </form-list>
    <select-project v-if='selectProjectVisible' :selected-row='selectedRow' :visible='selectProjectVisible' @close-modal='closeModal'></select-project>
  </div>
</template>
<style lang="scss" scoped>
  .userList{
    background:#ffffff;
    overflow:hidden;
  }
  .userList li{
    float:left;
    /* padding:5px 10px;*/
    margin:5px;
    border-radius:3px;
    /*border:1px solid #1890FF;*/
    border:1px solid #E8E8E8;
  }
  .userList li:first-child{
    border:none;
    padding:0px;
  }
  .userList li:first-child .selectedBtn{
    border:1px dashed #1890FF;
    height:29px;
  }
  /deep/ .el-tabs__nav-wrap{
    margin-bottom:0;
  }
</style>
<script>
import { P8Form as FormList } from '~/index'
import SelectProject from './selectProject'
export default {
  name: 'EditDuty',
  components: {
    FormList,
    SelectProject
  },
  props: {
    planInfoId: String
  },
  data () {
    return {
      setUserHeight: document.documentElement.clientHeight - 650 + 'px',
      saveApi: 'DutyToken.saveDuty',
      selectProjectVisible: false,
      labelWidth: 'auto',
      isCustomValidate: true,
      selectedRow: [],
      selectedData: {
        resourceList: [],
        userList: [],
        appList: []
      },
      dataSource: [
        {
          type: 'text',
          labelText: '责任令组名称',
         // slotName: 'select-project',
          fieldName: 'name',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '请选择项目' }]
        },
        {
          type: 'text',
          labelText: '责任令组简称',
          fieldName: 'short_name',
          colLayout: 'singleCol',
          fieldConfig: {

          }
        },
        {
          type: 'blank',
          labelText: '关联项目',
          slotName: 'projectName',
          fieldName: 'projectName',
          colLayout: 'singleCol'
        },
        {
          type: 'select',
          labelText: '年度',
          fieldName: 'year',
          optionUrl: {
            api: 'thirdPartInterface.getYear'
          },
          colLayout: 'singleCol',
          rules: [{ required: true, message: '请填写年度' }]
        },
        {
          type: 'number',
          labelText: '排序号',
          fieldName: 'index_no',
          colLayout: 'singleCol'
        }
      ],
      modify: {},
      otherParam: {},
      formData: {
        sysuserIds: [],
        wholeIds: []
      }
    }
  },
  methods: {
    rendered () {
      let that = this
      if (that.planInfoId) {
        this.$api['DutyToken.editDuty']({ id: that.planInfoId }).then(function (res) {
          console.log(res, '获取单独责任令数据！')
          if (res) {
            that.formData.id = res.id
            that.formData.createUserId = res.createUserId
            that.formData.year = res.year
            that.formData.name = res.name
            that.formData.projectName = res.planName
            // 关联项目选项为添加数据返回数据为null,这里编辑数组的时候处理null值
            that.selectedData.userList.push(...(res.planList || []))
            let idArr = (res.planList || []).map(v => { return v.id })
            that.formData.sysuserIds.push(...idArr)
            that.otherParam = { wholeDescribeId: that.formData.sysuserIds.join() }

            that.formData.short_name = res.short_name
            that.formData.index_no = res.index_no
            that.formData = Object.assign({}, that.formData)
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    showModal () {
      this.selectProjectVisible = true
    },
    closeModal (selectedRow) {
      console.log(selectedRow, '责任令组，查看选择项目！')
      this.selectProjectVisible = false
        this.selectedData.userList.push(...selectedRow)
        let idArr = selectedRow.map(v => { return v.id })
        this.formData.sysuserIds.push(...idArr)
        this.otherParam = { wholeDescribeId: this.formData.sysuserIds.join() }
        this.selectedRow = this.formData.sysuserIds
        // this.$api['planInfoManager.getWholeDescribeById']({ wholeDescribeId: that.selectedRow.id }).then(function (res) {
        //   if (res) {
        //     console.log(res, '查看选择项目信息！')
        //     that.formData.projectName = res.name
        //     that.formData.planCode = res.planCode
        //     that.formData.planName = res.name + '的计划'
        //     that.formData.indexNo = res.indexNo
        //     that.formData.beginEndTime = [res.pBeginTime, res.pEndTime]
        //     that.formData.forecastTime = [res.FBeginTime, res.FEndTime]
        //     // that.otherParam = { wholeDescribeId: that.selectedRow.id }
        //     that.formData = Object.assign({}, that.formData)
        //   }
        // }).catch(function (error) {
        //   console.log(error)
        // })
    },
    customValidate (saveParams) {
      this.$api['DutyToken.checkOnly']({
        name: saveParams.name,
        year: saveParams.year,
        flag: 'update'
      }).then(response => {
        if (response) {
          this.$message({
            type: 'error',
            message: '保存失败，该年度已有此责任令组！'
          })
        } else {
          this.$refs.form.submitForm(saveParams, this.saveApi)
        }
      })
    },
    clickEvent () {
      console.log('click')
    },
    saved (res) {
      this.$emit('save-success', res)
    },
    deleteUser (id) {
      this.formData.sysuserIds.splice(this.formData.sysuserIds.findIndex(v => v === id), 1)
      // this.otherParam.sysuserIds.splice(this.otherParam.sysuserIds.findIndex(v => v === id), 1)
      this.selectedData.userList.splice(this.selectedData.userList.findIndex(v => v.id === id), 1)
      // this.selectedRows.splice（(this.selectedRows.findIndex(v => v.id === id), 1)
      this.otherParam = { wholeDescribeId: this.formData.sysuserIds.join() }
        this.selectedRow = this.formData.sysuserIds
    }
  }
}
</script>
