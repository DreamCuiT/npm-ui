/* eslint-disable vue/no-unused-components */
<template>
  <div class="hello">
    <!-- <h1>{{ msg }}</h1>
    <h2>Essential Links</h2> -->
    <!-- <p8-normal-layout>-->
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
    <!-- <keep-alive>
      <p8-drawer :visible="visible"
                 @close="handleClose">
        <template #drawer>
          <p8-normal-layout>
            <template #west></template>
            <template #center>
              <p8-form ref="form"
                       labelWidth="150px"
                       @rendered="rendered"
                       @saved="saved"
                       :dataSource="dataSource"
                       :api="saveApi"
                       :form="formData"></p8-form>
            </template>
          </p8-normal-layout>
        </template>
      </p8-drawer>
    </keep-alive>
    <el-button @click="visible = !visible">dddddd</el-button> -->
    <!-- <P8Dialog :visible="visible"
              @handle-cancel="handleCancel"
              @handle-ok="handleOk"
              @close="handleClose">
      <template #dialog>
        <div>dddd</div>
      </template>
    </P8Dialog> -->
    <!-- <p8-formgenerator :record='{"id": "efee05aa45d95985ad141460db59d253"}'></p8-formgenerator> -->
    <p8-formApplication :form-conf="formConf"
                        :modify-res="modifyRes"
                        @setPageData="setPageData"
                        @submit="save"></p8-formApplication>
    <!-- <p8-upload></p8-upload> -->
    <!-- <p8-menu-layout></p8-menu-layout> -->
    <!-- <p8-select-user :visible='true'></p8-select-user> -->
    <!-- <p8-nlcr-layout></p8-nlcr-layout> -->
    <!-- <p8-split-pane split='vertical'></p8-split-pane> -->
    <!-- <p8-bpm></p8-bpm> -->
    <!-- <p8-process-approval></p8-process-approval>
    <p8-process-definition></p8-process-definition> -->
    <!-- <p8-anchor></p8-anchor> -->
    <!-- <p8-cron></p8-cron> -->
    <!-- <p8-icon-selector></p8-icon-selector> -->
    <!-- <p8-wrapper :full="true"></p8-wrapper> -->
    <!-- <p8-contextmenu>
       <p8-contextmenu-item></p8-contextmenu-item>
          </p8-contextmenu> -->
    <!-- <p8-contextmenu-group></p8-contextmenu-group> -->
    <!-- <p8-contextmenu-submenu></p8-contextmenu-submenu>  -->
    <!-- <p8-popconfirm></p8-popconfirm> -->
    <!-- <p8-tree-select></p8-tree-select> -->
    <!-- <p8-import></p8-import> -->
  </div>
</template>

<script>
// import Vue from 'vue'
// import { Button } from 'element-ui';
// import {
//   P8Form, P8Drawer, P8FormGenerator, P8FormParser, P8NormalLayout, P8MenuLayout, P8SelectUser, P8Bpm, P8ProcessApproval, P8ProcessDefinition, P8Anchor, P8Cron, P8IconSelector,
//   P8Popconfirm,
//   P8Import,
//   P8Wrapper,
//   P8TreeSelect,
//   P8NlcrLayout,
//   P8Contextmenu,
//   P8ContextmenuGroup,
//   P8ContextmenuItem,
//   P8ContextmenuSubmenu,
//   P8SplitPane,
//   P8Dialog
// } from '../../dist/index'
import {
  P8Form, P8Drawer, P8FormGenerator, P8FormParser, P8NormalLayout, P8MenuLayout, P8SelectUser, P8Bpm, P8ProcessApproval, P8ProcessDefinition, P8Anchor, P8Cron, P8IconSelector,
  P8Popconfirm,
  P8Import,
  P8Wrapper,
  P8TreeSelect,
  P8NlcrLayout,
  P8Contextmenu,
  P8ContextmenuGroup,
  P8ContextmenuItem,
  P8ContextmenuSubmenu,
  P8SplitPane,
  P8Dialog,
  P8FormParserView
} from '../../src/index'

export default {
  name: 'HelloWorld',
  components: {
    'p8-formgenerator': P8FormGenerator,
    'p8-normal-layout': P8NormalLayout,
    'p8-formApplication': P8FormParser,
    'p8-formApplication-view':P8FormParserView,
    P8Drawer,
    P8Form,
    P8MenuLayout,
    P8SelectUser,
    P8NlcrLayout,
    P8SplitPane,
    P8Bpm,
    P8ProcessApproval,
    P8ProcessDefinition,
    P8Anchor,
    P8Cron,
    P8Import,
    P8IconSelector,
    P8Wrapper,
    P8Contextmenu,
    P8ContextmenuGroup,
    P8ContextmenuItem,
    P8ContextmenuSubmenu,
    P8Popconfirm,
    P8TreeSelect,
    P8Dialog
  },
  data () {
    return {
      formConf: JSON.parse("{\"fields\":[{\"__config__\":{\"label\":\"活动编号\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"PROCESS_NO\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"input\",\"defaultValue\":\"sssssss\",\"required\":true,\"layout\":\"colFormItem\",\"span\":12,\"variable\":\"$PROPPARAM.PROCESS_NO\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629184439977,\"renderKey\":\"16291844399771629184439977\"},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"placeholder\":\"请输入活动编号\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"hidden\":false,\"prefix-icon\":\"\",\"suffix-icon\":\"\",\"maxlength\":null,\"show-word-limit\":false,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"PROCESS_NO\"},{\"__config__\":{\"label\":\"活动名称\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"PROCESS_NAME\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"input\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":12,\"variable\":\"$PROPPARAM.PROCESS_NAME\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629184438791,\"renderKey\":\"16291844387911629184438791\"},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"placeholder\":\"请输入活动名称\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"hidden\":false,\"prefix-icon\":\"\",\"suffix-icon\":\"\",\"maxlength\":null,\"show-word-limit\":false,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"PROCESS_NAME\"},{\"__config__\":{\"label\":\"责任单位\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"DEPT_NAME\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"input\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":12,\"variable\":\"$SYSTEM_PARAMS_SELECT.parentsName\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629184437666,\"renderKey\":\"16291844376661629184437666\"},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"placeholder\":\"请输入责任单位\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"hidden\":false,\"prefix-icon\":\"\",\"suffix-icon\":\"\",\"maxlength\":null,\"show-word-limit\":false,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"DEPT_NAME\"},{\"__config__\":{\"label\":\"填报人\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"SUMMIT_USER_NAME\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"input\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":12,\"variable\":\"$SYSTEM_PARAMS_SELECT.realName\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629184436257,\"renderKey\":\"16291844362571629184436257\"},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"placeholder\":\"请输入填报人\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"hidden\":false,\"prefix-icon\":\"\",\"suffix-icon\":\"\",\"maxlength\":null,\"show-word-limit\":false,\"readonly\":false,\"disabled\":true,\"__vModel__\":\"SUMMIT_USER_NAME\"},{\"__config__\":{\"label\":\"填报时间\",\"formFields\":\"REPORT_DATE\",\"tag\":\"el-date-picker\",\"tagIcon\":\"date\",\"defaultValue\":\"2021-08-19\",\"showLabel\":true,\"labelWidth\":null,\"span\":12,\"layout\":\"colFormItem\",\"required\":true,\"regList\":[],\"changeTag\":true,\"document\":\"https://element.eleme.cn/#/zh-CN/component/date-picker\",\"formId\":1629186992021,\"renderKey\":\"16291869920211629186992021\",\"variable\":\"#getFormFillingTime\"},\"placeholder\":\"请选择填报时间\",\"type\":\"date\",\"style\":{\"width\":\"100%\"},\"disabled\":true,\"clearable\":true,\"format\":\"yyyy-MM-dd\",\"value-format\":\"yyyy-MM-dd\",\"readonly\":false,\"__vModel__\":\"REPORT_DATE\"},{\"__config__\":{\"layout\":\"masterSlaveTable\",\"tagIcon\":\"table\",\"span\":24,\"childrenTable\":\"20210816zff\",\"defaultValue\":[],\"layoutTree\":true,\"displayMode\":\"singleLine\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/layout#row-attributes\",\"formId\":1629183251242,\"renderKey\":\"16291832512421629183251242\",\"componentName\":\"主从表100\",\"children\":[{\"__config__\":{\"label\":\"年份\",\"formFields\":\"YEAR\",\"tag\":\"el-date-picker\",\"tagIcon\":\"date\",\"defaultValue\":null,\"showLabel\":true,\"labelWidth\":null,\"span\":12,\"layout\":\"colFormItem\",\"required\":true,\"regList\":[],\"changeTag\":true,\"document\":\"https://element.eleme.cn/#/zh-CN/component/date-picker\",\"formId\":1629162890123,\"renderKey\":\"16291628901231629162890123\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"placeholder\":\"请选择年份\",\"type\":\"year\",\"style\":{\"width\":\"50%\"},\"disabled\":false,\"clearable\":true,\"format\":\"yyyy\",\"value-format\":\"yyyy\",\"readonly\":false,\"__vModel__\":\"YEAR\"},{\"__config__\":{\"label\":\"类别\",\"showLabel\":true,\"labelWidth\":null,\"formFields\":\"REPORT_TYPE\",\"tag\":\"el-select\",\"tagIcon\":\"select\",\"layout\":\"colFormItem\",\"dataType\":\"dynamic\",\"selectComp\":\"b1881fa93a531958c2d6d3dd77147c23\",\"selectParam\":{\"param\":[],\"sqlParam\":{},\"reportParam\":{}},\"span\":12,\"required\":true,\"regList\":[],\"changeTag\":true,\"document\":\"https://element.eleme.cn/#/zh-CN/component/select\",\"formId\":1629186667371,\"renderKey\":\"16291866673711629186667371\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"__slot__\":{\"options\":[{\"label\":\"日报\",\"value\":1},{\"label\":\"周报\",\"value\":2},{\"label\":\"月报\",\"value\":3},{\"label\":\"专报\",\"value\":4}]},\"placeholder\":\"请选择类别\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"disabled\":false,\"filterable\":false,\"multiple\":false,\"__vModel__\":\"REPORT_TYPE\"},{\"__config__\":{\"label\":\"开始时间\",\"formFields\":\"BEGIN_TIME\",\"tag\":\"el-date-picker\",\"tagIcon\":\"date\",\"defaultValue\":null,\"showLabel\":true,\"labelWidth\":null,\"span\":12,\"layout\":\"colFormItem\",\"required\":true,\"regList\":[],\"changeTag\":true,\"document\":\"https://element.eleme.cn/#/zh-CN/component/date-picker\",\"formId\":1629171597032,\"renderKey\":\"16291715970321629171597032\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"placeholder\":\"请选择开始时间\",\"type\":\"date\",\"style\":{\"width\":\"100%\"},\"disabled\":false,\"clearable\":true,\"format\":\"yyyy-MM-dd\",\"value-format\":\"yyyy-MM-dd\",\"readonly\":false,\"__vModel__\":\"BEGIN_TIME\"},{\"__config__\":{\"label\":\"结束时间\",\"formFields\":\"END_TIME\",\"tag\":\"el-date-picker\",\"tagIcon\":\"date\",\"defaultValue\":null,\"showLabel\":true,\"labelWidth\":null,\"span\":12,\"layout\":\"colFormItem\",\"required\":true,\"regList\":[],\"changeTag\":true,\"document\":\"https://element.eleme.cn/#/zh-CN/component/date-picker\",\"formId\":1629171599144,\"renderKey\":\"16291715991441629171599144\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"placeholder\":\"请选择结束时间\",\"type\":\"date\",\"style\":{\"width\":\"100%\"},\"disabled\":false,\"clearable\":true,\"format\":\"yyyy-MM-dd\",\"value-format\":\"yyyy-MM-dd\",\"readonly\":false,\"__vModel__\":\"END_TIME\"},{\"__config__\":{\"label\":\"XH名称\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"XH_NAME\",\"changeTag\":true,\"tag\":\"eject-select\",\"tagIcon\":\"ejectSelect\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"selectComp\":\"3d34ef6d0f570dc077b36b1f5add97b2\",\"backfillParam\":{\"label\":\"MODEL_NAME\",\"value\":\"ID\"},\"reportCode\":\"modelList\",\"span\":12,\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629278451801,\"renderKey\":\"16292784518011629278451801\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"__slot__\":{\"prepend\":\"\",\"append\":\"el-icon-link\"},\"placeholder\":\"请选择XH名称\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"prefix-icon\":\"\",\"suffix-icon\":\"el-icon-link\",\"maxlength\":null,\"show-word-limit\":false,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"XH_NAME\"},{\"__config__\":{\"label\":\"简报标题\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"TITLE\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"input\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":12,\"variable\":\"\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629163065067,\"renderKey\":\"16291630650671629163065067\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"placeholder\":\"请输入单行文本简报标题\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"hidden\":false,\"prefix-icon\":\"\",\"suffix-icon\":\"\",\"maxlength\":\"20\",\"show-word-limit\":true,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"TITLE\"},{\"__config__\":{\"label\":\"简报类型\",\"showLabel\":true,\"labelWidth\":null,\"formFields\":\"TYPE\",\"tag\":\"el-select\",\"tagIcon\":\"select\",\"layout\":\"colFormItem\",\"dataType\":\"dynamic\",\"selectComp\":\"2e4fc40376b1e41a46ee60986a0a15af\",\"selectParam\":{\"param\":[],\"sqlParam\":{},\"reportParam\":{}},\"span\":12,\"required\":true,\"regList\":[],\"changeTag\":true,\"document\":\"https://element.eleme.cn/#/zh-CN/component/select\",\"formId\":1629162995446,\"renderKey\":\"16291629954461629162995446\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"__slot__\":{\"options\":[{\"label\":\"例行报告\",\"value\":1},{\"label\":\"归零报告\",\"value\":2}]},\"placeholder\":\"请选择简报类型\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"disabled\":false,\"filterable\":false,\"multiple\":false,\"__vModel__\":\"TYPE\"},{\"__config__\":{\"label\":\"年度目标\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"OBJECT_\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"textarea\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":24,\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629163048682,\"renderKey\":\"16291630486821629163048682\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"type\":\"textarea\",\"placeholder\":\"请输入年度目标\",\"style\":{\"width\":\"100%\"},\"autosize\":{\"minRows\":4,\"maxRows\":4},\"maxlength\":\"200\",\"show-word-limit\":true,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"OBJECT_\"},{\"__config__\":{\"label\":\"当前（本期）进展\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"PROCESSES\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"textarea\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":24,\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629163133664,\"renderKey\":\"16291631336641629163133664\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"type\":\"textarea\",\"placeholder\":\"请输入当前（本期）进展\",\"style\":{\"width\":\"100%\"},\"autosize\":{\"minRows\":4,\"maxRows\":4},\"maxlength\":\"600\",\"show-word-limit\":true,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"PROCESSES\"},{\"__config__\":{\"label\":\"问题及措施\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"PROBLEM_MEASURE\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"textarea\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":24,\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629163179391,\"renderKey\":\"16291631793911629163179391\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"type\":\"textarea\",\"placeholder\":\"请输入问题及措施\",\"style\":{\"width\":\"100%\"},\"autosize\":{\"minRows\":4,\"maxRows\":4},\"maxlength\":\"600\",\"show-word-limit\":true,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"PROBLEM_MEASURE\"},{\"__config__\":{\"label\":\"后续安排\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"FOLLOW_UP\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"textarea\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":24,\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629163158512,\"renderKey\":\"16291631585121629163158512\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"type\":\"textarea\",\"placeholder\":\"请输入后续安排\",\"style\":{\"width\":\"100%\"},\"autosize\":{\"minRows\":4,\"maxRows\":4},\"maxlength\":\"200\",\"show-word-limit\":true,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"FOLLOW_UP\"},{\"__config__\":{\"label\":\"月重点工作\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"WORK\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"textarea\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":24,\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629163103320,\"renderKey\":\"16291631033201629163103320\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"type\":\"textarea\",\"placeholder\":\"请输入月重点工作\",\"style\":{\"width\":\"100%\"},\"autosize\":{\"minRows\":4,\"maxRows\":4},\"maxlength\":\"200\",\"show-word-limit\":true,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"WORK\"},{\"__config__\":{\"label\":\"备注\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"MARK\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"textarea\",\"defaultValue\":\"\",\"required\":false,\"layout\":\"colFormItem\",\"span\":24,\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629163207743,\"renderKey\":\"16291632077431629163207743\",\"childrenTable\":\"20210816zff\",\"selectChildTable\":true},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"type\":\"textarea\",\"placeholder\":\"请输入备注\",\"style\":{\"width\":\"100%\"},\"autosize\":{\"minRows\":4,\"maxRows\":4},\"maxlength\":\"20\",\"show-word-limit\":true,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"MARK\"}]},\"type\":\"default\",\"justify\":\"start\",\"align\":\"top\"},{\"__config__\":{\"layout\":\"masterSlaveTable\",\"tagIcon\":\"table\",\"span\":24,\"childrenTable\":\"114c2eadf9dadb277e295eab635e9ccd\",\"defaultValue\":[],\"layoutTree\":true,\"displayMode\":\"multiLine\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/layout#row-attributes\",\"formId\":1629184912368,\"renderKey\":\"16291849123681629184912368\",\"componentName\":\"主从表100\",\"children\":[{\"__config__\":{\"label\":\"文号\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"DOCUMENT_NUMBER\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"input\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":24,\"variable\":\"\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629184924825,\"renderKey\":\"16291849248251629184924825\",\"childrenTable\":\"114c2eadf9dadb277e295eab635e9ccd\",\"selectChildTable\":true},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"placeholder\":\"请输入单行文本文号\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"hidden\":false,\"prefix-icon\":\"\",\"suffix-icon\":\"\",\"maxlength\":null,\"show-word-limit\":false,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"DOCUMENT_NUMBER\"},{\"__config__\":{\"label\":\"上传附件\",\"tag\":\"p8-upload\",\"tagIcon\":\"p8-upload\",\"layout\":\"colFormItem\",\"defaultValue\":null,\"showLabel\":true,\"labelWidth\":null,\"required\":false,\"span\":24,\"showTip\":false,\"buttonText\":\"点击上传\",\"regList\":[],\"changeTag\":true,\"fileSize\":2,\"sizeUnit\":\"MB\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/upload\",\"fieldType\":\"common\",\"formId\":1629184919224,\"renderKey\":\"16291849192241629184919224\",\"childrenTable\":\"114c2eadf9dadb277e295eab635e9ccd\",\"selectChildTable\":true},\"__slot__\":{\"list-type\":true},\"disabled\":false,\"accept\":\"\",\"name\":\"file\",\"auto-upload\":true,\"list-type\":\"secret\",\"multiple\":false,\"__vModel__\":null}]},\"type\":\"default\",\"justify\":\"start\",\"align\":\"top\"},{\"__config__\":{\"label\":\"部门编码\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"DEPT_CODE\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"input\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":12,\"variable\":\"$SYSTEM_PARAMS_SELECT.departmentCode\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629183522700,\"renderKey\":\"16291835227001629183522700\"},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"placeholder\":\"请输入部门编码\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"hidden\":true,\"prefix-icon\":\"\",\"suffix-icon\":\"\",\"maxlength\":null,\"show-word-limit\":false,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"DEPT_CODE\"},{\"__config__\":{\"label\":\"表单类型\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"DATA_TYPE\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"input\",\"defaultValue\":\"081701\",\"required\":true,\"layout\":\"colFormItem\",\"span\":12,\"variable\":\"\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629183534833,\"renderKey\":\"16291835348331629183534833\"},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"placeholder\":\"请输入表单类型\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"hidden\":true,\"prefix-icon\":\"\",\"suffix-icon\":\"\",\"maxlength\":null,\"show-word-limit\":false,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"DATA_TYPE\"},{\"__config__\":{\"label\":\"上报人身份证\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"REPORT_USER_PID\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"input\",\"defaultValue\":\"\",\"required\":true,\"layout\":\"colFormItem\",\"span\":12,\"variable\":\"$SYSTEM_PARAMS_SELECT.pid\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629183535248,\"renderKey\":\"16291835352481629183535248\"},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"placeholder\":\"请输入上报人身份证\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"hidden\":true,\"prefix-icon\":\"\",\"suffix-icon\":\"\",\"maxlength\":null,\"show-word-limit\":false,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"REPORT_USER_PID\"},{\"__config__\":{\"label\":\"状态\",\"labelWidth\":null,\"showLabel\":true,\"formFields\":\"DATA_STATUS\",\"changeTag\":true,\"tag\":\"el-input\",\"tagIcon\":\"input\",\"defaultValue\":11600,\"required\":true,\"layout\":\"colFormItem\",\"span\":12,\"variable\":\"\",\"document\":\"https://element.eleme.cn/#/zh-CN/component/input\",\"regList\":[],\"formId\":1629183535640,\"renderKey\":\"16291835356401629183535640\"},\"__slot__\":{\"prepend\":\"\",\"append\":\"\"},\"placeholder\":\"请输入状态\",\"style\":{\"width\":\"100%\"},\"clearable\":true,\"hidden\":true,\"prefix-icon\":\"\",\"suffix-icon\":\"\",\"maxlength\":null,\"show-word-limit\":false,\"readonly\":false,\"disabled\":false,\"__vModel__\":\"DATA_STATUS\"}],\"formRef\":\"elForm\",\"formModel\":\"FormModel\",\"formDataBase\":\"3edc91a23af70c0093d2f69046dd45d8\",\"size\":\"small\",\"labelPosition\":\"right\",\"labelWidth\":100,\"formRules\":\"FormRules\",\"gutter\":10,\"disabled\":false,\"span\":12,\"formBtns\":true}"),
      modifyRes: JSON.parse('{"logDetail":null,"desFormId":"b03dee6fc64461dcd3afc39e498658d2","desformCode":"productionReport","dataId":"03f0cb3d657e4dae9509","primary":{"logDetail":null,"table":{"DEPT_NAME":null,"CUSTOM_ITEM5":null,"CUSTOM_ITEM3":null,"REPORT_DATE":"2021-08-19 00:00:00","UPDATE_DATE":null,"CUSTOM_ITEM4":null,"ITEM_MODIFY_TIME":null,"CUSTOM_ITEM1":null,"CUSTOM_ITEM2":null,"THEME_NAME":null,"REPORT_USER_PID":null,"YEAR_DATE":null,"GROUP_CONCERNS":null,"SOURCE_DATA_ID":null,"PROCESS_NAME":null,"MODEL_NUMBER":null,"REPORT_USER_NAME":null,"ITEM_CREATE_TIME":null,"ID":"03f0cb3d657e4dae9509","CREATE_TIME":"2021-08-27 14:29:30","SECRET_LEVEL":"9001","ARMY_TYPE":null,"REMARK":null,"DATA_TYPE":"081701","SUMMIT_USER_NAME":null,"SUMMIT_USER_PID":null,"MODEL_NAME":null,"PROCESS_STATUS":null,"PROCESS_NO":null,"DEPT_CODE":null,"UPDATE_BY":"setup","PRJECT_TASK_ID":null,"PLAN_ID":null,"UPDATE_TIME":{"length":11,"bytes":"eHkIGw8yBwroW8A=","null":false,"stream":{}},"MODEL_ABBREVIATION":null,"WHOLE_DESCRIBE_ID":null,"SUMMIT_DATE":null,"DATA_STATUS":"11600","CONCRETE_CONTENT":null,"CREATE_BY":"setup","MODEL_CODE":null,"WEEK_MONTH_DATE":null},"uploadFiles":[]},"children":[{"logDetail":null,"tableId":"20210816zff","data":[{"logDetail":null,"table":{"REPORT_TYPE":"2021081802zff02","CUSTOM_ITEM5":null,"CUSTOM_ITEM3":null,"CUSTOM_ITEM4":null,"CUSTOM_ITEM1":null,"CUSTOM_ITEM2":null,"END_TIME":{"length":7,"bytes":"eHkIFQEBAQ==","null":false,"stream":{}},"YEAR":"2022","FOLLOW_UP":"1","PROBLEM_MEASURE":"1","XH_NAME":"6fecba8b3931d3f77549898091e8a18b","ID":"e0363f9792c34cfb824d","CREATE_TIME":{"length":11,"bytes":"eHkIGw8eHzMUyEA=","null":false,"stream":{}},"SECRET_LEVEL":null,"TYPE":"20210818zff02","OBJECT_":"1","COMMIT_TIME":null,"BASE_DATA_ID":"03f0cb3d657e4dae9509","COMMIT_USER":null,"UPDATE_BY":null,"PROCESSES":"1","UPDATE_TIME":null,"MARK":"1","BEGIN_TIME":{"length":7,"bytes":"eHkIDgEBAQ==","null":false,"stream":{}},"DUTY_DEPT":null,"CREATE_BY":"setup","WORK":"1","TITLE":"1"},"uploadFiles":[]}],"removeId":null},{"logDetail":null,"tableId":"114c2eadf9dadb277e295eab635e9ccd","data":[null],"removeId":null}]}'),
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
        // {
        //   type: 'treeSelect',
        //   labelText: '所属部门',
        //   fieldName: 'departmentId',
        //   placeholder: '请选择所属部门',
        //   colLayout: 'doubleCol',
        //   defaultExpandAll: true,
        //   optionUrl: {
        //     api: 'userManager.deptTree',
        //     params: { deptId: this.deptId }
        //   },
        //   rules: [
        //     {
        //       required: true
        //       // trigger: 'change'
        //     }
        //   ]
        // },
        // {
        //   labelText: '用户密级',
        //   type: 'select',
        //   fieldName: 'confidentialite',
        //   placeholder: '请选择用户密级',
        //   colLayout: 'doubleCol',
        //   rules: [
        //     {
        //       required: true
        //     }
        //   ],
        //   optionUrl: {
        //     api: 'userManager.dicData',
        //     params: {
        //       dicType: 'USER_LEVEL'
        //     }
        //   }
        // },
        // {
        //   labelText: '出入证号',
        //   type: 'text',
        //   fieldName: 'empCode',
        //   placeholder: '请输入出入证号',
        //   colLayout: 'doubleCol',
        //   rules: [
        //     {
        //       maxLength: 32
        //     }
        //   ]
        // },
        // {
        //   labelText: '性别',
        //   type: 'select',
        //   fieldName: 'gender',
        //   placeholder: '请选择性别',
        //   colLayout: 'doubleCol',
        //   optionUrl: {
        //     api: 'userManager.dicData',
        //     params: {
        //       dicType: 'GENDER'
        //     }
        //   }
        // },
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
        // {
        //   labelText: '电话号码',
        //   type: 'text',
        //   fieldName: 'otel',
        //   colLayout: 'doubleCol',
        //   placeholder: '请输入手机或座机号码',
        //   tip: '手机格式如:13512341234 座机格式如:010-40020020',
        //   rules: [
        //     {
        //       pattern: '^(((\\+\\d{2}-)?0\\d{2,3}-\\d{7,8})|((\\+\\d{2}-)?(\\d{2,3}-)?([1][3,4,5,7,8][0-9]\\d{8})))$',
        //       message: '请输入正确的电话号码',
        //       trigger: 'blur'
        //     }
        //   ]
        // },
        // {
        //   labelText: '行政岗位',
        //   type: 'text',
        //   fieldName: 'workPost',
        //   colLayout: 'doubleCol',
        //   placeholder: '请输入行政岗位',
        //   rules: [
        //     {
        //       maxLength: 32
        //     }
        //   ]
        // },
        // {
        //   labelText: '技术岗位',
        //   type: 'text',
        //   fieldName: 'tecPost',
        //   colLayout: 'doubleCol',
        //   placeholder: '请输入技术岗位',
        //   rules: [
        //     {
        //       maxLength: 32
        //     }
        //   ]
        // },
        // {
        //   labelText: '电子邮件',
        //   type: 'text',
        //   fieldName: 'oemail',
        //   colLayout: 'doubleCol',
        //   rules: [
        //     {
        //       type: 'email'
        //     }
        //   ]
        // },
        // {
        //   labelText: '用户排序',
        //   type: 'number',
        //   fieldName: 'indexNo',
        //   placeholder: '请输入用户排序号',
        //   colLayout: 'doubleCol',
        //   min: 0,
        //   max: 99999999
        // }
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
h1,
h2 {
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
