<template>
  <el-header>
    <div class="navbar-container">
      <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="home">首页</el-menu-item>
        <el-menu-item index="forum">论坛</el-menu-item>
        <el-menu-item index="learning">学习</el-menu-item>
        <el-menu-item index="mall">商城</el-menu-item>
        <el-menu-item index="profile">我的</el-menu-item>
      </el-menu>

      <!-- 用户信息和退出登录区域 -->
      <div class="user-section">
        <el-dropdown @command="handleUserCommand">
          <span class="user-info">
            <el-icon>
              <User />
            </el-icon>
            {{ userInfo.nickname || userInfo.username || '用户' }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, ArrowDown } from '@element-plus/icons-vue'
import { logout } from '../api/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()
const activeMenu = ref('home')
const userInfo = ref({}) // 假设用户信息存储在这里

// 初始化时根据当前路由设置活动菜单和用户信息
onMounted(() => {
  activeMenu.value = route.name || 'home'
  loadUserInfo()
})

// 加载用户信息
const loadUserInfo = () => {
  try {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      userInfo.value = JSON.parse(storedUserInfo)
      console.log('[Navbar Debug] 用户信息加载成功:', userInfo.value.username)
    } else {
      console.warn('[Navbar Debug] 未找到用户信息')
    }
  } catch (error) {
    console.error('[Navbar Debug] 用户信息解析失败:', error)
  }
}

const handleSelect = (key) => {
  console.log('[Navbar Debug] 导航选择:', key);
  try {
    router.push({ name: key });
    activeMenu.value = key;
    console.log('[Navbar Debug] 路由跳转成功:', key);
  } catch (error) {
    console.error('[Navbar Debug] 路由跳转失败:', key, error);
    // 如果使用name跳转失败，尝试使用path跳转
    try {
      router.push(`/${key}`);
      activeMenu.value = key;
      console.log('[Navbar Debug] 使用path跳转成功:', key);
    } catch (pathError) {
      console.error('[Navbar Debug] path跳转也失败:', key, pathError);
    }
  }
}

// 处理用户下拉菜单命令
const handleUserCommand = async (command) => {
  console.log('[Navbar Debug] 用户命令:', command);

  if (command === 'logout') {
    // 确认退出登录
    try {
      await ElMessageBox.confirm(
        '确定要退出登录吗？',
        '退出登录',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )

      // 执行退出登录
      await performLogout()
    } catch (error) {
      // 用户取消退出
      console.log('[Navbar Debug] 用户取消退出登录')
    }
  } else if (command === 'profile') {
    router.push({ name: 'profile' });
  }
}

// 执行退出登录操作
const performLogout = async () => {
  try {
    console.log('[Navbar Debug] 开始执行退出登录')

    // 调用后端退出登录API
    await logout()

    // 清除本地存储的用户信息
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')

    // 显示成功消息
    ElMessage.success('退出登录成功')

    // 跳转到登录页
    router.push('/login')

    console.log('[Navbar Debug] 退出登录完成')
  } catch (error) {
    console.error('[Navbar Debug] 退出登录失败:', error)

    // 即使后端请求失败，也要清除本地数据
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')

    ElMessage.warning('退出登录完成')
    router.push('/login')
  }
}
</script>

<style scoped>
.el-header {
  background-color: #ffffff;
  color: #333;
  line-height: 60px;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.el-menu-demo {
  flex: 1;
  border-bottom: none;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-info .el-icon {
  margin-right: 5px;
}

.user-info .el-icon--right {
  margin-left: 5px;
  margin-right: 0;
}

/* 下拉菜单项样式优化 */
:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item--divided) {
  border-top: 1px solid #e6e6e6;
  margin-top: 4px;
  padding-top: 8px;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f7fa;
}
</style>