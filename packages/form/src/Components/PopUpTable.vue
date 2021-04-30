<template>
  <common-dialog
    title="弹出选择"
    :visible="visible"
    v-if="visible"
    :dialogConfig="dialogConfig"
    width="50%"
    :dialogHeight="360"
    @handle-cancel="close"
    @handle-ok="fillBack"
    @close="close"
  >
    <template #dialog>
      <custom-table
        v-if="visible"
        :code="code"
        :reportParam="reportParam"
        :customHeight="350"
        :showWestTree="false"
        :headerVisible="false"
        @selection-change="selectChange"
      ></custom-table>
    </template>
  </common-dialog>
</template>
<script>
import CommonDialog from '../../../dialog'
export default {
  name: 'PopUpTable',
  components: {
    CommonDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectCode: {
      type: String,
      default: ''
    },
    reportParam: { // 弹出报表参数
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dialogConfig: {
        modal: false
      },
      fillBackData: [], // 回填的数据
      code: '', // 报表编码
      selectionOption: {} // 报表回填label与value
    }
  },
  mounted () {
    this.$api['formGenerator.getSelectionDetail']({ code: this.selectCode }).then(res => {
      if (res) {
        this.code = res.reportCode
        this.selectionOption = JSON.parse(res.selectionOption)
      } else {
        this.code = ''
        this.selectionOption = {}
      }
    })
  },
  methods: {
    // 弹出选择选择行记录事件
    selectChange (val) {
      this.fillBackData = val
    },
    close () {
      this.$emit('close')
    },
    fillBack () {
      let fillBackObj = {}
      if (this.fillBackData.length) {
        fillBackObj['label'] = this.fillBackData[0][this.selectionOption.labelCol]
        fillBackObj['value'] = this.fillBackData[0][this.selectionOption.valueCol]
      }
      this.$emit('fillBack', fillBackObj)
    }
  }
}
</script>
