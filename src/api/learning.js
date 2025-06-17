import api from './auth.js';

// 学习活动相关 API
export const learningApi = {
  // 获取活动列表 - 修复数据结构处理
  async getActivities(params = {}) {
    try {
      console.log('[Learning API] 开始获取活动列表:', params);
      const response = await api.get('/learning/activities', { params });

      console.log('[Learning API] 原始响应:', {
        success: response.success,
        hasData: !!response.data,
        dataType: typeof response.data
      });

      // 处理后端返回的分页数据结构
      if (response.success && response.data) {
        // 如果返回的是分页对象，提取records数组
        if (response.data.records && Array.isArray(response.data.records)) {
          console.log('[Learning API] 返回分页数据，条数:', response.data.records.length);
          return response.data.records;
        }
        // 如果直接是数组
        else if (Array.isArray(response.data)) {
          console.log('[Learning API] 返回数组数据，条数:', response.data.length);
          return response.data;
        }
        // 其他情况，返回空数组
        else {
          console.warn('[Learning API] 返回数据格式异常:', response.data);
          return [];
        }
      } else {
        console.error('[Learning API] 请求失败:', response.message);
        return [];
      }
    } catch (error) {
      console.error('[Learning API] 获取活动列表异常:', error);
      return [];
    }
  },

  // 获取单个活动详情 - 修复数据结构处理
  async getActivityById(id) {
    try {
      console.log('[Learning API] 获取活动详情:', id);
      const response = await api.get(`/learning/activities/${id}`);

      if (response.success && response.data) {
        console.log('[Learning API] 活动详情获取成功');
        return response.data;
      } else {
        console.error('[Learning API] 获取活动详情失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('[Learning API] 获取活动详情异常:', error);
      return null;
    }
  },

  // 预约活动
  async reserveActivity(id) {
    try {
      const response = await api.post(`/learning/activities/${id}/reserve`);
      return response.data;
    } catch (error) {
      console.error('预约活动失败:', error);
      throw error;
    }
  },

  // 取消预约
  async cancelReservation(id) {
    try {
      await api.delete(`/learning/activities/${id}/reserve`);
      return true;
    } catch (error) {
      console.error('取消预约失败:', error);
      throw error;
    }
  },

  // 获取用户预约列表
  async getUserReservations() {
    try {
      const response = await api.get('/learning/reservations');
      return response.data || [];
    } catch (error) {
      console.error('获取预约列表失败:', error);
      return [];
    }
  },

  // 更新浏览量 - 修复参数处理
  async updateViews(id, newViews) {
    try {
      console.log('[Learning API] 更新浏览量:', id, newViews);
      const response = await api.post(`/learning/activities/${id}/view`, {
        views: newViews
      });

      if (response.success) {
        console.log('[Learning API] 浏览量更新成功');
        return true;
      } else {
        console.warn('[Learning API] 浏览量更新失败:', response.message);
        return false;
      }
    } catch (error) {
      console.error('[Learning API] 更新浏览量异常:', error);
      return false;
    }
  }
};