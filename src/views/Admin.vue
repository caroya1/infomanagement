<template>
  <el-container class="admin-container">
    <el-aside width="200px" class="admin-aside">
      <div class="logo">后台管理</div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        router
        @select="handleMenuSelect"
      >
        <el-menu-item index="/admin/manage">管理</el-menu-item>
        <el-menu-item index="/admin/analysis">数据分析</el-menu-item>
        <el-menu-item index="/admin/users">用户管理</el-menu-item>
        <el-menu-item index="/admin/dashboard">管理员主页</el-menu-item>
      </el-menu>
    </el-aside>
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
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.path)

watch(
  () => route.path,
  (val) => {
    activeMenu.value = val
  }
)

const handleMenuSelect = (index) => {
  router.push(index)
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}
</script>

<style scoped>
.admin-container {
  height: 100vh;
}
.admin-aside {
  background: #2d3a4b;
  color: #fff;
}
.logo {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 24px 0;
  color: #fff;
}
.admin-header {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
}
</style>