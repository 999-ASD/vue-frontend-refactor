<template>
  <div class="dashboard">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
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
import { usePatientStore } from '../stores/patient'
import { useRegistrationStore } from '../stores/registration'
import { useDrugStore } from '../stores/drug'

const patientStore = usePatientStore()
const registrationStore = useRegistrationStore()
const drugStore = useDrugStore()

const recentRecords = computed(() => 
  registrationStore.records.slice(0, 5)
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
.dashboard {
  padding: 20px;
}

.el-breadcrumb {
  margin-bottom: 32px;
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

.recent-records {
  margin-top: 20px;
}
</style>