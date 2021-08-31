<template>
  <el-dialog :title="dialogTitle"
             width="60%"
             :visible="visible"
             append-to-body
             destroy-on-close
             :style="{'--height':flexHeight+'px'}"
             @close="handleCancel">

    <common-tabs :tabsData="tabsData"
                 height="auto"
                 :activeTabs="activeTabs">

      <template #supplementaryContract>
        <supplementary-contract v-model="record"
                                :record="record"></supplementary-contract>
      </template>
      <template #supplementaryContract_label>
        <el-badge class="mark"
                  :value="mapCreateDataSize" />
      </template>
      <template #changeContract>
        <change-contract v-model="record"
                         :record="record"></change-contract>
      </template>
      <template #changeContract_label>
        <el-badge class="mark"
                  :value="contractChangeSize" />
      </template>
      <template #editChangeForm>
        <edit-change-form ref="editForm"
                          v-model="record"
                          :record="record"></edit-change-form>
      </template>
    </common-tabs>
    <div>
      <el-button style="top: 52px;position: absolute;right:20px"
                 type="primary"
                 round
                 :loading="loading"
                 @click="importData()">一键同步/变更
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog, Button, Badge } from '~/index'
import { P8Tabs as CommonTabs } from '~/index'
import SupplementaryContract from './supplementaryContract'
import ChangeContract from './changeContract'
import EditChangeForm from './editChangeForm'
const mh = document.documentElement.clientHeight - 255
export default {
  name: 'Index',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    otherParam: {
      type: Object,
      default: () => { }
    },
    mapCreateDataSize: {
      type: Number,
      default: 0
    },
    contractChangeSize: {
      type: Number,
      default: 0
    },
    allcyYear: {
      type: Array,
      default: () => []
    },
    contractYear: {
      type: Array,
      default: () => []
    },
    changeType: {
      type: String,
      default: ''
    },
    dialogTitle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeTabs: 'supplementaryContract',
      record: this.otherParam,
      flexHeight: mh,
      loading: false,
      tabsData: []
    }
  },
  created () {
    this.initColumns()
  },
  mounted () {

  },
  methods: {
    initColumns () {
      let tabsDataTemp = [
        {
          label: '增补合同',
          name: 'supplementaryContract'
        },
        {
          label: '合同变更',
          name: 'changeContract'
        }
      ]
      if (this.changeType) {
        tabsDataTemp.push({
          label: '填写变更原因',
          name: 'editChangeForm'
        })
      }
      this.tabsData = tabsDataTemp
    },
    importData (obj) {
      let that = this
      let resultArr = []
      for (let i = 0; i < that.contractYear.length; i++) {
        let contractY = that.contractYear[i]
        if (that.allcyYear.indexOf(contractY) === -1) {
          resultArr.push(contractY)
        }
      }

      if (resultArr.length > 0) {
        let yearMsg = resultArr.join(',')
        that.$message(
          {
            message: '全预算周期不包含(' + yearMsg + ')年,请联系预算管理员，增加全周期年限',
            type: 'error'
          }
        )
      } else {
        that.record.flag = 'adjust'
        let result = true
        if (that.changeType) {
          that.record.flag = that.changeType
          let textMsg = that.$refs.editForm.$refs.form.formData.textMsg

          if (textMsg) {
            result = true
            that.record.textMsg = textMsg
          } else {
            result = false
          }
        }

        if (result) {
          that.loading = true
          that.$api['collectionBudget.submitRevenueChangedReason'](that.record).then(res => {
            that.loading = false
            if (res) {
              that.$message(
                {
                  message: '保存成功',
                  type: 'success'
                }
              )
              that.$emit('close-dialog', that.changeType)
            } else {
              that.$message(
                {
                  message: '保存失败',
                  type: 'error'
                }
              )
            }
          })
        } else {
          that.$message(
            {
              message: '必须填写变更原因',
              type: 'error'
            }
          )
        }
      }
    },
    handleCancel () {
      this.$emit('close-dialog', this.changeType)
    }
  },
  components: {
    'el-button': Button,
    'el-dialog': Dialog,
    'el-badge': Badge,
    CommonTabs,
    SupplementaryContract,
    EditChangeForm,
    ChangeContract
  }
}
</script>
