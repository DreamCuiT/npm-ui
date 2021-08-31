<template>
    <common-dialog
            :title="title"
            :visible="visible"
            destroy-on-close
            @close="handleCancel"
            width="500px"
            style="dialogHeight:240px"
            :showHandleBtn="false"
            :dialogConfig="dialogConfig"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
    >
        <template #dialog>
            <form-list ref="form" @rendered="rendered" :form="formData"
                       @saved="saved" :dataSource="dataSource" :api="saveApi">
            </form-list>
        </template>
    </common-dialog>
</template>
<script>

    import { P8Form as FormList } from '~/index'
    import { P8Dialog as CommonDialog } from '~/index'

    let dataSource = [
        {
            type: 'number',
            labelText: '排序号',
            fieldName: 'indexNo',
            colLayout: 'singleCol',
            rules: [
                {
                    required: true,
                    message: '必填'
                }
            ]
        },
        {
            type: 'treeSelect',
            labelText: '父节点',
            fieldName: 'parentId',
            colLayout: 'singleCol',
            optionUrl: {
                api: 'qualitySystem.qualityTreeSelect',
                label: 'label',
                value: 'id'
            }
        },
        {
            type: 'text',
            labelText: '节点名称',
            fieldName: 'name',
            placeholder: '节点名称',
            colLayout: 'singleCol',
            rules: [
                {
                    required: true,
                    message: '必填'
                }
            ]
        }
    ]

    export default {
        name: 'TreeEdit',
        components: {
            FormList,
            CommonDialog },
        props: {
            record: {
                type: Object
            },
            visible: {
                type: Boolean
            },
            title: {
                type: String
            },
            clickedNodeData: {
                type: Object
            }
        },
        data () {
          return {
              dataSource: [],
              formData: {},
              saveApi: 'qualitySystem.save',
              dialogConfig: {
                  modal: true,
                  appendToBody: true,
                  modalAppendToBody: true
              },
              nodeData: null
          }
        },
        created () {
            this.formTrigger()
        },
        methods: {

            formTrigger () {
                if (this.title === '新建菜单') {
                    console.log(this.clickedNodeData, '===========')
                    this.nodeData = this.clickedNodeData
                    this.clickedNodeData = {}
                    this.formData.parentId = this.nodeData.id
                }
                this.dataSource = Object.assign([], dataSource)
            },

            getNodeDetail (clickedNodeData) {
                let that = this
                let nodeId = clickedNodeData.id
                this.$api['qualitySystem.getNodeDetail']({ 'id': nodeId }).then(function (res) {
                    let data = res
                    that.formData.id = data.id
                    that.formData.name = data.name
                    that.formData.indexNo = data.indexNo
                    that.formData = Object.assign({}, that.formData)
                }).catch(function (error) {
                    console.log(error)
                })
            },

            rendered () {
                if (this.clickedNodeData && this.clickedNodeData !== '') {
                    this.getNodeDetail(this.clickedNodeData)
                }
            },

            saved (res) {
                console.log('edit saved')
                this.$emit('save-success', res)
            },

            handleCancel (e) {
                this.$emit('close-modal')
            }
        }
    }
</script>

<style scoped>

</style>
