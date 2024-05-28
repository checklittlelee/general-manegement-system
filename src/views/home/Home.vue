<template>
  <el-row class="home" :gutter="20">
    <!-- 左侧 用户信息、图表 -->
    <el-col :span="8">
      <!-- 上方 -->
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/images/user.jpg" alt="" />
          <div class="user-info">
            <p class="name">Admin</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间:<span>2024-06-01</span></p>
          <p>上次登录的地点:<span>杭州</span></p>
        </div>
      </el-card>
      <!-- 下方 -->
      <el-card shadow="hover" style="margin-top: 30px; height: 400px">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <!-- 右侧 图表 -->
    <el-col :span="16">
      <!-- 上方 订单 -->
      <div class="num">
        <el-card
          v-for="item in countData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: 0 }"
        >
          <component
            :is="item.icon"
            :style="{ background: item.color }"
            class="icons"
          ></component>
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!-- 中间 折线图 -->
      <el-card style="height: 280px">
        <div ref="echart" style="height: 280px"></div>
      </el-card>
      <!-- 下方 柱状图、饼图 -->
      <div class="graph">
        <el-card style="height: 280px">
          <div ref="userechart" style="height: 240px"></div>
        </el-card>
        <el-card style="height: 280px">
          <div ref="videoechart" style="height: 240px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue"
import * as echarts from "echarts"

// getCurrentInstance 函数用于获取当前组件实例的引用
// 通过 proxy 属性访问了组件的属性、方法等信息
const { proxy } = getCurrentInstance()

// 左下方table数据
const tableData = ref([])
const tableLabel = {
  name: "课程",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总购买",
}
const getTableList = async () => {
  let res = await proxy.$api.getTableData()
  tableData.value = res
}

// 右上方表格
const countData = ref([])
const getCountData = async () => {
  let res = await proxy.$api.getCountData()
  countData.value = res
}

// 右下方表格
let xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: "#333",
  },
  grid: {
    left: "20%",
  },
  // 提示框
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    axisLabel: {
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
})
let pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: [],
})
let orderData = reactive({
  xData: [],
  series: [],
})
let userData = reactive({
  xData: [],
  series: [],
})
let videoData = reactive({
  series: [],
})
const getChartData = async () => {
  let result = await proxy.$api.getChartData()
  // console.log(result)
  let res = result.orderData
  let userRes = result.userData
  let videoRes = result.videoData
  orderData.xData = res.date
  const keyArray = Object.keys(res.data[0])
  const series = []
  keyArray.forEach((key) => {
    series.push({
      name: key,
      data: res.data.map((item) => item[key]),
      type: "line",
    })
  })
  orderData.series = series
  xOptions.xAxis.data = orderData.xData
  xOptions.series = orderData.series
  // userData进行渲染
  let hEcharts = echarts.init(proxy.$refs["echart"])
  hEcharts.setOption(xOptions)

  // 柱状图进行渲染的过程
  userData.xData = userRes.map((item) => item.date)
  userData.series = [
    {
      name: "新增用户",
      data: userRes.map((item) => item.new),
      type: "bar",
    },
    {
      name: "活跃用户",
      data: userRes.map((item) => item.active),
      type: "bar",
    },
  ]

  xOptions.xAxis.data = userData.xData
  xOptions.series = userData.series
  let uEcharts = echarts.init(proxy.$refs["userechart"])
  uEcharts.setOption(xOptions)
  videoData.series = [
    {
      data: videoRes,
      type: "pie",
    },
  ]
  pieOptions.series = videoData.series
  let vEcharts = echarts.init(proxy.$refs["videoechart"])
  vEcharts.setOption(pieOptions)
}

onMounted(() => {
  getTableList()
  getCountData()
  getChartData()
})
</script>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    img {
      width: 180px;
      height: 190px;
      border-radius: 50%;
      margin-right: 70px;
    }
    .user-info {
      .name {
        font-size: 30px;
      }
      .role {
        font-size: 15px;
        color: #123861;
        font-weight: 700;
        margin-top: 10px;
        text-align: center;
      }
    }
  }
  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span {
        color: #666;
        margin-left: 50px;
      }
    }
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icons {
      width: 70px;
      height: 70px;
      color: #fff;
    }
    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .num {
        font-size: 20px;
        margin-bottom: 10px;
      }
      .txt {
        font-size: 12px;
        text-align: center;
        color: #999;
      }
    }
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 48%;
    }
  }
}
</style>
