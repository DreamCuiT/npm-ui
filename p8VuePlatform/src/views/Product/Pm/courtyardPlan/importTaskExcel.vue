<template>
    <form-list
            labelWidth="100px"
            ref="form"
            :dataSource="dataSource"
            :form="formData"
            :api="saveApi"
            :is-custom-validate="isCustomValidate"
            :existDefaultBtn="existDefaultBtn"
            :existCustomBtn="existCustomBtn"
            @custom-validate="customValidate"
            @saved="saved"
            @rendered="rendered"
    >
        <template #outputRequest>
            <div class="edit-outputdata-view">
                <div class="title">导入模板: </div>
                <ul class="file-list" v-for="(item,index) in outputRequest" :key="item.attId" :class="{ 'not-last': index < outputRequest.length -1 }">
                    <li >
                        <p>模板下载:
                            <span class="filename">
                                <a class="filename" href="\static\download\院任务EXCEL导入模版.xls" download="院任务EXCEL导入模版.xls">院任务EXCEL导入模版.xls</a>
                            </span>
                        </p>
                    </li>
                    <li>
                        <p>导入说明: 严格按照模板导入！</p>
                    </li>
                </ul>
            </div>
        </template>
        <template #customBtn>
            <div>
                <el-button type="primary"
                           @click="handleSubmit">导入</el-button>
            </div>
        </template>
    </form-list>
</template>
<script>
    import { P8Form as FormList } from '~/index'
    // eslint-disable-next-line standard/object-curly-even-spacing
    import { Notification } from '~/index'
    export default {
        name: 'importTaskExcel',
        components: {
            FormList,
            // eslint-disable-next-line vue/no-unused-components
            Notification
        },
        props: {
            taskId: {
                type: String,
                default: '00001'
            },
            outputRequest: {
                type: Array
            },
            createPage: {
                type: String
            }
        },
        data () {
            const dataSource = [
                {
                    type: 'blank',
                    labelText: '',
                    slotName: 'outputRequest',
                    colLayout: ''
                },
                {
                    type: 'blank',
                    labelText: '',
                    slotName: 'outputIo',
                    colLayout: ''
                },
                {
                    type: 'upload',
                    labelText: '', // 控件显示的文本
                    fieldName: 'uploadFileJson',
                    defaultValue: [],
                    colLayout: 'singleCol',
                    uploadConfig: {
                        drag: true, // 上传附件按钮形式：单击或拖动到某区域上传设置为'drag:true'，单击按钮上传不做设置
                        limit: 1
                    },
                    listType: 'text' // 带密级的上传附件为'secret'，不带密级的listType分为'text'、'picture'、'picture-card'
                }
            ]
            return {
                saveApi: 'courtyardPlanManager.importTaskExcel',
                checkOutApi: 'courtyardPlanManager.importTaskExcelCheckOut',
                outputIoApi: 'courtyardPlanManager.importTaskExcel',
                dataSource,
                isCustomValidate: true,
                existDefaultBtn: false,
                existCustomBtn: true,
                formData: Object.assign({}, {
                    uploadFileJson: []
                    /**
                     * confidentialiteList: 在增删行带附件中需处理成二维数组
                     * confidentialiteList: [
                     *   [ {confidentialite: ''} ]
                     * ]
                     */
                    // confidentialiteList: []
                })
            }
        },
        methods: {
            rendered () {

            },
            saved (res) {
                if (res.length > 0) {
                    res.forEach((message) => {
                        Notification.warning({
                            message: message
                        })
                    })
                }
                this.formData = {}
                this.$emit('save-success', 'output')
            },
            getOutputIoData () {
                let _this = this
                this.$api[this.outputIoApi]({ taskId: _this.taskId }).then(res => {
                    // let uploadFileJson = res.uploadFileJson
                    if (res && res.length) {
                        res.forEach((item, index) => {
                            _this.renderedFormData(item, index)
                        })
                    } else {
                        _this.renderedFormData({})
                    }
                    console.log('rendered-formdata', this.formData)
                })
            },
            renderedFormData (row, index) {
                if (Object.keys(row).length) {
                    let tempObj = {
                        uploadFiles: []
                    }
                    let tempFileObj = {}
                    Object.keys(row).forEach(key => {
                        if (key.indexOf('aor') !== -1) {
                            tempObj[key] = row[key]
                        }
                        if (row['attFileName']) {
                            if (key.indexOf('att') !== -1) {
                                tempFileObj[this.keyHandle('att', key)] = row[key]
                            }
                        }
                        tempObj.taskId = row.taskId
                        tempObj.key = row.key
                    })
                    if (Object.keys(tempFileObj).length) {
                        tempObj.uploadFiles.push(tempFileObj)
                    }
                    this.$set(this.formData.uploadFileJson, index, tempObj)

                    // let confidentDefaultValue = [ { confidentialite: tempFileObj.confidentialite } ]
                    // this.$set(this.formData.confidentialiteList, index, confidentDefaultValue)
                } else {
                    let tempObj = {}
                    this.dataSource[this.dataSource.length - 1].children.forEach(item => {
                        tempObj[item.fieldName] = item.defaultValue
                    })
                    this.$set(this.formData.uploadFileJson, 0, tempObj)
                    // this.formData.confidentialiteList = []
                }
            },
            /** rowInfo中 att-文件信息字段 key 的处理 */
            keyHandle (str, key) {
                let s = key.replace(str, '')
                s = s.replace(s[0], s[0].toLowerCase())
                return s
            },
            handleSubmit (e) {
                this.$refs.form.handleSubmit(e)
            },
            customValidate (saveParams) {
                console.log('-----SaveParams----', saveParams)
                console.log('-----SaveParams创建页面----', this.createPage)
                let params = { // params: 保存时请求接口所需的参数
                    taskId: this.taskId,
                    createSource: this.createPage === 'compile' ? '0' : '1',
                    uploadFileJson: []
                }
                if (saveParams.uploadFileJson && saveParams.uploadFileJson.length > 0) {
                    saveParams.uploadFileJson.forEach((item, index) => {
                        let tempObj = {}
                        tempObj.aorId = this.taskId
                        tempObj.aorName = item.aorName ? item.aorName : ''
                        tempObj.aorDetail = item.aorDetail ? item.aorDetail : ''
                        tempObj.taskId = item.taskId ? item.taskId : this.taskId
                        tempObj.attId = item.id
                        tempObj.attFilePath = item.filePath
                        tempObj.attFileName = item.fileName
                        tempObj.attFileType = item.fileType
                        tempObj.attConfidentialite = item.confidentialite
                        this.$set(params.uploadFileJson, index, tempObj)
                    })
                } else {
                    Notification.error({
                        message: 'excel导入文件为空！'
                    })
                    return
                }
                this.$api['courtyardPlanManager.importTaskExcelCheckOut'](params).then(data => {
                    if (data.length > 0) {
                        let messages = ''
                        data.forEach((message) => {
                            messages += '<li> <i>' + message + '</i> </li>'
                        })
                        Notification.error({
                            title: '导入错误提示',
                            dangerouslyUseHTMLString: true,
                            message: messages
                        })
                    } else {
                        this.$refs.form.submitForm(params, this.saveApi)
                    }
                }).finally(() => {
                    // this.search.exportLoading = false
                })
            },
            downloadOutputRequsetFile (item) { // 模板下载
                console.log(item, 'item111')
                if (item.attId) {
                    this.$api['SystemSettings.getFileUrl']({ attachmentId: item.attId }, { responseType: 'blob' }).then(backJson => {
                        let link = document.createElement('a')
                        link.href = window.URL.createObjectURL(new Blob([backJson.data]))
                        link.download = item.fileName
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
    .el-form.formList .el-row {
        height: auto;
    }
    .edit-outputdata-view{
        background-color: rgba(239, 239, 239, .5);
        position: relative;
        min-height: 40px;
        .title {
            position: absolute;
            left: -100px;
            width: 100px;
            height: 100%;
            text-align: center;
            background-color: rgba(239, 239, 239, .5);
        }
        .file-list {
            li {
                box-sizing: border-box;
                list-style: decimal;
                padding: 0 10px;
                margin-left: 20px;
                &.not-last {
                    border-bottom: 1px solid rgba(0, 0, 0, .1);
                }
                p {
                    margin: 0;
                    padding: 0;
                }
                p span.filename {
                    cursor: pointer;
                }
            }
        }
    }
    .edit-outputIo-view {
        position: relative;
        .title {
            position: absolute;
            left: -100px;
            width: 100px;
            text-align: center;
        }
    }
</style>
