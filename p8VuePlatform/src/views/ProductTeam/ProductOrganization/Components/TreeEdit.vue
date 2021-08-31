<template>
    <common-dialog
            :title="title"
            :visible="visible"
            destroy-on-close
            @close="handleCancel"
            width="500px"
            style="dialogHeight:340px"
            :showHandleBtn="false"
            :dialogConfig="dialogConfig"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
    >
        <template #dialog>
            <form-list ref="form" :form="formData"
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
            type: 'text',
            labelText: '组织机构名称',
            fieldName: 'name',
            placeholder: '组织机构名称',
            colLayout: 'singleCol',
            rules: [
                {
                    required: true,
                    message: '必填'
                }
            ]
        },
        {
            type: 'text',
            labelText: '组织机构简称',
            fieldName: 'abbreviation',
            placeholder: '组织机构简称',
            colLayout: 'singleCol',
            rules: [
                {
                    required: true,
                    message: '必填'
                }
            ]
        },
        {
            type: 'text',
            labelText: '组织机构编号',
            fieldName: 'code',
            placeholder: '组织机构编号',
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
              saveApi: 'productOrganization.saveTree',
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
                this.nodeData = this.clickedNodeData
                this.formData.parentId = this.nodeData.id
                this.dataSource = Object.assign([], dataSource)
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
