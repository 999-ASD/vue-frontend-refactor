<template>
  <div class="registration-home">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/registration-home">挂号管理</a></el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="page-content">
      <el-card class="welcome-card">
        <div class="welcome-icon">📝</div>
        <h2>挂号管理</h2>
        <p>欢迎使用挂号管理系统，您可以在此进行窗口挂号、查询挂号记录等操作。</p>
      </el-card>
      
      <div class="stats-section">
        <el-card>
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-value">{{ registrationStore.todayRegistrations }}</div>
              <div class="stat-label">今日挂号</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ registrationStore.records.length }}</div>
              <div class="stat-label">累计挂号</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ pendingCount }}</div>
              <div class="stat-label">待就诊</div>
            </div>
          </div>
        </el-card>
      </div>
      
      <div class="recent-section">
        <el-card title="最新挂号记录">
          <el-table :data="recentRecords" border style="width: 100%;">
            <el-table-column prop="caseNo" label="病历号" width="120" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="department" label="科室" width="120" />
            <el-table-column prop="visitDate" label="就诊日期" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRegistrationStore } from '../../stores/registration'

const registrationStore = useRegistrationStore()

const recentRecords = computed(() => registrationStore.records.slice(0, 5))

const pendingCount = computed(() => 
  registrationStore.records.filter(r => r.status === '待就诊').length
)

function getStatusType(status: string): string {
  const statusMap: Record<string, string> = {
    '待就诊': 'warning',
    '已就诊': 'success',
    '已退号': 'danger'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.registration-home {
  padding: 20px;
}

.el-breadcrumb {
  margin-bottom: 32px;
}

.page-content {
  max-width: 1200px;
}

.welcome-card {
  text-align: center;
  padding: 40px;
  margin-bottom: 24px;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.welcome-card h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.welcome-card p {
  color: #666;
  font-size: 14px;
}

.quick-actions {
  margin-bottom: 24px;
}

.quick-actions h3 {
  font-size: 16px;
  margin-bottom: 15px;
}

.action-grid {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-grid button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  font-size: 16px;
}

.btn-icon {
  font-size: 24px;
}

.stats-section {
  margin-bottom: 24px;
}

.stats-row {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
  padding: 20px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #dc3545;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.recent-section {
  margin-top: 24px;
}
</style>