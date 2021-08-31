<template>
    <div class="project-con">
        <div class="title">
        </div>
        <div class="form-con">
            <form-list ref="form"
                :dataSource="dataSource"
                :form="formData"
                :existDefaultBtn="false">
            </form-list>
        </div>
    </div>
</template>
<script>
    import { P8Form as FormList } from '~/index'

    export default {
        name: 'Meeting',
        props: {
            id: {
                type: String
            }
        },
        data () {
            const dataSource = [
                {
                    type: 'view',
                    labelText: '项目名称',
                    fieldName: 'wholeDescribeName',
                    colLayout: 'singleCol'

                },
                {
                    type: 'view',
                    labelText: '会议密级',
                    fieldName: 'security',
                    colLayout: 'doubleCol'

                },
                {
                    type: 'view',
                    labelText: '会议时间',
                    fieldName: 'meetingTime',
                    colLayout: 'doubleCol'

                },

                {
                    labelText: '主持人',
                    type: 'view',
                    fieldName: 'compere',
                    colLayout: 'doubleCol'

                },
                {
                    labelText: '拟稿人',
                    type: 'view',
                    fieldName: 'draftPerson',
                    colLayout: 'doubleCol'

                },
                {
                    labelText: '会议类型',
                    type: 'view',
                    fieldName: 'meetingType',
                    colLayout: 'doubleCol'

                },
                {
                    labelText: '主送',
                    type: 'view',
                    fieldName: 'mainUserNameList',
                    colLayout: 'singleCol'
                },
                {
                    labelText: '抄送',
                    type: 'view',
                    fieldName: 'sendUserNameList',
                    colLayout: 'singleCol'

                },
                {
                    labelText: '参加人员',
                    type: 'view',
                    fieldName: 'otherUserNameList',
                    colLayout: 'singleCol'
                },
                {
                  type: 'view',
                  labelText: '会议议题',
                  colLayout: 'singleCol',
                  fieldName: 'sthemeList'
                }
            ]
            return {
                dataSource,
                formData: {}
            }
        },
        watch: {

        },
        mounted () {
            if (this.id && this.id !== '') {
                this.getClassifyData(this.id)
            }
        },
        methods: {
              getClassifyData: function (id) {
                let _this = this
                  this.$api['meetingManager.getInfo']({ id: id }).then(res => {
                    _this.formData = res
                  })
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
