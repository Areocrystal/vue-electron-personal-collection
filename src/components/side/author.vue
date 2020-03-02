<template>
  <div class="author-wrapper">
    <el-avatar style="vertical-align: middle;"
               src="https://avatars1.githubusercontent.com/u/29609342?s=460&v=4"></el-avatar>
    <span class="avatar-name">Areocrystal</span>
    <el-divider></el-divider>
  </div>
</template>

<script>
    export default {
        name: "author",
    }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/index';
  .author-wrapper {
    padding: 12px 24px 0;
    .avatar-name {
      margin-left: 8px;
      background: linear-gradient(to right, #ff545e, @main-color, #feff47, #41ff46);
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
    }
  }

</style>
