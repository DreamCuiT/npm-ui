<template>
  <div>
    <form-list ref="form"
               @rendered="rendered"
               @saved="saved"
               :dataSource="dataSource"
               :api="saveApi"
               :labelWidth="labelWidth"
               :is-custom-validate="isCustomValidate"
               @custom-validate="customValidate"
               :form="formData">
      <template #revenueModelName>
        <el-input size="mini"
                  readonly
                  autosize
                  placeholder="请选择经费预算计划模版"
                  v-model="formData.revenueModelName"
                  @click.native="modelVisible=true">
          <i class='el-icon-link'
             slot='suffix'
             type='link'
             :style='{ fontSize: "16px", color: "#08c" }'></i>
        </el-input>
      </template>
      <template #comeUser>
        <div>
          <el-main>
            <ul class="userList">
              <li>
                <el-button class="selectedBtn"
                           type="link"
                           size="small"
                           icon="user-add"
                           @click="showModal('comeUser')">选择人员</el-button>
              </li>
              <li v-for="item in selectedData.comeUserList"
                  :key="item.id">
                <span>{{item.realName}} [ {{item.departmentName}} ]</span>
                <i class="el-icon-circle-close"
                   @click="deleteUser(item.id,'comeUser')"></i>
              </li>
            </ul>
          </el-main>
        </div>
      </template>
      <template #secondUser>
        <div>
          <el-main>
            <ul class="userList">
              <li>
                <el-button class="selectedBtn"
                           type="link"
                           size="small"
                           icon="user-add"
                           @click="showModal('secondUser')">选择人员</el-button>
              </li>
              <li v-for="item in selectedData.secondUserList"
                  :key="item.id">
                <span>{{item.realName}} [ {{item.departmentName}} ]</span>
                <i class="el-icon-circle-close"
                   @click="deleteUser(item.id,'secondUser')"></i>
              </li>
            </ul>
          </el-main>
        </div>
      </template>
      <template #firstUser>
        <div>
          <el-main>
            <ul class="userList">
              <li>
                <el-button class="selectedBtn"
                           type="link"
                           size="small"
                           icon="user-add"
                           @click="showModal('firstUser')">选择人员</el-button>
              </li>
              <li v-for="item in selectedData.firstUserList"
                  :key="item.id">
                <span>{{item.realName}} [ {{item.departmentName}} ]</span>
                <i class="el-icon-circle-close"
                   @click="deleteUser(item.id,'firstUser')"></i>
              </li>
            </ul>
          </el-main>
        </div>
      </template>
      <template #applyUser>
        <div>
          <el-main>
            <ul class="userList">
              <li>
                <el-button class="selectedBtn"
                           type="link"
                           size="small"
                           icon="user-add"
                           @click="showModal('applyUser')">选择人员</el-button>
              </li>
              <li v-for="item in selectedData.applyUserList"
                  :key="item.id">
                <span>{{item.realName}} [ {{item.departmentName}} ]</span>
                <i class="el-icon-circle-close"
                   @click="deleteUser(item.id,'applyUser')"></i>
              </li>
            </ul>
          </el-main>
        </div>
      </template>
    </form-list>

    <select-revenue-model v-if="modelVisible"
                          :visible="modelVisible"
                          @close-modal="closeRevenueModel"
                          :disabled-row="disabledRow"></select-revenue-model>
    <select-user v-if="visible"
                 :visible="visible"
                 @close-dialog="closeModal"
                 :otherParam="otherParam"
                 :disabled-row="formData.tempUserList"></select-user>

  </div>
</template>
<style scoped>
.userList {
  background: #ffffff;
  overflow: hidden;
}
.userList li {
  float: left;
  padding: 0px 10px;
  margin: 5px;
  border-radius: 3px;
  /*border:1px solid #1890FF;*/
  border: 1px solid #e8e8e8;
}
.userList li i {
  font-size: 15px;
  margin-left: 10px;
  cursor: pointer;
}
.userList li:first-child {
  border: none;
  padding: 0px;
}
.userList li:first-child .selectedBtn {
  border: 2px dashed #1890ff;
  height: 32px;
}
</style>
<script>
import { Main, Button, Input } from '~/index'
import { P8Form as FormList } from '~/index'
import { P8SelectUser as SelectUser } from '~/index'
import SelectRevenueModel from '@/views/Product/Em/EntiretyBase/Components/SelectModel'
export default {
  name: 'RevenueFullBudgetEdit',
  components: {
    FormList,
    'el-main': Main,
    'el-button': Button,
    'el-input': Input,
    SelectRevenueModel,
    SelectUser
  },
  props: {
    thirdMenuParam: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      saveApi: 'revenueUser.saveUserConfig',
      visible: false,
      modelVisible: false,
      labelWidth: '120px',
      revenueInfoId: '',
      wholeDescribeId: '',
      useYearJson: [],
      isCustomValidate: true,
      selectedRows: [],
      disabledRow: [],
      otherParam: {},
      selectedData: {
        comeUserList: [],
        secondUserList: [],
        firstUserList: [],
        applyUserList: []
      },
      dataSource: [
        {
          type: 'view',
          labelText: '项目编号:',
          fieldName: 'pjCode',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '项目名称:',
          fieldName: 'productName',
          colLayout: 'doubleCol'
        },
        // {
        //   type: 'view',
        //   labelText: '管理部门:',
        //   fieldName: 'deptName',
        //   colLayout: 'singleCol'
        // },
        {
          type: 'view',
          labelText: '计划开始时间:',
          fieldName: 'beginTime',
          colLayout: 'doubleCol',
          fieldConfig: {
            format: 'YYYY-MM-DD'
          }
        },
        {
          type: 'view',
          labelText: '计划结束时间:',
          fieldName: 'endTime',
          colLayout: 'doubleCol',
          fieldConfig: {
            format: 'YYYY-MM-DD'
          }
        },
        {
          type: 'view',
          labelText: '币种:',
          fieldName: 'coinClassify',
          colLayout: 'doubleCol'
        },
        {
          type: 'view',
          labelText: '预算汇率:',
          fieldName: 'parities',
          colLayout: 'doubleCol'
        },
        {
          type: 'blank',
          slotName: 'comeUser',
          labelText: '收款预算编制人员:',
          fieldName: 'comeUser',
          colLayout: 'singleCol'
        },
        {
          type: 'blank',
          slotName: 'secondUser',
          labelText: '二级经费编制人员:',
          fieldName: 'secondUser',
          colLayout: 'singleCol'
        },
        {
          type: 'blank',
          slotName: 'firstUser',
          labelText: '一级经费编制人员:',
          fieldName: 'firstUser',
          colLayout: 'singleCol'
        },
        {
          type: 'blank',
          slotName: 'applyUser',
          labelText: '预算审批人:',
          fieldName: 'applyUser',
          colLayout: 'singleCol'
        },
        {
          type: 'blank',
          labelText: '全周期预算周期',
          colLayout: 'singleCol'
        },
        {
          type: 'datetime',
          labelText: '开始时间:',
          fieldName: 'startYear',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '必须选择日期' }],
          fieldConfig: {
            type: 'year',
            style: 'width: 20%',
            'value-format': 'yyyy-MM-dd'
          }
        },
        {
          type: 'datetime',
          labelText: '结束时间:',
          fieldName: 'endYear',
          colLayout: 'singleCol',
          rules: [{ required: true, message: '必须选择日期' }],
          fieldConfig: {
            type: 'year',
            style: 'width: 20%',
            'value-format': 'yyyy-MM-dd'
          }
        },
        {
          type: 'hidden',
          slotName: 'revenueModelName',
          labelText: '经费预算计划模版:',
          fieldName: 'revenueModelName',
          colLayout: 'doubleCol'
        }
      ],
      formData: {
      },
      activePane: 'setLimit'
    }
  },
  mounted () {
    this.revenueInfoId = this.thirdMenuParam.revenueInfoId
    this.wholeDescribeId = this.thirdMenuParam.wholeDescribeId
  },
  methods: {
    getPageSelectYear (saveParams) {
      let resultArr = []
      const ds = new Date(saveParams.startYear)
      let startYear = ds.getFullYear()
      const de = new Date(saveParams.endYear)
      let endYear = de.getFullYear()

      let length = endYear - startYear

      for (let i = 0; i <= length; i++) {
        resultArr.push(startYear + i)
      }
      return resultArr
    },
    isUseDeleteYear (saveParams) {
      let resultArr = []
      let pageSelectYear = this.getPageSelectYear(saveParams)
      for (var i = 0; i < this.useYearJson.length; i++) {
        var dataBaseYear = this.useYearJson[i]
        if (pageSelectYear.indexOf(dataBaseYear) === -1) {
          resultArr.push(dataBaseYear)
        }
      }
      return resultArr
    },
    customValidate (saveParams) {
      // 校验 年限
      let useYearArr = this.isUseDeleteYear(saveParams)
      if (useYearArr.length > 0) {
        let yearMsg = useYearArr.join(',')
        this.$message(
          {
            message: '全预算周期应包含(' + yearMsg + ')年,此年份有预算',
            type: 'error'
          }
        )
      } else {
        this.$refs.form.submitForm(saveParams, this.saveApi)
      }
    },
    rendered () {
      this.getRevenueUser()
    },
    clickEvent () {

    },
    getRevenueUser () {
      let that = this
      this.$api['revenueUser.getRevenueUser'](this.thirdMenuParam).then(function (res) {
        let { pjCode, productName, deptName, beginTime, endTime, startYear, endYear, coinClassify, parities, revenueModelName, revenueModelId, revenueModelType, comeUserList = [], secondUserList = [], firstUserList = [], applyUserList = [] } = res
        that.formData = { ...that.formData, pjCode, productName, deptName, beginTime, endTime, startYear, endYear, coinClassify, parities, revenueModelName, revenueModelId, revenueModelType }
        that.formData.revenueInfoId = that.revenueInfoId
        that.formData.wholeDescribeId = that.wholeDescribeId
        that.formData.comeUserList = comeUserList.map(u => u.id)

        that.formData.secondUserList = secondUserList.map(u => u.id)

        that.formData.firstUserList = firstUserList.map(u => u.id)

        that.formData.applyUserList = applyUserList.map(u => u.id)

        that.selectedData = { ...that.selectedData, comeUserList, secondUserList, firstUserList, applyUserList }
        that.useYearJson = res.useYearJson
      }).catch(function (error) {
        console.log(error)
      })
    },
    closeRevenueModel (selectedRow) {
      this.modelVisible = false
      if (selectedRow) {
        this.selectedRows[0] = selectedRow
        this.disabledRow = this.selectedRows[0].id
        if (this.selectedRows.length) {
          this.formData.revenueModelName = this.selectedRows[0].modelName
          this.formData.revenueModelId = this.selectedRows[0].id
        }
      }
    },
    saved (res) {
      this.$emit('saveSuccess', res)
    },
    handleChange (info) {

    },
    showModal (type) {
      this.visible = true
      if (type === 'comeUser') {
        this.otherParam.roleId = 'SYS_ROLE014'
        this.formData.tempUserList = this.formData.comeUserList
      } else if (type === 'secondUser') {
        this.otherParam.roleId = 'SYS_ROLE016'
        this.formData.tempUserList = this.formData.secondUserList
      } else if (type === 'firstUser') {
        this.otherParam.roleId = 'SYS_ROLE015'
        this.formData.tempUserList = this.formData.firstUserList
      } else if (type === 'applyUser') {
        this.otherParam.roleId = 'SYS_ROLE018'
        this.formData.tempUserList = this.formData.applyUserList
      }
    },
    closeModal (selectedRows, param) {
      this.visible = false
      let roleId = param.roleId
      let idArr = selectedRows.map(v => { return v.id })
      if (roleId === 'SYS_ROLE014') {
        this.selectedData.comeUserList.push(...selectedRows)
        this.formData.comeUserList.push(...idArr)
      } else if (roleId === 'SYS_ROLE016') {
        this.selectedData.secondUserList.push(...selectedRows)
        this.formData.secondUserList.push(...idArr)
      } else if (roleId === 'SYS_ROLE015') {
        this.selectedData.firstUserList.push(...selectedRows)
        this.formData.firstUserList.push(...idArr)
      } else if (roleId === 'SYS_ROLE018') {
        this.selectedData.applyUserList.push(...selectedRows)
        this.formData.applyUserList.push(...idArr)
      }
    },
    deleteUser (id, type) {
      if (type === 'comeUser') {
        this.formData.comeUserList.splice(this.formData.comeUserList.findIndex(v => v === id), 1)
        this.selectedData.comeUserList.splice(this.selectedData.comeUserList.findIndex(v => v.id === id), 1)
      } else if (type === 'secondUser') {
        this.formData.secondUserList.splice(this.formData.secondUserList.findIndex(v => v === id), 1)
        this.selectedData.secondUserList.splice(this.selectedData.secondUserList.findIndex(v => v.id === id), 1)
      } else if (type === 'firstUser') {
        this.formData.firstUserList.splice(this.formData.firstUserList.findIndex(v => v === id), 1)
        this.selectedData.firstUserList.splice(this.selectedData.firstUserList.findIndex(v => v.id === id), 1)
      } else if (type === 'applyUser') {
        this.formData.applyUserList.splice(this.formData.applyUserList.findIndex(v => v === id), 1)
        this.selectedData.applyUserList.splice(this.selectedData.applyUserList.findIndex(v => v.id === id), 1)
      }
    },
    btnSelectChange (selectedRes) {
      this.$set(this.formData, 'resourceIds', selectedRes)
    }
  }

}

</script>
