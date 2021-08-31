<template>
    <el-container>
        <el-header>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                     background-color="#ffffff" text-color="#333333" active-text-color="#1890ff"
                     @select="menuSelect">
                <el-menu-item index="1">共性资源计划</el-menu-item>
                <!--<el-menu-item index="2">共性资源分析</el-menu-item>-->
                <!--<el-menu-item index="3">共性资源完成率</el-menu-item>-->
            </el-menu>
        </el-header>
        <el-main>
            <template v-if="activeIndex==1">
                <plan-List></plan-List>
            </template>
            <template v-if="activeIndex==2">
                <analysis-List></analysis-List>
            </template>
            <template v-if="activeIndex==3">
                <completion-List></completion-List>
            </template>
        </el-main>
    </el-container>
</template>
<script>
    import { Container, Header, Main, Menu, MenuItem } from '~/index'
    import PlanList from './planList'
    import AnalysisList from './analysisList'
    import CompletionList from './completionList'

    export default {
        components: {
            PlanList,
            AnalysisList,
            CompletionList,
            'el-container': Container,
            'el-header': Header,
            'el-main': Main,
            'el-menu': Menu,
            'el-menu-item': MenuItem
        },
        data () {
            return {
                activeIndex: '1',
                chatDrawer: false,
                thirdMenuParam: {},
                drawerConfig: {
                    modal: false,
                    'modal-append-to-body': false,
                    'custom-class': 'custom-chat-drawer-class'
                }
            }
        },
        methods: {
            menuSelect (index) {
                this.activeIndex = index
            }
        }
    }
</script>
<style lang="scss" scoped>
.el-main{
  padding:0;
}
.el-header{
  padding:0;
  height:50px !important;
}
</style>
