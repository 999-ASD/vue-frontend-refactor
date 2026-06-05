<template>
  <div class="layout-container">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <span class="logo">🏥 智慧医院HIS系统</span>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="user-info">
              <span class="welcome">欢迎，{{ authStore.currentUser?.name }}</span>
              <el-tag type="primary" class="role-tag">{{ ROLE_LABELS[authStore.currentUser?.role || ''] || '未知角色' }}</el-tag>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <User />
                  <span>{{ authStore.currentUser?.name }}</span>
                </el-dropdown-item>
                <el-dropdown-item disabled>
                  <Key />
                  <span>{{ ROLE_LABELS[authStore.currentUser?.role || ''] }}</span>
                </el-dropdown-item>
                <el-dropdown-divider />
                <el-dropdown-item @click="handleLogout">
                  <ArrowRight />
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>
    
    <div class="layout-content">
      <aside class="sidebar" style="width: 220px; display: block !important;">
        <div class="sidebar-inner">
          <div class="menu-item" :class="{ active: activeMenu === '/' }" @click="navigate('/')">
            <i class="menu-icon">🏠</i>
            <span>首页</span>
          </div>
          
          <div class="menu-group">
            <div class="menu-group-title" @click="handleGroupClick('registration')">
              <i class="menu-icon">📝</i>
              <span>挂号管理</span>
              <span class="expand-icon">{{ expandedGroups.includes('registration') ? '▼' : '▶' }}</span>
            </div>
            <div v-show="expandedGroups.includes('registration')" class="menu-group-items">
              <div class="sub-item" :class="{ active: activeMenu === '/registration-home' }" @click="navigate('/registration-home')">挂号管理</div>
              <div class="sub-item" :class="{ active: activeMenu === '/registration' }" @click="navigate('/registration')">窗口挂号</div>
              <div class="sub-item" :class="{ active: activeMenu === '/registration-record' }" @click="navigate('/registration-record')">挂号记录</div>
            </div>
          </div>
          
          <div class="menu-group">
            <div class="menu-group-title" @click="handleGroupClick('patient')">
              <i class="menu-icon">👥</i>
              <span>患者管理</span>
              <span class="expand-icon">{{ expandedGroups.includes('patient') ? '▼' : '▶' }}</span>
            </div>
            <div v-show="expandedGroups.includes('patient')" class="menu-group-items">
              <div class="sub-item" :class="{ active: activeMenu === '/patient-home' }" @click="navigate('/patient-home')">患者管理</div>
              <div class="sub-item" :class="{ active: activeMenu === '/patient-list' }" @click="navigate('/patient-list')">患者列表</div>
              <div class="sub-item" :class="{ active: activeMenu === '/patient-queue' }" @click="navigate('/patient-queue')">排队叫号</div>
            </div>
          </div>
          
          <div class="menu-item" :class="{ active: activeMenu === '/doctor' }" @click="navigate('/doctor')">
            <i class="menu-icon">👨‍⚕️</i>
            <span>医生管理</span>
          </div>
          
          <div class="menu-group">
            <div class="menu-group-title" @click="handleGroupClick('record')">
              <i class="menu-icon">📁</i>
              <span>病历管理</span>
              <span class="expand-icon">{{ expandedGroups.includes('record') ? '▼' : '▶' }}</span>
            </div>
            <div v-show="expandedGroups.includes('record')" class="menu-group-items">
              <div class="sub-item" :class="{ active: activeMenu === '/record-home' }" @click="navigate('/record-home')">病历管理</div>
              <div class="sub-item" :class="{ active: activeMenu.startsWith('/medical-record') }" @click="navigate('/medical-record')">病历记录</div>
              <div class="sub-item" :class="{ active: activeMenu === '/prescription' }" @click="navigate('/prescription')">开具处方</div>
              <div class="sub-item" :class="{ active: activeMenu === '/prescription-list' }" @click="navigate('/prescription-list')">处方记录</div>
            </div>
          </div>
          
          <div class="menu-item" :class="{ active: activeMenu === '/drugstore' }" @click="navigate('/drugstore')">
            <i class="menu-icon">🧪</i>
            <span>药房管理</span>
          </div>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import { ROLE_LABELS } from '../utils/auth'
import { User, Key, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const expandedGroups = ref(['registration', 'patient', 'record'])
const activeMenu = computed(() => route.path)

function navigate(path: string) {
  router.push(path)
}

function toggleGroup(group: string) {
  const index = expandedGroups.value.indexOf(group)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(group)
  }
}

function handleGroupClick(group: string) {
  toggleGroup(group)
  const homePaths: Record<string, string> = {
    registration: '/registration-home',
    patient: '/patient-home',
    record: '/record-home'
  }
  if (homePaths[group] && !activeMenu.value.startsWith(homePaths[group].replace('-home', ''))) {
    router.push(homePaths[group])
  }
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
  background-color: #f5f5f5;
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

.logo {
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.welcome {
  font-size: 14px;
}

.role-tag {
  font-size: 12px;
}

.layout-content {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 60px);
}

.sidebar {
  width: 220px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%);
  min-height: calc(100vh - 60px);
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  border-right: 2px solid #1a252f;
  box-shadow: 3px 0 15px rgba(0, 0, 0, 0.3);
}

.sidebar-inner {
  padding: 10px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #ecf0f1;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
  background-color: #dc3545;
  color: white;
}

.menu-icon {
  margin-right: 10px;
  font-size: 16px;
}

.menu-group {
  margin-bottom: 5px;
}

.menu-group-title {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #ecf0f1;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.menu-group-title:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.expand-icon {
  margin-left: auto;
  font-size: 12px;
}

.menu-group-items {
  background-color: rgba(0, 0, 0, 0.2);
}

.sub-item {
  padding: 10px 20px 10px 45px;
  color: #bdc3c7;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.sub-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ecf0f1;
}

.sub-item.active {
  background-color: rgba(220, 53, 69, 0.3);
  color: #dc3545;
}

.main-content {
  flex: 1;
  padding: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  min-height: calc(100vh - 60px);
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