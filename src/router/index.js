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
import { getUserInfo } from '../mock/loginMock';
import { ElMessage } from 'element-plus';

// 路由守卫，验证登录状态
const requireAuth = async (to, from, next) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  
  if (!token) {
    // 未登录，重定向到登录页
    next('/login');
  } else {
    try {
      const response = await getUserInfo(token);
      if (response.success) {
        // 已登录
        if (to.name === 'Admin' && userType !== 'admin') {
          // 非管理员访问管理员页面，重定向到用户页面
          next('/home');
        } else {
          next();
        }
      } else {
        ElMessage.error(response.message || '无效的token');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        next('/login');
      }
    } catch (error) {
      ElMessage.error('验证登录状态请求出错');
      console.error('验证登录状态错误:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
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
    name: 'Home',
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
      component: ForumView
    },
    {
      path: '/forum/detail/:id',
      name: 'ForumDetail',
      component: ForumDetail
    },
    {
      path: '/mall',
      name: 'mall',
      component: MallView
    },
    {
      path: '/learning',
      name: 'learning',
      component: LearningView
    },
    {
      path: '/learning/detail/:id',
      name: 'LearningDetail',
      component: LearningDetail
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;