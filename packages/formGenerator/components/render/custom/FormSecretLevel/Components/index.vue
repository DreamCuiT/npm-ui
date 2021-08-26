<template>
  <el-select
    placeholder="请选择密级"
    v-model="formSecretLevelNew"
    @change="(val) => {selectChange(val)}"
  >
    <el-option
      v-for="confidentialite in confidentialiteFileOption"
      :key="confidentialite.value"
      :label="confidentialite.label"
      :value="confidentialite.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option } from 'element-ui'
export default {
  name: 'formSecretLevel',
  components: {
    'el-select': Select,
    'el-option': Option
  },
  props: {
    formSecretLevel: {
      type: String,
      default: ''
    }
  },
  watch: {
    formSecretLevel: {
      handler (val, old) {
        this.formSecretLevelNew = val
      },
      immediate: true
    }
  },
  data () {
    return {
      formSecretLevelNew: '',
      confidentialiteFileOption: this.$store.state.user.confidentialiteList
    }
  },
  methods: {
    selectChange (val) {
      this.$emit('secret', val)
    }
  }
}
</script>

<style>

</style>
