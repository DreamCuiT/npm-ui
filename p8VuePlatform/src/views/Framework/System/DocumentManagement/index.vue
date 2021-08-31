<template>
    <normal-layout>
        <template #north v-if="viewType === 'table'">
            <common-button :comp="comp"
                           :button-config="buttonConfig"></common-button>
            <div class="upload-box">
                <common-upload :files="files" @upload="handleUpload" @remove="handleRemove"></common-upload>
            </div>
        </template>
        <template #west>
            <div style="padding: 10px">
                <search-form-list ref="search"
                                  searchWidth="100%"
                                  searchContainWidth="100%"
                                  labelWidth="70px"
                                  :dataSource="searchData"
                                  @search="search"
                                  @re-set="reSet">
                </search-form-list>
            </div>
            <div class="treeContain">
                <common-tree :treeApi="treeDataApi" :treeParam="treeParam" @select="onSelect"></common-tree>
            </div>
        </template>
        <template #center>
            <div v-if="viewType === 'table'">
                <common-table ref="table"
                              :comp="comp"
                              :columns="columns"
                              :params="queryParam"
                              :api="tableApi"
                              :table-Refresh="tableRefresh"
                              @select="recordSelected"
                              :pagination="true">
                </common-table>
            </div>
            <div v-else>
                <el-row>
                    <el-col :span="5" v-for="r in cardData" :key="r.id" :offset="cardData.length > 0 ? 1 : 0">
                        <el-card :body-style="{ padding: '0px' }">
                            <img src="" class="image">
                            <div style="padding: 14px;">
                                <span>{{ r.name }}</span>
                                <div class="bottom clearfix">
                                    <time class="time">{{ r.itemCreateTime }}</time>
                                    <el-button type="text" @click="download(r)" class="button">下载</el-button>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </template>
        <template #drawer-panel>
            <common-drawer v-if="isVisibleDocumentViewDrawer"
                           :title="documentViewDrawerTitle"
                           :visible="isVisibleDocumentViewDrawer"
                           placement="top"
                           size="50%"
                           @close="documentViewDrawerClose">
                <template #drawer>
                    <DocumentView :record="selectedRecord" @close="documentViewDrawerClose"></DocumentView>
                </template>
            </common-drawer>
            <common-drawer v-if="isVisibleDocumentEditDrawer"
                           :title="documentEditDrawerTitle"
                           :visible="isVisibleDocumentEditDrawer"
                           placement="top"
                           size="50%"
                           @close="documentEditDrawerClose">
                <template #drawer>
                    <DocumentEdit :record="selectedRecord" @close="documentEditDrawerClose"></DocumentEdit>
                </template>
            </common-drawer>
        </template>
    </normal-layout>
</template>

<script>
import { P8NormalLayout as NormalLayout } from '~/index'
import { P8Table as CommonTable } from '~/index'
import { P8Tree as CommonTree } from '~/index'
import { P8Drawer as CommonDrawer } from '~/index'
import { P8Button as CommonButton } from '~/index'
import { P8Upload as CommonUpload } from '~/index'
import { P8Search as SearchFormList } from '~/index'
import DocumentEdit from './edit'
import DocumentView from './view'
import { Card, Button, Row, Col } from '~/index'
import Vue from 'vue'
export default {
  name: 'DocumentManagement',
  components: {
    NormalLayout,
    CommonTable,
    CommonTree,
    CommonDrawer,
    CommonButton,
    DocumentEdit,
    DocumentView,
    CommonUpload,
    SearchFormList,
    'el-card': Card,
    'el-button': Button,
    'el-row': Row,
    'el-col': Col
  },
  props: {
    files: {
      type: Array,
      default: () => []
    },
    viewType: {
      type: String,
      default: () => { return 'table' }
    }
  },
  data: function () {
    return {
      comp: this,
      classify: [],
      queryParam: {},
      tableApi: 'documentManagement.listPage',
      cardApi: 'documentManagement.list',
      treeDataApi: 'documentManagement.getAllDicByCodeType',
      cardData: [],
      treeParam: { dicType: 'DOCUMENT_CLASSIFY' },
      isTreeSelectView: false,
      isVisibleDocumentViewDrawer: false,
      isVisibleDocumentEditDrawer: false,
      documentEditDrawerTitle: '文档修改',
      documentViewDrawerTitle: '文档查看',
      selectedRecord: undefined,
      uploadFiles: [],
      drawerConfig: {
        modal: false
      },
      buttonConfig: {
        icon: 'edit'
      },
      searchData: [
        {
          type: 'text',
          labelText: '文件名称',
          fieldName: 'name',
          placeholder: '请输入文件名称',
          colLayout: 'singleCol'
        }
      ],
      columns: [
        {
          title: '序号',
          type: 'index',
          minWidth: 55,
          align: 'center'
        },
        {
          title: '文件名称',
          dataIndex: 'name',
          width: 250,
          align: 'left'
        },
        {
          title: '文件描述',
          dataIndex: 'description',
          align: 'center'
        },
        {
          title: '上传人',
          dataIndex: 'createUserName',
          width: 100,
          align: 'center'
        },
        {
          title: '上传时间',
          dataIndex: 'itemCreateTime',
          width: 140,
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 120,
          align: 'center'
        }
      ]
    }
  },
  mounted () {
    this.isTreeSelectView = true
    if (this.viewType !== 'table') {
      this.queryData()
    }
  },
  methods: {
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    },
    onSelect (node) {
      this.queryParam.classify = node.id
      this.queryData()
    },
    save () {
      let this_ = this
      this.$api['documentManagement.save']({ uploadFiles: this.uploadFiles, classify: this.queryParam.classify ? this.queryParam.classify : 'dc_zff_01' }).then(res => {
        this_.$message({
          message: '操作成功',
          type: 'success'
        })
        this_.queryData()
      })
    },
    queryData (params) {
      let this_ = this
      this.queryParam = { ...this.queryParam, ...params }
      if (this_.viewType === 'table') {
        Vue.nextTick(function () {
          this_.$refs.table.queryList()
        })
      } else {
        this.$api[this_.cardApi](this.queryParam).then(res => {
          this_.cardData = res
        })
      }
    },
    documentViewDrawerClose () {
      this.isVisibleDocumentViewDrawer = false
    },
    documentEditDrawerClose () {
      this.isVisibleDocumentEditDrawer = false
    },
    recordSelected (record) {
      this.selectedRecord = record
    },
    view (record) {
      this.selectedRecord = record
      this.isVisibleDocumentViewDrawer = true
    },
    edit (record) {
      this.selectedRecord = record
      this.isVisibleDocumentEditDrawer = true
    },
    delete (record) {
      let this_ = this
      this.selectedRecord = record
      this.$api['documentManagement.delete']({ id: record.id }).then(res => {
        this_.queryData()
      })
    },
    handleUpload (file) {
      this.uploadFiles.push(file)
      this.save()
    },
    handleRemove (file) {
      let removeIndex = this.uploadFiles.findIndex((fileItem) => fileItem.filePath === file.filePath)
      this.uploadFiles.splice(removeIndex, 1)
      this.save()
    },
    download (r) {
      if (!r.attachmentId) {
        this.$message({
          type: 'error',
          message: '文件不存在'
        })
        return
      }
      this.$api['documentManagement.download']({ attachmentId: r.attachmentId }, { responseType: 'blob' }).then(backJson => {
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(new Blob([backJson.data]))
        link.download = r.name
        document.body.appendChild(link)

        link.click()
        window.URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      }).finally(() => {
      })
    },
    reSet () {
      let this_ = this
      Object.keys(this_.queryParam).forEach(key => { this_.queryParam[key] = null })
      Vue.nextTick(function () {
        this_.$refs.table.searchData()
      })
    },
    search (searchData) {
      this.queryData(searchData)
    }
  }
}
</script>

<style scoped>
    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .treeContain {
        width: 100%;
        height: calc(100% - 50px);
        overflow: auto;
        box-sizing: border-box;
    }
</style>
