<template>
  <div class="project-con">
    <div class="title">
      项目信息
    </div>
    <div class="form-con">
      <form-list ref="form" :dataSource="dataSource" :form="formData" :existDefaultBtn="false"></form-list>
    </div>
  </div>
</template>
<script>
import { P8Form as FormList } from '~/index'
export default {
  name: 'ProjectFormView',
  props: {
    id: {
      type: String
    }
  },
  data () {
    const dataSource = [
      {
        type: 'view', // 控件类型
        labelText: '项目名称: ', // 控件显示的文本
        fieldName: 'name',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '型号代号:',
        fieldName: 'modelCode',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '项目编号:',
        fieldName: 'pjCode',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '开始时间:',
        fieldName: 'beginTime',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '完成时间:',
        fieldName: 'endTime',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '实际开始时间:',
        fieldName: 'realBeginTime',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '实际完成时间:',
        fieldName: 'realEndTime',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '项目概述:',
        fieldName: 'backdrop',
        colLayout: ''
      },
      {
        type: 'view',
        labelText: '项目目标:',
        fieldName: 'projectTarget',
        colLayout: ''
      }
    ]
    return {
      dataSource,
      formData: Object.assign({}, {
        hiddenId: '',
        checkboxGroup: [],
        detailList: [
        // {
        //   roleName: '',
        //   sysName: ''
        // }
        ],
        confidentialiteList: []
      })
    }
  },
  watch: {
    id (val) {
      this.getProjectInfo()
    }
  },
  mounted () {
    // this.getProjectInfo()
  },
  methods: {
    getProjectInfo () {
      let _this = this
      if (this.id) {
        this.$api['ProjectApply.wholeDescribeData']({ entityId: this.id }).then(res => {
          _this.formData = res
        })
      }
    }
  },
  components: {
    FormList
  }
}
</script>
<style lang="scss">
  .project-con{
    .title {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      padding-left: 6px;
      border-bottom: 1px solid #f2f2f2;
      box-sizing: border-box;
    }
    box-sizing: border-box;
    height: 90vh;
    overflow-y: auto;
    padding: 0 8px;
    .form-con {
      height: calc(100% - 50px);
    }
  }
</style>
