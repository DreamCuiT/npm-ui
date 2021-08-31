<template>
  <list-layout>
    <template #center>
      <div class="common-table"
           :class="{ 'flex-table': !!flex }"
           :style="{ height: flexHeight }">
        <div :class="{
            'small-table': size === 'small',
            havePagination: pagination,
          }">
          <el-table ref="table"
                    height="100%"
                    stripe
                    row-key="id"
                    :data="data"
                    style="width: 100%">
            <el-table-column type="index"
                             label="序号"
                             align="center"
                             min-width="1"> </el-table-column>
            <el-table-column prop="modelName"
                             label="型号"
                             align="center"
                             min-width="2"> </el-table-column>
            <el-table-column prop="commonType"
                             label="共性资源类型"
                             align="center"
                             min-width="3">
            </el-table-column>
            <el-table-column prop="planCount"
                             label="计划数"
                             align="center"
                             min-width="1">
              <template slot-scope="scope">
                <div style="
                    color: red;
                    text-decoration: underline;
                    cursor: pointer;
                  "
                     @click="getMore2(scope.row, '')">
                  {{ scope.row.planCount }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="completeCount"
                             label="完成数"
                             align="center"
                             min-width="1">
              <template slot-scope="scope">
                <div style="
                    color: red;
                    text-decoration: underline;
                    cursor: pointer;
                  "
                     @click="getMore2(scope.row, 1)">
                  {{ scope.row.completeCount }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="incompleteCount"
                             label="未完成数"
                             align="center"
                             min-width="1">
              <template slot-scope="scope">
                <div style="
                    color: red;
                    text-decoration: underline;
                    cursor: pointer;
                  "
                     @click="getMore2(scope.row, 0)">
                  {{ scope.row.incompleteCount }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="percent"
                             label="完成率"
                             align="center"
                             min-width="1">
              <template slot-scope="scope">
                <div>
                  {{
                    (scope.row.completeCount / scope.row.planCount).toFixed(2) +
                    '%'
                  }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="panination"
             v-if="pagination">
          <el-pagination background
                         layout="prev, pager, next, total, jumper"
                         :current-page="page.current"
                         :page-size="page.size"
                         :total="page.total"
                         @current-change="changePage"></el-pagination>
        </div>
      </div>
    </template>
    <template #drawer-panel>
      <common-drawer :title="drawerTitle"
                     :visible="drawerVisible"
                     size="100%"
                     @close="onDrawerClose">
        <template #drawer>
          <info @saveSuccess="saveCallback"
                :id="typeId"
                :modelId="modelId"
                :statusNum="statusNum"></info>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>
<script>
import { Table, TableColumn, Pagination } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import Info from './info'

export default {
  name: 'list',
  props: {
    size: {
      type: String,
      default: 'small'
    },
    minHeight: {
      type: Number,
      default: 200
    },
    flex: {
      type: Number,
      default: 160
    },
    pagination: {// 是否展示分页
      type: Boolean,
      default: true
    }
  },
  data () {
    const mh = document.documentElement.clientHeight - this.flex > this.minHeight
      ? (this.pagination ? (document.documentElement.clientHeight - this.flex) : (document.documentElement.clientHeight - this.flex + 40))
      : this.minHeight
    return {
      drawerTitle: null,
      drawerVisible: false,
      typeId: '',
      modelId: '',
      statusNum: '',
      flexHeight: this.customHeight ? this.customHeight + 'px' : mh + 'px',
      page: {
        current: 1,
        size: 1000,
        total: 0,
        orders: []
      }, // 分页
      data: []
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    changePage (pageNo) { // 分页时调用列表数据接口
      this.page.current = pageNo
      this.refresh()
    },
    getMore2 (obj, statusNum) {
      console.log(obj, 'obj000')
      this.typeId = obj.id
      this.modelId = obj.modelId
      this.statusNum = statusNum
      this.drawerTitle = '共性资源计划详情'
      this.drawerVisible = true
    },
    onDrawerClose () { // 抽屉关闭
      this.drawerVisible = false
    },
    saveCallback () {
      this.$refs.table.searchData()
      this.onDrawerClose()
    },
    refresh () {
      let params = {
        page: {
          current: this.page.current ? this.page.current : 1,
          size: this.page.size ? this.page.size : 10,
          orders: this.page.orders ? this.page.orders : []
        }
      }
      const that = this
      this.$api['commonResourcesImplementation.list'](params).then(function (res) {
        console.log(res, 'res22')
        const data = res.records
        data.forEach(function (item, idx) {
          item.key = item.id
        })
        that.data = data

        that.page = {
          total: res.total,
          current: res.current,
          size: res.size,
          orders: res.orders
        }
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    CommonDrawer,
    ListLayout,
    Info
  }
}
</script>

<style lang="scss">
$pagination-bg-color: #e9edf6;
$pagination-text-color: #9b9b9b;

.common-table {
  position: relative;

  &.flex-table {
    display: flex;
    flex-direction: column;
  }

  .small-table {
    width: 100%;
    flex: 1;
    display: inherit;
    height: 100%;
    border: 1px solid $base-line-color;
    border-radius: 6px;
    box-shadow: 5px 5px 13px $base-bg-shadow;
    box-sizing: border-box;
    overflow: hidden;

    // thead th, tbody td { padding: 7px 0 !important; }
    &.havePagination {
      height: calc(100% - 50px);
    }
  }

  .panination {
    margin: 9px 0;
    display: flex;
    flex: none;
    justify-content: flex-end;
  }

  .el-button--small {
    padding: 0;
  }

  .el-dropdown-link {
    color: $base-light-color;
    font-size: 12px;
    cursor: pointer;
  }

  .el-pagination__jump {
    margin-left: 0;

    .el-pagination__editor.el-input {
      width: 35px;
      border-radius: 4px;

      .el-input__inner {
        height: 25px;
        line-height: 25px;
        border-color: $pagination-bg-color;
        background-color: $pagination-bg-color;
      }
    }
  }

  .el-pagination.is-background {
    .btn-prev,
    .btn-next,
    .el-pager li {
      background-color: $pagination-bg-color;
      height: 25px;
      line-height: 25px;
      padding: 0;
      min-width: 25px;
      margin: 0 3px;
      border-radius: 4px;
      color: $pagination-text-color;
    }
  }

  .caret-wrapper {
    height: 16px;
  }

  .sort-caret.ascending {
    top: -5px;
  }

  .sort-caret.descending {
    bottom: -1px;
  }

  .table-setting-icon {
    position: absolute;
    right: 1px;
    top: 1px;
    z-index: 1;
    width: 30px;
    height: 48px;
    line-height: 50px;
    text-align: center;
    background: #f5f7fa;
    color: $base-light-color;
    cursor: pointer;
    font-size: 16px;

    .el-icon-more {
      transform: rotateZ(90deg);
    }
  }

  .el-table-column--selection {
    .cell {
      padding: 0;
    }
  }
}

.el-table--enable-row-transition .el-table__body tr:hover td {
  background: $base-active-color;
}
</style>
