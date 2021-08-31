<template>
    <el-container>
        <el-main>
            <template v-if="activeIndex==1">
                <list></list>
            </template>
        </el-main>
    </el-container>
</template>
<script>
    import { Container, Main } from '~/index'
    import List from './list'

    export default {
        components: {
            List,
            'el-container': Main,
            'el-main': Container
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
<style lang="scss">
.el-main{
  padding:0;
}
</style>
