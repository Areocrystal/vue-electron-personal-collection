<template>
    <baseLayout>
        <div slot="personal" class="second-includer">
            <top-layout :showBack="true"></top-layout>
            <keep-alive exclude="dicePicture">
                <router-view/>
            </keep-alive>
            <template v-if="$route.name==='personal'">
                <h2 class="desc-title">简要描述</h2>
                <h3 class="desc-title">均为纯前端实现</h3>
                <el-divider><i class="el-icon-edit-outline"></i></el-divider>
                <el-row class="desc-row">
                    <el-col :span="24">
                        <div>
                            <h3>1.骰子作图</h3>
                            <p class="s-font">通过上传一张图片，还原其像素的样子，同时也可以裁剪图片、选择像素大小和设置颜色，有各种表单选择可供操作</p>
                        </div>
                    </el-col>
                </el-row>
                <el-divider><i class="el-icon-edit-outline"></i></el-divider>
                <el-row class="desc-row">
                    <el-col :span="24">
                        <div>
                            <h3>2.随机抽人</h3>
                            <p>先创建总人数和其每排人数，再设置抽取进行时间抽取一个什么东西的小游戏</p>
                        </div>
                    </el-col>
                </el-row>
                <el-divider><i class="el-icon-edit-outline"></i></el-divider>
                <el-row class="desc-row">
                    <el-col :span="24">
                        <div>
                            <h3>3.计算器</h3>
                            <p>仿制win10的计算器，做出计算器相应的功能，目前只有普通计算器和日期计算器</p>
                        </div>
                    </el-col>
                </el-row>
            </template>
        </div>
    </baseLayout>
</template>

<script>
    import baseLayout from "components/common/baseLayout";
    import topLayout from "components/common/topLayout";

    export default {
        name: "introduce",
        components: {baseLayout, topLayout,},
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.$store.commit('EDIT_METANAME', to.meta);
                vm.$store.commit('EDIT_MENUINDEX', '2');
            })
        },
        data() {
            return {}
        },
    }
</script>

<style lang="less" scoped>
    @import '~@/assets/css/index';
    @import '~@/assets/css/font';
</style>
