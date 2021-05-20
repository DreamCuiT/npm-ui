<script>
import { Popconfirm } from 'element-ui'
export default {
  name: 'P8Popconfirm',
  componentName: 'P8Popconfirm',
  extends: Popconfirm,
  methods: {
    confirm () {
      this.visible = false
      this.$emit('confirm')
    },
    cancel () {
      this.visible = false
      this.$emit('cancel')
    }
  },
  mounted () {

  }
}
</script>
