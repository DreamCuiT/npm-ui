<template>
  <div style="padding: 20px">
    <div class="test-select-wrap"></div>
    <div class="test-tree-select" style="margin-top: 100px"></div>
    <div class="test-date-picker" style="margin-top: 100px"></div>
    <div class="test-input-wrap" style="margin-top: 100px; width: 100px"></div>
  </div>
</template>

<script>
import Input from '@/assets/commonJS/originalComponents/input'
import Selector from '@/assets/commonJS/originalComponents/select'
import TreeSelect from '@/assets/commonJS/originalComponents/treeSelect'
import DatePicker from '@/assets/commonJS/originalComponents/datePicker'
export default {
  name: 'TEST2',
  components: {
  },
  data () {
    return {
      options1: [{
        value: '选项1',
        name: '黄金糕'
      }, {
        value: '选项2',
        name: '双皮奶'
      }, {
        value: '选项3',
        name: '蚵仔煎'
      }, {
        value: '选项4',
        name: '龙须面'
      }, {
        value: '选项5',
        name: '北京烤鸭'
      }],
      value2: '',
      treeOptions: [
        { name: '部门', id: '0' },
        { name: '部门-1', id: 'bm1', pId: '0' },
        { name: '部门-2', id: 'bm2', pId: '0' },
        { name: '部门-1-1', id: 'bm1-1', pId: 'bm1' },
        { name: '院', id: '1' },
        { name: '院-1', id: 'y1', pId: '1' }
      ]
    }
  },
  mounted () {
    this.initInput()
    this.initSelector()
    this.initTreeSelect()
    this.initDatePicker()
  },
  methods: {
    initInput () {
      const _this = this
      this.inputer = new Input('.test-input-wrap', {
        placeholder: '输入搜索',
        value: _this.csInputValue,
        onChangeValue (value) {
          _this.csInputValue = value
        },
        onChange (value) {
          console.log(value, 'yk-----v')
        }
      })
    },
    initSelector () {
      const _this = this
      this.selector = new Selector('.test-select-wrap', {
        customClassName: 'custom-select-style',
        options: _this.options1,
        props: {
          value: 'value',
          label: 'name'
        },
        multiple: true,
        value: '',
        onSelect: function (data) {
          console.log(data, 'yk-data')
        }
      })
    },
    initTreeSelect () {
      const _this = this
      this.treeSelect = new TreeSelect('.test-tree-select', {
        value: '',
        options: _this.treeOptions,
        props: {
          value: 'id',
          label: 'name',
          children: 'children',
          parentId: 'pId'
        },
        onSelect (v) {
          console.log(v, 'yk-vv-tree')
        }
      })
    },
    initDatePicker () {
      this.datePicker = new DatePicker('.test-date-picker', {
        value: '', // 2021-01-29
        onChange (v) {
          console.log(v, 'yk-picker-click')
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/commonJS/originalComponents/input/input.scss';
@import '~@/assets/commonJS/originalComponents/select/select.scss';
@import '~@/assets/commonJS/originalComponents/treeSelect/treeSelect.scss';
@import '~@/assets/commonJS/originalComponents/datePicker/datePicker.scss';

</style>
