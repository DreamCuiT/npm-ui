<template>
    <el-container>
    <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                  text-color="#333333" active-text-color="#1890ff"
                 @select="menuSelect">
            <el-menu-item index="1">项目计划完成率</el-menu-item>
            <el-menu-item index="2">部门计划完成率</el-menu-item>
        </el-menu>
    </el-header>
    <el-main>
        <template v-if="activeIndex==1">
            <plan-RateList></plan-RateList>
        </template>
        <template v-if="activeIndex==2">
            <deptplan-RateList></deptplan-RateList>
        </template>
    </el-main>
    </el-container>
</template>
<script>
    import { Container, Header, Main, Menu, MenuItem } from '~/index'
    import PlanRateList from './planRateList'
    import DeptplanRateList from './deptplanRateList'
    export default {
        components: {
            PlanRateList,
            DeptplanRateList,
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
            menuSelect (index, indexPath) {
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
