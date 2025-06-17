import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // 确保token格式正确，统一添加Bearer前缀
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[Token Debug] 请求携带token:', token.substring(0, 20) + '...');
    }
    return config;
  },
  (error) => {
    console.error('[Token Debug] 请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理通用错误
api.interceptors.response.use(
  (response) => {
    // 直接返回后端的Result对象
    console.log('[Token Debug] 响应数据结构:', {
      success: response.data.success,
      hasData: !!response.data.data,
      hasToken: !!(response.data.data && response.data.data.token)
    });
    return response.data;
  },
  (error) => {
    console.error('[Token Debug] 响应错误:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // token 过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 登录 API - 重新设计
export const login = async (username, password) => {
  try {
    console.log('[Token Debug] 开始登录请求:', username);
    const response = await api.post('/auth/login', {
      username,
      password
    });

    console.log('[Token Debug] 登录响应:', {
      success: response.success,
      hasData: !!response.data,
      hasToken: !!(response.data && response.data.token)
    });

    // 检查登录是否成功并且有token
    if (response.success && response.data && response.data.token) {
      // 存储token和用户信息
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      console.log('[Token Debug] Token存储成功:', response.data.token.substring(0, 20) + '...');
    } else {
      console.error('[Token Debug] 登录失败，无有效token');
    }

    return response;
  } catch (error) {
    console.error('[Token Debug] 登录请求异常:', error);
    return {
      success: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || '登录失败，请稍后重试'
    };
  }
};

// 获取用户信息 API - 重新设计
export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('[Token Debug] 获取用户信息，当前token:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      console.warn('[Token Debug] 无token，无法获取用户信息');
      return {
        success: false,
        message: '未登录'
      };
    }

    const response = await api.get('/auth/userinfo');

    console.log('[Token Debug] 获取用户信息响应:', {
      success: response.success,
      hasData: !!response.data,
      username: response.data ? response.data.username : 'N/A'
    });

    return response;
  } catch (error) {
    console.error('[Token Debug] 获取用户信息失败:', error.response?.status, error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || '获取用户信息失败'
    };
  }
};

// 退出登录 API - 重新设计
export const logout = async () => {
  try {
    console.log('[Token Debug] 开始退出登录');
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('[Token Debug] 后端退出登录请求失败，但继续清理本地数据:', error.message);
  } finally {
    // 无论后端请求是否成功，都清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    console.log('[Token Debug] 本地token和用户信息已清除');

    // 跳转到登录页
    window.location.href = '/login';
  }
};

export default api;