<template>
  <div class="home-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎使用智慧医院HIS系统</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="welcome-card">
      <h2>欢迎来到智慧医院HIS系统</h2>
      <p>请通过左侧菜单选择功能模块。</p>
    </div>
    
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-value">{{ store.queuePatients.length }}</div>
          <div class="stat-label">待就诊患者</div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <div class="stat-value">{{ store.registrationRecords.length }}</div>
          <div class="stat-label">今日挂号</div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-icon">👨⚕️</div>
        <div class="stat-info">
          <div class="stat-value">{{ store.doctors.length }}</div>
          <div class="stat-label">在线医生</div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-icon">💊</div>
        <div class="stat-info">
          <div class="stat-value">{{ store.drugs.length }}</div>
          <div class="stat-label">药品库存</div>
        </div>
      </el-card>
    </div>
    
    <div class="quick-actions">
      <h3>快捷操作</h3>
      <div class="action-buttons">
        <el-button type="primary" @click="navigate('/registration')">
          <span class="btn-icon">📝</span>
          <span>快速挂号</span>
        </el-button>
        <el-button type="success" @click="navigate('/patient-list')">
          <span class="btn-icon">👥</span>
          <span>查看患者</span>
        </el-button>
        <el-button type="warning" @click="navigate('/prescription')">
          <span class="btn-icon">💊</span>
          <span>开具处方</span>
        </el-button>
        <el-button type="info" @click="navigate('/drugstore')">
          <span class="btn-icon">🏪</span>
          <span>药房发药</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHospitalStore } from '../stores/hospital'
import { useRouter } from 'vue-router'

const store = useHospitalStore()
const router = useRouter()

function navigate(path: string) {
  router.push(path)
}
</script>

<style scoped>
.home-content {
  padding: 20px;
}

.welcome-card {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.welcome-card h2 {
  margin-bottom: 10px;
  font-size: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100px;
}

.stat-icon {
  font-size: 40px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #dc3545;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.quick-actions {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.quick-actions h3 {
  margin-bottom: 15px;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-buttons button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
}

.btn-icon {
  font-size: 18px;
}
</style>
