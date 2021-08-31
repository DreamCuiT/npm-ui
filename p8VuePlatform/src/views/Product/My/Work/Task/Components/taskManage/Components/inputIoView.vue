<template>
  <div class="inputdata-view">
     <div class="edit-outputdata-view">
      <el-tag type="info">输入要求</el-tag>
      <ul class="file-list">
        <li v-for="(item,index) in inputRequest"
            :key="item.attId"
            :class="{ 'not-last': index < inputRequest.length -1 }">
          <p>
            <span class="label">输入要求</span>
            <span>{{item.descriptionStr}}</span>
          </p>
          <p>
            <span class="label">附件</span>
            <span class="filename" v-if="item.attFileName">
              <el-link @click="downloadOutputRequsetFile(item)"><i class="el-icon-document"></i>&nbsp;{{item.attFileName}}</el-link>
            </span>
          </p>
        </li>
      </ul>
    </div>
    <div class="input-view">
      <el-tag type="info">&nbsp;&nbsp;前置输出物</el-tag>
      <ul class="file-list">
        <li v-for="(item,index) in inputIoData"
            :key="item.attId"
            :class="{ 'not-last': index < inputIoData.length -1 }">
            <p class="">
              <span class="label">任务名称</span>
              <span>{{item.taskName}}</span>
            </p>
            <p>
              <span class="label">提交物名称</span>
              <span>{{item.aorName}}</span>
            </p>
            <p>
              <span class="label">补充说明</span>
              <span>{{item.aorDetail}}</span>
            </p>
            <p>
              <span class="label">附件</span>
              <span class="filename" v-if="item.attFileName">
                <el-link @click="downloadOutputRequsetFile(item)"><i class="el-icon-document"></i>&nbsp;{{item.attFileName}}</el-link>
                <span v-if="item.attConfidentialite">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;密级：<span v-text="confidentialiteLabel(item)"></span></span>
              </span>
            </p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Tag, Link } from '~/index'
export default {
  name: 'InputIo',
  inject: ['getPlanInfo'],
  components: {
    'el-tag': Tag,
    'el-link': Link
  },
  props: {
    inputIoData: {
      type: Array
    },
    inputRequest: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  methods: {
    downloadOutputRequsetFile (item) {
      if (item.attId) {
        this.$api['SystemSettings.getFileUrl']({ attachmentId: item.attId }, { responseType: 'blob' }).then(backJson => {
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(new Blob([backJson.data]))
          link.download = item.attFileName
          document.body.appendChild(link)

          link.click()
          window.URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        }).finally(() => {
          // this.search.exportLoading = false
        })
      }
    },
    confidentialiteLabel (item) {
      let conList = this.$store.state.user.confidentialiteList
      if (conList && conList.length) {
        let filterCon = conList.filter(con => con.value === item.attConfidentialite)
        if (filterCon.length) {
          return filterCon[0].label
        }
      }
      return ''
    }
  }
}
</script>
<style lang="scss">
.inputdata-view {
  position: relative;
  min-height: 40px;
  padding: 6px 0 6px 0px;
  box-sizing: border-box;
  .edit-outputdata-view,
  .input-view {
    position: relative;
    min-height: 50px;
    margin-left: 0;
    padding: 0 10px;
  }
  .title {
    position: absolute;
    left: 0px;
    width: 100px;
    text-align: center;
  }
  .file-list {
    li {
      box-sizing: border-box;
      padding: 0 10px;
      margin-left: 100px;
      &.not-last {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      p {
        margin: 10px 0 12px;
        padding: 0;
        display: flex;
        align-items: center;
        span.label {
          flex-basis: 14%;
          font-weight: bolder;
        }
        span.filename {
          flex: 1;
          display: flex;
          align-items: flex-start;
          a {
            flex-basis: 70%;
            justify-content: flex-start;
          }
        }
      }
    }
  }
}
</style>
