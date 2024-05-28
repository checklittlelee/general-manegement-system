<template>
  <el-aside :width="$store.state.isCollapse ? '64px' : '180px'">
    <el-menu :collapse="$store.state.isCollapse" :collapse-transition="false">
      <!-- 菜单栏顶部名称及logo -->
      <div class="comp-info" @click="goHome">
        <img
          v-show="$store.state.isCollapse"
          src="../assets/images/management-logo.png"
          alt=""
        />
        <span v-show="!$store.state.isCollapse">后台管理</span>
      </div>
      <!-- 第一个 -->
      <el-menu-item
        v-for="item in noChildren()"
        :key="item.path"
        :index="item.path"
        @click="clickMenu(item)"
      >
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <!-- 第二个 -->
      <el-sub-menu
        v-for="item in hasChildren()"
        :key="item.path"
        :index="item.label"
      >
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
            :index="subItem.path"
            @click="clickMenu(subItem)"
          >
            <component class="icons" :is="subItem.icon"></component>
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useStore } from "vuex"

const router = useRouter()
const store = useStore()

const noChildren = () => {
  return asyncList.filter((item) => !item.children)
}
const hasChildren = () => {
  return asyncList.filter((item) => item.children)
}
const asyncList = store.state.menu

// 点击menu实现右侧el-main路由跳转
const clickMenu = (item) => {
  router.push({
    name: item.name,
  })
  store.commit("selectMenu", item)
}
const goHome = () => {
  router.push({
    name: "home",
  })
}
</script>

<style lang="less" scoped>
.icons {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.el-menu {
  border-right: none;
  .comp-info {
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-weight: bold;
    background: #e0b9b9;
    cursor: pointer;
    img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
