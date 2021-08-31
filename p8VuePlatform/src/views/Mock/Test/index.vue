<template>
  <normal-layout>
    <template #north>
      <common-button
        :comp="comp"
        :selectRecords="selectRecords"
      ></common-button>
      <el-button type="primary" round @click="createProject('form')"
        >新建test</el-button
      >
      <el-button type="primary" round @click="dialogTest"
        >测试dialog拖拽</el-button
      >
      <el-button type="primary" round @click="createProject('formView')"
        >form查看带文件</el-button
      >
      <el-button type="primary" round @click="createProject('singleFile')"
        >文件查看</el-button
      >
      <el-button type="primary" round @click="createProject('monitor')"
        >锚点导航</el-button
      >
      <search-form-list
        ref="search"
        :dataSource="searchData"
        @search="search"
        @re-set="reSet"
      ></search-form-list>
    </template>
    <template #west>
      <common-tree :tree-api="treeApi" @select="onSelect"></common-tree>
    </template>
    <template #center>
      <common-table
        ref="table"
        :columns="columns"
        :tableRefresh="tableRefresh"
        :params="queryParam"
        :comp="comp"
        :noApiTableData="noApiTableData"
      >
        <template #icon="{ scope }">
          <common-status-icon
            statusName="planStatus"
            statusKey="1000"
            @iconClick="iconEdit(scope.row)"
          ></common-status-icon>
        </template>
      </common-table>
      <common-drawer
        title="表单页面"
        :visible="drawer"
        :direction="direction"
        size="50%"
        @close="onEditUserClose"
      >
        <template #drawer>
          <template v-if="drawerContent === 'form'">
            <form-list
              ref="form"
              :dataSource="dataSource"
              :form="formData"
              :api="saveApi"
              @saved="saved"
              labelWidth="100px"
              @rendered="rendered"
            >
              <template #password>
                <el-alert title="成功提示的文案" type="success"></el-alert>
              </template>
            </form-list>
          </template>
          <template v-if="drawerContent === 'formView'">
            <form-list
              ref="form"
              @rendered="rendered"
              @saved="() => {}"
              :dataSource="formViewData"
              :form="formData"
              :api="saveApi"
              labelWidth="100px"
              :existDefaultBtn="false"
            >
              <template #password>
                <el-alert title="成功提示的文案" type="success"></el-alert>
              </template>
            </form-list>
          </template>
          <template v-if="drawerContent === 'singleFile'">
            <common-file-view
              :uploadFiles="uploadFiles"
              filesLayout="card"
            ></common-file-view>
          </template>
          <template v-if="drawerContent === 'monitor'">
            <anchor
              placement="right"
              :menu="anchorMenu"
              :menuKey="{ label: 'label', value: 'value' }"
            >
              <template #monit1>
                <monitor-edit></monitor-edit>
              </template>
              <template #dep1>
                <dependence-edit></dependence-edit>
              </template>
              <template #monit2>
                <monitor-edit></monitor-edit>
              </template>
              <template #dep2>
                <dependence-edit></dependence-edit>
              </template>
              <template #monit3>
                <monitor-edit></monitor-edit>
              </template>
              <template #dep3>
                <dependence-edit></dependence-edit>
              </template>
              <template #monit4>
                <monitor-edit></monitor-edit>
              </template>
              <template #dep4>
                <dependence-edit></dependence-edit>
              </template>
              <template #monit5>
                <monitor-edit></monitor-edit>
              </template>
              <template #dep5>
                <dependence-edit></dependence-edit>
              </template>
              <template #monit6>
                <monitor-edit></monitor-edit>
              </template>
              <template #dep6>
                <dependence-edit></dependence-edit>
              </template>
            </anchor>
          </template>
        </template>
      </common-drawer>
      <dialog-test :visible="dialogVisible" title="拖拽" @close="closeDialog" @handle-cancel="closeDialog" @handle-ok="closeDialog">
        <template #dialog>
          <common-table
            ref="table"
            :columns="columns"
            :tableRefresh="tableRefresh"
            :params="queryParam"
            :comp="comp"
            :noApiTableData="noApiTableData"
          >
            <template #icon="{ scope }">
              <common-status-icon
                statusName="planStatus"
                statusKey="1000"
                @iconClick="iconEdit(scope.row)"
              ></common-status-icon>
            </template>
          </common-table>
        </template>
      </dialog-test>
    </template>
  </normal-layout>
</template>

<script>
import Vue from 'vue'
import { Alert, Button } from '~/index'
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8Form as FormList } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import { P8FileView as CommonFileView } from '~/index' // 单独附件查看
import MonitorEdit from '@/views/Product/Pm/Plan/Components/monitorEdit/index2'
import DependenceEdit from '@/views/Product/Pm/Plan/Components/dependenceEdit/index2'
import { P8Anchor as Anchor } from '~/index'
import { P8StatusIcon as CommonStatusIcon } from '~/index'
import { P8Dialog as DialogTest } from '~/index'
export default {
  name: 'Test',
  data () {
    return {
      dialogVisible: false,
      // selectRecords: [
      //   {
      //     userName: '张三',
      //     realName: 'zhangsan',
      //     deptName: '部门1',
      //     status: '1',
      //     lockStatus: true,
      //     isUse: true
      //   },
      //   {
      //     userName: '李四',
      //     realName: 'lisi',
      //     deptName: '部门2',
      //     status: '2',
      //     lockStatus: true,
      //     isUse: true
      //   },
      //   {
      //     userName: '王五',
      //     realName: 'wangwu',
      //     deptName: '部门3',
      //     status: '4',
      //     lockStatus: false,
      //     isUse: true
      //   }
      // ],
      selectRecords: [],
      noApiTableData: [
        {
          userName: '张三',
          realName: 'zhangsan',
          deptName: '部门1',
          status: '1',
          lockStatus: true,
          isUse: true
        },
        {
          userName: '李四',
          realName: 'lisi',
          deptName: '部门2',
          status: '2',
          lockStatus: true,
          isUse: true
        },
        {
          userName: '王五',
          realName: 'wangwu',
          deptName: '部门3',
          status: '4',
          lockStatus: false,
          isUse: true
        },
        {
          userName: '马六',
          realName: 'maliu',
          deptName: '部门4',
          status: '4',
          lockStatus: false,
          isUse: false
        }
      ],
      searchData: [
        {
          type: 'text', // 控件类型
          labelText: '用户名称', // 控件显示的文本
          fieldName: 'userName',
          defaultValue: '',
          colLayout: 'doubleCol',
          placeholder: '请输入用户名或姓名', // 默认控件的空值文本
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          type: 'checkbox', // 控件类型
          labelText: '已锁定', // 控件显示的文本
          defaultValue: false,
          colLayout: 'doubleCol',
          fieldName: 'lockStatus'
        }
      ],
      queryParam: {},
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '标识',
          dataIndex: 'icon',
          width: 60,
          scopedSlots: { customRender: 'custom' },
          align: 'center'
        },
        {
          title: '用户名称',
          dataIndex: 'userName',
          filterable: true, // 列上增加输入框搜索
          filter: {
            inputVal: '',
            visible: false
          },
          align: 'center'
        },
        {
          title: '真实名字',
          dataIndex: 'realName',
          sortable: true, // 服务器端排序
          align: 'center'
        },
        {
          title: '所属部门',
          dataIndex: 'deptName',
          columnConfig: { // 表格列内容过长隐藏并显示Tooltip
            'show-overflow-tooltip': true
          },
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center'
        },
        {
          title: '锁定',
          dataIndex: 'lockStatus',
          align: 'center'
        },
        {
          title: '是否使用',
          dataIndex: 'isUse',
          align: 'center'
        },
        // {
        //   title: '新增列',
        //   dataIndex: 'newAdd'
        // },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 300,
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      // formData: Object.assign({}, {
      //   // hiddenId: '',
      //   // checkboxGroup: [],
      //   // detailList: [
      //   // // {
      //   // //   roleName: '',
      //   // //   sysName: ''
      //   // // }
      //   // ]
      //   // confidentialiteList: []
      // }),
      formData: {
        confidentialiteList: []
      },
      dataSource: [
        {
          labelText: '增删行',
          type: 'addField', // 控件类型--增删行
          colLayout: 'singleCol',
          fieldName: 'detailList', // 保存时格式，类似detailList[0].roleName
          addFieldLayout: 'vertical',
          children: [
            {
              type: 'text', // 控件类型
              fieldName: 'roleName',
              placeholder: '请输入角色名称', // 默认控件的空值文本
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ]
            },
            {
              type: 'upload', // 控件类型
              labelText: '上传附件', // 控件显示的文本
              fieldName: 'uploadFiles',
              colLayout: 'singleCol',
              defaultValue: [],
              uploadConfig: {
                // drag: true// 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
              },
              listType: 'secret'// 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
            }
          ]
        },
        {
          type: 'text',
          labelText: '用户名称',
          fieldName: 'userName',
          placeholder: '请输入用户名称',
          tip: '输入要求：必须为包含大写字母，小写字母，下划线',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              message: '必填'
            }
            // ,
            // {
            //   validator: (rule, value, callback) => {
            //     if (!value) {
            //       // callback 是提示的信息
            //       return callback(new Error('团队名不能为空'))
            //     } else {
            //       // 调用封装了的异步效验方法，
            //       this.$api['menu.list']().then(response => {
            //         if (response.result.errcode !== '0') {
            //           console.log('效验失败')
            //         } else {
            //           if (response.body[0] === 0) {
            //             console.log(response.body[0])
            //             callback()
            //           } else {
            //             callback()
            //           }
            //         }
            //       })
            //     }
            //   },
            //   trigger: 'blur'
            // }
          ]
        },
        {
          type: 'number',
          labelText: '数字输入框',
          fieldName: 'number',
          colLayout: 'doubleCol',
          placeholder: '这只是一个数字的文本输入框',
          min: 0,
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          type: 'textarea',
          labelText: '文本区域',
          fieldName: 'textarea',
          colLayout: 'singleCol',
          placeholder: '请输入文本内容',
          rules: [
            {
              required: true,
              message: '必填'
            }
          ]
        },
        {
          type: 'blank',
          labelText: '插槽',
          slotName: 'password',
          fieldName: 'password',
          colLayout: 'doubleCol'
        },
        {
          type: 'select',
          labelText: '下拉框',
          fieldName: 'select',
          placeholder: '下拉选择你要的',
          colLayout: 'doubleCol',
          options: [
            {
              label: 'text1',
              value: '0'
            },
            {
              label: 'text2',
              value: '1'
            }
          ]
        },
        {
          type: 'multiple',
          labelText: '角色',
          defaultValue: [],
          fieldName: 'role',
          colLayout: 'singleCol',
          options: [
            {
              label: '系统管理员',
              value: '0'
            },
            {
              label: '风控管理员',
              value: '1'
            },
            {
              label: '催收管理员',
              value: '2'
            },
            {
              label: '催收员',
              value: '3'
            },
            {
              label: '审核员',
              value: '4'
            },
            {
              label: '财务',
              value: '5'
            }
          ]
        },
        {
          type: 'datetime',
          labelText: '日期选择',
          fieldName: 'datetime',
          colLayout: 'doubleCol',
          placeholder: '选择日期'
        },
        {
          type: 'datetimeRange',
          labelText: '日期范围选择',
          fieldName: 'datetimeRange',
          colLayout: 'singleCol',
          placeholder: '选择日期'
        },
        {
          type: 'radio',
          labelText: '单选框',
          fieldName: 'radio',
          colLayout: 'doubleCol',
          options: [
            {
              label: '选项1',
              value: '0'
            },
            {
              label: '选项2',
              value: '1'
            }
          ]
        },
        {
          type: 'checkbox',
          labelText: '复选框',
          fieldName: 'checkbox',
          defaultValue: true,
          label: '不能为空',
          colLayout: 'doubleCol'
        },
        {
          type: 'checkboxGroup',
          labelText: '复选框组',
          fieldName: 'checkboxGroup',
          defaultValue: ['Apple'],
          options: [
            { label: 'Apple2', value: 'Apple1' },
            { label: 'Pear2', value: 'Pear1' },
            { label: 'Orange2', value: 'Orange1' }
          ],
          colLayout: 'singleCol'
        },
        {
          type: 'switch',
          labelText: '开关',
          fieldName: 'switch',
          colLayout: 'doubleCol'
        },
        {
          type: 'treeSelect', // 控件类型--treeSelect 一般用于类似部门树形结构
          labelText: '所属部门',
          defaultValue: [],
          // optionUrl: {
          //   api: 'departmentManger.deptTree',
          //   params: { deptId: '' },
          //   pId: 'pId' // 平行数据处理成树形数据的依据 -- 值为pId时可以不声明
          // },
          fieldName: 'deptId',
          placeholder: '请选择所属部门',
          colLayout: 'singleCol',
          clearable: true,
          defaultExpandAll: true,
          multiple: false,
          disabled: false,
          checkStrictly: true,
          treeData: [ // 树形控件的某项禁用-- 数据中存在 disabled:true 时直接禁用
            {
              label: '新疆维吾尔自治区',
              value: '1',
              disabled: true,
              children: [
                {
                  label: '乌鲁木齐市',
                  value: '2',
                  children: [
                    { label: '达坂城区', value: '7', children: [] },
                    { label: '头屯河区', value: '8', children: [] },
                    { label: '乌鲁木齐县', value: '9', children: [] }
                  ]
                },
                {
                  label: '克拉玛依市',
                  disabled: 'false',
                  value: '3',
                  children: [
                    { label: '克拉玛依区', value: '10', children: [] },
                    { label: '白碱滩区', value: '11', children: [] },
                    { label: '独山子区', value: '12', disabled: 'true', children: [] }
                  ]
                },
                { label: '吐鲁番地区', value: '4', children: [] },
                { label: '哈密地区', value: '5', children: [] },
                { label: '昌吉回族自治州', value: '6', children: [] }
              ]
            }
          ],
          treeProps: {
            value: 'value',
            children: 'children',
            label: 'label'
          },
          disabledValues: [],
          rules: [
            {
              required: true,
              message: '必须选择部门',
              trigger: 'input'
            }
          ],
          readonly: false
        }
        // {
        //   type: 'upload', // 控件类型
        //   labelText: '上传附件', // 控件显示的文本
        //   fieldName: 'uploadFiles',
        //   colLayout: 'singleCol',
        //   uploadConfig: {
        //     // drag: true// 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
        //   },
        //   listType: 'secret'// 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
        // }
      ],
      formViewData: [
        {
          type: 'view',
          labelText: '用户名称',
          fieldName: 'userName',
          placeholder: '请输入用户名称',
          tip: '输入要求：必须为包含大写字母，小写字母，下划线',
          colLayout: ''
        },
        {
          type: 'view',
          labelText: '文本区域',
          fieldName: 'textarea',
          colLayout: 'singleCol',
          placeholder: '请输入文本内容'
        },
        {
          type: 'view',
          labelText: '下拉框',
          fieldName: 'select',
          placeholder: '下拉选择你要的',
          colLayout: 'singleCol'
        },
        {
          type: 'uploadView', // form查看带文件
          filesLayout: 'row', // 附件展示类型[row / card; 默认card]
          labelText: '文件',
          fieldName: 'uploadFiles',
          placeholder: '',
          colLayout: ''
        },
        {
          labelText: '增删行',
          type: 'addField',
          isView: true, // 新增 isView字段: 表示增删行是否是查看(true:会隐藏掉添加行和删除行按钮)
          colLayout: 'singleCol',
          fieldName: 'detailList',
          addFieldLayout: 'vertical',
          children: [
            {
              type: 'view', // 控件类型
              labelText: '角色名称',
              fieldName: 'roleName',
              placeholder: '请输入角色名称',
              tip: 'tip-tip-tip-tip'
            },
            {
              type: 'uploadView', // 增删行中附件查看
              filesLayout: 'card', // 附件展示类型[row / card; 默认card]
              labelText: '附件查看',
              fieldName: 'uploadFiles',
              colLayout: 'singleCol'
            }
          ]
        }
      ],
      drawer: false,
      drawerContent: '',
      direction: 'rtl',
      saveApi: '',
      treeApi: 'menu.list',
      comp: this,
      uploadFiles: [],
      anchorMenu: [
        { label: '任务标识1', value: 'monit1' },
        { label: '前后置1', value: 'dep1' },
        { label: '任务标识2', value: 'monit2' },
        { label: '前后置2', value: 'dep2' },
        { label: '任务标识3', value: 'monit3' },
        { label: '前后置3', value: 'dep3' },
        { label: '任务标识4', value: 'monit4' },
        { label: '前后置4', value: 'dep4' },
        { label: '任务标识5', value: 'monit5' },
        { label: '前后置5', value: 'dep5' },
        { label: '任务标识6', value: 'monit6' },
        { label: '前后置6', value: 'dep6' }
      ]
    }
  },
  mounted () {
    this.getTempData()
  },
  methods: {
    dialogTest () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
    },
    iconEdit (row) {
      console.log(row, 'row')
    },
    testFunction () {
      console.log('testfunction')
      return {
        disabled: true,
        disabledMsg: '删除禁用'
      }
    },
    rendered () {
      // 所有表单元素渲染后调用rendered
    },
    getTempData () {
      const _this = this
      this.$api['taskManager.getOutputIo']({ taskId: '100100' }).then(res => {
        let detailList = [
          {
            roleName: 'yk',
            uploadFiles: [
              {
                confidentialite: '9003',
                customItem1: null,
                customItem2: null,
                customItem3: null,
                customItem4: null,
                customItem5: null,
                entityId: null,
                entityName: null,
                fileName: '改车预算1111.doc',
                filePath: '/upload/2020-06/202006091606226_d65673557bd047d8aae4',
                fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                id: null,
                itemCreateTime: null,
                moduleId: null,
                sysuserId: null,
                type: null,
                uploadUser: null,
                version: null
              }
            ]
          },
          {
            roleName: 'bm',
            uploadFiles: [
              {
                'id': null,
                'sysuserId': null,
                'moduleId': null,
                'entityName': null,
                'entityId': null,
                'fileName': '烘培笔记-6寸戚风蛋糕.pdf',
                'itemCreateTime': null,
                'version': null,
                'fileType': 'text/plain',
                'filePath': '/upload/2020-06/202006091606236_5fabe2f6d3de4ba398f3',
                'type': null,
                'confidentialite': '9004',
                'uploadUser': null,
                'customItem1': null,
                'customItem2': null,
                'customItem3': null,
                'customItem4': null,
                'customItem5': null
              }
            ]
          }
        ]
        let uploadFiles = [
          {
            confidentialite: '9004',
            customItem1: null,
            customItem2: null,
            customItem3: null,
            customItem4: null,
            customItem5: null,
            entityId: null,
            entityName: null,
            fileName: '改车预算1111.doc',
            filePath: '/upload/2020-06/202006091606226_d65673557bd047d8aae4',
            fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            id: null,
            itemCreateTime: null,
            moduleId: null,
            sysuserId: null,
            type: null,
            uploadUser: null,
            version: null
          },
          {
            confidentialite: '9004',
            customItem1: null,
            customItem2: null,
            customItem3: null,
            customItem4: null,
            customItem5: null,
            entityId: null,
            entityName: null,
            fileName: '周计划安排.xlsx',
            filePath: '/upload/2020-06/202006091606226_d65673557bd047d8aae4',
            fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            id: null,
            itemCreateTime: null,
            moduleId: null,
            sysuserId: null,
            type: null,
            uploadUser: null,
            version: null
          },
          {
            'id': null,
            'sysuserId': null,
            'moduleId': null,
            'entityName': null,
            'entityId': null,
            'fileName': '烘培笔记-6寸戚风蛋糕.pdf',
            'itemCreateTime': null,
            'version': null,
            'fileType': 'text/plain',
            'filePath': '/upload/2020-06/202006091606236_5fabe2f6d3de4ba398f3',
            'type': null,
            'confidentialite': '9003',
            'uploadUser': null,
            'customItem1': null,
            'customItem2': null,
            'customItem3': null,
            'customItem4': null,
            'customItem5': null
          }

        ]
        let Obj = {
          userName: '张三',
          number: 3,
          datetime: '2020-03-01',
          textarea: '选项1',
          select: '0',
          role: '0',
          checkbox: true,
          datetimeRange: ['2020-07-12', '2020-07-23'],
          radio: '0',
          checkboxGroup: ['Apple1', 'Pear1'],
          switch: true,
          detailList: detailList,
          deptId: '1',
          uploadFiles: uploadFiles
        }
        _this.formData = { ..._this.formData, ...Obj }
        _this.uploadFiles = uploadFiles
        console.log('form-rendered', _this.formData)
      })
    },
    createProject (type) {
      console.log('click')
      this.drawer = true
      this.drawerContent = type
    },
    schedulerTaskNormal (record) {
      console.log(record, 'record')
    },
    iconClick (record) {
      console.log(record, 'record---icon')
    },
    nameClick (record) {
      console.log(record, 'record---name')
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    saved () {
      console.log('修改页面关闭时的回调方法')
      this.$refs.table.searchData()
      this.onEditUserClose()
    },
    onEditUserClose () {
      this.drawer = false
      this.drawerContent = ''
    },
    search (param) {
      let newParams = { ...param, ...(this.queryParam.deptId ? { deptId: this.queryParam.deptId } : {}) }
      this.queryParam = newParams
      let that = this
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    reSet () {
      let deptId
      if (this.queryParam.deptId) {
        deptId = this.queryParam.deptId
      }
      let that = this
      Object.keys(that.queryParam).forEach(function (key) { return (that.queryParam[key] = '') })
      if (deptId) {
        this.queryParam.deptId = deptId
      }
      Vue.nextTick(function () {
        that.$refs.table.searchData()
      })
    },
    onSelect (obj) {
      console.log(obj, 'obj')
      this.queryParam.deptId = obj.id
      this.$refs.table.searchData()
    }
  },
  components: {
    'el-alert': Alert,
    'el-button': Button,
    NormalLayout,
    CommonTable,
    CommonButton,
    CommonTree,
    FormList,
    CommonDrawer,
    SearchFormList,
    CommonFileView,
    MonitorEdit,
    DependenceEdit,
    Anchor,
    CommonStatusIcon,
    DialogTest
  }
}
</script>
<style scoped>
</style>
