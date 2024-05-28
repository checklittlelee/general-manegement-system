// 封装请求，统一处理网络请求和错误信息
import axios from "axios"
import config from "../config"
import { ElMessage } from "element-plus"
const NETWORK_ERROR = "网络请求异常,请稍后重试....."

const service = axios.create({
  // 创建 axios 实例
  baseURL: config.baseApi,
})

// 请求前拦截器，可以添加一些通用的请求配置
service.interceptors.request.use((req) => {
  return req
})

// 请求后拦截器
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data
  if (code == 200) {
    return data
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

// 封装的核心函数--用于发送 HTTP 请求
function request(options) {
  options.method = options.method || "get"
  if (options.method.toLowerCase() == "get") {
    options.params = options.data
  }
  // 对 mock 的处理，可以单独决定是否使用 mock 数据
  let isMock = config.mock
  if (typeof options.mock !== "undefined") {
    isMock = options.mock
  }
  // 如果是生产环境，不使用 mock 数据
  if (config.env == "prod") {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }

  return service(options)
}
export default request
