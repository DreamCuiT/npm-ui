<template>
    <el-container>
        <el-header>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                     background-color="#ffffff" text-color="#333333" active-text-color="#1890ff"
                     @select="menuSelect">
                <el-menu-item index="1">计量标准装置管理</el-menu-item>
                <el-menu-item index="2">计量专用测试设备管理</el-menu-item>
            </el-menu>
        </el-header>
        <el-main>
            <template v-if="activeIndex==1">
                <device-List></device-List>
            </template>
            <template v-if="activeIndex==2">
                <test-List></test-List>
            </template>
        </el-main>
    </el-container>
</template>
<script>
    import { Container, Header, Main, Menu, MenuItem } from '~/index'
    import deviceList from './deviceList'
    import testList from './testList'

    export default {
        components: {
            deviceList,
            testList,
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
