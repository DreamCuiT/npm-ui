<template>
  <list-layout>
    <template #north>
      <el-button @click="createImport">导入</el-button>
    </template>
    <template #center>
      <common-tabs :tabsData="tabsData" height="auto" :activeTabs="activeTabs">
        <template #myDate>
          <common-infinite-scroll :listApi="listApi" :activeItem="2">
            <template #list="{item,index}">
              <el-row type="flex" style="text-align: left; height:30px">
                  <el-col :span="4" style="text-align: center">{{index+1}}</el-col>
                  <el-col :span="20">{{item.meaning}}</el-col>
              </el-row>
            </template>
          </common-infinite-scroll>
        </template>
        <template #myWork>
          <common-card>
            <template #header>
              <span>卡片名称</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </template>
            <template #content>
              <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
              </div>
            </template>
          </common-card>
        </template>
        <template #myTask>
          我的任务
        </template>
      </common-tabs>
      <common-drawer
        title="导入"
        :visible="drawerImport"
        direction="rtl"
        size="50%"
        @close="onEditImportClose"
      >
        <template #drawer>
          <common-import :fields="importData" :formData="formData" :uploadApi="uploadApi"></common-import>
        </template>
      </common-drawer>
    </template>
  </list-layout>
</template>

<script>
import { Button, Row, Col } from '~/index'
import { P8ListLayout as ListLayout } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Import as CommonImport } from '~/index'
import { P8Tabs as CommonTabs } from '~/index'
import { P8InfiniteScroll as CommonInfiniteScroll } from '~/index'
import { P8Card as CommonCard } from '~/index'

export default {
  name: 'Import',
  data () {
    return {
      activeTabs: 'myWork',
      tabsData: [
        {
          label: '无限滚动InfiniteScroll',
          name: 'myDate',
          icon: 'icon-log-list'
        },
        {
          label: '统计卡片',
          name: 'myWork',
          icon: 'icon-add'
        },
        {
          label: '我的任务',
          name: 'myTask',
          icon: 'icon-my-task'
        }
      ],
      searchData: [
        {
          type: 'text', // 控件类型
          labelText: '用户名称', // 控件显示的文本
          fieldName: 'userName',
          placeholder: '请输入用户名或姓名', // 默认控件的空值文本
          fieldEvent: {
            'click': 'clickEvent(this)'
          }
        },
        {
          type: 'checkbox', // 控件类型
          labelText: '已锁定', // 控件显示的文本
          fieldName: 'lockStatus',
          defaultValue: false
        }
      ],
      formData: Object.assign({}, {
        confidentialiteList: []
      }),
      importData: {
        type: 'upload', // 控件类型
        labelText: '上传附件', // 控件显示的文本
        fieldName: 'importFiles',
        colLayout: 'singleCol',
        uploadConfig: {
          drag: true// 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
        },
        listType: 'secret'// 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
      },
      drawerImport: false,
      uploadApi: '/attachment/upload',
      listApi: 'secretLevel.list'
    }
  },
  methods: {
    createImport () {
      this.drawerImport = true
    },
    onEditImportClose () {
      this.drawerImport = false
    }
  },
  components: {
    'el-button': Button,
    'el-row': Row,
    'el-col': Col,
    ListLayout,
    CommonDrawer,
    CommonImport,
    CommonTabs,
    CommonInfiniteScroll,
    CommonCard
  }
}
</script>
<style scoped>
</style>
