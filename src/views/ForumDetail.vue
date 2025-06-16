<template>
  <div class="forum-detail">
    <el-page-header @back="goBack" content="帖子详情"></el-page-header>
    <el-card class="detail-card">
      <template #header>
        <div class="flex justify-between items-center">
          <h3>{{ post.title }}</h3>
        </div>
      </template>
      <div class="detail-content">
        <div class="post-meta">
          <span>作者: {{ post.author }}</span>
          <span>发布时间: {{ post.createTime }}</span>
          <span>浏览量: {{ post.views }}</span>
        </div>
        <div class="post-content" v-html="post.content"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { forumApi } from '../mock/forumData.js';

const route = useRoute();
const router = useRouter();

const post = ref({
  id: 0,
  title: '',
  content: '',
  author: '',
  createTime: '',
  views: 0
});

const goBack = () => {
  router.back();
};

// 加载帖子详情
const loadPostDetail = async () => {
  try {
    const postId = parseInt(route.params.id);
    const postData = await forumApi.getPostById(postId);
    
    if (postData) {
      post.value = { ...postData };
      // 更新浏览量
      await forumApi.updateViews(postId, postData.views + 1);
      post.value.views = postData.views + 1;
    } else {
      router.push('/forum');
      ElMessage({
        message: '帖子不存在',
        type: 'warning',
        duration: 2000
      });
    }
  } catch (error) {
    console.error('获取帖子详情失败', error);
    ElMessage({
      message: '加载帖子失败，请重试',
      type: 'error',
      duration: 2000
    });
    router.push('/forum');
  }
};

onMounted(() => {
  loadPostDetail();
});

watch(() => route.params, () => {
  loadPostDetail();
});
</script>

<style scoped>
.forum-detail {
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

.post-content {
  margin-top: 20px;
  line-height: 1.6;
}
</style>