<template>
  <div :style="{ 'height': dialogMaxHeight }" >
      <div id="table-contain">
        <div class="resourceList" :style="{'width':resourceWidth}">
          <common-table ref='tableCom'
                      :columns='columns'
                      :params='formCompProp'
                      :api='tableApi'
                      :style="{height: customHeight + 'px'}"
                      :table-Refresh='tableRefresh'
                      :table-config='tableConfig'
                      :tableSetting="false"
                      :disabledCheckAll="true"
                      :pagination="false"
                      @row-click="rowClick"
                      @row-dblclick='rowDblclick'
                      @requested-table-data="requestedTableData">
                      <template #fileName="{scope}">
                        <i v-if="scope.row.a5FileUrl" class="p8 icon-conflict" @click="showUserLoad(scope.row)"></i>
                        <span   class="underline" @click="showFileLoad(scope.row)">{{ scope.row.fileName }}</span>
                      </template>
          </common-table>
        </div>
        <div class="resourceLoad" :style="{ 'height': dialogMaxHeight }"  >
            <iframe v-if="fileView" id="frame" name="frame" frameborder="0" :src="fileUrl" style="width:100%;height:100%;"  ></iframe>
        </div>
      </div>
  </div>
</template>
<style lang="scss" scoped>
  .date-range-con,
  .input-con {
    float: left;
    height: 30px;
    width:500px;
  }
  .input-con {
    margin-left: 10px;
  }
  .el-icon-d-arrow-right{
    float:right;
    font-size:20px;
    margin-top:6px;
    cursor:pointer;
  }
  .icon-conflict{
    cursor:pointer;
    font-size:20px;
    color:#ff0000;
  }
  .table-con .small-table {
    overflow-y: auto;
  }
  .resourceList{
    float:left;
    width:20%;
  }
  .resourceLoad{
    float:right;
    width:80%;
  }
</style>
<script>
import { P8Table as CommonTable } from '~/index'
const mh = document.documentElement.clientHeight
export default {
  name: 'ResourceSelect',
  components: {
    CommonTable
  },
  props: {
    formCompProp: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      comp: this,
      title: '查看文档',
      dialogMaxHeight: mh + 'px',
      fileUrl: '',
      fileView: false,
      tableApi: 'courtyardTask.getTaskOutputFile',
      tableConfig: {
        'highlight-current-row': true
      },
      resourceWidth: '20%',
      customHeight: mh,
      columns: [
        {
          align: 'center',
          width: 1
        },
        {
          title: '文档',
          dataIndex: 'fileName',
          align: 'left',
          minWidth: 200,
          scopedSlots: { customRender: 'custom' }
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    // 单击选中行
    rowClick (row, column, event) {
       this.showFileLoad(row)
    },
    // 双击行，直接关闭抽屉、回填值
    rowDblclick (row, column, event) {
       this.showFileLoad(row)
    },
    showFileLoad (row) {
     this.fileUrl = row.a5FileUrl
     if (this.fileUrl) {
        if (this.fileUrl.substring(0, 11) === 'VISIT_URL=/') {
          this.fileUrl = row.a5FileUrl.substring(11)
        }
        this.fileView = true
      } else {
     this.fileView = false
     if (row.attId) {
        this.$api['SystemSettings.getFileUrl']({ attachmentId: row.attId }, { responseType: 'blob' }).then(backJson => {
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(new Blob([backJson.data]))
          link.download = row.fileName
          document.body.appendChild(link)

          link.click()
          window.URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        }).finally(() => {

        })
      }
      }
    },

    requestedTableData (data) {
      let that = this
      if (data.length) {
        that.$nextTick(() => {
          data.map(item => {
            if (!that.fileUrl && item.a5FileUrl) {
                that.fileUrl = item.a5FileUrl
              if (item.a5FileUrl.substring(0, 11) === 'VISIT_URL=/') {
                that.fileUrl = item.a5FileUrl.substring(11)
              }
              that.fileView = true
            }
          })
        })
      }
    },
    tableRefresh (param) {
      param.then(() => {
        console.log('异步成功后端做的操作')
      }).catch(() => {
        console.log('异步失败的操作')
      })
    }
  }

}

</script>
