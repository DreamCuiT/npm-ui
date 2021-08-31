<template>
    <common-dialog
            title="新建"
            destroy-on-close
            :visible="visible"
            width="700px"
            :dialogHeight="200"
            @close="handleCancel"
            @handle-ok="handleOk"
            @handle-cancel="handleCancel"
            @isfullscreen="isfullscreen"
    >
        <template #dialog class="cascader">
                <el-cascader class="cascader" ref="form"
                           @saved="saved"
                           @rendered="rendered"
                           :existDefaultBtn="false"
                           @close="closeModal"
                           :options="options"
                           :props="{ expandTrigger: 'hover' }"
                           :form="formData"
                           @change="handleChange"
                           :placeholder='"请选择来源、业务范围、类型"'
                >
                </el-cascader>
        </template>
    </common-dialog>
</template>

<script>
    import Vue from 'vue'
    import { P8Dialog as CommonDialog } from '~/index'
    export default {
        name: 'copyIndex',
        components: {
            CommonDialog
        },
        props: ['visible', 'disabled-row', 'defaultEmData'],
        data () {
            return {
                formData: {
                    filedId: '',
                    sourceId: '',
                    classifyId: '',
                    configId: ''
                },
                emData: {},
                options: []
            }
        },
        mounted () {
            if (this.defaultEmData && Object.keys(this.defaultEmData).length) {
                let sourceId = this.defaultEmData.sourceId
                let filedId = this.defaultEmData.filedId
                let classifyId = this.defaultEmData.classifyId
                this.setEmData(sourceId, filedId, classifyId)
               .then(() => {
                     this.handleOk()
            }).catch(() => { })
            } else {
               this.initData()
            }
        },
        computed: {},
        methods: {
       initData () {
            let that = this
            this.$api['thirdPartInterface.getDicTree']({}).then(function (res) {
                if (res) {
                    that.options = res
                }
                }).catch(function (error) {
                console.log(error)
                })
            },
            handleChange (value) {
                this.setEmData(value[0], value[1], value[2])
            },
            setEmData (sourceId, filedId, classifyId) {
                return new Promise((resolve, reject) => {
                    this.formData.sourceId = sourceId
                    this.formData.filedId = filedId
                    this.formData.classifyId = classifyId
                    this.emData.filedId = filedId
                    let _this = this
                    this.$api['thirdPartInterface.getConfigId'](this.formData).then(function (res) {
                        _this.emData.configId = res.id
                        _this.emData.configName = res.configName
                        _this.emData.sourceId = filedId
                        _this.emData.filedName = res.filedName
                        _this.emData.sourceName = res.sourceName
                        _this.emData.classifyName = res.classifyName
                        _this.emData.decisionForm = res.decisionForm
                        _this.emData.processDefinitionKey = res.processDefinitionKey
                        resolve(true)
                    })
                })
            },
            saved (res) {
            },
            closeModal () {

            },
            rendered () {

            },
            handleOk () {
                if (this.emData && Object.keys(this.emData).length) {
                    this.$emit(
                        'close',
                        this.emData
                    )
                } else {
                    this.$message({ message: '请选择来源、业务范围、类型', type: 'error' })
                }
            },
            rowClick (row, column, event) {
                this.emData.id = row.id
                this.emData.configName = row.configName
                this.emData.filedId = row.filedId
                this.emData.sourceId = row.sourceId
                this.emData.classifyId = row.classifyId
                this.emData.filedName = row.filedName
                this.emData.sourceName = row.sourceName
                this.emData.classifyName = row.classifyName
                this.emData.processDefinitionKey = row.processDefinitionKey
            },
            handleCancel (e) {
                this.$emit('close', {})
            },
            closeDrawer () {
                this.visibleProjectViewDrawer = false
            },
            copyData (copyData) {
                this.emData = copyData
            },
            isfullscreen (isfullscreen) {
                if (isfullscreen) {
                    this.cutomHeight = document.documentElement.clientHeight - 160
                } else {
                    this.cutomHeight = 390
                }
            },
            currentChange (currentRow, oldCurrentRow) {
                this.selectedRowKeys = []
                this.selectedRowKeys.push(currentRow.id)
                this.sourceTaskBookId = currentRow.id
                this.visibleProjectViewDrawer = true
            },
            tableRefresh (param) {
                param.then(() => {
                    console.log('异步成功后端做的操作')
                }).catch(() => {
                    console.log('异步失败的操作')
                })
            },
            search (param) {
                let newParams = {
                    ...param,
                    ...(this.queryParam.roleName
                        ? { roleName: this.queryParam.roleName }
                        : {})
                }
                this.queryParam = newParams
                let that = this
                Vue.nextTick(function () {
                    that.$refs.table.queryList()
                })
            },
            reSet () {
                Object.keys(this.queryParam).forEach(key => {
                    this.queryParam[key] = ''
                })
                Vue.nextTick(function () {
                    this.$refs.table.search()
                })
            }
        },
        watch: {
            sourceTaskBookId: function (val, oldVal) {
                this.$emit('change-task-book-id', val)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cascader{
        width: 500px;
        margin-top: 20px;
        margin-left: 100px;
    }
</style>
