import api from './auth.js';

// 论坛相关 API
export const forumApi = {
  // 获取帖子列表 - 修复数据结构处理
  async getPosts(params = {}) {
    try {
      console.log('[Forum API] 开始获取帖子列表:', params);
      const response = await api.get('/forum/posts', { params });

      console.log('[Forum API] 原始响应:', {
        success: response.success,
        hasData: !!response.data,
        dataType: typeof response.data
      });

      // 处理后端返回的数据结构
      if (response.success && response.data) {
        // 如果返回的是分页对象，提取records数组
        if (response.data.records && Array.isArray(response.data.records)) {
          console.log('[Forum API] 返回分页数据，条数:', response.data.records.length);
          return response.data.records;
        }
        // 如果直接是数组
        else if (Array.isArray(response.data)) {
          console.log('[Forum API] 返回数组数据，条数:', response.data.length);
          return response.data;
        }
        // 其他情况，返回空数组
        else {
          console.warn('[Forum API] 返回数据格式异常:', response.data);
          return [];
        }
      } else {
        console.error('[Forum API] 请求失败:', response.message);
        return [];
      }
    } catch (error) {
      console.error('[Forum API] 获取帖子列表异常:', error);
      return [];
    }
  },

  // 获取单个帖子详情 - 修复数据结构处理
  async getPostById(id) {
    try {
      console.log('[Forum API] 获取帖子详情:', id);
      const response = await api.get(`/forum/posts/${id}`);

      if (response.success && response.data) {
        console.log('[Forum API] 帖子详情获取成功');
        return response.data;
      } else {
        console.error('[Forum API] 获取帖子详情失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('[Forum API] 获取帖子详情异常:', error);
      return null;
    }
  },

  // 创建新帖子 - 修复API调用和错误处理
  async createPost(postData) {
    try {
      console.log('[Forum API] 开始创建帖子:', postData)
      const response = await api.post('/forum/posts', postData);

      console.log('[Forum API] 创建帖子响应:', response)

      if (response.success && response.data) {
        console.log('[Forum API] 帖子创建成功')
        return response.data;
      } else {
        console.error('[Forum API] 帖子创建失败:', response.message)
        throw new Error(response.message || '发布失败')
      }
    } catch (error) {
      console.error('[Forum API] 创建帖子异常:', error);
      throw new Error(error.response?.data?.message || error.message || '发布失败，请重试');
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

  // 更新浏览量 - 修复参数处理
  async updateViews(id, newViews) {
    try {
      console.log('[Forum API] 更新浏览量:', id, newViews);
      const response = await api.post(`/forum/posts/${id}/view`, {
        views: newViews
      });

      if (response.success) {
        console.log('[Forum API] 浏览量更新成功');
        return true;
      } else {
        console.warn('[Forum API] 浏览量更新失败:', response.message);
        return false;
      }
    } catch (error) {
      console.error('[Forum API] 更新浏览量异常:', error);
      return false;
    }
  }
};