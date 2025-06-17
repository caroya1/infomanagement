import api from './auth.js';

// 收藏相关 API - 调用真实的后端接口
export const favoriteApi = {
  // 添加论坛帖子收藏
  async addFavorite(postId, postType = 'forum') {
    try {
      let endpoint;
      if (postType === 'forum') {
        endpoint = `/forum/posts/${postId}/favorite`;
      } else if (postType === 'learning') {
        endpoint = `/learning/activities/${postId}/favorite`;
      } else {
        throw new Error('不支持的收藏类型');
      }

      const response = await api.post(endpoint);
      return response.data;
    } catch (error) {
      console.error('添加收藏失败:', error);
      throw error;
    }
  },

  // 移除收藏
  async removeFavorite(postId, postType = 'forum') {
    try {
      let endpoint;
      if (postType === 'forum') {
        endpoint = `/forum/posts/${postId}/favorite`;
      } else if (postType === 'learning') {
        endpoint = `/learning/activities/${postId}/favorite`;
      } else {
        throw new Error('不支持的收藏类型');
      }

      await api.delete(endpoint);
      return true;
    } catch (error) {
      console.error('移除收藏失败:', error);
      throw error;
    }
  },

  // 检查是否已收藏
  async isFavorite(postId, postType = 'forum') {
    try {
      let endpoint;
      if (postType === 'forum') {
        endpoint = `/forum/posts/${postId}/favorite/check`;
      } else if (postType === 'learning') {
        endpoint = `/learning/activities/${postId}/favorite/check`;
      } else {
        return false;
      }

      const response = await api.get(endpoint);
      return response.data?.isFavorite || false;
    } catch (error) {
      console.error('检查收藏状态失败:', error);
      return false;
    }
  },

  // 获取收藏列表 - 调用真实的后端API
  async getFavorites() {
    try {
      console.log('[Favorite API] 开始获取用户收藏列表');
      const response = await api.get('/profile/favorites');

      if (response.success && response.data) {
        const favorites = Array.isArray(response.data) ? response.data : [];
        console.log('[Favorite API] 获取收藏列表成功，共', favorites.length, '条');
        return favorites;
      } else {
        console.error('[Favorite API] 获取收藏列表失败:', response.message);
        return [];
      }
    } catch (error) {
      console.error('[Favorite API] 获取收藏列表异常:', error);
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

// 预约相关 API - 整合到学习模块
export const reservationApi = {
  // 预约活动 - 使用学习模块API
  async addReservation(activityId) {
    try {
      const response = await api.post(`/learning/activities/${activityId}/reserve`);
      return response.data;
    } catch (error) {
      console.error('预约活动失败:', error);
      throw error;
    }
  },

  // 取消预约 - 使用学习模块API
  async cancelReservation(activityId) {
    try {
      await api.delete(`/learning/activities/${activityId}/reserve`);
      return true;
    } catch (error) {
      console.error('取消预约失败:', error);
      throw error;
    }
  },

  // 检查是否已预约 - 使用学习模块API
  async isReserved(activityId) {
    try {
      const response = await api.get(`/learning/activities/${activityId}/reserve/check`);
      return response.data?.isReserved || false;
    } catch (error) {
      console.error('检查预约状态失败:', error);
      return false;
    }
  },

  // 获取用户预约列表 - 使用学习模块API
  async getReservations() {
    try {
      const response = await api.get('/learning/reservations');
      return response.data || [];
    } catch (error) {
      console.error('获取预约列表失败:', error);
      return [];
    }
  }
};

// 充值相关 API
export const rechargeApi = {
  // 充值余额
  async recharge(amount, paymentMethod) {
    try {
      const response = await api.post('/profile/recharge', {
        amount,
        paymentMethod
      });
      return response.data;
    } catch (error) {
      console.error('充值失败:', error);
      throw error;
    }
  },

  // 获取充值记录
  async getRechargeHistory() {
    try {
      const response = await api.get('/profile/recharge-history');
      return response.data || [];
    } catch (error) {
      console.error('获取充值记录失败:', error);
      return [];
    }
  }
};