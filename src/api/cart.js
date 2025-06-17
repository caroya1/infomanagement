import api from './auth.js';

// 购物车相关 API
export const cartApi = {
  // 获取购物车列表
  async getCart() {
    try {
      console.log('[Cart API] 开始获取购物车');
      const response = await api.get('/cart');

      if (response.success && response.data) {
        // 确保返回数组
        const cartItems = Array.isArray(response.data) ? response.data : [];
        console.log('[Cart API] 获取购物车成功，商品数量:', cartItems.length);
        return cartItems;
      } else {
        console.error('[Cart API] 获取购物车失败:', response.message);
        return [];
      }
    } catch (error) {
      console.error('[Cart API] 获取购物车异常:', error);
      return [];
    }
  },

  // 添加商品到购物车
  async addToCart(productId, quantity = 1) {
    try {
      console.log('[Cart API] 添加商品到购物车:', { productId, quantity });
      const response = await api.post('/cart/add', {
        productId,
        quantity
      });

      if (response.success) {
        console.log('[Cart API] 添加到购物车成功');
        return true;
      } else {
        console.error('[Cart API] 添加到购物车失败:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('[Cart API] 添加到购物车异常:', error);
      throw error;
    }
  },

  // 更新购物车商品数量
  async updateCartItem(productId, quantity) {
    try {
      console.log('[Cart API] 更新购物车商品数量:', { productId, quantity });
      const response = await api.put('/cart/update', {
        productId,
        quantity
      });

      if (response.success) {
        console.log('[Cart API] 更新购物车成功');
        return true;
      } else {
        console.error('[Cart API] 更新购物车失败:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('[Cart API] 更新购物车异常:', error);
      throw error;
    }
  },

  // 从购物车移除商品
  async removeFromCart(productId) {
    try {
      console.log('[Cart API] 从购物车移除商品:', productId);
      const response = await api.delete(`/cart/remove/${productId}`);

      if (response.success) {
        console.log('[Cart API] 从购物车移除成功');
        return true;
      } else {
        console.error('[Cart API] 从购物车移除失败:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('[Cart API] 从购物车移除异常:', error);
      throw error;
    }
  },

  // 清空购物车
  async clearCart() {
    try {
      console.log('[Cart API] 清空购物车');
      const response = await api.delete('/cart/clear');

      if (response.success) {
        console.log('[Cart API] 清空购物车成功');
        return true;
      } else {
        console.error('[Cart API] 清空购物车失败:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('[Cart API] 清空购物车异常:', error);
      throw error;
    }
  }
};

// 商品相关 API
export const productApi = {
  // 获取商品列表
  async getProducts(params = {}) {
    try {
      console.log('[Product API] 开始获取商品列表:', params);
      const response = await api.get('/products', { params });

      if (response.success && response.data) {
        // 处理分页数据
        if (response.data.records && Array.isArray(response.data.records)) {
          console.log('[Product API] 返回分页数据，商品数量:', response.data.records.length);
          return response.data.records;
        } else if (Array.isArray(response.data)) {
          console.log('[Product API] 返回数组数据，商品数量:', response.data.length);
          return response.data;
        } else {
          console.warn('[Product API] 商品数据格式异常:', response.data);
          return [];
        }
      } else {
        console.error('[Product API] 获取商品列表失败:', response.message);
        return [];
      }
    } catch (error) {
      console.error('[Product API] 获取商品列表异常:', error);
      return [];
    }
  },

  // 获取商品详情
  async getProductById(id) {
    try {
      console.log('[Product API] 获取商品详情:', id);
      const response = await api.get(`/products/${id}`);

      if (response.success && response.data) {
        console.log('[Product API] 商品详情获取成功');
        return response.data;
      } else {
        console.error('[Product API] 获取商品详情失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('[Product API] 获取商品详情异常:', error);
      return null;
    }
  }
};

// 订单相关 API
export const orderApi = {
  // 购物车结算下单
  async checkout(orderInfo = {}) {
    try {
      console.log('[Order API] 开始购物车结算:', orderInfo);
      const response = await api.post('/orders/checkout', {
        shippingAddress: orderInfo.shippingAddress || '',
        remark: orderInfo.remark || ''
      });

      if (response.success) {
        console.log('[Order API] 下单成功:', response.data.orderNumber);
        return response.data;
      } else {
        console.error('[Order API] 下单失败:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('[Order API] 下单异常:', error);
      throw error;
    }
  },

  // 获取用户订单列表
  async getUserOrders() {
    try {
      console.log('[Order API] 获取用户订单列表');
      const response = await api.get('/orders');

      if (response.success && response.data) {
        const orders = Array.isArray(response.data) ? response.data : [];
        console.log('[Order API] 获取订单列表成功，订单数量:', orders.length);
        return orders;
      } else {
        console.error('[Order API] 获取订单列表失败:', response.message);
        return [];
      }
    } catch (error) {
      console.error('[Order API] 获取订单列表异常:', error);
      return [];
    }
  },

  // 获取订单详情
  async getOrderDetail(orderId) {
    try {
      console.log('[Order API] 获取订单详情:', orderId);
      const response = await api.get(`/orders/${orderId}`);

      if (response.success && response.data) {
        console.log('[Order API] 订单详情获取成功');
        return response.data;
      } else {
        console.error('[Order API] 获取订单详情失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('[Order API] 获取订单详情异常:', error);
      return null;
    }
  },

  // 取消订单
  async cancelOrder(orderId) {
    try {
      console.log('[Order API] 取消订单:', orderId);
      const response = await api.put(`/orders/${orderId}/cancel`);

      if (response.success) {
        console.log('[Order API] 订单取消成功');
        return true;
      } else {
        console.error('[Order API] 取消订单失败:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('[Order API] 取消订单异常:', error);
      throw error;
    }
  }
};