<template>
    <div style="position:relative;padding-bottom:30px;">
        <form-list ref="form"
                   :dataSource="dataSource"
                   :form="formData"
                   :api="saveApi"
                   @saved="saved"
                   labelWidth="90px"
                   :isCustomValidate="true"
                   @custom-validate="parseCheck">
        </form-list>
        <template>
            <div>
                <editable-table :columns="paramColumns"
                                :renderHeight="renderHeight"
                                :addRow="true"
                                :params="params"
                                :api="tableConfigDetailsApi"
                                @save-param-data="saveParamData">
                    <template #content="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.content"
                                    :content="scope.row.content">
                            <el-input class="classInput" v-model="scope.row.content"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #time="{scope, data}">
                        <el-date-picker v-model="scope.row.time"
                                        type="date"
                                        style="width: 140px;"
                                        :value-format="valueFormat"
                                        @change="saveParamData(data)"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </template>
                    <template #deptId="{scope, data}">
                        <el-select v-model="scope.row.deptId" placeholder="请选择"
                                   @blur="saveParamData(data)">
                            <template v-for="(item,index) in deptIdTypes">
                                <el-option :label="item.label" :value="item.id"
                                           :key="index"></el-option>
                            </template>
                        </el-select>
                    </template>
                    <template #wholeDescribeId="{scope, data}">
                        <el-input v-model="scope.row.wholeDescribeName"
                                  readonly
                                  autosize
                                  placeholder="请选择项目"
                                  v-on:click.native="showModal(scope)"
                                  @blur="saveParamData(data)">
                            <i v-if='selectedRow'
                               class='el-icon-link'
                               slot='suffix'
                               type='link'
                               :style='{cursor: "pointer", fontSize: "16px", color: "#08c" }'></i>
                        </el-input>
                    </template>
                    <template #type="{scope, data}">
                        <el-select v-model="scope.row.type" placeholder="请选择"
                                   @blur="saveParamData(data)">
                            <template v-for="(item,index) in types">
                                <el-option :label="item.label" :value="item.value"
                                           :key="index"></el-option>
                            </template>
                        </el-select>
                    </template>
                    <template #remark="{scope, data}">
                        <el-tooltip effect="light" :disabled="!scope.row.remark"
                                    :content="scope.row.remark">
                            <el-input v-model="scope.row.remark"
                                      @blur="saveParamData(data)"></el-input>
                        </el-tooltip>
                    </template>
                    <template #getFile="{scope}">
                            <li v-for="(item, index) in scope.row.getFile" :key="index" @click="downloadFile(item)">
                                <span style='cursor:pointer;'>{{ item.fileName }}</span>
                            </li>
                    </template>
                    <template #handle="{scope, data}">
                        <el-button type="primary" @click="saveParamData(data),showFile(scope)"
                        >上传附件
                        </el-button>
                    </template>
                </editable-table>
            </div>
        </template>

        <select-file v-if='selectFileVisible' :selected-row='selectedRowFile'
                     :visible='selectFileVisible'
                     @close-modal='closeFileModal'></select-file>

        <select-project v-if='selectProjectVisible' :selected-row='selectedRow'
                        :visible='selectProjectVisible'
                        @close-modal='closeProjectModal'></select-project>

    </div>
</template>

<script>
    import { Input, DatePicker, Select, Option, Button, Tooltip } from '~/index'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/base16-dark.css'
    import 'codemirror/mode/sql/sql'
    import { P8Form as FormList } from '~/index'
    import { P8EditTable as EditableTable } from '~/index'
    import SelectProject from '@/views/Product/Pm/Project/selectProject'
    import SelectFile from './selectFile'

    export default {
        name: 'SqlEdit',
        components: {
            FormList,
            EditableTable,
            SelectProject,
            SelectFile,
            'el-date-picker': DatePicker,
            'el-input': Input,
            'el-select': Select,
            'el-option': Option,
            'el-tooltip': Tooltip,
            'el-button': Button
        },
        data () {
            const height = document.documentElement.clientHeight - 212
            return {
                selectedRowFile: {},
                selectFileVisible: false,
                selectedRow: {},
                selectProjectVisible: false,
                renderHeight: height + 'px',
                valueFormat: 'yyyy-MM-dd',
                valueFormatTime: 'yyyy-MM-dd HH:mm:ss',
                cmOptions: {
                    tabSize: 4,
                    mode: 'sql',
                    theme: 'base16-dark',
                    lineNumbers: true,
                    line: true
                },
                saveApi: 'memorabilia.save',
                tableConfigDetailsApi: 'memorabilia.list',
                dataSource: [],
                formData: {},
                types: [],
                deptIdTypes: [],
                wholeDescribeIdTypes: [],
                paramColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '内容',
                        dataIndex: 'content',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '日期',
                        dataIndex: 'time',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '部门',
                        dataIndex: 'deptId',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '项目',
                        dataIndex: 'wholeDescribeId',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '类型',
                        dataIndex: 'type',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '附件',
                        dataIndex: 'getFile',
                        default: '',
                        scopedSlots: { customRender: 'custom' }
                    },
                    {
                        title: '操作',
                        dataIndex: 'handle',
                        default: '',
                        width: 70,
                        scopedSlots: { customRender: 'custom' }
                    }
                ],
                params: {
                    deptId: ''
                },
                sqlParams: {
                    getFile: []
                },
                scopeValue: {}
            }
        },
        mounted () {
            this.getDept()
            this.getType()
        },
        methods: {
            getType () {
                let that = this
                this.$api['thirdPartInterface.getDic']({ dicType: 'QUALITY_DEVELOPMENT_STAGE' }).then(res => {
                    that.types = res
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            getDept () {
                let that = this
                this.$api['userManager.deptTree']().then(res => {
                    that.deptIdTypes = res
                }).catch(function (error) {
                    console.log('error' + error)
                })
            },
            saveParamData (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].getFile === '') {
                        data[i].getFile = []
                    }
                }
                this.sqlParams['memorabiliaRequests'] = data
            },
            saved (res) {
                this.$emit('saveSuccess', res)
            },
            parseCheck (saveParams) {
                let params = { ...saveParams, ...this.sqlParams }
                let _this = this
                _this.$refs.form.submitForm(params, _this.saveApi)
            },
            showModal (scope) {
                this.scopeValue = scope
                this.selectProjectVisible = true
            },
            closeProjectModal (selectedRow) {
                this.selectProjectVisible = false
                this.selectedRow = selectedRow
                console.log(selectedRow, 'selectedRow')
                if (this.selectedRow) {
                    let that = this
                    that.sqlParams.memorabiliaRequests[that.scopeValue.$index].wholeDescribeId = selectedRow.id
                    that.sqlParams.memorabiliaRequests[that.scopeValue.$index].wholeDescribeName = selectedRow.name
                    that.sqlParams = Object.assign({}, that.sqlParams)
                }
            },
            showFile (scope) {
                this.scopeValue = scope
                this.selectFileVisible = true
            },
            closeFileModal (row) {
                this.selectFileVisible = false
                let that = this
                let files = that.sqlParams.memorabiliaRequests[that.scopeValue.$index].getFile
                console.log(files, 'files')
                if (files != null) {
                    for (let i = 0; i < row.length; i++) {
                        that.sqlParams.memorabiliaRequests[that.scopeValue.$index].getFile.push(row[i])
                    }
                }
            },
            downloadFile (item) { // 输出要求-文件下载
                if (item.id) {
                    this.$api['SystemSettings.getFileUrl']({ attachmentId: item.id }, { responseType: 'blob' }).then(backJson => {
                        console.log(backJson, '附件下载')
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
<style lang="scss">
    .classInput{
        display:inline-block;   //这个看情况加
        white-space:nowrap;    //必须
        overflow:hidden;     //必须
        text-overflow:ellipsis;    //必须
    }
</style>
