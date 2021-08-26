<script>
import renderTags from './renderTags'

export default {
  components: {
    renderTags
  },
  props: {
    config: {// 组件对象
      type: Object,
      default: () => {
        return {}
      }
    },
    formModel: {// formData对象
      type: Object,
      default: () => {
        return {}
      }
    },
    formRules: {// form规则对象
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {

    }
  },
  mounted () {

  },
  watch: {
    config: {
      handler (val) {

      }
    },
    deep: true
  },
  methods: {
    saveData () {

    }
  },
  render (h) {
    const { config, formRules, formModel } = this
    const { children } = config.__config__
    return (
      <div>
        <el-row>
          {
            children.map((item, index) => {
              let labelWidth = item.__config__.labelWidth ? `${item.__config__.labelWidth}px` : null
              return (
                      <el-col span={item.__config__.span}>
                        <el-form-item label-width={labelWidth}
                                      label={item.__config__.showLabel ? item.__config__.label : ''}
                                      prop={item.__vModel__}
                                      rules={formRules[item.__vModel__]}>
                          <render-tags item={item}
                                       index={index}
                                       formModel={formModel}></render-tags>
                        </el-form-item>
                      </el-col>
                    )
            })
          }
        </el-row>
      </div>
    )
  }
}
</script>