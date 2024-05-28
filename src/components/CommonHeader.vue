<template>
  <el-header>
    <div class="l-content">
      <!-- 左侧折叠按钮 -->
      <el-button size="small" @click="handleCollapse">
        <el-icon :size="20"><Menu /></el-icon>
      </el-button>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">{{
          current.label
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 右侧用户头像及下拉 -->
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user" :src="getImageUrl('user')" alt="" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

const router = useRouter()
const store = useStore()

// 折叠
const handleCollapse = () => {
  store.commit("updateIsCollapse")
}

// 用户头像
let getImageUrl = (imgName) => {
  return new URL(`../assets/images/${imgName}.jpg`, import.meta.url).href
}

// 面包屑
const current = computed(() => {
  return store.state.currentMenu
})

// 退出登录
const handleLoginOut = () => {
  store.commit("cleanMenu")
  router.push({
    name: "login",
  })
}
</script>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #123861;
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
:deep(.bread span) {
  color: #fff !important;
  cursor: pointer !important;
}
</style>
