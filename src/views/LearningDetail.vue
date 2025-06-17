<template>
  <div class="learning-detail">
    <el-page-header @back="goBack" content="活动详情"></el-page-header>
    <el-card class="detail-card">
      <template #header>
        <div class="flex justify-between items-center">
          <h3>{{ activity.title }}</h3>
        </div>
      </template>
      <div class="detail-content">
        <div class="post-meta">
          <span>发布者: {{ activity.author }}</span>
          <span>发布时间: {{ activity.createTime }}</span>
          <span>浏览量: {{ activity.views }}</span>
          <span>已预约人数: {{ activity.reservedCount }}</span>
        </div>
        <img :src="activity.imageUrl" alt="封面图片" class="post-image">
        <div class="post-content" v-html="activity.content"></div>
        <el-button 
          type="primary" 
          @click="reserveActivity(activity.id)">
          预约活动
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { learningApi } from '../api/learning.js';
import { reservationApi } from '../api/common.js';

const route = useRoute();
const router = useRouter();

const activity = ref({
  id: 0,
  title: '',
  content: '',
  author: '',
  createTime: '',
  views: 0,
  imageUrl: '',
  reservedCount: 0
});

const goBack = () => {
  router.back();
};

// 加载活动详情
const loadActivityDetail = async () => {
  try {
    const activityId = parseInt(route.params.id);
    const activityData = await learningApi.getActivityById(activityId);
    
    if (activityData) {
      activity.value = { ...activityData };
      // 更新浏览量
      await learningApi.updateViews(activityId, activityData.views + 1);
      activity.value.views = activityData.views + 1;
    } else {
      router.push('/learning');
      ElMessage({
        message: '活动不存在',
        type: 'warning',
        duration: 2000
      });
    }
  } catch (error) {
    console.error('获取活动详情失败', error);
    ElMessage({
      message: '加载活动失败，请重试',
      type: 'error',
      duration: 2000
    });
    router.push('/learning');
  }
};

// 预约活动
const reserveActivity = async () => {
  try {
    await reservationApi.addReservation(activity.value.id);
    activity.value.reservedCount++;
    ElMessage.success('预约成功！');
  } catch (error) {
    console.error('预约失败:', error);
    ElMessage.error('预约失败，请重试');
  }
};

onMounted(() => {
  loadActivityDetail();
});

watch(() => route.params, () => {
  loadActivityDetail();
});
</script>

<style scoped>
.learning-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-card {
  margin-bottom: 20px;
}

.post-meta {
  margin: 10px 0;
  color: #606266;
  font-size: 14px;
}

.post-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 20px;
}

.post-content {
  margin-top: 20px;
  line-height: 1.6;
}
</style>