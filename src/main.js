import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index"
import store from "./store/index"
// 按需引入 element-plus
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import "./assets/less/index.less"
import "./api/mock.js"
import api from "./api/api"

const app = createApp(App)

// elemen-plus 部分
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// app.config.globalProperties 是一个全局配置对象。
// 将 api 对象添加为全局属性，以便在整个 Vue 应用程序中可以方便地访问和使用
app.config.globalProperties.$api = api

// 路由
store.commit("addMenu", router)
function checkRouter(path) {
  let hasCheck = router.getRoutes().filter((route) => route.path == path).length
  if (hasCheck) {
    return true
  } else {
    return false
  }
}
router.beforeEach((to, from, next) => {
  store.commit("getToken")
  const token = store.state.token
  if (!token && to.name !== "login") {
    next({ name: "login" })
  } else if (!checkRouter(to.path)) {
    next({ name: "home" })
  } else {
    next()
  }
})

app.use(router)
app.use(store)
app.mount("#app")
