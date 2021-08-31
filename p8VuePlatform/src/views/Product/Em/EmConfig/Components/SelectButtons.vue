<template>
  <el-table row-key="id" :data="menus" :pagination="false" :height="height" :default-expand-all="true">

    <el-table-column label="选择" type="index">
      <span slot-scope="scope">
        <el-checkbox v-model="scope.row.checked" :disabled="resDisabled(scope.row.id)" @change="(v) => checkMenu(v, scope.row)">
        </el-checkbox>
      </span>
    </el-table-column>
    <el-table-column width="120" label="功能" prop="title"></el-table-column>
    <el-table-column label="子功能">
      <span slot-scope="scope">
        <ul class="btn-container">
          <template v-for="btn in buttons(scope.row.id)">
            <li :key="btn.id" :class="btnClass(btn.checked)">
              <el-checkbox :key="btn.id" v-model="btn.checked" @change="(v) => checkMenu(v, btn)"  >
                <!-- <a-icon class="roleOperationIcon" :type="btn.icon"></a-icon> -->
                {{btn.title}}
              </el-checkbox>
            </li>
          </template>
        </ul>
      </span>
    </el-table-column>

  </el-table>
</template>
<style lang="scss" scoped>
  .ant-tag-checkable .roleOperationIcon {
    margin-right: 5px;
  }
  .btn-container {
    li{
        float: left;
        min-width: 80px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid #DCDFE6;
        padding: 5px 8px;
        border-radius: 5px;
        cursor: pointer;
        &.checked {
          border:1px solid #2196F3;
        }
    }
  }
</style>
<script>
import {
  Checkbox,
  Table,
  TableColumn
} from '~/index'
import {
  generateTree
} from '@/utils/generateTree'

export default {
  props: {
    buttonSelected: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-checkbox': Checkbox
  },
  data () {
    const docHeight = document.documentElement.clientHeight - 263
    return {
      height: docHeight,
      resources: []
    }
  },
  mounted () {
    this.getPermissions()
    window.addEventListener('resize', this._initTableSize)
  },
  computed: {
    btnClass () {
      return function (checked) {
        return checked ? 'checked' : ''
      }
    },
    dataSource () {
      let that = this
      console.log(this.buttonSelected, '999999999999999')
      this.buttonSelected.forEach(b => {
        let res = that.resources.find(r => r.id === b)
        if (res) {
          res.checked = true
        }
      })
      return that.resources
    },
    menus () {
      // this.dataSource.filter(r => r.parentId === 'root').forEach(i => { i.parentId = null })
      // filter(r => r.type === 'MENU' && r.id !== 'root') 不包含根节点
      return generateTree(this.dataSource.filter(r => r.type === 'MENU' && r.id !== null), 'parentId')
    },
    buttons () {
      return function (menuId) {
        return this.dataSource.filter(r => r.parentId === menuId && r.type === 'BUTTON')
      }
    },
    resDisabled () {
      return function (resId) {
        let checkedChild = this.dataSource.find(r => r.parentId === resId && r.checked)
        let result = !!checkedChild
        return result
      }
    },
    selectedRes: function () {
      let res = []
      res = this.dataSource.filter(r => r.checked).map(r => r.id)
      return res
    }

  },
  methods: {
    _initTableSize () {
      let docHeight = document.documentElement.clientHeight - 263
      this.height = docHeight
    },
    getPermissions () {
      let that = this
      this.$api['emConfig.getProjectFunction']().then(function (res) {
        that.resources = res
        that.resChanged()
      })
    },
    checkMenu (v, row) {
      if (v === true) {
        let pId = row.parentId
        while (pId !== null) {
          let pRow = this.dataSource.find(r => r.id === pId)
          if (pRow) {
            pRow.checked = true
            pId = pRow.parentId
          } else {
            pId = null
          }
        }
      } else {
        let checkedChild = this.dataSource.find(r => r.parentId === row.id && r.checked)
        if (checkedChild) {
          row.checked = true
        }
      }

      this.resChanged()
    },
    resChanged () {
      this.$emit('btn-select-change', this.selectedRes)
    }
  }
}
</script>
