<template>
  <div class="login-container">
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="clearfix">
          <span>用户登录</span>
        </div>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button type="text" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { login } from '../mock/loginMock';
import { useRouter } from 'vue-router';

// 表单数据
const loginForm = ref({
  username: '',
  password: ''
});

// 表单验证规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
});

// 表单引用
const formRef = ref(null);
const router = useRouter();

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 登录处理函数
const handleLogin = async () => {
  if (formRef.value) {
    const valid = await formRef.value.validate();
    if (valid) {
      try {
        const { username, password } = loginForm.value;
        const response = await login(username, password);
        
        if (response.success) {
          const { userType, token } = response.data;
          
          // 存储token到本地存储
          localStorage.setItem('token', token);
          localStorage.setItem('userType', userType);
          
          ElMessage.success(`${userType === 'admin' ? '管理员' : '普通用户'}登录成功`);
          
          // 根据用户类型跳转到不同页面
          if (userType === 'admin') {
            router.push('/admin');
          } else {
            router.push('/home');
          }
        } else {
          ElMessage.error(response.message || '登录失败，请重试');
        }
      } catch (error) {
        ElMessage.error('登录请求出错');
        console.error('登录错误:', error);
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.box-card {
  width: 400px;
}
</style>