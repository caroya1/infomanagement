import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';
import Home from '../views/Home.vue';
import ForumView from '../views/ForumView.vue';
import ForumDetail from '../views/ForumDetail.vue';
import LearningView from '../views/LearningView.vue';
import LearningDetail from '../views/LearningDetail.vue';
import MallView from '../views/MallView.vue';
import ProfileView from '../views/ProfileView.vue';
// 修复：使用真实的后端API而不是Mock API
import { getUserInfo } from '../api/auth';
import { ElMessage } from 'element-plus';

// 路由守卫，验证登录状态 - 修复为使用真实API
const requireAuth = async (to, from, next) => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  console.log('[Router Debug] 路由守卫检查:', { hasToken: !!token, userType: userInfo.userType });
  
  if (!token) {
    console.log('[Router Debug] 无token，重定向到登录页');
    next('/login');
  } else {
    try {
      // 使用真实的后端API验证token
      const response = await getUserInfo();
      console.log('[Router Debug] Token验证结果:', { success: response.success });
      
      if (response.success) {
        // 已登录，检查权限
        if (to.name === 'Admin' && userInfo.userType !== 'admin') {
          console.log('[Router Debug] 非管理员访问管理员页面，重定向到用户页面');
          next('/home');
        } else {
          console.log('[Router Debug] 验证通过，允许访问');
          next();
        }
      } else {
        console.log('[Router Debug] Token验证失败:', response.message);
        ElMessage.error(response.message || '登录状态已过期，请重新登录');
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        next('/login');
      }
    } catch (error) {
      console.error('[Router Debug] 验证登录状态请求异常:', error);
      ElMessage.error('验证登录状态请求出错');
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      next('/login');
    }
  }
};

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: requireAuth
  },
  {
    path: '/home',
    name: 'home', // 修复：改为小写，与导航栏一致
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/forum',
    name: 'forum',
    component: ForumView,
    beforeEnter: requireAuth // 添加认证守卫
  },
  {
    path: '/forum/detail/:id',
    name: 'ForumDetail',
    component: ForumDetail,
    beforeEnter: requireAuth // 添加认证守卫
  },
  {
    path: '/mall',
    name: 'mall',
    component: MallView,
    beforeEnter: requireAuth // 添加认证守卫
  },
  {
    path: '/learning',
    name: 'learning',
    component: LearningView,
    beforeEnter: requireAuth // 添加认证守卫
  },
  {
    path: '/learning/detail/:id',
    name: 'LearningDetail',
    component: LearningDetail,
    beforeEnter: requireAuth // 添加认证守卫
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    beforeEnter: requireAuth // 添加认证守卫
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;