<template>
  <div>
    <select-classify v-if='selectClassifyVisible'
                     :selected-row='selectedRow'
                     :selectedClassifyId='selectedClassifyId'
                     :visible='selectClassifyVisible'
                     @close-modal='closeModal'></select-classify>
    <form-list ref="form"
               @rendered="rendered"
               @saved="saved"
               :dataSource="dataSource"
               :api="saveApi"
               :form="formData">
      <template #classifyName>
        <el-input v-model='formData["classifyName"]'
                  readonly
                  v-on:click.native="showModal"
                  placeholder="请选择所属领域">
          <i v-if='selectedRow'
             class='el-icon-link'
             slot='suffix'
             type='link'
             :style='{ fontSize: "16px", color: "#08c" }'></i>
        </el-input>
      </template>
    </form-list>
  </div>
</template>
<style scoped>
</style>
<script>
import { Input } from '~/index'
import { P8Form as FormList } from '~/index'
import SelectClassify from './selectClassify'
export default {
  name: 'ModelEdit',
  components: {
    FormList,
    'el-input': Input,
    SelectClassify

  },
  props: {
    id: {
      type: String,
      default: ''
    },
    dateNumber: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      saveApi: 'modelInformation.MISave',
      selectClassifyVisible: false,
      labelWidth: 'auto',
      selectedRow: {},
      dataSource: [
        {
          type: 'text',
          labelText: '型号代号',
          fieldName: 'modelCode',
          placeholder: '请输入型号代号',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              message: '必填'
            },
            {
              validator: (rule, value, callback) => {
                let that = this
                that.$api['modelInformation.MIRepeatedCheck']({ modelCode: value, id: that.id }).then(res => {
                  if (res === 'reject') {
                    callback(new Error('型号代号已被使用，请重新输入！'))
                    return
                  }
                  callback()
                })
              },
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'text',
          labelText: '型号名称',
          fieldName: 'modelName',
          placeholder: '请输入型号名称',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              message: '必填'
            },
            {
              validator: (rule, value, callback) => {
                let that = this
                that.$api['modelInformation.MIRepeatedCheck']({ id: that.id, modelName: value }).then(res => {
                  if (res === 'reject') {
                    callback(new Error('型号名称已被使用，请重新输入！'))
                    return
                  }
                  callback()
                })
              },
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'text',
          labelText: '型号简称',
          fieldName: 'abbreviation',
          placeholder: '请输入型号简称',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              message: '必填'
            },
            {
              validator: (rule, value, callback) => {
                let that = this
                that.$api['modelInformation.MIRepeatedCheck']({ id: that.id, abbreviation: value }).then(res => {
                  console.log(res)
                  if (res === 'reject') {
                    callback(new Error('型号简称已被使用，请重新输入！'))
                    return
                  }
                  callback()
                })
              },
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'hidden',
          fieldName: 'id'
        },
        {
          labelText: '型号密级',
          type: 'select',
          fieldName: 'security',
          placeholder: '请选择型号密级',
          colLayout: 'doubleCol',
          optionUrl: {
            api: 'thirdPartInterface.getDic',
            params: { dicType: 'SECRET_LEVEL' },
            label: 'label',
            value: 'value'
          },
          options: [],
          rules: [
            {
              required: true,
              message: '必填'
            }]
        },
        {
          labelText: '所属领域',
          type: 'blank',
          slotName: 'classifyName',
          placeholder: '请选择所属领域',
          colLayout: 'singleCol',
          // colLayout: 'doubleCol',
          // optionUrl: {
          //   api: 'thirdPartInterface.getDic',
          //   params: { dicType: 'OWNER_TYPE' },
          //   label: 'label',
          //   value: 'value'
          // },
          // options: [],
          rules: [
            {
              required: true,
              message: '请选择所属领域'
            }]
        },
        {
          labelText: '排序号',
          type: 'number',
          fieldName: 'indexNo',
          placeholder: '请输入排序号',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              message: '必填'
            }]
        },
        {
          type: 'hidden',
          labelText: '所属领域实际值',
          fieldName: 'classify',
          colLayout: 'doubleCol'

        }
      ],
      modify: {},
      otherParam: {},
      selectedClassifyId: '',
      formData: {}

    }
  },
  mounted () {

  },
  methods: {
    rendered () {
      if (this.id && this.id !== '') {
        this.getModelData(this.id)
      } else {
        this.formData.indexNo = this.dateNumber
      }
    },
    showModal () {
      this.selectedClassifyId = this.formData.classify
      this.selectClassifyVisible = true
    },
    closeModal (selectedRow) {
      let that = this
      that.selectClassifyVisible = false
      if (selectedRow && selectedRow.id) {
        that.$set(that.formData, 'classifyName', selectedRow.meaning)
        that.$set(that.formData, 'classify', selectedRow.id)
      }
    },
    showMessage (obj, message, type) {
      obj.$message({
        message: message,
        type: type
      })
    },
    clickEvent () {
      console.log('click')
    },
    getModelData (id) {
      // console.log(this.$api, 'this')
      let that = this
      this.$api['modelInformation.MIGetInfo']({ id: id }).then(function (res) {
        console.log(res, 'getInfo')
        that.formData = res
        that.formData = Object.assign({}, that.formData)
      }).catch(function (error) {
        console.log('error' + error)
      })
    },
    saved (res) {
      console.log('edit saved')
      this.$emit('saveSuccess', res)
    },
    handleChange (info) {
      console.log(info, 'info')
    }
  }

}

</script>
