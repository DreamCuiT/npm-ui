## 安装依赖
  - cnpm i bpmn-js --save
  - cnpm i bpmn-js-properties-panel --save
  - cnpm i camunda-bpmn-moddle --save
## 组件说明
  ### processApprovalView.vue
    流程审批查看视图
        提供两种使用方式，根据传入的[参数对象]确定使用何种方式。
        businessObj，processObj
            方式一：传入businessObj对象 -> {businessId:'',processDefinitionKey:''},
                根据业务id和流程定义Key获取该业务id对应的流程定义实例和审批信息。
            方式二：传入processObj对象 -> {processDefinitionId:'',processInstanceId:''},
                根据processDefinitionId获取流程实例，根据processInstanceId获取审批信息。
  ### processDefinitionView.vue
    流程定义查看视图，接收两个参数，根据业务需要任选其一。
        提供两种使用方式，根据传入的[参数]确定使用何种方式
           processDefinitionKey，processDefinitionId
           方式一：传入processDefinitionKey,根据流程定义Key获取最后一个版本的流程定义
           方式二：传入processDefinitionId ,根据流程定义Id获取对应版本的流程定义（更精准）
  ### bpm/view (已弃用)
##[参考链接](https://juejin.im/post/5def4377e51d4557f852baf9)
