<template>
  <aside class="sidebar">
    <div class="menu-container">
      <div class="menu-item" :class="{ active: currentRoute === '/' }" @click="navigate('/')">🏠 首页</div>
      
      <div class="menu-group">
        <div class="menu-group-title">挂号收费</div>
        <div class="menu-item" :class="{ active: currentRoute === '/registration' }" @click="navigate('/registration')">窗口挂号</div>
        <div class="menu-item" :class="{ active: currentRoute === '/registration-record' }" @click="navigate('/registration-record')">窗口退号</div>
      </div>
      
      <div class="menu-group">
        <div class="menu-group-title">门诊医生</div>
        <div class="menu-item" :class="{ active: currentRoute === '/patient-list' }" @click="navigate('/patient-list')">患者查看</div>
        <div class="menu-item" :class="{ active: currentRoute === '/medical-record' }" @click="navigate('/medical-record')">病历首页</div>
        <div class="menu-item" :class="{ active: currentRoute === '/prescription' }" @click="navigate('/prescription')">开设处方</div>
      </div>
      
      <div class="menu-item" :class="{ active: currentRoute === '/drugstore' }" @click="navigate('/drugstore')">💊 药房管理</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const currentRoute = ref('/')

function handleRouteChange() {
  currentRoute.value = route.path
}

function navigate(path: string) {
  currentRoute.value = path
  router.push(path)
}

onMounted(() => {
  currentRoute.value = route.path
  router.afterEach(handleRouteChange)
})

onUnmounted(() => {
  router.afterEach(handleRouteChange)
})
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  min-height: calc(100vh - 60px);
  padding: 10px;
}

.menu-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.menu-item {
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #e9ecef;
}

.menu-item.active {
  background-color: #dc3545;
  color: white;
}

.menu-group {
  margin-top: 10px;
}

.menu-group-title {
  padding: 8px 15px;
  font-weight: bold;
  color: #666;
  font-size: 14px;
}
</style>
