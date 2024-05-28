// 环境配置文件：开发环境、测试环境、生产环境
const env = import.meta.env.MODE || "prod"

const EnvConfig = {
  development: {
    baseApi: "/api",
    mockApi: "https://mock.apifox.com/m1/4068509-0-default/api",
  },
  test: {
    baseApi: "//test.future.com/api",
    mockApi:
      "https://www.fastmock.site/mock/300283cb590d2022f75682f11a1848b0/api",
  },
  prod: {
    baseApi: "//future.com/api",
    mockApi:
      "https://www.fastmock.site/mock/300283cb590d2022f75682f11a1848b0/api",
  },
}
// console.log(env)
// console.log(EnvConfig[env], "env")
export default {
  env,
  // mock的总开关
  mock: false,
  ...EnvConfig[env],
}
