<template>
  <div class="layout-container">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <span class="logo">🏥 智慧医院HIS系统</span>
        </div>
        <div class="header-right">
          <span class="welcome">欢迎，{{ authStore.currentUser?.name }}</span>
          <el-dropdown trigger="click" class="user-dropdown">
            <el-button type="text" class="user-btn">
              <User />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>
    
    <div class="layout-content">
      <aside class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          mode="vertical"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/">
            <i class="el-icon-home"></i>
            <span>首页</span>
          </el-menu-item>
          
          <el-sub-menu index="registration">
            <template #title>
              <i class="el-icon-document"></i>
              <span>挂号管理</span>
            </template>
            <el-menu-item index="/registration">窗口挂号</el-menu-item>
            <el-menu-item index="/registration-record">挂号记录</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="patient">
            <template #title>
              <i class="el-icon-user"></i>
              <span>患者管理</span>
            </template>
            <el-menu-item index="/patient-list">患者列表</el-menu-item>
            <el-menu-item index="/patient-queue">排队叫号</el-menu-item>
          </el-sub-menu>
          
          <el-menu-item index="/doctor">
            <i class="el-icon-user-solid"></i>
            <span>医生管理</span>
          </el-menu-item>
          
          <el-menu-item index="/medical-record">
            <i class="el-icon-files"></i>
            <span>病历管理</span>
          </el-menu-item>
          
          <el-menu-item index="/prescription">
            <i class="el-icon-edit-pen"></i>
            <span>处方管理</span>
          </el-menu-item>
          
          <el-menu-item index="/drugstore">
            <i class="el-icon-box"></i>
            <span>药房管理</span>
          </el-menu-item>
        </el-menu>
      </aside>
      
      <main class="main-content">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)

function handleMenuSelect(key: string) {
  router.push(key)
}

function handleLogout() {
  authStore.logout()
  ElMessage.info('已退出登录')
  router.push('/login')
}

onMounted(() => {
  authStore.loadFromStorage()
})
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #dc3545;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.welcome {
  font-size: 14px;
}

.user-btn {
  color: white;
  font-size: 20px;
}

.layout-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  background-color: #2f3542;
  min-height: calc(100vh - 60px);
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  color: #b8c7ce;
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: #1a1d23;
}

.sidebar-menu :deep(.el-menu-item.is-active),
.sidebar-menu :deep(.el-sub-menu.is-active .el-sub-menu__title) {
  background-color: #dc3545;
  color: white;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>