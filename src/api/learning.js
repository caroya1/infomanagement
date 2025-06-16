import api from './auth.js';

// 学习活动相关 API
export const learningApi = {
  // 获取活动列表
  async getActivities(params = {}) {
    try {
      const response = await api.get('/learning/activities', { params });
      return response.data || [];
    } catch (error) {
      console.error('获取活动列表失败:', error);
      return [];
    }
  },

  // 获取单个活动详情
  async getActivityById(id) {
    try {
      const response = await api.get(`/learning/activities/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('获取活动详情失败:', error);
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

  // 更新浏览量
  async updateViews(id) {
    try {
      await api.post(`/learning/activities/${id}/view`);
      return true;
    } catch (error) {
      console.error('更新浏览量失败:', error);
      return false;
    }
  }
};