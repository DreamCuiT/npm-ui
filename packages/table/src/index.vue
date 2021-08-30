<template>
  <div class="common-table"
       :class="{ 'flex-table': !!flex }"
       :style="{ height: flexHeight }">
    <div :class="{ 'small-table': size === 'small', havePagination: pagination, selectAllHidden: selectAllHidden, showSearchRow:showSearchRow }">
      <el-table v-if="columns.length"
                ref="table"
                height="100%"
                stripe
                border
                :data="tableData"
                row-key="id"
                v-on="$listeners"
                v-bind="tableConfig"
                :default-sort="defaultSort"
                :span-method="margeHandle"
                :header-cell-class-name="headerCellClass"
                @select="select"
                @select-all="selectAll">
        <template v-for="(item, index) in renderColumns">
          <template v-if="item.isshow && item.isshow">
            <!-- 列表自定义列 -->
            <template v-if="
                item.scopedSlots && item.scopedSlots.customRender == 'custom'
              ">
              <el-table-column :key="index"
                               :label="item.title"
                               :prop="item.dataIndex"
                               :show-overflow-tooltip="showOverflowTooltip"
                               :type="item.type"
                               :width="item.width"
                               :min-width="item.minWidth"
                               :align="item.align"
                               :fixed="item.fixed"
                               :sortable="item.sortable ? 'custom' : false">
                <!-- 钻取列 -->
                <template slot="header"
                          slot-scope="scope">
                  <span class="custom_label">{{ scope.column.label }}</span>
                  <el-popover v-if="item.filterable && item.iconDisplay"
                              placement="bottom-start"
                              width="200"
                              trigger="manual"
                              v-model="item.filter.visible">
                    <el-input v-model="item.filter.val"
                              size="small"
                              placeholder="输入关键字搜索"
                              v-on:keyup.enter.native="columnFiter(item)">
                      <template slot="suffix">
                        <i v-if="item.filter.val"
                           class="el-icon-close"
                           @click="columnReset(item)"></i>
                        <i class="el-icon-search"
                           @click="columnFiter(item)"></i>
                      </template>
                    </el-input>
                    <i class="el-icon-search"
                       :class="{ active: item.filter.visible }"
                       slot="reference"
                       @click.stop="item.filter.visible = !item.filter.visible"></i>
                  </el-popover>
                  <i class="p8 icon-drilling"
                     v-if="item.drillable"
                     style="
                      font-size: 15px;
                      cursor: pointer;
                      color: #0070c5;
                      font-weight: bold;
                    "></i>
                  <div class="colSearch"
                       v-if="showSearchRow">
                    <search-field-render v-if="item.filterable && !item.iconDisplay"
                                         :item="item"
                                         @columnReset="columnReset"
                                         @columnFiter="columnFiter"></search-field-render>
                  </div>
                </template>
                <template slot-scope="scope">
                  <slot :name="scope.column.property"
                        :scope="scope"
                        :third-menu-data="thirdMenuData"></slot>
                </template>
              </el-table-column>
            </template>
            <!-- 列表三级菜单列 -->
            <template v-else-if="
                item.scopedSlots && item.scopedSlots.customRender == 'thirdMenu'
              ">
              <el-table-column :key="index"
                               :label="item.title"
                               :prop="item.dataIndex"
                               :show-overflow-tooltip="showOverflowTooltip"
                               :type="item.type"
                               :fixed="item.fixed"
                               :width="item.width"
                               :min-width="item.minWidth"
                               :align="item.align">
                <template slot="header"
                          slot-scope="scope">
                  <span class="custom_label">{{ scope.column.label }}</span>
                  <div class="colSearch"
                       v-if="showSearchRow"></div>
                </template>
                <template slot-scope="scope"
                          v-if="item.formatter ? item.formatter(scope.row) : true">
                  <el-dropdown :hide-on-click="false">
                    <span class="el-dropdown-link">
                      <i class="el-icon-menu"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(item, index) in thirdMenuData"
                                        :key="index">
                        <div @click="thirdMenuClick(scope.row, item)">
                          <i class="el-icon-setting"></i> {{ item.meta.title }}
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </template>
            <!-- 列表操作列 -->
            <template v-else-if="
                item.scopedSlots && item.scopedSlots.customRender == 'operation'
              ">
              <el-table-column v-if="buttonData.length > 0"
                               :key="index"
                               :label="item.title"
                               :prop="item.dataIndex"
                               :fixed="item.fixed"
                               :width="item.width ? item.width : 105"
                               :min-width="item.minWidth">
                <template slot="header"
                          slot-scope="scope">
                  <span class="custom_label">{{ scope.column.label }}</span>
                  <div class="colSearch"
                       v-if="showSearchRow"></div>
                </template>
                <template slot-scope="scope">
                  <template v-if="hiddenRootOperation && scope.row.whetherRoot">
                  </template>
                  <template v-else>
                    <template v-for="(button, btnIdx) in renderButtonData(scope.row)">
                      <template v-if="btnIdx === 0">
                        <el-tooltip :key="button.id"
                                    placement="left"
                                    :disabled="
                            button.isDisabled
                              ? tooltipContent(button, scope.row)
                                ? false
                                : true
                              : true
                          "
                                    :content="tooltipContent(button, scope.row)">
                          <span>
                            <el-button type="text"
                                       :disabled="buttonDisabled(button, scope.row)"
                                       @click="buttonClick(scope,button)">{{ button.title }}</el-button>
                          </span>
                        </el-tooltip>
                        <el-divider v-if="buttonData.length > 1"
                                    direction="vertical"
                                    :key="button.id"></el-divider>
                      </template>
                      <template v-if="buttonData.length === 2 && btnIdx === 1">
                        <el-tooltip :key="button.id"
                                    placement="left"
                                    :disabled="
                            button.isDisabled
                              ? tooltipContent(button, scope.row)
                                ? false
                                : true
                              : true
                          "
                                    :content="tooltipContent(button, scope.row)">
                          <span>
                            <el-button type="text"
                                       :disabled="buttonDisabled(button, scope.row)"
                                       @click="buttonClick (scope, button)">{{ button.title }}</el-button>
                          </span>
                        </el-tooltip>
                      </template>
                    </template>
                    <template v-if="buttonData.length > 2">
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown"
                                          class="operation-dropdown">
                          <template v-for="(button, btnIdx) in renderButtonData(
                              scope.row
                            )">
                            <el-dropdown-item :key="button.id"
                                              v-if="btnIdx > 0"
                                              style="padding: 0">
                              <el-tooltip :key="button.id"
                                          placement="left"
                                          :disabled="
                                  button.isDisabled
                                    ? tooltipContent(button, scope.row)
                                      ? false
                                      : true
                                    : true
                                "
                                          :content="tooltipContent(button, scope.row)">
                                <span style="display: block">
                                  <el-button type="text"
                                             :disabled="
                                      buttonDisabled(button, scope.row)
                                    "
                                             @click="buttonClick (scope, button)"
                                             style="
                                      width: 100%;
                                      height: 100%;
                                      text-align: left;
                                      padding: 0 15px;
                                    "><i class="p8"></i>{{ button.title }}</el-button>
                                </span>
                              </el-tooltip>
                            </el-dropdown-item>
                          </template>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </template>
                </template>
              </el-table-column>
            </template>
            <!-- 列表自定义列 --- 编辑 -->
            <template v-else-if="
                item.scopedSlots && item.scopedSlots.customRender == 'edit'
              ">
              <el-table-column :key="index"
                               :label="item.title"
                               :prop="item.dataIndex"
                               :type="item.type"
                               :width="item.width"
                               :min-width="item.minWidth"
                               :align="item.align"
                               :fixed="item.fixed">
                <template slot-scope="scope">
                  <slot :name="scope.column.property"
                        :scope="scope"
                        :data="tableData"></slot>
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column v-if="item.filterable"
                               :prop="item.dataIndex"
                               :label="item.title"
                               :show-overflow-tooltip="showOverflowTooltip"
                               :width="item.width"
                               :min-width="item.minWidth"
                               :key="index"
                               :type="item.type"
                               :align="item.type === 'index' && !item.align ? 'center' : item.align"
                               :index="indexMethod"
                               :fixed="item.fixed"
                               v-bind="item.columnConfig"
                               :formatter="item.formatter"
                               :sortable="item.sortable ? 'custom' : false">
                <template slot="header"
                          slot-scope="scope">
                  <span class="custom_label">{{ scope.column.label }}</span>
                  <span class="caret-wrapper-custom"
                        v-if="item.sortable"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span>
                  <el-popover v-if="item.iconDisplay"
                              placement="bottom-start"
                              width="200"
                              trigger="manual"
                              v-model="item.filter.visible">
                    <el-input v-model="item.filter.val"
                              size="mini"
                              placeholder="输入关键字搜索"
                              v-on:keyup.enter.native="columnFiter(item)">
                      <template slot="suffix">
                        <i v-if="item.filter.val"
                           class="el-icon-close"
                           @click="columnReset(item)"></i>
                        <i class="el-icon-search"
                           @click="columnFiter(item)"></i>
                      </template>
                    </el-input>
                    <i class="el-icon-search"
                       :class="{ active: item.filter.visible }"
                       slot="reference"
                       @click.stop="item.filter.visible = !item.filter.visible"></i>
                  </el-popover>
                  <div class="colSearch"
                       v-else-if="showSearchRow">
                    <search-field-render :item="item"
                                         @columnReset="columnReset"
                                         @columnFiter="columnFiter"></search-field-render>
                  </div>
                  <i class="p8 icon-drilling"
                     v-if="item.drillable"
                     style="
                      font-size: 16px;
                      cursor: pointer;
                      color: #0070c5;
                      font-weight: bold;
                    "></i>
                </template>
              </el-table-column>
              <el-table-column v-else
                               :prop="item.dataIndex"
                               :label="item.title"
                               :show-overflow-tooltip="showOverflowTooltip"
                               :width="item.width"
                               :min-width="item.minWidth"
                               :key="index"
                               :type="item.type"
                               :reserve-selection="item.reserveSelection"
                               :align="
                  item.type === 'index' && !item.align ? 'center' : item.align
                "
                               :selectable="item.selectable"
                               :index="indexMethod"
                               :fixed="item.fixed"
                               v-bind="item.columnConfig"
                               :formatter="item.formatter"
                               :sortable="item.sortable ? 'custom' : false">
                <template slot="header"
                          slot-scope="scope">
                  <span class="custom_label">{{ scope.column.label }}</span>
                  <span class="caret-wrapper-custom"
                        v-if="item.sortable"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span>
                  <div class="colSearch"
                       v-if="showSearchRow"></div>
                </template>
              </el-table-column>
            </template>
          </template>
        </template>
        <!-- <template v-if="tableSetting">
          <el-table-column width="20px">
            <template slot-scope="scope">
              <slot name="tableSetting" :scope="scope"></slot>
            </template>
          </el-table-column>
        </template> -->
      </el-table>
    </div>
    <div class="panination"
         v-if="pagination">
      <el-pagination background
                     layout="prev, pager, next, total, jumper"
                     :current-page="page.current"
                     :page-size="page.size"
                     :total="page.total"
                     :pager-count="5"
                     @current-change="changePage"></el-pagination>
    </div>
    <span v-if="tableSetting"
          class="table-setting-icon"
          @click="open"><i class="el-icon-more"></i></span>
    <table-setting :visible="tableSettingVisible"
                   :columns="renderColumns"
                   @close="tableSettingVisible = false"
                   @save-setting="saveSettingHandle"></table-setting>
  </div>
</template>

<script>
import { Table, TableColumn, Pagination, Button, Tooltip, Divider, Dropdown, DropdownMenu, DropdownItem, Input, Popover } from 'element-ui'
import { generateTree } from '~/utils/generateTree'
import { handleTableSpan, handleObjectSpanMethod } from './Function.js'
import SearchFieldRender from './SearchFieldRender'
import TableSetting from './TableSetting'

export default {
  name: 'P8Table',
  componentName: 'P8Table',
  props: {
    comp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    intelligenceComp: { // 智能报表中配置的按钮this
      type: Object,
      default: () => {
        return {}
      }
    },
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
      default: 140
    },
    columns: {
      type: Array,
      default: () => []
    },
    pagination: {// 是否展示分页
      type: Boolean,
      default: true
    },
    paginationInfo: {
      type: Object,
      default: () => { }
    },
    tableRefresh: {// 调用列表接口后的回调方法
      type: Function,
      default: function () { }
    },
    params: {// 列表查询条件
      type: Object,
      default: () => {
        return {}
      }
    },
    api: {
      type: String,
      default: ''
    },
    parentButtonId: {// 权限按钮如果有子的话传入该按钮的id
      type: String,
      default: ''
    },
    specialRoteName: {
      type: String,
      default: ''
    },
    tableConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    menuState: {
      type: Array,
      default: () => []
    },
    hiddenRootOperation: {
      type: Boolean,
      default: false
    },
    useTreeFormat: {// 是否是treeTable，数据格式为平行数组，通过pId或parentId来转换
      type: Boolean,
      default: false
    },
    useTreePId: {// 如果useTreeFormat设置为true，默认通过pId来转换数据格式
      type: String,
      default: 'pId'
    },
    noApiTableData: {
      type: Array,
      default: () => []
    },
    tableSetting: { // 是否展示表格设置图标[true:展示--可操作表格; false:不展示--不可操作表格]
      type: Boolean,
      default: true
    },
    customButtonData: { // 智能报表中新增按钮
      type: Array,
      default: () => []
    },
    customHeight: {
      type: Number,
      default: 0
    },
    merageKeys: { // 要纵向合并的单元格的key数组
      type: Array,
      default: () => []
    },
    showOverflowTooltip: { // 默认列内容过长被隐藏时显示 tooltip
      type: Boolean,
      default: true
    },
    filterThirdMenu: { // 过滤三级菜单， 值为路由的name；  过滤多个时， 以逗号拼接。
      type: String,
      default: 'true'
    },
    disabledCheckAll: { // 是否需要全选功能(前提: table带勾选功能), true:隐藏全选
      type: Boolean,
      default: false
    },
    isRadioSelect: { // 是否需要单选功能(前提: table带勾选功能), true:隐藏全选
      type: Boolean,
      default: false
    },
    customButtonConfig: { // 智能报表中按钮的禁用规则
      type: Array,
      default: () => []
    },
    selectAllHidden: {
      type: Boolean,
      default: false
    },
    showSearchRow: { // table表头默认显示查询行
      type: Boolean,
      default: false
    },
    countSizeRowHeight: { //计算请求size数量-表格行高
      type: Number,
      default: 40
    },
  },
  data () {
    const { API_DEFAULT_CONFIG } = this.$sysConfig
    const mh = document.documentElement.clientHeight - this.flex > this.minHeight
      ? document.documentElement.clientHeight - this.flex
      : this.minHeight
    return {
      calPageSize: Math.ceil((mh - 100) / this.countSizeRowHeight),
      flexHeight: this.customHeight ? this.customHeight + 'px' : mh + 'px',
      isListLoading: false, // 列表加载
      radioSelectionRow: null,// 单选选中数据
      page: { // 翻页数据
        current: 1,
        size: this.calPageSize,
        total: 0,
        orders: []
      },
      tableData: [],
      buttonData: [...this.customButtonData],
      thirdMenuData: [], // 三级菜单
      columnFilterParam: {}, // 列上增加输入框筛选条件
      buttonDisabledLimit: [...this.$store.state.project.buttonLimit, ...this.customButtonConfig],
      buttonLimitFlag: false, // 判断行按钮是否需要禁用，默认不绑定禁用逻辑
      tableSettingVisible: false,
      api_default_config: API_DEFAULT_CONFIG,
      constSettingParams: {
        type: 'Table',
        description: 'table-setting'
      },
      // 要合并的单元格的rowspan 数据
      rowspanObj: {},
      // renderColumns: this.renderColumnsHandle()
      defaultSort: {} // 表格默认排序
    }
  },
  computed: {
    selection () {
      return this.$refs.table.selection
    },
    renderComp () {
      return this.comp
    },
    renderIntelligenceComp () {
      return this.intelligenceComp
    },
    renderColumns: {
      get () {
        return this.renderColumnsHandle()
      },
      set (val) {

      }
    }
  },
  watch: {
    params: {
      handler (val) {
        this.queryList()
      },
      deep: true
    },
    noApiTableData: {
      handler (val) {
        this.tableData = val
      },
      immediate: true,
      deep: true
    },
    flex () {
      this._initTableSize()
    },
    customButtonData: {
      handler (val, oldVal) {
        this.buttonData = [...val]
        this.buttonDisabledLimit = [...this.$store.state.project.buttonLimit, ...this.customButtonConfig]
        this.getButtonData()
      },
      deep: true
    },
    paginationInfo: {
      handler (val) {
        if (this.pagination && val && Object.keys(val).length) {
          this.page = { ...this.page, ...val }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    if (this.columns.length) {
      this.columns.map(item => {
        if (item.defaultSort) {
          let sortObj = {
            column: item.dataIndex,
            asc: item.asc
          }
          this.page.orders = [sortObj]
          this.defaultSort = {
            prop: item.dataIndex,
            order: item.asc ? 'ascending' : 'descending'
          }
        }
      })
    }
    const currentPath = this.$route.path
    const rootRouter = this.$store.state.routers.addRouters
    let thirdMenu = []
    if (rootRouter && rootRouter.length > 0) {
      rootRouter.map(function (item, index) {
        if (item.children && item.children.length > 0) {
          item.children.map(function (subItem, idx) {
            if (subItem.path === currentPath) {
              thirdMenu = subItem
            }
          })
        }
      })
    }

    let children = thirdMenu.children
    let tempChildren = []
    if (this.filterThirdMenu && children && children.length) {
      children.map(item => {
        if (this.filterThirdMenu.indexOf(item.name) === -1) {
          tempChildren.push(item)
        }
      })
    }
    this.thirdMenuData = this.filterThirdMenu ? tempChildren : thirdMenu.children

    if (!this.api) {
      this.tableData = this.noApiTableData
    }
    // 判断是否存在操作列，存在的话再请求button.info
    let exitOperation = this.columns.filter(item => item.scopedSlots && (item.scopedSlots.customRender === 'operation'))
    if (exitOperation.length) {
      this.getButtonData()
    }
  },
  mounted () {
    this.queryList()
    // 如果配置了flex属性, 则在组件加载完成后配置一个reisze监听,保证表格的高度为动态计算
    if (this.flex !== 0) {
      window.addEventListener('resize', this._initTableSize)
    } else {
      this.flexHeight = 'auto'
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._initTableSize)
  },
  methods: {
    // 操作按钮点击事件
    buttonClick (scope, button) {
      if (this.renderIntelligenceComp[button.eventHandle]) {
        this.renderIntelligenceComp[button.eventHandle](scope.row, button)
      } else {
        this.renderComp[button.eventHandle](scope.row, button)
      }
    },
    getButtonData () {
      let _this = this
      let resourceName = this.$route.name
      if (this.specialRoteName && this.specialRoteName !== '') {
        resourceName = this.specialRoteName
      }
      const params = {
        'resourceName': resourceName,
        'parentUuid': this.parentButtonId
      }
      this.$api['button.info'](params).then(res => {
        _this.buttonData = [...res, ..._this.buttonData]

        _this.buttonData = _this.buttonData.filter(item => item.location === 'row')
        // 给每个行按钮绑定相应的禁用规则
        _this.buttonData.map(item => {
          _this.buttonDisabledLimit.map(i => {
            if (item.id === i.id) {
              _this.buttonLimitFlag = true
              item.disabledRules = i
            }
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    renderColumnsHandle () {
      const _this = this
      let tableSettingaAll = this.$store.state.user.userSettingAll.Table ? this.$store.state.user.userSettingAll.Table : null
      if (tableSettingaAll) {
        const key = this.$route.path + '.' + this.api
        let currTableSetting = tableSettingaAll.filter(item => item.key === key)
        if (currTableSetting && currTableSetting.length) {
          let columnsSetting = currTableSetting[0].value.columns
          let tempColumns = []
          // 根据页面传入的columns 和 vuex中Table设置的数据 重新组合
          columnsSetting.forEach((settingItem, settingIndex) => {
            let settingType = settingItem.dataIndex || settingItem.type
            let initFilter = _this.columns.filter((initItem, initIndex) => {
              let initType = initItem.dataIndex || initItem.type
              return settingType === initType
            })
            if (initFilter && initFilter.length) {
              if (Object.keys(initFilter[0]).indexOf('isshow') === -1) {
                initFilter[0].isshow = settingItem.isshow
              }
              initFilter[0].fixed = settingItem.fixed
              tempColumns.push(initFilter[0])
            }
          })
          // console.log('tempColumns', tempColumns)
          // 当前table的设置项存在, 但页面上的配置项-columns更新了, 设置项中不存在更新的列, 处理放入更新列(按照配置项-columns更新列所在的索引位置放入)
          let updateColumns = _this.columns.filter(item => {
            return tempColumns.indexOf(item) === -1
          })
          if (updateColumns && updateColumns.length) {
            updateColumns.forEach(item => {
              let index = _this.columns.indexOf(item)
              if (Object.keys(item).indexOf('isshow') === -1) {
                _this.$set(item, 'isshow', true)
              }
              let fixed = (item.columnConfig && item.columnConfig.fixed) || item.fixed
              _this.$set(item, 'fixed', fixed || false)
              tempColumns.splice(index, 0, item)
            })
          }
          return tempColumns
        }
      }
      return this.columns.map(item => {
        if (Object.keys(item).indexOf('isshow') === -1) {
          this.$set(item, 'isshow', true)
        }
        let fixed = (item.columnConfig && item.columnConfig.fixed) || item.fixed
        this.$set(item, 'fixed', fixed || false)
        return item
      })
    },
    open () {
      this.tableSettingVisible = true
    },
    // 行内禁用按钮悬浮信息内容
    tooltipContent (button, row) {
      if (button.isDisabled) {
        if (typeof (button.isDisabled) === 'boolean') {
          return button.rdesc
        } else {
          if (typeof this.renderIntelligenceComp[button.isDisabled] === 'function') {
            return this.renderIntelligenceComp[button.isDisabled](row, button, ['disabled', 'disabledMsg']).disabledMsg
          } else if (typeof this.renderComp[button.isDisabled] === 'function') {
            return this.renderComp[button.isDisabled](row, button, ['disabled', 'disabledMsg']).disabledMsg
          } else {
            console.warn('[button.isDisabled]是一个函数，请在methods中增加[button.isDisabled]字段对应方法')
          }
        }
      } else {
        return ''
      }
      // button.isDisabled?(typeof(button.isDisabled)==='boolean'?button.rdesc:renderComp[button.isDisabled](scope.row,button,['disabled','disabledMsg']).disabledMsg):''
    },
    // 行内禁用按钮逻辑
    buttonDisabled (button, row) {
      if (button.isDisabled) {
        if (typeof (button.isDisabled) === 'boolean') {
          return button.isDisabled
        } else {
          if (typeof this.renderIntelligenceComp[button.isDisabled] === 'function') {
            return this.renderIntelligenceComp[button.isDisabled](row, button, ['disabled', 'disabledMsg']).disabled
          } else if (typeof this.renderComp[button.isDisabled] === 'function') {
            return this.renderComp[button.isDisabled](row, button, ['disabled', 'disabledMsg']).disabled
          } else {
            console.warn('[button.isDisabled]是一个函数，请在methods中增加[button.isDisabled]字段对应方法')
          }
        }
      } else {
        return false
      }
      // button.isDisabled ? (typeof (button.isDisabled) === 'boolean' ? button.isDisabled : renderComp[button.isDisabled](scope.row, button, ['disabled', 'disabledMsg']).disabled) : false
    },
    renderButtonData (record) {
      let that = this
      if (this.buttonData && this.buttonData.length) {
        let btnData = this.buttonData.map(o => ({ ...o }))
        let returnBtnData = []; let hiddenArr = []; let disabledArr = []; let titleArr = []
        if (that.buttonLimitFlag) {
          that.buttonData.map((item, index) => {
            // 按钮禁用逻辑
            if (item.disabledRules && item.disabledRules.disabled && item.disabledRules.disabled.length) {
              let disabledBoolean = false
              let btnDisabledTooltip = ''
              item.disabledRules.disabled.map((disItem, disIndex) => {
                let btnDisabled = disItem.status.indexOf(record[disItem.field])

                if (disItem.link) {
                  if ((disItem.link).toUpperCase() === 'AND') {
                    btnDisabledTooltip += ('与' + disItem.title[btnDisabled])
                    disabledBoolean = disabledBoolean && (btnDisabled !== -1)
                  } else if ((disItem.link).toUpperCase() === 'OR') {
                    btnDisabledTooltip += (disabledBoolean ? ((btnDisabled !== -1) ? ('或' + disItem.title[btnDisabled]) : '') : disItem.title[btnDisabled])
                    disabledBoolean = disabledBoolean || (btnDisabled !== -1)
                  }
                } else {
                  if (btnDisabled !== -1) {
                    disabledBoolean = true
                    btnDisabledTooltip += disItem.title[btnDisabled]
                  } else {
                    disabledBoolean = false
                  }
                }
              })
              if (disabledBoolean) {
                disabledArr.push(item.id)
                titleArr.push(btnDisabledTooltip + '时不可进行' + item.title + '操作')
              }
            }
            // 按钮隐藏逻辑
            if (item.disabledRules && item.disabledRules.hidden && item.disabledRules.hidden.length) {
              let hiddenBoolean = false
              item.disabledRules.hidden.map((hiddenItem, hiddenIndex) => {
                let btnHidden = hiddenItem.status.indexOf(record[hiddenItem.field])

                if (hiddenItem.link) {
                  if ((hiddenItem.link).toUpperCase() === 'AND') {
                    hiddenBoolean = hiddenBoolean && (btnHidden !== -1)
                  } else if ((hiddenItem.link).toUpperCase() === 'OR') {
                    hiddenBoolean = hiddenBoolean || (btnHidden !== -1)
                  }
                } else {
                  hiddenBoolean = (btnHidden !== -1)
                }
              })
              if (hiddenBoolean) {
                hiddenArr.push(item.id)
              }
            }
            // 自定义函数控制按钮禁用/提示及隐藏
            if (item.disabledRules && item.disabledRules.function) {
              item.isDisabled = item.disabledRules.function
            }
          })
          btnData.map((item, index) => {
            let disabledIndex = disabledArr.indexOf(item.id)
            if (disabledIndex !== -1) {
              item.isDisabled = true
              item.rdesc = titleArr[disabledIndex]
            }
            if (hiddenArr.indexOf(item.id) === -1) {
              returnBtnData.push(item)
            }
          })

          return returnBtnData
        } else {
          return btnData
        }
      } else {
        return []
      }
    },
    thirdMenuClick (record, item) {
      this.$emit('open-third-menu', record, item)
    },
    _initTableSize () {
      const vm = this
      let timer = null
      // 这里增加一个延迟保证不会触发频次不会太高,减少开销
      if (timer) return
      timer = setTimeout(() => {
        const mh = document.documentElement.clientHeight - vm.flex > this.minHeight
          ? (this.pagination ? (document.documentElement.clientHeight - vm.flex) : (document.documentElement.clientHeight - vm.flex + 40))
          : this.minHeight
        vm.flexHeight = vm.customHeight ? vm.customHeight + 'px' : mh + 'px'
        vm.calPageSize = Math.ceil((mh - 100) / 40)
        timer = null
      }, 300)
    },
    // 列表翻页
    changePage (current) {
      this.page.current = current
      this.$emit('change-page', current)
      this.queryList()
    },
    sortChange (column) {
      let sortObj = {
        column: column.prop,
        asc: column.order === 'ascending'
      }
      this.page.orders = [sortObj]
      this.queryList()
    },
    columnFiter (item) {
      const alias = item.filter.alias ? item.filter.alias : item.dataIndex
      this.columnFilterParam = { ...this.columnFilterParam, [alias]: item.filter.val }
      item.filter.visible = false
      this.$emit('column-fiter', this.columnFilterParam)
      this.queryList()
    },
    columnReset (item) {
      item.filter.val = ''
      let typeArray = ['multiple', 'checkboxGroup', 'datetimeRange']
      if (item.filter.type === 'treeSelect' && item.filter.multiple) {
        typeArray.push('treeSelect')
      }
      const alias = item.filter.alias ? item.filter.alias : item.dataIndex
      this.columnFilterParam = { ...this.columnFilterParam, [alias]: typeArray.indexOf(item.filter.type) > -1 ? [] : '' }
      // item.filter.visible = false
      this.$emit('column-fiter', this.columnFilterParam)
      this.queryList()
    },
    indexMethod (index) {
      if (this.pagination) {
        let pageSize = this.page.size
        let pageIndex = this.page.current
        return (index + 1) + (pageIndex - 1) * pageSize
      } else {
        return index + 1
      }
    },
    triggerEvent (event, record) {
      this.$emit(event, record)
    },
    select (selection, row) {
      if (isRadioSelect) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(row, true)
        if (this.radioSelectionRow) {
          this.radioSelectionRow.id === row.id && !selection.length && this.$refs.table.toggleRowSelection(row, false)
        } 
        this.radioSelectionRow = row
        if(selection.length === 0) this.radioSelectionRow = null
        const radioSelection = this.radioSelectionRow ? [this.radioSelectionRow] : []
        this.$emit('select', radioSelection, this.radioSelectionRow)
      } else {
        this.$emit('select', selection, row)
      }
    },
    selectAll (selection) {
      this.$emit('select-all', this.tableData)
    },
    headerCellClass (row) {
      if (this.disabledCheckAll || this.isRadioSelect) {
        if (row.columnIndex === 0) {
          return 'disabled-check-all'
        }
      }
      return ''
    },
    searchData () {
      if (this.pagination) {
        this.page.current = 1
      }
      this.queryList()
    },
    setItemKey (item) {
      item.key = item.id
      let that = this
      if (item.children && item.children.length > 0) {
        item.children.map(function (subItem, idx) {
          that.setItemKey(subItem)
        })
      }
    },
    queryList () {
      let params = { ...this.params, ...this.columnFilterParam }
      if (this.pagination) {
        params = {
          ...params,
          page: {
            current: this.page.current ? this.page.current : 1,
            size: this.page.size ? this.page.size : this.calPageSize,
            orders: this.page.orders ? this.page.orders : []
          }
        }
      }

      const that = this
      this.isListLoading = true
      this.tableRefresh(new Promise((resolve, reject) => {
        if (that.api) {
          that.$api[that.api](params).then(function (res) {
            that.isListLoading = false
            // 数据是否分页 进行处理 (暂时先这样)
            let data = null
            if (that.pagination) {
              if (that.useTreeFormat) {
                data = generateTree(res.records, that.useTreePId)
              } else {
                data = res.records
              }

              that.page = {
                total: res.total,
                current: that.page.current,
                size: res.size,
                orders: res.orders,
                onChange: that.changePage
              }
            } else {
              if (that.useTreeFormat) {
                data = generateTree(res.records ? res.records : res, that.useTreePId)
              } else {
                data = res.records ? res.records : res
              }
              that.page = false
            }

            if (data && data.length > 0) {
              data.forEach(function (item, idx) {
                that.setItemKey(item)
              })
            }
            that.tableData = data
            that.data = data
            that.$emit('requested-table-data', that.data)
            that.spanMargeArrHandle()
            setTimeout(() => {
              that.$refs.table.doLayout()
            })
            resolve(res)// 调用列表接口成功后的回调方法
          }).catch(function (error) {
            //   that.isListLoading = false
            //   console.log(error)
            reject(error) // 调用列表接口失败后的回调方法
          })
        }
      }))
    },
    commonConfirm (params) {
      return new Promise((resolve, reject) => {
        this.$confirm(params.content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: params.type ? params.type : 'warning'
        }).then(() => {
          this.$api[params.api](params.params).then(() => {
            this.$message({
              type: 'success',
              message: params.successMsg ? params.successMsg : '操作成功!'
            })
            resolve('success')
          }).catch(() => {
            this.$message({
              type: 'warning',
              message: params.errorMsg ? params.errorMsg : '操作失败!'
            })
          })
        }).catch((reject) => {
          this.$message({
            type: 'info',
            message: params.cancelMsg ? params.cancelMsg : '已取消操作!'
          })
          reject('error')
        })
      })
    },
    saveSettingHandle (updateColumns, tableSettingData) {
      const _this = this
      let obj = this.saveSettingOtherHandle()
      let params = [{
        id: obj.id,
        key: obj.key,
        description: obj.description,
        type: obj.type,
        value: JSON.stringify({ columns: tableSettingData })
      }]
      /** 使用$ajax请求: 是因为 this.$api请求会将请求参数处理成对象, 而保存设置接口请求参数为数组 */
      _this.$ajax.post(obj.postUrl, params, { headers: { 'Authorization': this.$store.getters.token } }).then(res => {
        _this.tableSettingVisible = false
        _this.$nextTick(function () {
          _this.renderColumns = updateColumns.map((item, index) => {
            item.isshow = tableSettingData[index].isshow
            item.fixed = tableSettingData[index].fixed
            return item
          })
        })
        // 更新vuex || this.$store.dispatch('getSettingAll')[dispatch会触发请求获取设置信息]
        this.$store.commit('SET_SETTING_ALL', res)
      }).catch(err => {
        console.log('user.setting.save--err', err)
      })
    },
    saveSettingOtherHandle () {
      const { devBaseUrl, prodBaseUrl, isDevMode } = this.api_default_config
      const urlPrefix = isDevMode ? `${devBaseUrl}` : `${prodBaseUrl}`
      const url = '/framework/user/setting/save'
      const p = this.constSettingParams
      const key = this.$route.path + '.' + this.api
      let tableSettingaAll = this.$store.state.user.userSettingAll.Table ? this.$store.state.user.userSettingAll.Table : null
      let id = null
      if (tableSettingaAll) {
        let columnsSetting = tableSettingaAll.filter(item => item.key === key)
        if (columnsSetting && columnsSetting.length) {
          id = columnsSetting[0].id
        }
      }
      return {
        postUrl: urlPrefix + url,
        id: id,
        key: key,
        description: p.description,
        type: p.type
      }
    },
    spanMargeArrHandle () {
      // table 合并的第一步: 获取指定合并列的key对应的合并信息
      let data = this.noApiTableData && this.noApiTableData.length ? this.noApiTableData : this.tableData
      this.rowspanObj = handleTableSpan(this.merageKeys, data)
    },
    margeHandle (tableObj) {
      // table 合并的第二步: 确认合并项
      return handleObjectSpanMethod(tableObj, this.merageKeys, this.rowspanObj)
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-button': Button,
    'el-tooltip': Tooltip,
    'el-divider': Divider,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    'el-input': Input,
    'el-popover': Popover,
    TableSetting,
    SearchFieldRender
  }
}
</script>
