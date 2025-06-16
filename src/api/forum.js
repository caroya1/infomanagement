import api from './auth.js';

// 论坛相关 API
export const forumApi = {
  // 获取帖子列表
  async getPosts(params = {}) {
    try {
      const response = await api.get('/forum/posts', { params });
      return response.data || [];
    } catch (error) {
      console.error('获取帖子列表失败:', error);
      return [];
    }
  },

  // 获取单个帖子详情
  async getPostById(id) {
    try {
      const response = await api.get(`/forum/posts/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('获取帖子详情失败:', error);
      return null;
    }
  },

  // 创建新帖子
  async createPost(postData) {
    try {
      const response = await api.post('/forum/posts', postData);
      return response.data;
    } catch (error) {
      console.error('创建帖子失败:', error);
      throw error;
    }
  },

  // 更新帖子
  async updatePost(id, postData) {
    try {
      const response = await api.put(`/forum/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error('更新帖子失败:', error);
      throw error;
    }
  },

  // 删除帖子
  async deletePost(id) {
    try {
      await api.delete(`/forum/posts/${id}`);
      return true;
    } catch (error) {
      console.error('删除帖子失败:', error);
      throw error;
    }
  },

  // 更新浏览量
  async updateViews(id) {
    try {
      await api.post(`/forum/posts/${id}/view`);
      return true;
    } catch (error) {
      console.error('更新浏览量失败:', error);
      return false;
    }
  }
};