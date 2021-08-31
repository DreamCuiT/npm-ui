<template>
  <div class="ele-steps-wrap">
    <!-- <div class="ele-steps-slider">
      <ul class="ele-steps-slider__ul">
        <li
          v-for="(item,index) in steps"
          :key="item.id"
          :class="{'active':selectStepsId===item.id}"
          @click="stepsSliderClickHandle(item, index)"
        >
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div> -->
    <div class="ele-steps-content">
      <div class="content-header">
        <span v-for="item in header"
              :key="item.id"
              :class="'header ' + item.id">{{item.name}}</span>
      </div>
      <VuePerfectScrollbar ref="scrollarea"
                           class="scroll-area"
                           :settings="scrollSetting"
                           @ps-scroll-y="psScrollYHandle"
                           @ps-scroll-up="psScrollUpHandle"
                           @ps-scroll-down="psScrollDownHandle"
                           @ps-y-reach-end="psScrollEndHandle">
        <div v-for="(item,index) in steps"
             :key="item.id"
             :id="`stepsBody${index}`"
             :ref="item.id"
             class="content-list-wrap"
             :class="{'activeAni':item.id === selectStepsId}">
          <div class="content-list-cont">
            <div class="classify">
              <el-tag style="width:65px"
                      v-if="item.id === 'activityDesc'">活动描述</el-tag>
              <el-tag style="width:65px"
                      v-if="item.id === 'putin'">输入</el-tag>
              <el-tag style="width:65px"
                      v-if="item.id === 'output'">输出</el-tag>
              <el-tag style="width:65px"
                      v-if="item.id === 'varsion'">特别说明</el-tag>
            </div>
            <div class="list-con">
              <template v-if="item.id === 'activityDesc'">
                <template v-if="activityDescData && activityDescData.length">
                  <div v-for="(citem,cindex) in activityDescData"
                       :key="cindex"
                       class="list-con-item">
                    <div class="list-con-item__content request">
                      <el-tooltip placement="top"
                                  :content="citem.description">
                        <span>{{citem.description}}</span>
                      </el-tooltip>
                    </div>
                    <div class="list-con-item__content remark"></div>
                    <div class="list-con-item__content file"></div>
                  </div>
                </template>
                <template v-else>
                  <div class="no-info">
                    <span>暂无信息</span>
                  </div>
                </template>
              </template>
              <template v-if="item.id === 'putin'">
                <template v-if="inputIoData && inputIoData.length">
                  <div v-for="citem in inputIoData"
                       :key="citem.aoId"
                       class="list-con-item">
                    <div class="list-con-item__content request">
                      <el-tooltip placement="top"
                                  :content="citem.aorName">
                        <span>{{citem.aorName}}</span>
                      </el-tooltip>
                    </div>
                    <div class="list-con-item__content remark">{{citem.aorDetail || ''}}</div>
                    <div class="list-con-item__content file"
                         @click="downloadOutputRequsetFile(citem)">
                      <i class="el-icon-link"
                         v-show="citem.attFileName"
                         style="font-size: 14px"></i>
                      <span>{{citem.attFileName}}</span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="no-info">
                    <span>暂无信息</span>
                  </div>
                </template>
              </template>
              <template v-if="item.id === 'output'">
                <template v-if="outputIoData && outputIoData.length">
                  <div v-for="citem in outputIoData"
                       :key="citem.aorId"
                       class="list-con-item">
                    <div class="list-con-item__content request">
                      <el-tooltip placement="top"
                                  :content="citem.aorName">
                        <span>{{citem.aorName}}</span>
                      </el-tooltip>
                    </div>
                    <div class="list-con-item__content remark">{{citem.aorDetail}}</div>
                    <div class="list-con-item__content file"
                         @click="downloadOutputRequsetFile(citem)">
                      <i class="el-icon-link"
                         style="font-size: 14px"></i>
                      <span>{{citem.attFileName}}</span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="no-info">
                    <span>暂无信息</span>
                  </div>
                </template>
              </template>
              <template v-if="item.id === 'varsion'">
                <template v-if="specialVersionData && specialVersionData.length">
                  <div v-for="citem in specialVersionData"
                       :key="citem.aorId"
                       class="list-con-item">
                    <div class="list-con-item__content request">
                      <el-tooltip placement="top"
                                  :content="citem.aoDescribes">
                        <span>{{citem.aoDescribes}}</span>
                      </el-tooltip>
                    </div>
                    <div class="list-con-item__content remark">{{citem.aorDetail}}</div>
                    <div class="list-con-item__content file"
                         @click="downloadOutputRequsetFile(citem)">
                      <i class="el-icon-link"
                         style="font-size: 14px"></i>
                      <span>{{citem.attFileName}}</span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="no-info">
                    <span>暂无信息</span>
                  </div>
                </template>
              </template>
            </div>
            <div class="operation">
              <button-group :buttonGroup="item.btns"
                            :stepsRow="item"
                            :comp="comp"></button-group>
            </div>
          </div>
        </div>
      </VuePerfectScrollbar>
    </div>
    <common-drawer size="50%"
                   class="manager-drawer"
                   :title="drawerTitle"
                   :visible="drawerVisible"
                   :drawerConfig="drawerConfig"
                   @close="onDrawerClose">
      <template #drawer>
        <template v-if="drawerViewVisible === 'activityDesc'">
          <activity-desc-edit-view :activityDescData="activityDescData"
                                   @editSaveOK="editSaveOK"></activity-desc-edit-view>
        </template>
        <template v-if="drawerViewVisible === 'putin'">
          <input-io-view :inputIoData="inputIoData"
                         :inputRequest="inputRequestData"></input-io-view>
        </template>
        <template v-if="drawerViewVisible === 'output'">
          <output-edit-view :taskId="getPlanInfo().taskId"
                            :outputRequest="outputRequestData"
                            @editSaveOK="editSaveOK"></output-edit-view>
        </template>
        <template v-if="drawerViewVisible === 'version'">
          <version-view :versionData="specialVersionData"></version-view>
        </template>
      </template>
    </common-drawer>
  </div>
</template>
<script>
import ButtonGroup from './Components/buttonGroup'
import ActivityDescEditView from './Components/activityDescEdit'
import InputIoView from './Components/inputIoView'
import OutputEditView from './Components/outputEdit'
import VersionView from './Components/versionView'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { P8Drawer as CommonDrawer } from '~/index'
import { Tooltip, Tag } from '~/index'
export default {
  name: '',
  inject: ['getPlanInfo'],
  components: {
    VuePerfectScrollbar,
    ButtonGroup,
    CommonDrawer,
    ActivityDescEditView,
    InputIoView,
    OutputEditView,
    VersionView,
    'el-tag': Tag,
    'el-tooltip': Tooltip
  },
  data () {
    const steps = [
      { name: '活动描述', id: 'activityDesc', btns: [{ title: '编辑', eventHandle: 'modifyMenu' }] },
      { name: '输入', id: 'putin', btns: [{ title: '查看', eventHandle: 'detailsSettings' }] },
      { name: '输出', id: 'output', btns: [{ title: '编辑', eventHandle: 'modifyMenu' }] },
      { name: '特别说明', id: 'varsion', btns: [{ title: '查看', eventHandle: 'detailsSettings' }] }
    ]
    const header = [
      { name: '要素分类', id: 'classify' },
      { name: '要求/说明/描述', id: 'request' },
      { name: '附加说明/备注', id: 'remark' },
      { name: '交付物/模板/文档', id: 'file' },
      { name: '操作', id: 'operation' }
    ]
    return {
      comp: this,
      outputRequestData: null,
      outputIoData: null,
      inputRequestData: null,
      inputIoData: null,
      activityDescData: null,
      specialVersionData: null,

      steps,
      selectStepsId: steps[0].id,
      header,
      scrollSetting: {
        suppressScrollY: false
      },

      // drawer 抽屉相关
      drawerTitle: '',
      drawerVisible: false,
      drawerViewVisible: false,
      drawerConfig: {
        modal: false,
        'modal-append-to-body': false,
        'append-to-body': true
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      const _this = this
      const taskId = _this.getPlanInfo().taskId
      const requestApi = 'taskManager.getOutputRequire'
      const outputApi = 'taskManager.getOutputIo'
      const inputRequestApi = 'taskManager.getInputRequire'
      const inputApi = 'taskManager.getInputIo'
      const descApi = 'taskManager.getActivityDescription'
      const versionApi = 'taskManager.getSpecialVersion'
      Promise.all([
        _this.$api[requestApi]({ taskId }),
        _this.$api[outputApi]({ taskId }),
        _this.$api[inputRequestApi]({ taskId }),
        _this.$api[inputApi]({ taskId }),
        _this.$api[descApi]({ taskId }),
        _this.$api[versionApi]({ taskId })
      ]).then(values => {
        _this.outputRequestData = values[0]
        _this.outputIoData = values[1]
        _this.inputRequestData = values[2]
        _this.inputIoData = values[3]
        _this.activityDescData = values[4]
        _this.specialVersionData = values[5]
      }).catch(err => {
        console.log('error-all', err)
      })
    },
    getActivityDesc () { // 获取活动描述
      const _this = this
      const api = 'taskManager.getActivityDescription'
      const taskId = _this.getPlanInfo().taskId
      this.$api[api]({ taskId }).then(res => {
        _this.activityDescData = res
      })
    },
    getOutputIo () { // 获取输出物
      const _this = this
      const api = 'taskManager.getOutputIo'
      const taskId = _this.getPlanInfo().taskId
      this.$api[api]({ taskId }).then(res => {
        _this.outputIoData = res
      })
    },
    stepsSliderClickHandle (item, index) {
      if (item.id === this.selectStepsId) {
        return false
      }
      this.selectStepsId = item.id
      const _this = this
      let scrollTotal = 0
      if (index > 0) {
        for (let i = 0; i < index; i++) {
          let off = _this.$el.querySelector(`#stepsBody${i}`).offsetHeight
          scrollTotal += off
        }
      }
      _this.$refs.scrollarea.$el.scrollTop = scrollTotal
    },
    psScrollYHandle () {
      // this.selectStepsId = ''
    },
    psScrollUpHandle (e) {
      // console.log('psScrollUpHandle', e)
    },
    psScrollDownHandle (e) {
      // console.log('psScrollDownHandle', e)
    },
    psScrollEndHandle (e) {
      // console.log('psScrollEndHandle', e)
    },
    detailsSettings (button, stepsItem) { // 查看
      this.drawerTitle = stepsItem.name
      this.drawerVisible = true
      this.drawerViewVisible = stepsItem.id
    },
    modifyMenu (button, stepsItem) { // 编辑
      this.drawerTitle = stepsItem.name
      this.drawerVisible = true
      this.drawerViewVisible = stepsItem.id
    },
    onDrawerClose () {
      this.drawerTitle = ''
      this.drawerVisible = false
      this.drawerViewVisible = false
    },
    editSaveOK (type) { // 输出-抽屉form组件保存后回调
      this.onDrawerClose()
      if (type === 'activityDesc') {
        this.getActivityDesc()
      }
      if (type === 'output') {
        this.getOutputIo()
      }
    },
    downloadOutputRequsetFile (item) {
      // let url = item.attFileLink
      // console.log(item, 'item')
      // if (url.substring(0, 10) === 'VISIT_URL=') {
      //     url = item.attFileLink.substring(10)
      // }
      // window.open(url, '_blank')
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
    }
  }
}
</script>
<style lang="scss" scoped>
$borderBottomLine: 1px solid #efefef;
$fixedWidth: 130px;
$fixedHeaderHeight: 40px;
$fixedListHeight: 40px;
$blue-color: #1b8af9;
.ele-steps-wrap {
  height: 100%;
  box-sizing: border-box;
  position: relative;
  // padding-left: 180px;
  .ele-steps-slider {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    width: 180px;
    height: 100%;
    // padding-top: $fixedHeaderHeight;
    .ele-steps-slider__ul {
      // padding-left: 40%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      li {
        position: relative;
        width: 40%;
        margin: 0 auto 10px 30px;
        height: 28px;
        line-height: 28px;
        background: #e3f2fd;
        cursor: pointer;
        text-align: center;
        &.active {
          background: #1565c0;
          color: #ffffff;
          &::after {
            border-color: transparent transparent transparent #1565c0;
          }
        }
        &::after {
          content: '';
          border-width: 14px;
          border-color: transparent transparent transparent #e3f2fd;
          border-style: solid;
          position: absolute;
          right: -58%;
          transform: translate(-50%, -50%);
          top: 50%;
        }
      }
    }
  }
  .ele-steps-content {
    height: 100%;
    overflow: hidden;
    .content-header {
      height: $fixedHeaderHeight;
      display: flex;
      box-sizing: border-box;
      align-items: center;
      border-bottom: $borderBottomLine;
      font-weight: bolder;
      color: #909399;
      span.header {
        line-height: $fixedHeaderHeight;
        flex: 1.5;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 0 4px;
        box-sizing: border-box;
      }
      span.header.file {
        flex: 1;
      }
      span.header.classify,
      span.header.operation {
        flex: 0 0 $fixedWidth;
        text-align: center;
      }
    }
    .scroll-area {
      height: calc(100% - #{$fixedHeaderHeight});
      .content-list-wrap.activeAni {
        animation: activeAni 1s ease;
      }
      @keyframes activeAni {
        to {
          background-color: #e7f3ff;
        }
      }
      .content-list-cont {
        display: flex;
        box-sizing: border-box;
        div.classify,
        div.operation {
          position: relative;
          flex: 0 0 $fixedWidth;
          text-align: center;
          box-sizing: border-box;
          padding: 0 4px;
          border-bottom: $borderBottomLine;
        }
        div.classify span {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        div.operation .btn-con {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
        }
        div.list-con {
          width: calc(100% - #{$fixedWidth * 2});
          .list-con-item {
            display: flex;
            align-items: center;
            height: 40px;
            box-sizing: border-box;
            border-bottom: $borderBottomLine;
            div.list-con-item__content {
              flex: 1.5;
              box-sizing: border-box;
              padding: 0 4px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              &.file {
                flex: 1;
                cursor: pointer;
              }
            }
          }
        }
        div.no-info {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #efefef;
          color: #909399;
        }
      }
    }
  }
}
/deep/ .manager-drawer .el-drawer__header {
  padding: 11px;
}
</style>
