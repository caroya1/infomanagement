<!-- 后台管理主页面，聚合侧边栏和内容区 -->
<template>
  <el-container class="admin-container">
    <AdminSidebar />
    <el-container>
      <el-header class="admin-header">
        <div>欢迎，管理员</div>
        <el-button type="text" @click="logout">退出登录</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  window.location.href = '/login'
}
</script>
<style scoped>
.admin-container { height: 100vh; }
.admin-header { background: #fff; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; border-bottom: 1px solid #eee; }
</style>
