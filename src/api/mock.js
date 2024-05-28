import Mock from "mockjs"
import homeApi from "./mockData/home"
import userApi from "./mockData/user"
import permissionApi from "./mockData/permission"

Mock.mock("/home/getData", homeApi.getHomeData)
Mock.mock(/user\/getUser/, userApi.getUserList)
Mock.mock(/user\/add/, "post", userApi.createUser)
Mock.mock(/user\/edit/, "post", userApi.updateUser)
Mock.mock(/user\/delete/, "get", userApi.deleteUser)
Mock.mock(/permission\/getMenu/, "post", permissionApi.getMenu)
