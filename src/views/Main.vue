<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 左边侧边栏 -->
      <CommonAside />
      <!-- 右边 -->
      <el-container>
        <CommonHeader />
        <el-main class="right-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonHeader from "../components/CommonHeader.vue"
import CommonAside from "../components/CommonAside.vue"
</script>

<style lang="less" scoped>
.el-container {
  flex-wrap: wrap;
  height: 100%;
}
.common-layout {
  .lay-container {
    flex-wrap: nowrap;
    .right-main {
      height: calc(100% - 124px) !important;
    }
  }
}
</style>
