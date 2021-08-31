<template>
      <div class="versiondata-view">
        <div class="title">特别说明:</div>
        <ul class="file-list">
          <li
            v-for="(item,index) in versionData"
            :key="item.attId"
            :class="{ 'not-last': index < versionData.length -1 }"
          >
            <p>
              文件:
              <span class="filename" @click="downloadOutputRequsetFile(item)">{{item.attFileName}}</span>
            </p>
            <p>说明: {{item.aoDescribes}}</p>
          </li>
        </ul>
      </div>
</template>
<script>
export default {
  name: 'Version',
  inject: ['getPlanInfo'],
  components: {

  },
  props: {
    versionData: {
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
          link.download = item.attFilePath
          document.body.appendChild(link)

          link.click()
          window.URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        }).finally(() => {
        // this.search.exportLoading = false
        })
      }
    }
  }
}
</script>
<style lang="scss">
.versiondata-view {
  background-color: rgba(239, 239, 239, 0.5);
  position: relative;
  min-height: 40px;
  padding: 6px 0 6px 100px;
  box-sizing: border-box;
  .title {
    position: absolute;
    left: 0px;
    width: 100px;
    text-align: center;
  }
  .file-list {
    margin-top: -6px;
    li {
      box-sizing: border-box;
      list-style: decimal;
      padding: 0 10px;
      margin-left: 20px;
      &.not-last {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      p {
        margin: 8px 0;
        padding: 0;
      }
      p span.filename {
        cursor: pointer;
      }
    }
  }
}
</style>
