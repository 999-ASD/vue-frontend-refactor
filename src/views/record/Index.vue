<template>
  <div class="record-home">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/record-home">病历管理</a></el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="page-content">
      <el-card class="welcome-card">
        <div class="welcome-icon">📁</div>
        <h2>病历管理</h2>
        <p>欢迎使用病历管理系统，您可以在此管理患者病历、开具处方等操作。</p>
      </el-card>
      
      <div class="stats-section">
        <el-card>
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-value">{{ drugStore.prescriptions.length }}</div>
              <div class="stat-label">处方总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ pendingPrescriptions }}</div>
              <div class="stat-label">待发药</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ completedPrescriptions }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </div>
      
      <div class="recent-section">
        <el-card title="最新处方">
          <el-table :data="recentPrescriptions" border style="width: 100%;">
            <el-table-column prop="caseNo" label="病历号" width="120" />
            <el-table-column prop="patientName" label="患者姓名" width="120" />
            <el-table-column prop="doctorName" label="医生" width="100" />
            <el-table-column prop="total" label="金额" width="100">
              <template #default="scope">¥ {{ scope.row.total.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="150" />
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDrugStore } from '../../stores/drug'

const drugStore = useDrugStore()

const recentPrescriptions = computed(() => drugStore.prescriptions.slice(0, 5))

const pendingPrescriptions = computed(() => 
  drugStore.prescriptions.filter(p => p.status === '待发药').length
)

const completedPrescriptions = computed(() => 
  drugStore.prescriptions.filter(p => p.status === '已发药').length
)

function getStatusType(status: string): string {
  const statusMap: Record<string, string> = {
    '待发药': 'warning',
    '已发药': 'success',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.record-home {
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