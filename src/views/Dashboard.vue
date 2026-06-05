<template>
  <div class="dashboard">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-value">{{ patientStore.waitingCount }}</div>
          <div class="stat-label">待就诊患者</div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <div class="stat-value">{{ registrationStore.todayRegistrations }}</div>
          <div class="stat-label">今日挂号</div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-icon">👨⚕️</div>
        <div class="stat-info">
          <div class="stat-value">{{ registrationStore.doctors.length }}</div>
          <div class="stat-label">在线医生</div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-icon">💊</div>
        <div class="stat-info">
          <div class="stat-value">{{ drugStore.totalDrugCount }}</div>
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
    
    <div class="recent-records">
      <el-card title="最近挂号记录">
        <el-table :data="recentRecords" border style="width: 100%;">
          <el-table-column prop="caseNo" label="病历号" width="120"></el-table-column>
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column prop="department" label="科室" width="120"></el-table-column>
          <el-table-column prop="doctor" label="医生" width="100"></el-table-column>
          <el-table-column prop="visitDate" label="就诊日期" width="120"></el-table-column>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '../stores/patient'
import { useRegistrationStore } from '../stores/registration'
import { useDrugStore } from '../stores/drug'

const router = useRouter()
const patientStore = usePatientStore()
const registrationStore = useRegistrationStore()
const drugStore = useDrugStore()

const recentRecords = computed(() => 
  registrationStore.records.slice(0, 5)
)

function navigate(path: string) {
  router.push(path)
}

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
.dashboard {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
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
  margin-bottom: 20px;
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

.recent-records {
  margin-top: 20px;
}
</style>