import api from './auth.js';

// 收藏相关 API
export const favoriteApi = {
  // 添加收藏
  async addFavorite(postId, postType = 'forum') {
    try {
      const response = await api.post('/favorites', {
        postId,
        postType
      });
      return response.data;
    } catch (error) {
      console.error('添加收藏失败:', error);
      throw error;
    }
  },

  // 移除收藏
  async removeFavorite(postId) {
    try {
      await api.delete(`/favorites/${postId}`);
      return true;
    } catch (error) {
      console.error('移除收藏失败:', error);
      throw error;
    }
  },

  // 检查是否已收藏
  async isFavorite(postId) {
    try {
      const response = await api.get(`/favorites/check/${postId}`);
      return response.data?.isFavorite || false;
    } catch (error) {
      console.error('检查收藏状态失败:', error);
      return false;
    }
  },

  // 获取收藏列表
  async getFavorites(params = {}) {
    try {
      const response = await api.get('/favorites', { params });
      return response.data || [];
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      return [];
    }
  }
};

// 商城相关 API
export const mallApi = {
  // 获取商品列表
  async getProducts(params = {}) {
    try {
      const response = await api.get('/mall/products', { params });
      return response.data || [];
    } catch (error) {
      console.error('获取商品列表失败:', error);
      return [];
    }
  },

  // 获取商品详情
  async getProductById(id) {
    try {
      const response = await api.get(`/mall/products/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('获取商品详情失败:', error);
      return null;
    }
  },

  // 添加到购物车
  async addToCart(productId, quantity = 1) {
    try {
      const response = await api.post('/mall/cart', {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('添加到购物车失败:', error);
      throw error;
    }
  },

  // 获取购物车
  async getCart() {
    try {
      const response = await api.get('/mall/cart');
      return response.data || [];
    } catch (error) {
      console.error('获取购物车失败:', error);
      return [];
    }
  }
};

// 预约相关 API  
export const reservationApi = {
  // 添加预约
  async addReservation(activityId) {
    try {
      const response = await api.post(`/reservations`, {
        activityId
      });
      return response.data;
    } catch (error) {
      console.error('添加预约失败:', error);
      throw error;
    }
  },

  // 获取所有预约
  async getReservations() {
    try {
      const response = await api.get('/reservations');
      return response.data || [];
    } catch (error) {
      console.error('获取预约列表失败:', error);
      return [];
    }
  },

  // 检查是否已预约
  async isReserved(activityId) {
    try {
      const response = await api.get(`/reservations/check/${activityId}`);
      return response.data?.isReserved || false;
    } catch (error) {
      console.error('检查预约状态失败:', error);
      return false;
    }
  },

  // 取消预约
  async cancelReservation(activityId) {
    try {
      await api.delete(`/reservations/${activityId}`);
      return true;
    } catch (error) {
      console.error('取消预约失败:', error);
      throw error;
    }
  }
};