<template>
    <div slot="calculator" class="calculator-wrapper">
        <el-tabs type="border-card">
            <el-tab-pane label="普通计算器">
                <normalCalc></normalCalc>
            </el-tab-pane>
            <el-tab-pane label="日期计算器">
                <dateCalc></dateCalc>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import normalCalc from "pages/winCalculator/normalCalc";
    import dateCalc from "pages/winCalculator/dateCalc";

    export default {
        name: "calculator",
        components: {
            normalCalc, dateCalc,
        },
        beforeRouteEnter(to, from, next) {
            next(vm => (vm.$store.commit('EDIT_METANAME', to.meta), vm.$store.commit('EDIT_MENUINDEX', '2-3')))
        },
        data() {
            return {};
        }
    }
</script>

<style lang="less" scoped>
.calculator-wrapper{

}

</style>