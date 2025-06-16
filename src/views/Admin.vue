<template>
  <div class="admin-container">
    <el-header>
      <div class="logo">后台管理系统</div>
      <div class="user-info">
        <span>欢迎，管理员</span>
        <el-button type="text" @click="logout">退出登录</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="1" class="el-menu-vertical" router>
          <el-menu-item index="/admin">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/admin/users">
            <i class="el-icon-s-custom"></i>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/settings">
            <i class="el-icon-s-tools"></i>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-card shadow="never">
          <template #header>
            <div class="clearfix">
              <span>管理仪表盘</span>
            </div>
          </template>
          <div class="grid-content bg-purple">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>用户总数</span>
                  </div>
                  <div class="number">1,280</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>今日新增</span>
                  </div>
                  <div class="number">24</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>今日活跃</span>
                  </div>
                  <div class="number">328</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>在线人数</span>
                  </div>
                  <div class="number">86</div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 退出登录
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  router.push('/login');
};
</script>

<style scoped>
.admin-container {
  height: 100vh;
}

.el-header {
  background-color: #304156;
  color: #fff;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
}

.number {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
}
</style>