<template>
    <div>
        <form-list ref="form"
                    @rendered="rendered"
                    @saved="saved"
                    :dataSource="dataSource"
                    :api="saveApi"
                    :form="formData"
                    >

        </form-list>
    </div>
</template>
<style scoped>
</style>
<script>
import { P8Form as FormList } from '~/index'
export default {
  name: 'ExperienceClassifyEdit',
  components: {
    FormList
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    parentId: {
      type: String,
      default: ''
    }

  },
  data () {
    return {
      saveApi: 'myExperience.experienceClassifyCreateOrUpdate',
      dataSource: [
        {
          type: 'text',
          labelText: '名称',
          fieldName: 'label',
          placeholder: '请输入分类名称',
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          labelText: '排序号',
          type: 'number',
          fieldName: 'indexNo',
          placeholder: '请输入排序号',
          colLayout: 'singleCol',
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        }

      ],
      modify: {

      },
      otherParam: {},
      formData: {
        id: this.id,
        parentId: this.parentId
      }

    }
  },
  mounted () {

  },
  methods: {
    rendered () {
      if (this.id && this.id !== '') {
        this.getModelData(this.id)
      }
    },
    openTable () {
      this.visible1 = true
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
      this.$api['myExperience.myExperienceCliassifyEditData']({ id: id }).then(function (res) {
        // console.log(res, 'myExperienceCliassifyEditData')
        that.formData = res
        // console.log(that.formData,'---------我的值');
        that.formData = Object.assign({}, that.formData)
      }).catch(function (error) {
        console.log('error' + error)
      })
    },
    saved () {
      console.log('edit saved')
      // console.log(this.parentId,'------我的标识');
      // this.formData.id=this.id
      // this.formData.parentId=this.parentId
      this.$emit('saveSuccess')
    },
    handleChange (info) {
      console.log(info, 'info')
    }
  }

}

</script>
