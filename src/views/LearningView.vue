<template>
  <div class="learning-container">
    <Navbar />
    <el-row class="learning-header">
      <el-col :span="24">
        <el-input 
          v-model="searchText" 
          placeholder="搜索活动" 
          prefix-icon="el-icon-search"
          @keyup.enter="searchActivity">
          <template #append>
            <el-button @click="searchActivity">搜索</el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row class="learning-content" :gutter="20">
      <el-col :span="8" v-for="activity in filteredActivities" :key="activity.id">
        <el-card 
          class="learning-card" 
          :body-style="{ padding: '0px' }">
          <div class="learning-image-container">
            <img :src="activity.imageUrl" alt="活动图片" class="learning-image">
          </div>
          <div class="learning-info" style="padding: 14px;">
            <h3 class="learning-title">{{ activity.title }}</h3>
            <div class="learning-author">发布者: {{ activity.author }}</div>
            <div class="learning-views">浏览量: {{ activity.views }}</div>
            <div class="learning-reserved">已预约人数: {{ activity.reservedCount }}</div>
            <el-button 
              type="primary" 
              size="small" 
              @click="goToActivityDetail(activity)">
              查看详情
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 16, 24]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="activities.length">
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { learningApi } from '../api/learning.js'
import { reservationApi } from '../api/common.js'

const router = useRouter()

// 修复数据初始化，确保数组数据的正确处理
const searchText = ref('')
const currentUser = 'test_user'
const originalActivities = ref([])
const activities = ref([])
const currentPage = ref(1)
const pageSize = ref(8)
const totalActivities = ref(0)

// 修复计算属性，添加防护措施
const filteredActivities = computed(() => {
  // 确保activities.value是数组
  if (!Array.isArray(activities.value)) {
    console.warn('[Learning View] activities.value不是数组:', typeof activities.value);
    return [];
  }

  let result = [...activities.value]
  
  // 搜索过滤
  if (searchText.value) {
    result = result.filter(activity => {
      // 添加属性存在检查
      if (!activity) return false;
      
      const title = activity.title || '';
      const content = activity.content || '';
      const author = activity.author || '';
      
      return title.toLowerCase().includes(searchText.value.toLowerCase()) || 
             content.toLowerCase().includes(searchText.value.toLowerCase()) || 
             author.toLowerCase().includes(searchText.value.toLowerCase());
    });
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 搜索活动
const searchActivity = () => {
  currentPage.value = 1
}

// 查看活动详情
const goToActivityDetail = async (activity) => {
  try {
    await learningApi.updateViews(activity.id, activity.views + 1)
    router.push(`/learning/detail/${activity.id}`)
  } catch (error) {
    console.error('更新浏览量失败', error)
    router.push(`/learning/detail/${activity.id}`)
  }
}

// 预约活动
const reserveActivity = async (activity) => {
  try {
    await reservationApi.addReservation(activity.id);
    activity.reservedCount++;
    ElMessage.success('预约成功！');
  } catch (error) {
    console.error('预约失败:', error);
    ElMessage.error('预约失败，请重试');
  }
};

// 检查是否已预约
const isReserved = async (activityId) => {
  try {
    return await reservationApi.isReserved(activityId);
  } catch (error) {
    console.error('检查预约状态失败:', error);
    return false;
  }
};

// 修复数据获取函数，添加更多防护措施
const fetchActivities = async () => {
  try {
    console.log('[Learning View] 开始获取活动数据');
    const data = await learningApi.getActivities()
    
    console.log('[Learning View] 获取到的数据:', {
      isArray: Array.isArray(data),
      length: data ? data.length : 0,
      type: typeof data
    });
    
    // 确保数据是数组
    if (Array.isArray(data)) {
      originalActivities.value = data
      activities.value = data
      totalActivities.value = data.length
      console.log('[Learning View] 活动数据设置成功，共', data.length, '条');
    } else {
      console.error('[Learning View] 获取的数据不是数组:', data);
      // 设置为空数组以防止错误
      originalActivities.value = []
      activities.value = []
      totalActivities.value = 0
      
      ElMessage({
        message: '活动数据格式异常，请联系管理员',
        type: 'error',
        duration: 3000
      })
    }
  } catch (error) {
    console.error('[Learning View] 获取活动列表异常:', error)
    
    // 出错时设置为空数组
    originalActivities.value = []
    activities.value = []
    totalActivities.value = 0
    
    ElMessage({
      message: '加载活动列表失败，请重试',
      type: 'error',
      duration: 3000
    })
  }
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
.learning-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.learning-header {
  margin-bottom: 20px;
}

.learning-content {
  min-height: 500px;
}

.learning-card {
  width: 100%;
  max-width: 285px;
  margin-bottom: 20px;
}

.learning-image-container {
  height: 200px;
  overflow: hidden;
}

.learning-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.learning-card:hover .learning-image {
  transform: scale(1.05);
}

.learning-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.learning-author {
  color: #909399;
  font-size: 14px;
  text-align: left;
  margin-bottom: 5px;
}

.learning-views {
  color: #909399;
  font-size: 14px;
  text-align: left;
  margin-bottom: 5px;
}

.learning-reserved {
  color: #909399;
  font-size: 14px;
  text-align: left;
  margin-bottom: 10px;
}
</style>