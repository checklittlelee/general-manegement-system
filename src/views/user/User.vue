<template>
  <div class="table">
    <!-- table上方 新增和搜索 -->
    <div class="user-header">
      <el-button type="primary" @click="handleAdd">+ 新增</el-button>
      <el-form :inline="true" :model="formInline">
        <el-form-item class="search-item">
          <el-input
            v-model="formInline.keyword"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlerSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- table列表、分页器 -->
    <div class="table">
      <el-table :data="list" style="width: 100%" height="540px">
        <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width | 125"
        />
        <el-table-column fixed="right" label="操作" min-width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        small
        background
        layout="prev, pager, next"
        :page-size="20"
        :total="config.total"
        class="pagi mt-4"
        @current-change="changePage"
      />
    </div>
    <el-dialog
      width="35%"
      v-model="dialogVisible"
      :title="action == 'add' ? '新增用户' : '编辑用户'"
    >
      <el-form :inline="true" :model="formUser" ref="userForm" :rules="rules">
        <el-row>
          <!-- 姓名 -->
          <el-col :span="12">
            <el-form-item label="姓名" prop="name"
              ><el-input
                v-model="formUser.name"
                placeholder="请输入姓名"
              ></el-input
            ></el-form-item>
          </el-col>
          <!-- 年龄 -->
          <el-col :span="12">
            <el-form-item label="年龄" prop="age"
              ><el-input
                v-model.number="formUser.age"
                placeholder="请输入年龄"
              ></el-input
            ></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- 性别 -->
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select
                v-model="formUser.sex"
                placeholder="请选择"
                style="width: 100px"
              >
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 出生日期 -->
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker
                v-model="formUser.birth"
                type="date"
                aria-label="出生日期"
                placeholder="请输入"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- 地址 -->
          <el-form-item label="地址" prop="addr">
            <el-input v-model="formUser.addr" placeholder="请输入地址" />
          </el-form-item>
        </el-row>
        <el-row style="justify-content: flex-end">
          <el-form-item>
            <el-button type="primary" @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, nextTick } from "vue"

const { proxy } = getCurrentInstance()

const tableLabel = reactive([
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "sexLabel",
    label: "性别",
  },
  {
    prop: "birth",
    label: "出生日期",
    width: 200,
  },
  {
    prop: "addr",
    label: "地址",
    width: 320,
  },
])
const list = ref([])
const config = reactive({
  total: 0,
  page: 1,
  name: "",
})
// 区分新增和编辑
const action = ref("add")
// 对话框中用户数据
const formUser = reactive({
  name: "",
  age: "",
  sex: "",
  birth: "",
  addr: "",
})
let userForm = ref()

const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [{ required: true, message: "年龄是必填项", trigger: "blur" }],
  addr: [{ required: true, message: "地址是必填项", trigger: "blur" }],
})

// table 数据请求
const getUserData = async (config) => {
  let res = await proxy.$api.getUserData(config)
  config.total = res.count
  list.value = res.list.map((item) => {
    item.sexLabel = item.sex === 0 ? "女" : "男"
    return item
  })
}
// pagination 点击分页器换页
const changePage = (page) => {
  config.page = page
  getUserData(config)
}

// 点击新增按钮
const handleAdd = () => {
  formUser.name = ""
  formUser.age = ""
  formUser.sex = ""
  formUser.birth = ""
  formUser.addr = ""

  action.value = "add"
  dialogVisible.value = true
}
// 点击搜索按钮
const formInline = reactive({
  keyword: "",
})
const handlerSearch = () => {
  config.name = formInline.keyword
  getUserData(config)
}

const dialogVisible = ref(false)
// 点击对话框中取消
const handleCancel = () => {
  dialogVisible.value = false
}
// 日期处理
const timeFormat = (time) => {
  var time = new Date(time)
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var date = time.getDate()
  function add(m) {
    return m < 10 ? "0" + m : m
  }
  return year + "-" + add(month) + "-" + add(date)
}
// 点击对话框中确定
const onSubmit = () => {
  // 表单校验是否通过
  proxy.$refs.userForm.validate(async (valid) => {
    // 校验通过
    if (valid) {
      // 新增
      if (action.value == "add") {
        formUser.birth = timeFormat(formUser.birth)
        let res = await proxy.$api.addUser(formUser)
        if (res) {
          dialogVisible.value = false
          getUserData(config)
        }
      } else {
        // 编辑
        formUser.birth = timeFormat(formUser.birth)
        formUser.sex == "男" ? (formUser.sex = "1") : (formUser.sex = "0")
        let res = await proxy.$api.editUser(formUser)
        if (res) {
          dialogVisible.value = false
          getUserData(config)
        }
      }
    } else {
      // 校验没通过
      ElMessage({
        showClose: true,
        message: "请输入正确的内容",
        type: "error",
      })
    }
  })
}

// 点击编辑用户
const handleEdit = (row) => {
  row.sex == 1 ? (row.sex = "男") : (row.sex = "女")
  Object.assign(formUser, row)
  action.value = "edit"
  dialogVisible.value = true
}
// 点击删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm("你确定删除吗?")
    .then(async () => {
      await proxy.$api.deleteUser({
        id: row.id,
      })
      ElMessage({
        showClose: true,
        message: "删除成功",
        type: "success",
      })
      getUserData(config)
    })
    .catch(() => {
      // catch error
    })
}

onMounted(() => {
  getUserData(config)
})
</script>

<style lang="less" scoped>
.pagi {
  margin-top: 30px;
}
.user-header {
  display: flex;
  justify-content: space-between;
}
</style>
