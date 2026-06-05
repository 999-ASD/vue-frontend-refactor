<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>🏥 智慧医院HIS系统</h1>
        <p>请登录您的账号</p>
      </div>
      
      <el-form :model="form" class="login-form">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
          >
            <template #prefix><User /></template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            type="password" 
            v-model="form.password" 
            placeholder="请输入密码"
          >
            <template #prefix><Lock /></template>
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin">
            <template #icon><ArrowRight /></template>
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="circle circle-4"></div>
      <div class="circle circle-5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { ElMessage } from 'element-plus'
import { User, Lock, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: ''
})

function handleLogin() {
  if (!form.username) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!form.password) {
    ElMessage.warning('请输入密码')
    return
  }
  
  if (authStore.login(form.username, form.password)) {
    ElMessage.success('登录成功！')
    router.push('/dashboard')
  } else {
    ElMessage.error('用户名或密码错误')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 50%, #a71d2a 100%);
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  animation: float 8s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.3);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.4);
  top: 20%;
  right: -50px;
  animation-delay: 2s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.25);
  bottom: 10%;
  left: 10%;
  animation-delay: 4s;
}

.circle-4 {
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.35);
  bottom: -50px;
  right: 20%;
  animation-delay: 1s;
}

.circle-5 {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

.login-box {
  width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 26px;
  color: #dc3545;
  margin-bottom: 8px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-form {
  margin-bottom: 10px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
}
</style>