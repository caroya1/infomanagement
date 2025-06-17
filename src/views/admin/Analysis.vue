<template>
  <div class="analysis-container">
    <!-- 用户运营数据 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>用户运营数据</span>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="data-card">
            <h3>总用户数</h3>
            <div class="number">{{ userStats.totalUsers || 0 }}</div>
          </el-card>
        </el-col>
      </el-row>      <div class="chart-container">
        <h3>新增用户趋势</h3>
        <v-chart class="chart" :option="userChartOption" />
      </div>
    </el-card>

    <!-- 社区论坛数据 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>社区论坛数据</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="data-card">
            <h3>总帖子数</h3>
            <div class="number">{{ forumStats.totalPosts || 0 }}</div>
          </el-card>
        </el-col>
      </el-row>      <div class="chart-container">
        <h3>新增帖子趋势</h3>
        <v-chart class="chart" :option="postChartOption" />
      </div>

      <el-row :gutter="20" class="mt-4">
        <el-col :span="12">
          <h3>高互动帖子 TOP5</h3>
          <el-table :data="forumStats.topPosts || []" stripe>
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="views" label="浏览量" />
            <el-table-column prop="favorites" label="收藏量" />
            <el-table-column fixed="right" label="操作" width="100">
              <template #default="scope">
                <el-button link type="primary" @click="viewForumDetail(scope.row.id)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <el-col :span="12">
          <h3>活跃用户排行</h3>
          <el-table :data="forumStats.activeUsers || []" stripe>
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="post_count" label="发帖数" />
          </el-table>
        </el-col>
      </el-row>

      <div class="word-cloud-container mt-4">
        <h3>热门话题词云</h3>
        <v-chart class="word-cloud" :option="wordCloudOption" />
      </div>
    </el-card>

    <!-- 热门预约活动 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>热门预约活动</span>
        </div>
      </template>

      <el-table :data="hotReservations" stripe>
        <el-table-column prop="title" label="活动名称" />
        <el-table-column prop="startTime" label="开始时间">
          <template #default="scope">
            {{ formatDateTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="reservationCount" label="预约人数" />
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button link type="primary" @click="viewReservationDetail(scope.row.id)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import * as echarts from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import 'echarts-wordcloud'
import { formatDateTime } from '@/utils/date'

// 注册必要的组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent
])

// API 引入
import { getUserStats, getForumStats, getHotReservations } from '@/api/analysis'

const router = useRouter()
const userStats = ref({})
const forumStats = ref({})
const hotReservations = ref([])

// 图表配置
const userChartOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [],
    type: 'line',
    areaStyle: {}
  }]
})

const postChartOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [],
    type: 'line',
    areaStyle: {}
  }]
})

// 词云配置
const wordCloudOption = ref({
  series: [{
    type: 'wordCloud',
    shape: 'circle',
    left: 'center',
    top: 'center',
    width: '70%',
    height: '80%',
    right: null,
    bottom: null,
    sizeRange: [12, 60],
    rotationRange: [-90, 90],
    rotationStep: 45,
    gridSize: 8,
    drawOutOfBound: false,
    textStyle: {
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      color: function () {
        return 'rgb(' + [
          Math.round(Math.random() * 160),
          Math.round(Math.random() * 160),
          Math.round(Math.random() * 160)
        ].join(',') + ')'
      }
    },
    emphasis: {
      textStyle: {
        shadowBlur: 10,
        shadowColor: '#333'
      }
    },
    data: []
  }]
})

// 获取数据
const fetchData = async () => {    try {
      // 获取用户统计数据
      const userStatsRes = await getUserStats();
      if (userStatsRes.data) {
        userStats.value = userStatsRes.data;
        const dates = userStatsRes.data.dailyNewUsers.map(item => item.date);
        const counts = userStatsRes.data.dailyNewUsers.map(item => item.count);
        userChartOption.value.xAxis.data = dates;
        userChartOption.value.series[0].data = counts;
      }      // 获取论坛统计数据
      const forumStatsRes = await getForumStats();
      if (forumStatsRes.data) {
        forumStats.value = forumStatsRes.data;
        const dates = forumStatsRes.data.dailyNewPosts.map(item => item.date);
        const counts = forumStatsRes.data.dailyNewPosts.map(item => item.count);
        postChartOption.value.xAxis.data = dates;
        postChartOption.value.series[0].data = counts;

      // 更新词云数据
      wordCloudOption.value.series[0].data = forumStatsRes.data.hotKeywords.map(item => ({
        name: item.keyword,
        value: item.count
      }))
    }

    // 获取热门预约活动
    const hotReservationsRes = await getHotReservations()
    if (hotReservationsRes.data) {
      hotReservations.value = hotReservationsRes.data
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  }
}

// 查看详情
const viewForumDetail = (id) => {
  router.push(`/forum/detail/${id}`)
}

const viewReservationDetail = (id) => {
  router.push(`/reservation/detail/${id}`)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.analysis-container {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.mt-4 {
  margin-top: 20px;
}

.data-card {
  text-align: center;
  padding: 20px;
}

.data-card .number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-top: 10px;
}

.chart-container {
  margin-top: 20px;
  height: 300px;
}

.chart {
  height: 100%;
  width: 100%;
}

.word-cloud-container {
  height: 400px;
}

.word-cloud {
  height: 100%;
  width: 100%;
}
</style>
