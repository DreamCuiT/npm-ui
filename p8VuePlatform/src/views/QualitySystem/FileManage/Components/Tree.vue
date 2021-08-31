<template>
    <div>
        <v-contextmenu ref="treeMenu">
            <v-contextmenu-item v-if="contextmenuSelectedNode != null && contextmenuSelectedNode.hierarchy != 3" @click="createOrg">新建菜单</v-contextmenu-item>
            <v-contextmenu-item  @click="editOrg">修改菜单</v-contextmenu-item>
            <v-contextmenu-item  @click="deleteOrg">删除菜单</v-contextmenu-item>
        </v-contextmenu>

        <el-tree
                ref="tree"
                :data="orgTreeData"
                node-key="id"
                :props="defaultProps"
                default-expand-all
                :expand-on-click-node="false"
                @node-contextmenu="showContextMenu"
                @node-click="handleNodeClick"
                :render-content="customRender"
                @update="update"
        >
        </el-tree>
    </div>
</template>
<script>
    /**
     * System Menu Tree Component
     * ----------------------
     * Author: Vicco Wang
     * Date: 2018.06.13
     */
    import { Tree } from '~/index'
    import { mapGetters } from 'vuex'
    // eslint-disable-next-line standard/object-curly-even-spacing
    import { generateTree } from '../../../../utils/generateTree'

    // api
    export default {
        name: 'SystemMenuTree',
        data () {
            return {
                orgTreeData: [{
                    id: 1,
                    label: '一级 1',
                    children: [
                        {
                            id: 2,
                            label: '2'
                        }
                    ]
                }],
                contextmenuSelectedNode: null,
                defaultProps: {
                    label: 'name'
                }
            }
        },
        props: {
            clickedNodeData: {
                type: Object
            }
        },
        components: {
            'el-tree': Tree
        },
        computed: {
            ...mapGetters(['systemTheme']),
            selectedNode () {
                return this.clickedNodeData
            }
        },
        mounted () {
            this.qualityTree()
        },
        methods: {
            initOrgTree () {
                this.$api['qualitySystem.qualityTree']().then(res => {
                    this.orgTreeData = generateTree(res)
                })
            },
            qualityTree () {
                let that = this
                that.$api['qualitySystem.qualityTree']().then(res => {
                    that.orgTreeData = generateTree(res)
                })
            },
            // 节点点击事件
            handleNodeClick (data, node, nodeCom) {
                this.$emit('nodeClick', { data, node, nodeCom })
            },
            // 节点右键弹出菜单
            showContextMenu (event, data, node, nodeCom) {
                if (node) {
                    const tree = this.$refs.tree
                    const contextMenu = this.$refs.treeMenu
                    // 右键设置当前树节点为选中状态
                    this.contextmenuSelectedNode = data
                    tree.setCurrentKey(data.id)
                    // 弹出菜单
                    contextMenu.show({ top: event.clientY, left: event.clientX })
                }
            },
            update () {
                this.initOrgTree()
                //   console.log('tree updated.')
            },
            // 菜单 -- 新建
            createOrg () {
                this.$emit('update:isCreate', true)
                this.$emit('openDialog', this.contextmenuSelectedNode)
            },
            // 菜单 -- 编辑
            editOrg () {
                this.$emit('update:isCreate', false)
                this.$emit('updateTree', 'update', this.contextmenuSelectedNode)
            },
            // 菜单 -- 删除
            deleteOrg () {
                const { name, id } = this.contextmenuSelectedNode
                if (id) {
                    this.$confirm(`此操作将删除:[${name}], 确认要删除吗?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$api['qualitySystem.removeNode']({ id: id }).then(res => {
                            if (res && res.data) {
                                // eslint-disable-next-line no-undef
                                that.$message({
                                    message: res.data.resultMsg,
                                    type: 'warning'
                                })
                            } else {
                                this.initOrgTree()
                            }
                        })
                    }).catch(() => {})
                }
            },
            // 树节点自定义渲染格式 (JSX)
            customRender (createElement, { node, data, store }) {
                // directive 参数参考指令钩子函数中的定义: https://cn.vuejs.org/v2/guide/custom-directive.html
                // const directives = [{name: 'contextmenu', arg: 'treeMenu'}]
                const directives = [{ name: 'contextmenu', arg: 'treeMenu' }]
                return (
                    <span class="custom-tree-node" { ...{ directives } } >
                    <span>{ node.label }</span>
                {
                    (this.$refs.tree.getCurrentNode() && data.id === this.$refs.tree.getCurrentNode().id) &&
                    <span class="active"></span>
                }
                    </span>
                     )
            }
        }
    }
</script>
<style lang="scss" scoped>
    .custom-tree-node {
        position:relative;
        width:100%;

        .active {
            position: absolute;
            display: inline-block;
            width:10px;
            height:10px;
            right:10px;
            top:3px;
            border-radius:10px;
        }
    }
</style>
