<template>
  <el-header>
    <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="home">首页</el-menu-item>
      <el-menu-item index="forum">论坛</el-menu-item>
      <el-menu-item index="learning">学习</el-menu-item>
      <el-menu-item index="mall">商城</el-menu-item>
      <el-menu-item index="profile">我的</el-menu-item>
    </el-menu>
  </el-header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeMenu = ref('home')

// 初始化时根据当前路由设置活动菜单
onMounted(() => {
  activeMenu.value = route.name || 'home'
})

const handleSelect = (key) => {
  router.push({ name: key })
  activeMenu.value = key
}
</script>

<style scoped>
.el-header {
  background-color: #ffffff;
  color: #ffffff;
  line-height: 60px;
}

.el-menu-demo {
  width: 100%;
}
</style>