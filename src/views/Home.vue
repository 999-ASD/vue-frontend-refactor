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
  </div>
</template>

<script setup>
import { useHospitalStore } from '../stores/hospital'
const store = useHospitalStore()
</script>

<style scoped>
.home-content { padding: 20px; }
.welcome-card { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; }
.welcome-card h2 { margin-bottom: 10px; font-size: 24px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
.stat-card { display: flex; align-items: center; gap: 20px; height: 100px; }
.stat-icon { font-size: 40px; }
.stat-info { flex: 1; }
.stat-value { font-size: 28px; font-weight: bold; color: #dc3545; }
.stat-label { font-size: 14px; color: #666; }
</style>
