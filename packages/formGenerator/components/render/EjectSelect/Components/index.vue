<template>
  <div>
    <el-input v-model="formName">
      <el-button
        slot="append"
        icon="el-icon-link"
        @click="showDialog"
      ></el-button>
    </el-input>
    <el-input v-show="false" v-model="formId"></el-input>
    <common-dialog
      title="弹出选择"
      :visible="visible"
      :dialogConfig="dialogConfig"
      width="50%"
      :dialogHeight="360"
      @handle-cancel="visible = false"
      @handle-ok="fillBack"
      @close="visible = false"
    >
      <!-- <template #dialog> -->
        <!-- <custom-table
          :code="code"
          :customHeight="350"
          :showWestTree="false"
          :headerVisible="false"
          @selection-change="selectChange"
        ></custom-table> -->
      <!-- </template> -->
    </common-dialog>
  </div>
</template>
<script>
import { Input } from 'element-ui'
import  Dialog  from 'packages/dialog/src'
// import CustomTable from '@/views/Framework/ComponentsMananger/Grid/Components/tableRender'
export default {
  name: 'EjectSelect',
  components: {
    'el-input': Input,
    'common-dialog': Dialog,
    // 'custom-table': CustomTable
  },
  props: {
    config: {
      type: Object,
      require: true
    },
    formModel: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: String
  },
  model: {
    props: 'value',
    event: 'change'
  },
  data () {
    return {
      formName: '', // 回填name
      formId: this.value, // 回填id
      visible: false,
      dialogConfig: {
        modal: false
      },
      fillBackData: [], // 回填的数据
      code: '' // 报表编码
    }
  },
  mounted () {
    this.code = this.config.__config__.reportCode
  },
  watch: {
    formModel: {
      handler (val) {
        const _this = this
        if (Object.keys(val).length && val[_this.config.__vModel__]) {
          _this.formId = val[_this.config.__vModel__]
          _this.selectedValue(_this.formId)
        }
      },
      immediate: true,
      deep: true
    },
    formId: {
      handler (val) {
        this.$emit('change', val)
      },
      immediate: true
    }
  },
  methods: {
    selectedValue (val) {
      this.formModel[this.config.__vModel__] = val
      let _this = this
      let param = {
        id: this.config.__config__.selectComp,
        param: {},
        sqlParam: {},
        reportParam: {
          [this.config.__config__.backfillParam.value]: val
        }
      }
      this.$api['formGenerator.getSelectionData'](param).then(function (res) {
        if (res.data && res.data.length) {
          _this.$emit('data', res.data[0])
          _this.formName = res.data[0][_this.config.__config__.backfillParam.label]
        }
      })
    },
    showDialog () {
      this.visible = true
    },
    fillBack () {
      this.visible = false
      if (this.fillBackData.length) {
        this.formName = this.fillBackData[0][this.config.__config__.backfillParam.label]
        this.formId = this.fillBackData[0][this.config.__config__.backfillParam.value]
        this.selectedValue(this.formId)
      }
    },
    selectChange (val) {
      this.fillBackData = val
      this.$emit('data', val[0])
    }
  }
}
</script>
