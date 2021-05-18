<template>
  <div class="hello">
    <!-- <h1>{{ msg }}</h1>
    <h2>Essential Links</h2> -->
<!--    <p8-normal-layout>-->
<!--      <template #west></template>-->
<!--      <template #center>-->
<!--        <p8-form ref="form"-->
<!--                 labelWidth="150px"-->
<!--                 @rendered="rendered"-->
<!--                 @saved="saved"-->
<!--                 :dataSource="dataSource"-->
<!--                 :api="saveApi"-->
<!--                 :form="formData"></p8-form>-->
<!--      </template>-->
<!--    </p8-normal-layout>-->
<!--    <p8-drawer :visible="visible"-->
<!--               @close="handleClose">-->
<!--      <template #drawer>-->
<!--        <p8-normal-layout>-->
<!--          <template #west></template>-->
<!--          <template #center>-->
<!--            <p8-form ref="form"-->
<!--                     labelWidth="150px"-->
<!--                     @rendered="rendered"-->
<!--                     @saved="saved"-->
<!--                     :dataSource="dataSource"-->
<!--                     :api="saveApi"-->
<!--                     :form="formData"></p8-form>-->
<!--          </template>-->
<!--        </p8-normal-layout>-->
<!--      </template>-->
<!--    </p8-drawer>-->
    <!-- <p8-dragdialog :visible="visible"
                   @handle-cancel="handleCancel"
                   @handle-ok="handleOk"
                   @close="handleClose">
                   <template v-slot:dialog>
                     <div>dddd</div>
                   </template>
                   </p8-dragdialog> -->
<!--     <p8-formgenerator :record='{"id": "efee05aa45d95985ad141460db59d253"}'></p8-formgenerator>-->
    <!-- <p8-formApplication :form-conf="formConf"
                        @setPageData="setPageData"
                        @submit="save"></p8-formApplication>-->
    <!-- <p8-upload></p8-upload> -->
    <!-- <p8-menu-layout></p8-menu-layout> -->
    <!-- <p8-select-user :visible='true'></p8-select-user> -->
    <!-- <p8-nlcr-layout></p8-nlcr-layout> -->
    <!-- <p8-split-pane split='vertical'></p8-split-pane> -->
    <!-- <p8-bpm></p8-bpm> -->
    <!-- <p8-process-approval></p8-process-approval> -->
    <p8-process-definition></p8-process-definition>
  </div>
</template>

<script>
import {Button, Dialog, P8FormGenerator, P8FormParser, P8NormalLayout, P8MenuLayout, P8SelectUser, P8Bpm, P8ProcessApproval, P8ProcessDefinition,
  P8NlcrLayout,
  P8SplitPane,} from '../../dist/index'

export default {
  name: 'HelloWorld',
  components: {
    'p8-button': Button,
    'p8-dragdialog': Dialog,
    'p8-formgenerator': P8FormGenerator,
    'p8-normal-layout': P8NormalLayout,
    'p8-formApplication': P8FormParser,
    P8MenuLayout,
    P8SelectUser,
    P8NlcrLayout,
    P8SplitPane,
    P8Bpm,
    P8ProcessApproval, 
    P8ProcessDefinition
  },
  data () {
    return {
      formConf:JSON.parse('{"fields":[{"__config__":{"label":"项目名称","labelWidth":null,"showLabel":true,"formFields":"NAME","changeTag":true,"tag":"el-input","tagIcon":"input","defaultValue":"","required":true,"layout":"colFormItem","span":12,"document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1606974655934,"renderKey":"16069746559341606974655934"},"__slot__":{"prepend":"","append":""},"placeholder":"请输入项目名称","style":{"width":"100%"},"clearable":true,"prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"__vModel__":"NAME"},{"__config__":{"label":"项目类型","showLabel":true,"labelWidth":null,"formFields":"KPROJECT_CLASSIFY_ID","tag":"el-select","tagIcon":"select","layout":"colFormItem","dataType":"dynamic","selectComp":"e523ef305e250de0412c2abb8bdc28d3","selectParam":{"param":[],"sqlParam":{},"reportParam":{}},"span":12,"required":true,"regList":[],"changeTag":true,"document":"https://element.eleme.cn/#/zh-CN/component/select","formId":1606982087667,"renderKey":"16069820876671606982087667"},"__slot__":{"options":[{"label":"选项一","value":1},{"label":"选项二","value":2}]},"placeholder":"请选择项目类型","style":{"width":"100%"},"clearable":true,"disabled":false,"filterable":false,"multiple":false,"__vModel__":"KPROJECT_CLASSIFY_ID"},{"__config__":{"label":"选择型号","labelWidth":null,"showLabel":true,"formFields":"MODEL_INFORMATION_ID","changeTag":true,"tag":"eject-select","tagIcon":"ejectSelect","defaultValue":"","required":false,"layout":"colFormItem","selectComp":"f86e697db94251e19fe1b7ebc38a8baf","backfillParam":{"label":"MODEL_NAME","value":"ID"},"reportCode":"selectModel","span":12,"document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1606974703861,"renderKey":"16069747038611606974703861"},"__slot__":{"prepend":"","append":"el-icon-link"},"placeholder":"请弹出选择型号","style":{"width":"100%"},"clearable":true,"prefix-icon":"","suffix-icon":"el-icon-link","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"__vModel__":"MODEL_INFORMATION_ID"},{"__config__":{"label":"产品代号","labelWidth":null,"showLabel":true,"formFields":"PJ_CODE","changeTag":true,"tag":"el-input","tagIcon":"input","defaultValue":"","required":true,"layout":"colFormItem","span":12,"document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1606974759777,"renderKey":"16069747597771606974759777"},"__slot__":{"prepend":"","append":""},"placeholder":"请输入产品代号","style":{"width":"100%"},"clearable":true,"prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"__vModel__":"PJ_CODE"},{"__config__":{"label":"项目来源","showLabel":true,"labelWidth":null,"formFields":"SOURCE","tag":"el-select","tagIcon":"select","layout":"colFormItem","dataType":"dynamic","selectComp":"56c54d22e16f1ea6297fdb7d6a9c208b","selectParam":{"param":[],"sqlParam":{},"reportParam":{}},"span":12,"required":true,"regList":[],"changeTag":true,"document":"https://element.eleme.cn/#/zh-CN/component/select","formId":1606974892963,"renderKey":"16069748929631606974892963"},"__slot__":{"options":[{"label":"选项一","value":1},{"label":"选项二","value":2}]},"placeholder":"请选择项目来源","style":{"width":"100%"},"clearable":true,"disabled":false,"filterable":false,"multiple":false,"__vModel__":"SOURCE"},{"__config__":{"label":"分系统单位","labelWidth":null,"showLabel":true,"formFields":"SYS_DEPT","changeTag":true,"tag":"el-input","tagIcon":"input","defaultValue":"","required":true,"layout":"colFormItem","span":12,"document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1607657809393,"renderKey":"16076578093931607657809393"},"__slot__":{"prepend":"","append":""},"placeholder":"请输入分系统单位","style":{"width":"100%"},"clearable":true,"prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"__vModel__":"SYS_DEPT"},{"__config__":{"label":"项目分级","showLabel":true,"labelWidth":null,"formFields":"PROJECT_ORDER","tag":"el-select","tagIcon":"select","layout":"colFormItem","dataType":"dynamic","selectComp":"6fdaf0c214291344044d417d5540dec0","selectParam":{"param":[],"sqlParam":{},"reportParam":{}},"span":12,"required":true,"regList":[],"changeTag":true,"document":"https://element.eleme.cn/#/zh-CN/component/select","formId":1607427646247,"renderKey":"16074276462471607427646247"},"__slot__":{"options":[{"label":"选项一","value":1},{"label":"选项二","value":2}]},"placeholder":"请选择项目分级","style":{"width":"100%"},"clearable":true,"disabled":false,"filterable":false,"multiple":false,"__vModel__":"PROJECT_ORDER"},{"__config__":{"label":"项目密级","showLabel":true,"labelWidth":null,"formFields":"SECRET_GRADE","tag":"el-select","tagIcon":"select","layout":"colFormItem","dataType":"dynamic","selectComp":"2b0e4b75a0851064ee05286feb56f3f7","selectParam":{"param":[],"sqlParam":{},"reportParam":{}},"span":12,"required":true,"regList":[],"changeTag":true,"document":"https://element.eleme.cn/#/zh-CN/component/select","formId":1606974987937,"renderKey":"16069749879371606974987937"},"__slot__":{"options":[{"label":"选项一","value":1},{"label":"选项二","value":2}]},"placeholder":"请选择项目密级","style":{"width":"100%"},"clearable":true,"disabled":false,"filterable":false,"multiple":false,"__vModel__":"SECRET_GRADE"},{"__config__":{"label":"开始时间","formFields":"BEGIN_TIME","tag":"el-date-picker","tagIcon":"date","defaultValue":null,"showLabel":true,"labelWidth":null,"span":12,"layout":"colFormItem","required":true,"regList":[],"changeTag":true,"document":"https://element.eleme.cn/#/zh-CN/component/date-picker","formId":1606975385909,"renderKey":"16069753859091606975385909"},"placeholder":"请选择开始时间","type":"date","style":{"width":"100%"},"disabled":false,"clearable":true,"format":"yyyy-MM-dd","value-format":"yyyy-MM-dd","readonly":false,"__vModel__":"BEGIN_TIME"},{"__config__":{"label":"结束时间","formFields":"END_TIME","tag":"el-date-picker","tagIcon":"date","defaultValue":null,"showLabel":true,"labelWidth":null,"span":12,"layout":"colFormItem","required":true,"regList":[],"changeTag":true,"document":"https://element.eleme.cn/#/zh-CN/component/date-picker","formId":1606975455495,"renderKey":"16069754554951606975455495"},"placeholder":"请选择结束时间","type":"date","style":{"width":"100%"},"disabled":false,"clearable":true,"format":"yyyy-MM-dd","value-format":"yyyy-MM-dd","readonly":false,"__vModel__":"END_TIME"},{"__config__":{"label":"预估数量","labelWidth":null,"showLabel":true,"formFields":"ESTIMATE_NUM","changeTag":true,"tag":"el-input","tagIcon":"input","defaultValue":"","required":true,"layout":"colFormItem","span":12,"document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1607657921360,"renderKey":"16076579213601607657921360"},"__slot__":{"prepend":"","append":""},"placeholder":"请输入预估数量","style":{"width":"100%"},"clearable":true,"prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"__vModel__":"ESTIMATE_NUM"},{"__config__":{"label":"预估单价","labelWidth":null,"showLabel":true,"formFields":"ESTIMATE_PRICE","changeTag":true,"tag":"el-input","tagIcon":"input","defaultValue":"","required":true,"layout":"colFormItem","span":12,"document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1607657920752,"renderKey":"16076579207521607657920753"},"__slot__":{"prepend":"","append":""},"placeholder":"请输入预估单价","style":{"width":"100%"},"clearable":true,"prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"__vModel__":"ESTIMATE_PRICE"},{"__config__":{"label":"国拨金额","showLabel":true,"changeTag":true,"labelWidth":null,"formFields":"APPROPRIATION_BUDGET","tag":"el-input-number","tagIcon":"number","defaultValue":"","span":12,"layout":"colFormItem","required":false,"regList":[],"document":"https://element.eleme.cn/#/zh-CN/component/input-number","formId":1608042531991,"renderKey":"16080425319911608042531991"},"placeholder":"国拨金额","min":0,"max":500000,"step":1,"step-strictly":false,"precision":2,"controls-position":"","disabled":false,"__vModel__":"APPROPRIATION_BUDGET"},{"__config__":{"label":"地配金额","showLabel":true,"changeTag":true,"labelWidth":null,"formFields":"LOCAL_BUDAGET","tag":"el-input-number","tagIcon":"number","defaultValue":"","span":12,"layout":"colFormItem","required":false,"regList":[],"document":"https://element.eleme.cn/#/zh-CN/component/input-number","formId":1608042676190,"renderKey":"16080426761901608042676190"},"placeholder":"地配金额","min":0,"max":500000,"step":1,"step-strictly":false,"precision":2,"controls-position":"","disabled":false,"__vModel__":"LOCAL_BUDAGET"},{"__config__":{"label":"横向合同来款","showLabel":true,"changeTag":true,"labelWidth":null,"formFields":"CROSS_BUDAGET","tag":"el-input-number","tagIcon":"number","defaultValue":"","span":12,"layout":"colFormItem","required":false,"regList":[],"document":"https://element.eleme.cn/#/zh-CN/component/input-number","formId":1608042675894,"renderKey":"16080426758941608042675894"},"placeholder":"横向合同来款","min":0,"max":500000,"step":1,"step-strictly":false,"precision":2,"controls-position":"","disabled":false,"__vModel__":"CROSS_BUDAGET"},{"__config__":{"label":"自筹金额","showLabel":true,"changeTag":true,"labelWidth":null,"formFields":"RAISE_BUDGET","tag":"el-input-number","tagIcon":"number","defaultValue":"","span":12,"layout":"colFormItem","required":false,"regList":[],"document":"https://element.eleme.cn/#/zh-CN/component/input-number","formId":1608042675510,"renderKey":"16080426755101608042675510"},"placeholder":"自筹金额","min":0,"max":500000,"step":1,"step-strictly":false,"precision":2,"controls-position":"","disabled":false,"__vModel__":"RAISE_BUDGET"},{"__config__":{"label":"经费来源","labelWidth":null,"showLabel":true,"formFields":"FUNDS_SOURCE","changeTag":true,"tag":"el-input","tagIcon":"input","defaultValue":"","required":false,"layout":"colFormItem","span":12,"variable":"$LABEL.APPROPRIATION_BUDGET+$LABEL.RAISE_BUDGET+$LABEL.LOCAL_BUDAGET+$LABEL.CROSS_BUDAGET","document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1608042841974,"renderKey":"16080428419741608042841974"},"__slot__":{"prepend":"","append":""},"placeholder":"请输入经费来源","style":{"width":"100%"},"clearable":true,"hidden":false,"prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":true,"disabled":false,"__vModel__":"FUNDS_SOURCE"},{"__config__":{"label":"概算金额","labelWidth":null,"showLabel":true,"formFields":"CUSTOM_ITEM1","changeTag":true,"tag":"el-input","tagIcon":"input","defaultValue":"","required":false,"layout":"colFormItem","span":12,"variable":"$COMPUTED.APPROPRIATION_BUDGET+$COMPUTED.RAISE_BUDGET+$COMPUTED.LOCAL_BUDAGET+$COMPUTED.CROSS_BUDAGET","document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1608042931829,"renderKey":"16080429318291608042931829"},"__slot__":{"prepend":"","append":""},"placeholder":"请输入概算金额","style":{"width":"100%"},"clearable":true,"hidden":false,"prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":true,"disabled":false,"__vModel__":"CUSTOM_ITEM1"},{"__config__":{"label":"承揽必要性","labelWidth":null,"showLabel":true,"formFields":"NECESSITY","changeTag":true,"tag":"el-input","tagIcon":"input","defaultValue":"","required":true,"layout":"colFormItem","span":12,"document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1607657981328,"renderKey":"16076579813281607657981328"},"__slot__":{"prepend":"","append":""},"placeholder":"请输入承揽必要性","style":{"width":"100%"},"clearable":true,"prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"__vModel__":"NECESSITY"},{"__config__":{"label":"主承部门","showLabel":true,"labelWidth":null,"formFields":"MAIN_DEPTID","tag":"tree-select","tagIcon":"select","layout":"colFormItem","dataType":"dynamic","selectComp":"6ad521f443d2f9d3c80c2ba2a210c964","selectParam":{"param":[],"sqlParam":{},"reportParam":{}},"span":12,"required":true,"regList":[],"changeTag":true,"document":"https://element.eleme.cn/#/zh-CN/component/select","formId":1606976067311,"renderKey":"16069760673111606976067311"},"__slot__":{"options":[{"label":"部门1","value":1,"children":[{"label":"科室1-1","value":2},{"label":"科室1-2","value":3}]},{"label":"部门2","value":4,"children":[{"label":"科室2-1","value":5},{"label":"科室2-2","value":6}]}]},"defaultExpandAll":true,"multiple":false,"checkStrictly":true,"placeholder":"请选择主承部门","readonly":true,"style":{"width":"100%"},"clearable":true,"disabled":false,"__vModel__":"MAIN_DEPTID"},{"__config__":{"label":"主要风险","showLabel":true,"labelWidth":null,"formFields":"RISK","tag":"el-select","tagIcon":"select","layout":"colFormItem","dataType":"static","selectComp":null,"selectParam":{"param":[],"sqlParam":{},"reportParam":{}},"span":12,"required":false,"regList":[],"changeTag":true,"document":"https://element.eleme.cn/#/zh-CN/component/select","formId":1607432996613,"renderKey":"16074329966131607432996613"},"__slot__":{"options":[{"label":"是","value":1},{"label":"否","value":0}]},"placeholder":"请选择主要风险","style":{"width":"100%"},"clearable":true,"disabled":false,"filterable":false,"multiple":false,"__vModel__":"RISK"},{"__config__":{"label":"主管所领导","labelWidth":null,"showLabel":true,"formFields":"MAIN_LEAD_USER","changeTag":true,"tag":"eject-select","tagIcon":"ejectSelect","defaultValue":"","required":true,"layout":"colFormItem","selectComp":"03821b69d56fcdb87b72ac80dbd04ff8","backfillParam":{"label":"REAL_NAME","value":"ID"},"reportCode":"selectUser","span":12,"document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1606975267414,"renderKey":"16069752674141606975267414"},"__slot__":{"prepend":"","append":"el-icon-link"},"placeholder":"请选择弹出选择主管所领导","style":{"width":"100%"},"clearable":true,"prefix-icon":"","suffix-icon":"el-icon-link","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"__vModel__":"MAIN_LEAD_USER"},{"__config__":{"label":"竞争对手","showLabel":true,"labelWidth":null,"formFields":"COMPETITORS","tag":"el-select","tagIcon":"select","layout":"colFormItem","dataType":"static","selectComp":null,"selectParam":{"param":[],"sqlParam":{},"reportParam":{}},"span":12,"required":false,"regList":[],"changeTag":true,"document":"https://element.eleme.cn/#/zh-CN/component/select","formId":1607433046960,"renderKey":"16074330469601607433046960"},"__slot__":{"options":[{"label":"有","value":1},{"label":"无","value":0}]},"placeholder":"请选择竞争对手","style":{"width":"100%"},"clearable":true,"disabled":false,"filterable":false,"multiple":false,"__vModel__":"COMPETITORS"},{"__config__":{"label":"关键指标","labelWidth":null,"showLabel":true,"formFields":"INDICATOR_WAYS","changeTag":true,"tag":"el-input","tagIcon":"input","defaultValue":"","required":false,"layout":"colFormItem","span":12,"document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1607658069329,"renderKey":"16076580693291607658069329"},"__slot__":{"prepend":"","append":""},"placeholder":"请输入关键指标","style":{"width":"100%"},"clearable":true,"prefix-icon":"","suffix-icon":"","maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"__vModel__":"INDICATOR_WAYS"},{"__config__":{"label":"申请日期","labelWidth":null,"showLabel":true,"formFields":"","tag":"custom-view","tagIcon":"customView","defaultValue":"","layout":"colFormItem","span":12,"formId":1607429876455,"renderKey":"16074298764551607429876455"},"style":{"width":"100%"},"type":"viewField","viewField":"$PROPPARAM.now","__vModel__":""},{"__config__":{"label":"项目概述","labelWidth":null,"showLabel":true,"formFields":"PARTICULAR","changeTag":true,"tag":"el-input","tagIcon":"textarea","defaultValue":"","required":false,"layout":"colFormItem","span":24,"document":"https://element.eleme.cn/#/zh-CN/component/input","regList":[],"formId":1607429734989,"renderKey":"16074297349891607429734989"},"__slot__":{"prepend":"","append":""},"type":"textarea","placeholder":"请输入项目概述","style":{"width":"100%"},"autosize":{"minRows":4,"maxRows":4},"maxlength":null,"show-word-limit":false,"readonly":false,"disabled":false,"__vModel__":"PARTICULAR"}],"formRef":"elForm","formModel":"FormModel","formDataBase":"e1fb7dbd16cce017c4ce429a606b6b92","size":"medium","labelPosition":"left","labelWidth":147,"formRules":"FormRules","gutter":34,"disabled":false,"span":12,"formBtns":true}'),
      msg: 'Welcome to Your Vue.js App',
      visible: true,
      dataSource: [
        {
          type: 'text', // 控件类型
          labelText: '用户名称', // 控件显示的文本
          fieldName: 'userName',
          placeholder: '请输入用户名称', // 默认控件的空值文本
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              maxLength: 32
            },
            {
              pattern: '^[0-9a-zA-Z_]{1,}$',
              message: '只可输入数字,字母或下划线',
              trigger: 'blur'
            },
            {
              validator: (rule, value, callback) => {
                let that = this
                // console.log(that.userId)
                this.$api['userManager.repeatedCheck']({ id: that.userId, userName: value }).then(response => {
                  // console.log(response)
                  if (response.result) {
                    callback(new Error('用户名已被使用！'))
                  } else {
                    callback()
                  }
                })
              },
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'text', // 控件类型
          labelText: '员工代码[身份证]', // 控件显示的文本
          fieldName: 'pid',
          placeholder: '请输入员工代码[身份证]', // 默认控件的空值文本
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              maxLength: 18
            },
            {
              pattern: '^[0-9a-zA-Z]{1,}$',
              message: '只可输入数字或字母',
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'text', // 控件类型
          labelText: '真实姓名', // 控件显示的文本
          fieldName: 'realName',
          placeholder: '请输入真实姓名', // 默认控件的空值文本
          colLayout: 'doubleCol',
          rules: [
            {
              required: true,
              maxLength: 32
            }
          ]
        },
        {
          type: 'treeSelect',
          labelText: '所属部门',
          fieldName: 'departmentId',
          placeholder: '请选择所属部门',
          colLayout: 'doubleCol',
          defaultExpandAll: true,
          optionUrl: {
            api: 'userManager.deptTree',
            params: { deptId: this.deptId }
          },
          rules: [
            {
              required: true
              // trigger: 'change'
            }
          ]
        },
        {
          labelText: '用户密级',
          type: 'select',
          fieldName: 'confidentialite',
          placeholder: '请选择用户密级',
          colLayout: 'doubleCol',
          rules: [
            {
              required: true
            }
          ],
          optionUrl: {
            api: 'userManager.dicData',
            params: {
              dicType: 'USER_LEVEL'
            }
          }
        },
        {
          labelText: '出入证号',
          type: 'text',
          fieldName: 'empCode',
          placeholder: '请输入出入证号',
          colLayout: 'doubleCol',
          rules: [
            {
              maxLength: 32
            }
          ]
        },
        {
          labelText: '性别',
          type: 'select',
          fieldName: 'gender',
          placeholder: '请选择性别',
          colLayout: 'doubleCol',
          optionUrl: {
            api: 'userManager.dicData',
            params: {
              dicType: 'GENDER'
            }
          }
        },
        {
          labelText: '生日',
          type: 'datetime',
          fieldName: 'birthDate',
          colLayout: 'doubleCol',
          placeholder: '请选择生日日期',
          fieldConfig: {
            'value-format': 'yyyy-MM-dd'
          }
        },
        {
          labelText: '电话号码',
          type: 'text',
          fieldName: 'otel',
          colLayout: 'doubleCol',
          placeholder: '请输入手机或座机号码',
          tip: '手机格式如:13512341234 座机格式如:010-40020020',
          rules: [
            {
              pattern: '^(((\\+\\d{2}-)?0\\d{2,3}-\\d{7,8})|((\\+\\d{2}-)?(\\d{2,3}-)?([1][3,4,5,7,8][0-9]\\d{8})))$',
              message: '请输入正确的电话号码',
              trigger: 'blur'
            }
          ]
        },
        {
          labelText: '行政岗位',
          type: 'text',
          fieldName: 'workPost',
          colLayout: 'doubleCol',
          placeholder: '请输入行政岗位',
          rules: [
            {
              maxLength: 32
            }
          ]
        },
        {
          labelText: '技术岗位',
          type: 'text',
          fieldName: 'tecPost',
          colLayout: 'doubleCol',
          placeholder: '请输入技术岗位',
          rules: [
            {
              maxLength: 32
            }
          ]
        },
        {
          labelText: '电子邮件',
          type: 'text',
          fieldName: 'oemail',
          colLayout: 'doubleCol',
          rules: [
            {
              type: 'email'
            }
          ]
        },
        {
          labelText: '用户排序',
          type: 'number',
          fieldName: 'indexNo',
          placeholder: '请输入用户排序号',
          colLayout: 'doubleCol',
          min: 0,
          max: 99999999
        }
      ],
      formData: {
        id: null,
        userName: null,
        pid: null,
        realName: null,
        departmentId: null,
        confidentialite: null,
        empCode: null,
        gender: null,
        birthDate: null,
        otel: null,
        workPost: null,
        tecPost: null,
        oemail: null,
        indexNo: null,
        roles: null
      },
      comp: this,
      saveApi: 'userManager.save',
    }
  },
  methods: {
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      this.visible = false
    },
    handleClose () {
      this.visible = false
    },
    save (data, childData) {

    },
     setPageData (pageData) {

    },
    rendered () {

    },
    saved () {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
