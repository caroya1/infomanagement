import axios from 'axios';
import { ElMessage } from 'element-plus';  // 导入 ElMessage

// 创建 axios 实例
const request = axios.create({
  baseURL: '/',  // 设置基础URL
  timeout: 10000  // 设置超时时间
});

// 请求拦截器 - 添加 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
request.interceptors.response.use(
  (response) => {
    // 如果后端返回的是包装过的数据结构，直接返回 data
    return response.data;
  },
  (error) => {
    console.error('响应错误:', error);
    // 统一处理错误
    const msg = error.response?.data?.message || error.message || '请求失败';
    ElMessage.error(msg);
    return Promise.reject(error);
  }
);

export default request;
