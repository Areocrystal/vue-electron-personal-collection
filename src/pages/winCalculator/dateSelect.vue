<template>
    <div>
        <p>{{desc}}</p>
        <el-select v-model="value" placeholder="请选择" style="width: 100px;" @change="emitDate(value)">
            <el-option v-for="(item, key) in dateList"
                       :key="key"
                       :label="item"
                       :value="item">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "date-select",
        props: ['desc'],
        created() {
            for (let i = 0; i < 1000; i++) {
                this.dateList.push(i);
            }
        },
        data() {
            return {
                dateList: [],
                value: '',
            }
        },
        methods: {
            emitDate(v) {
                this.$emit('getSelected', v);
            }
        }
    }
</script>

<style scoped>

</style>