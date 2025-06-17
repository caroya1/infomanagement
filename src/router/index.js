import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Admin from '../views/admin/Index.vue';
import AdminManage from '../views/admin/Manage.vue';
import AdminAnalysis from '../views/admin/Analysis.vue';
import AdminUsers from '../views/admin/Users.vue';
import AdminDashboard from '../views/admin/Dashboard.vue';
import ForumList from '../views/forum/List.vue';
import ForumDetail from '../views/forum/Detail.vue';
import LearningList from '../views/learning/List.vue';
import LearningDetail from '../views/learning/Detail.vue';
import MallList from '../views/mall/List.vue';
import ProfileIndex from '../views/profile/Index.vue';
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
        if (to.matched.some(r => r.name === 'Admin') && userInfo.userType !== 'admin') {
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
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'home', component: Home, beforeEnter: requireAuth },
  { path: '/', redirect: '/login' },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: requireAuth,
    children: [
      { path: '', redirect: '/admin/manage' },
      { path: 'manage', name: 'AdminManage', component: AdminManage },
      { path: 'analysis', name: 'AdminAnalysis', component: AdminAnalysis },
      { path: 'users', name: 'AdminUsers', component: AdminUsers },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard }
    ]
  },
  { path: '/forum', name: 'forum', component: ForumList, beforeEnter: requireAuth },
  { path: '/forum/detail/:id', name: 'ForumDetail', component: ForumDetail, beforeEnter: requireAuth },
  { path: '/mall', name: 'mall', component: MallList, beforeEnter: requireAuth },
  { path: '/learning', name: 'learning', component: LearningList, beforeEnter: requireAuth },
  { path: '/learning/detail/:id', name: 'LearningDetail', component: LearningDetail, beforeEnter: requireAuth },
  { path: '/profile', name: 'profile', component: ProfileIndex, beforeEnter: requireAuth }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;