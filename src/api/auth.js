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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理通用错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求错误:', error);
    if (error.response?.status === 401) {
      // token 过期，清除本地存储并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 登录 API
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password
    });

    // 如果登录成功，保存 token 和用户信息
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }

    return response;
  } catch (error) {
    return {
      success: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || '登录失败，请稍后重试'
    };
  }
};

// 获取用户信息 API
export const getUserInfo = async (token) => {
  try {
    const response = await api.get('/auth/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '获取用户信息失败'
    };
  }
};

// 退出登录 API
export const logout = async () => {
  try {
    await api.post('/auth/logout');
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    return { success: true };
  } catch (error) {
    // 即使后端返回错误，也清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    return { success: true };
  }
};

export default api;