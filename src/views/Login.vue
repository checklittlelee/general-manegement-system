<template>
  <div>
    <el-form class="login-container">
      <h3>系统登录</h3>
      <!-- 账号 -->
      <el-form-item :model="loginForm">
        <el-input
          type="input"
          placeholder="请输入账号"
          v-model="loginForm.username"
          style="width: 260px"
        ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item>
        <el-input
          type="password"
          placeholder="请输入密码"
          v-model="loginForm.password"
          style="width: 260px"
        ></el-input>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

const router = useRouter()
const store = useStore()
const { proxy } = getCurrentInstance()

const loginForm = reactive({
  username: "admin",
  password: "admin",
})

// 点击登录
const login = async () => {
  const res = await proxy.$api.getMenu(loginForm)
  store.commit("setMenu", res.menu)
  store.commit("addMenu", router)
  store.commit("setToken", res.token)
  router.push({ name: "home" })
}
</script>

<style lang="less" scoped>
.login-container {
  width: 350px;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 180px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }
}
</style>
