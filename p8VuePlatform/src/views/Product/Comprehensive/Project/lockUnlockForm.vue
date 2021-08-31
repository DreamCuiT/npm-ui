<template>
  <el-form ref="form" :model="formData" label-width="100px" class="formList" :inline-Message="inlineMessage" style="height:100%">
    <el-row :class="{'existBtn':true}">
<!--      <el-col>-->
<!--        <el-form-item label="任务编辑" prop="taskEdit">-->
<!--          <el-radio-group v-model="formData['taskEdit']" @change="taskEditChange">-->
<!--            <el-radio-button-->
<!--                v-for="opt in options"-->
<!--                :key="opt.value"-->
<!--                :label="opt.value"-->
<!--                :value="opt.value"-->
<!--            >{{opt.label}}</el-radio-button>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <span style="font-size: 12px;color: red;">任务编辑加锁后，标识自动加锁且不可解锁，任务编辑解锁后，标识加解锁限制取消。标识加锁后，编辑视图对应标识不可添加、取消，添加标识任务的名称、责任人、标识管理时间不可修改。</span>-->
<!--        <hr>-->
<!--      </el-col>-->
      <template v-for="(item, index) in dataSource">
        <el-col :span="item.colLayout === 'doubleCol'?12:24" :key="index">
          <el-form-item :label="item.labelText" :prop="item.fieldName">
            <el-radio-group :disabled="taskEditCheck" v-model="formData[item.fieldName]">
              <el-radio-button
                  v-for="opt in options"
                  :key="opt.value"
                  :label="opt.value"
                  :value="opt.value"
              >{{opt.label}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </template>
      <el-col>
        <el-form-item label="解锁/锁定原因" prop="content" :rules="validator(rules)">
          <el-input
              type="textarea"
              placeholder="请输入解锁/锁定原因"
              v-model="formData['content']"
              rows="4"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :class="{'formBtn':true}">
      <el-col class="flex-right">
        <slot name="btn"></slot>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { Form, FormItem, Row, Col, Button, Input, RadioGroup, RadioButton } from '~/index'
export default {
  name: 'lockUnlockForm',
  props: ['planInfoArray', 'content'],
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
    'el-button': Button,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-input': Input
  },
  data () {
    return {
      saveApi: 'planInfoManager.saveLockUnlockForm',
      otherParam: {},
      dataSource: [],
      taskEditCheck: false,
      viewData: ['111'], // 防止form表单保存按钮
      planInfoLockUnlockStatus: [],
      isCustomValidate: true,
      inlineMessage: true,
      formData: {},
      monitorPoints: {},
      monitorPointLockUnlockStatus: {},
      options: [
        {
          label: '解锁',
          value: '0'
        },
        {
          label: '加锁',
          value: '1'
        }
      ],
      rules: [
        {
          required: true,
          message: '必填'
        }
      ]
    }
  },
  mounted: function () {
    let that = this
    that.otherParam.planInfoArray = that.planInfoArray
    that.$api['planInfoManager.loadLockUnlockFormData']({ planInfoArray: that.planInfoArray }).then(res => {
      if (res && res.length) {
        that.monitorPoints = res
        res.forEach(function (item, idx) {
          if (item.value !== 'taskEdit') {
            let dataSourceItem = {
              type: 'radioButton',
              labelText: item.label,
              fieldName: item.value,
              colLayout: 'doubleCol'
            }
            that.dataSource.push(dataSourceItem)
          }
        })
      }
    }).catch(function (error) {
      console.log(error, 'error')
    })
  },
  methods: {
    taskEditChange (obj) {
      if (obj === '1') {
        this.taskEditCheck = true
      } else {
        this.taskEditCheck = false
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      let that = this
      that.validate().then((queryParams) => {
        let saveParams = { ...queryParams, ...that.otherParam }
        let formData = saveParams
        that.monitorPoints.forEach(function (item, idx) {
          if (saveParams[item.value]) {
            that.monitorPointLockUnlockStatus[item.value] = saveParams[item.value]
          }
        })
        // 任务编辑
        that.monitorPoints.forEach(function (item, idx) {
          // 若任务编辑为加锁状态时，标识设置为加锁状态（表单禁用）
          if (saveParams['taskEdit'] === '1') {
            that.monitorPointLockUnlockStatus[item.value] = '1'
          } else {
            if (saveParams[item.value]) {
              that.monitorPointLockUnlockStatus[item.value] = saveParams[item.value]
            }
          }
        })
        that.monitorPointLockUnlockStatus['taskEdit'] = saveParams['taskEdit']
        if (JSON.stringify(that.monitorPointLockUnlockStatus) !== '{}') {
          formData.monitorPointLockUnlockStatus = that.monitorPointLockUnlockStatus
          that.submitForm(formData, that.saveApi)
        } else {
          that.$message({ message: `请选择加解锁内容`, type: 'error' })
        }
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(isValid => {
          if (isValid) {
            const queryParams = this.handleParams(Object.assign({}, this.formData))
            resolve(queryParams)
          }
        })
      })
    },
    submitForm (params, api) {
      this.loadingVisible = true
      this.saveForm(api, params).then((res) => {
        this.successSave(res)
      }).catch(function (e) {
        console.log(e, '异步失败的操作')
      })
    },
    handleParams (obj) {
      // 判断必须为obj
      if (!(Object.prototype.toString.call(obj) === '[object Object]')) {
        return {}
      }
      let tempObj = {}
      for (let [key, value] of Object.entries(obj)) {
        // if(value == null) value = '';
        if (Array.isArray(value) && value.length <= 0) continue
        if (Object.prototype.toString.call(value) === '[object Function]') continue
        // 若是为字符串则清除两边空格
        if (value && typeof value === 'string') {
          value = value.trim()
        }
        tempObj[key] = value
      }
      return tempObj
    },
    saveForm (api, params, urlParam) {
      let that = this
      return new Promise((resolve, reject) => {
        that.$api[api](params, urlParam).then(function (res) {
          resolve(res)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    successSave (res) {
      this.loadingVisible = false
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
      this.$emit('save-success', res)
      this.$emit('close-lock-unlock', res)
    }
  }
}
</script>
<style lang="scss">
  .formList.el-form{
    >.el-row{
      padding:10px;
      box-sizing: border-box;

      &.existBtn:first-child{
        height:calc(100% - 50px);
        overflow-y:auto;
        overflow-x:hidden;
      }

      &.formBtn{
        position: absolute;
        bottom:0;
        left:0;
        width:100%;
        border-top:1px solid $base-line-color;
        box-sizing:border-box;
      }

      .el-form-item__label{
        font-size:12px;
      }

      .el-form-item__content{
        font-size:12px;
      }

    }
  }

  .el-radio__input.is-disabled.is-checked {
    .el-radio__inner {
      background-color: #80BDFF;
      border-color: #80BDFF;

      &::after {
        background-color: #FFFFFF;
      }
    }
  }

  .el-checkbox__input.is-disabled.is-checked {
    .el-checkbox__inner {
      background-color: #80BDFF;
      border-color: #80BDFF;

      &::after {
        border-color: #FFFFFF;
      }
    }

  }
</style>
